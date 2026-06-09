import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Google Gen AI with the new AQ-supported SDK
const geminiKey = process.env.GEMINI_API_KEY || process.env.GENERATIVE_API_KEY || process.env.GOOGLE_API_KEY;
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

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Food schema and model
const FoodSchema = new mongoose.Schema({
  img: { type: String },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  company: { type: String, required: true }
});

const Food = mongoose.model("Food", FoodSchema);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🔥 Fuel & Fire API is running successfully!");
});

// CRUD routes
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

// ✅ SDK-Powered secure proxy route supporting new AQ API keys
app.post('/api/generate', async (req, res) => {
  const clientPayload = req.body && req.body.payload ? req.body.payload : null;
  if (!clientPayload) {
    return res.status(400).json({ error: 'Missing payload in request body' });
  }

  // Extract text prompt from your existing frontend client structure
  let userPrompt = "";
  try {
    if (clientPayload.contents && clientPayload.contents[0] && clientPayload.contents[0].parts) {
      userPrompt = clientPayload.contents[0].parts[0].text;
    } else {
      userPrompt = JSON.stringify(clientPayload);
    }
  } catch (e) {
    return res.status(400).json({ error: 'Invalid payload structure' });
  }

  try {
    // Generate text directly using the official client architecture
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      generationConfig: {
        responseMimeType: req.body.useStructuredOutput !== false ? "application/json" : "text/plain"
      }
    });

    // Mirror the format expected by your existing frontend parsing logic
    const structuredResponse = {
      candidates: [
        {
          content: {
            parts: [
              { text: response.text }
            ]
          }
        }
      ]
    };

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(structuredResponse);

  } catch (err) {
    console.error("Gemini SDK Generation Error:", err);
    return res.status(502).json({ error: 'Failed to complete generation upstream', details: String(err) });
  }
});

// ✅ Render-friendly port binding
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});