import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

// Food schema and model
const FoodSchema = new mongoose.Schema({
  img: { type: String }, // image URL or path
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  company: { type: String, required: true }
});

const Food = mongoose.model("Food", FoodSchema);

// Get all food items
app.get("/food-items", async (req, res) => {
  const items = await Food.find();
  res.json(items);
});

// Get a food item by ID
app.get("/food-items/:id", async (req, res) => {
  const item = await Food.findById(req.params.id);
  res.json(item);
});

// Add a new food item
app.post("/food-items", async (req, res) => {
  try {
    const item = new Food(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a food item
app.put("/food-items/:id", async (req, res) => {
  try {
    const item = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a food item
app.delete("/food-items/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});