// Rating system disabled for deployment
// Backend API not available

const RATINGS_STORAGE_KEY = "pdfToolkit_ratings_local";

// Submit a new rating (disabled)
export const addRating = async (rating, feedback = "", tool = "general") => {
  // Store locally only
  localStorage.setItem(RATINGS_STORAGE_KEY, "true");
  return { success: true, message: "Rating saved locally" };
};

// Return null stats (disabled)
export const getRemoteRatingStats = async () => {
  return null;
};

// Check if user has already rated (locally)
export const hasUserRated = () => {
  return localStorage.getItem(RATINGS_STORAGE_KEY) === "true";
};

// Legacy support
export const calculateAverageRating = () => {
  return null;
};
