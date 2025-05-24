// API URLs based on environment
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-url.vercel.app' // Replace with your backend Vercel URL
  : 'http://localhost:5000'; 