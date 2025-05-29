// API URLs based on environment
// Use VITE_API_URL environment variable set in Vercel/local .env
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Default to localhost for safety if env var is missing 