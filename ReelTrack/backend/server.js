
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Media = require("./models/Media");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("ReelTrack API is running!");
});

// READ: Get all media
app.get("/api/media", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Could not load media." });
  }
});

// CREATE: Add new media
app.post("/api/media", async (req, res) => {
  try {
    const newMedia = await Media.create(req.body);
    res.status(201).json(newMedia);
  } catch (error) {
    res.status(400).json({ message: "Could not add media." });
  }
});

// UPDATE: Edit existing media
app.put("/api/media/:id", async (req, res) => {
  try {
    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMedia) {
      return res.status(404).json({ message: "Media not found." });
    }

    res.json(updatedMedia);
  } catch (error) {
    res.status(400).json({ message: "Could not update media." });
  }
});

// DELETE: Remove media
app.delete("/api/media/:id", async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(
      req.params.id
    );

    if (!deletedMedia) {
      return res.status(404).json({ message: "Media not found." });
    }

    res.json({ message: "Media deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Could not delete media." });
  }
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
