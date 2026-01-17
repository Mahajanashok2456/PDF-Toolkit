const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    tool: {
      type: String,
      default: "general",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "ratings",
  }
);

module.exports = mongoose.model("Rating", ratingSchema);
