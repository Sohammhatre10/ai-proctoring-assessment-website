# AI assessment platform

A full-stack web application for conducting **coding** and **aptitude** assessments with integrated **AI-based proctoring** features.  
This platform ensures secure, monitored online tests using advanced web technologies and computer vision tools.

---

## Features

- **User Authentication**:  
  - Registration and login functionality using MongoDB, Express.js, and secure password hashing (bcrypt).

- **Coding and Aptitude Assessments**:  
  - Different sections for coding challenges and aptitude questions.
  - Real-time submissions and evaluation support.

- **AI-Based Proctoring**:  
  - Webcam monitoring using OpenCV and other computer vision techniques.
  - Detects suspicious activities such as face absence, multiple faces, and abnormal behavior during the test.

- **Theme Support**:  
  - Light and dark mode toggle integrated with the UI.

- **Responsive Design**:  
  - Fully responsive and mobile-friendly layout for seamless access across devices.

---

## Tech Stack

**Frontend**:
- React.js
- TypeScript
- TailwindCSS
- React Router
- Lucide Icons

**Backend**:
- Node.js
- Express.js
- MongoDB (Atlas)
- bcrypt for password hashing
- dotenv for environment variable management
- CORS enabled for frontend-backend communication

**Proctoring System**:
- OpenCV (Python/JavaScript integration)
- WebRTC / MediaDevices API for webcam access
- Custom ML models for real-time face and activity detection (optional enhancement)

---

## Folder Structure

```
/frontend
  └── src
      ├── pages
      ├── components
      ├── context
      └── assets

/backend
  ├── server.js
  ├── models
  ├── routes
  ├── controllers
  └── .env
```

---

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Sohammhatre10/ai-proctoring-website.git
   ```

2. **Install backend dependencies**:

   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env` file inside the `backend/` directory:

   ```
   MONGODB_URI=your_mongodb_uri_here
   PORT=5000
   ```

4. **Start the backend server**:

   ```bash
   cd backend
   npm run dev
   ```

5. **Install frontend dependencies**:

   ```bash
   npm install
   ```

6. **Start the frontend app**:

   ```bash
   npm run dev
   ```

---

## Future Enhancements

- Integrate AI-based cheating detection (head pose estimation, gaze tracking).
- Add real-time notification system for proctor alerts.
- Implement timer-based assessments.
- Support for multiple question types (MCQ, coding, subjective).

---

## License

This project is licensed under the MIT License.
