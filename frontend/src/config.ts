// API URLs based on environment
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ai-proctoring-backend.onrender.com' // Render.com backend URL
  : 'http://localhost:5000'; 