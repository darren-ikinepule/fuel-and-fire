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

// ✅ Render-friendly port binding
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
