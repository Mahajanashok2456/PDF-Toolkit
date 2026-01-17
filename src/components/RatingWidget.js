import React, { useState } from "react";
import { addRating } from "../utils/ratingSystem";
import "./RatingWidget.css";

const RatingWidget = ({ onRatingSubmitted = () => {} }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await addRating(rating, feedback);
      setSubmitted(true);
      setRating(0);
      setFeedback("");
      onRatingSubmitted();

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError("Failed to save rating. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rating-widget">
      <h3 className="rating-title">Rate PDF Toolkit</h3>

      {submitted && (
        <div className="rating-success">
          ✓ Thank you for rating! Your feedback helps us improve.
        </div>
      )}

      {error && <div className="rating-error">{error}</div>}

      <form onSubmit={handleSubmit} className="rating-form">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${rating >= star ? "active" : ""}`}
              onClick={() => setRating(star)}
              title={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional: Share your feedback (max 200 characters)"
          maxLength={200}
          className="rating-feedback"
        />

        <div className="rating-actions">
          <button type="submit" className="rating-submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
          <span className="rating-help">Your rating helps others decide</span>
        </div>
      </form>
    </div>
  );
};

export default RatingWidget;
