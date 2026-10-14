
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Media = require("./models/Media");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Home route
app.get("/", (req, res) => {
  res.send("ReelTrack backend is running!");
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Please log in to access your watchlist.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session is invalid or expired. Please log in again.",
    });
  }
}

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 6
    ) {
      return res.status(400).json({
        message:
          "Enter your name, email, and a password of at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Could not create your account.",
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Could not log in.",
    });
  }
});

// Get only the logged-in user's media
app.get("/api/media", authenticateToken, async (req, res) => {
  try {
    const media = await Media.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    return res.json(media);
  } catch (error) {
    console.error("Fetch media error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch media.",
    });
  }
});

// Add media for the logged-in user
app.post("/api/media", authenticateToken, async (req, res) => {
  try {
    const { title, type, genre, year, status, rating, image } =
      req.body;

    const newMedia = await Media.create({
      title,
      type,
      genre,
      year,
      status,
      rating,
      image,
      user: req.userId,
    });

    return res.status(201).json(newMedia);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to add media.",
    });
  }
});

// Update only the logged-in user's media
app.put("/api/media/:id", authenticateToken, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid media ID.",
      });
    }

    const allowedFields = [
      "title",
      "type",
      "genre",
      "year",
      "status",
      "rating",
      "image",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const updatedMedia = await Media.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMedia) {
      return res.status(404).json({
        message: "Media not found in your watchlist.",
      });
    }

    return res.json(updatedMedia);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to update media.",
    });
  }
});

// Delete only the logged-in user's media
app.delete(
  "/api/media/:id",
  authenticateToken,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid media ID.",
        });
      }

      const deletedMedia = await Media.findOneAndDelete({
        _id: req.params.id,
        user: req.userId,
      });

      if (!deletedMedia) {
        return res.status(404).json({
          message: "Media not found in your watchlist.",
        });
      }

      return res.json({
        message: "Media deleted successfully.",
      });
    } catch (error) {
      console.error("Delete media error:", error.message);

      return res.status(500).json({
        message: "Failed to delete media.",
      });
    }
  }
);

// Connect to MongoDB and start the server
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("JWT_SECRET or MONGO_URI is missing from .env.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(
        `ReelTrack server running on http://localhost:${port}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
