import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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

// Proxy route to call Google Generative Language (Gemini) API securely from server
app.post('/api/generate', async (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GENERATIVE_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY environment variable' });
  }

  const clientPayload = req.body && req.body.payload ? req.body.payload : null;
  if (!clientPayload) {
    return res.status(400).json({ error: 'Missing payload in request body' });
  }

  const apiEndpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`
  ];

  let useStructuredOutput = req.body.useStructuredOutput !== undefined ? Boolean(req.body.useStructuredOutput) : true;
  let lastError = null;

  for (let i = 0; i < apiEndpoints.length; i++) {
    const url = apiEndpoints[i];

    // Build payload depending on structured flag
    const currentPayload = useStructuredOutput
      ? clientPayload
      : {
          contents: clientPayload.contents,
          generationConfig: {
            temperature: 0,
            topP: 0.1,
            responseMimeType: 'application/json'
          }
        };

    try {
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPayload)
      });

      // If structured output unsupported, adjust and retry same endpoint
      if (upstream.status === 400 && useStructuredOutput) {
        const text = await upstream.clone().text().catch(() => '');
        if (text.includes('responseSchema') || text.includes('responseMimeType') || text.includes('generation_config') || text.includes('unknown field')) {
          useStructuredOutput = false;
          // retry same endpoint with non-structured payload
          i--; // decrement to retry same endpoint
          continue;
        }
      }

      // Forward the upstream response (status and body) back to client
      const bodyText = await upstream.text().catch(() => '');
      const contentType = upstream.headers.get('content-type') || 'application/json';
      res.setHeader('Content-Type', contentType);
      return res.status(upstream.status).send(bodyText);
    } catch (err) {
      lastError = err;
      // try next endpoint if available
      if (i < apiEndpoints.length - 1) continue;
      return res.status(502).json({ error: 'Failed to reach upstream API', details: String(err) });
    }
  }
  // If we reach here nothing worked
  return res.status(502).json({ error: 'All upstream endpoints failed', details: String(lastError) });
});

// ✅ Render-friendly port binding
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
