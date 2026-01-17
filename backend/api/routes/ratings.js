const express = require("express");
const mongoose = require("mongoose");
const Rating = require("../models/Rating");
const Sentry = require("@sentry/node");

const router = express.Router();

// GET /api/ratings - Get aggregate rating data for SEO
router.get("/stats", async (req, res) => {
  try {
    // Return default stats if DB is not connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({ ratingValue: 5.0, ratingCount: 0, note: "Offline" });
    }

    const stats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({ ratingValue: 0, ratingCount: 0 });
    }

    res.json({
      ratingValue: parseFloat(stats[0].averageRating.toFixed(1)),
      ratingCount: stats[0].totalRatings,
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: "Failed to fetch rating stats" });
  }
});

// POST /api/ratings - Submit a new rating
router.post("/", async (req, res) => {
  try {
    const { rating, feedback, tool } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Rating service temporary unavailable. Please try again later." });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating (1-5 required)" });
    }

    const newRating = new Rating({
      rating,
      feedback,
      tool: tool || "general",
    });

    await newRating.save();
    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: "Failed to save rating" });
  }
});

module.exports = router;
