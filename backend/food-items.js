import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const geminiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GENERATIVE_API_KEY ||
  process.env.GOOGLE_API_KEY;

if (!geminiKey) {
  console.error("Server missing GEMINI_API_KEY environment variable");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: geminiKey });

// Connect to MongoDB Atlas with error handling
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI environment variable is not set!");
  process.exit(1);
}

mongoose.connect(uri).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const FoodSchema = new mongoose.Schema({
  img: { type: String },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  company: { type: String, required: true },
});

const Food = mongoose.model("Food", FoodSchema);

function extractPrompt(clientPayload) {
  const text = clientPayload?.contents?.[0]?.parts?.[0]?.text;
  return typeof text === "string" && text.length > 0 ? text : null;
}

function buildGenerationConfig(clientPayload, useStructuredOutput) {
  const generationConfig = clientPayload?.generationConfig || {};
  const config = {
    temperature: generationConfig.temperature ?? 0,
    topP: generationConfig.topP ?? 0.1,
  };

  if (!useStructuredOutput) {
    return config;
  }

  config.responseMimeType = generationConfig.responseMimeType || "application/json";
  if (generationConfig.responseSchema) {
    config.responseJsonSchema = generationConfig.responseSchema;
  }

  return config;
}

function toClientResponse(text) {
  return {
    candidates: [
      {
        content: {
          parts: [{ text }],
        },
      },
    ],
  };
}

function parseGeminiError(err) {
  const raw = String(err?.message || err);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error) {
      return { status: parsed.error.code || 502, body: parsed };
    }
  } catch {
    // not JSON
  }

  return {
    status: 502,
    body: { error: { message: raw } },
  };
}

app.get("/", (req, res) => {
  res.send("🔥 Fuel & Fire API is running successfully!");
});

app.get("/food-items", async (req, res) => {
  try {
    const items = await Food.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).json({ error: "Failed to fetch food items", details: err.message });
  }
});

app.get("/food-items/:id", async (req, res) => {
  try {
    const item = await Food.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Error fetching food item:", err);
    res.status(500).json({ error: "Failed to fetch food item", details: err.message });
  }
});

app.post("/food-items", async (req, res) => {
  try {
    const item = new Food(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Error creating food item:", err);
    res.status(400).json({ error: err.message });
  }
});

app.put("/food-items/:id", async (req, res) => {
  try {
    const item = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Error updating food item:", err);
    res.status(400).json({ error: err.message });
  }
});

app.delete("/food-items/:id", async (req, res) => {
  try {
    const item = await Food.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json({ message: "Food item deleted" });
  } catch (err) {
    console.error("Error deleting food item:", err);
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/generate", async (req, res) => {
  const clientPayload = req.body?.payload ?? null;
  if (!clientPayload) {
    return res.status(400).json({ error: "Missing payload in request body" });
  }

  const useStructuredOutput =
    req.body.useStructuredOutput !== undefined
      ? Boolean(req.body.useStructuredOutput)
      : true;

  const prompt = extractPrompt(clientPayload);
  if (!prompt) {
    return res.status(400).json({ error: "Invalid payload: missing prompt text" });
  }

  let structured = useStructuredOutput;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: buildGenerationConfig(clientPayload, structured),
    });

    const text = response.text;
    if (!text) {
      return res.status(502).json({ error: { message: "Empty response from Gemini" } });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(toClientResponse(text));
  } catch (err) {
    const message = String(err?.message || err);

    if (
      structured &&
      (message.includes("responseSchema") ||
        message.includes("responseJsonSchema") ||
        message.includes("responseMimeType"))
    ) {
      try {
        structured = false;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: buildGenerationConfig(clientPayload, false),
        });

        if (response.text) {
          res.setHeader("Content-Type", "application/json");
          return res.status(200).json(toClientResponse(response.text));
        }
      } catch (retryErr) {
        console.error("Gemini SDK retry error:", retryErr);
        const parsed = parseGeminiError(retryErr);
        return res.status(parsed.status).json(parsed.body);
      }
    }

    console.error("Gemini SDK generation error:", err);
    const parsed = parseGeminiError(err);
    return res.status(parsed.status).json(parsed.body);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
