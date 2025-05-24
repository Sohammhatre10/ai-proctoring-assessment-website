// API URLs based on environment
export const API_URL = process.env.NODE_ENV === 'production'
  ? '/api' // In production, API calls will be relative to the same domain
  : 'http://localhost:5000/api'; // In development, use localhost 