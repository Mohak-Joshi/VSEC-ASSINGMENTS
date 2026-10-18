const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Movie", "TV Series", "Web Series", "Anime"],
      required: true,
    },

    genre: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Plan to Watch",
        "Watching",
        "Completed",
        "Dropped",
      ],
      default: "Plan to Watch",
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Media", mediaSchema);