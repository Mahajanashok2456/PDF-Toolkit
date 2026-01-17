// Rating system to collect and calculate real user ratings
// Now connects to backend MongoDB API

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const RATINGS_STORAGE_KEY = "pdfToolkit_ratings_local"; // Still keep for UX (limit 1 rating per user)
const MIN_RATINGS_TO_DISPLAY = 5;

// Submit a new rating to the backend
export const addRating = async (rating, feedback = "", tool = "general") => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  try {
    const response = await fetch(`${API_URL}/api/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, feedback, tool }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit rating to server");
    }

    // Mark as rated locally to prevent spam from the same browser
    localStorage.setItem(RATINGS_STORAGE_KEY, "true");
    
    return await response.json();
  } catch (error) {
    console.error("Error saving rating:", error);
    throw error;
  }
};

// Fetch current rating statistics from the backend
// This replaces the old local calculation
export const getRemoteRatingStats = async () => {
  try {
    const response = await fetch(`${API_URL}/api/ratings/stats`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.ratingCount < MIN_RATINGS_TO_DISPLAY) {
      return null;
    }

    return {
      ratingValue: data.ratingValue,
      ratingCount: data.ratingCount,
      isValid: true,
    };
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }
};

// Check if user has already rated (locally)
export const hasUserRated = () => {
  return localStorage.getItem(RATINGS_STORAGE_KEY) === "true";
};

// Legacy support (to avoid breaking components immediately)
export const calculateAverageRating = () => {
  // This will now likely be null as we move to async remote stats
  // The SEO component should handle the async loading
  return null;
};
