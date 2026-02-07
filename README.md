# 🚀 Logic Leet – Full Stack Coding Practice Platform

Logic Leet is a full-stack coding practice platform designed to help learners improve their programming skills through hands-on practice, AI-powered doubt solving, and multi-language code execution.

It provides a real-world coding environment with modern features, scalable architecture, and cloud deployment.

---

## 🌐 Live Demo

🔗 **Website:** https://logicleet.run.place/  
📂 **GitHub:** https://github.com/Prashant0036/Logic-Leet  

> 📌 *For the best experience, please open on laptop/desktop.*

---

## ✨ Features

- ✅ User Authentication & Authorization  
- ✅ Online Code Compiler (Multi-Language Support)  
- ✅ Code Submission & Evaluation  
- ✅ AI-Powered Doubt Solving  
- ✅ Video-Based Solutions  
- ✅ Problem Practice System  
- ✅ Cloud Image & Video Storage  
- ✅ Scalable Backend Architecture  
- ✅ Secure API System  

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5, CSS3, JavaScript

### Backend
- Node.js
- Express.js
- MongoDB (with ODM)
- Redis (Caching)

### Other Tools & Services
- Judge0 API (Code Execution)
- Cloudinary (Media Storage)
- REST APIs
- AWS EC2 (Deployment)
- Nginx (Reverse Proxy)

---

## 🚀 Deployment

The application is deployed on:

- **AWS EC2** for hosting
- **Nginx** as a reverse proxy
- **PM2** for backend process management (if used)

Ensuring high availability and better performance.

---

## 📁 Project Structure

Directory structure:
└── prashant0036-logic-leet/
    ├── backend/
    │   ├── package.json
    │   └── src/
    │       ├── index.js
    │       ├── config/
    │       │   ├── db.js
    │       │   ├── gemini_llm_example.js
    │       │   └── redis_db.js
    │       ├── controllers/
    │       │   ├── solveDoubt.js
    │       │   ├── userAuthent.js
    │       │   ├── userProblem.js
    │       │   ├── userSubmission.js
    │       │   └── videoSection.js
    │       ├── middleware/
    │       │   ├── adminMiddleware.js
    │       │   └── userMiddleware.js
    │       ├── models/
    │       │   ├── problem.js
    │       │   ├── solutionVideo.js
    │       │   ├── submission.js
    │       │   └── user.js
    │       ├── routes/
    │       │   ├── aiChatting.js
    │       │   ├── problemHandler.js
    │       │   ├── submit.js
    │       │   ├── userAuth.js
    │       │   └── videoCreator.js
    │       └── utils/
    │           ├── languageUtils.js
    │           └── Validator.js
    └── frontend/
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package.json
        ├── vite.config.js
        ├── .env.production
        └── src/
            ├── App.css
            ├── App.jsx
            ├── authSlice.js
            ├── index.css
            ├── main.jsx
            ├── assets/
            │   └── assets.js
            ├── components/
            │   ├── AdminCreate.jsx
            │   ├── AdminDelete.jsx
            │   ├── AdminUpdate.jsx
            │   ├── AdminUpdateProblem.jsx
            │   ├── AdminUpload.jsx
            │   ├── AdminVideo.jsx
            │   ├── ChatAi.jsx
            │   ├── Editorial.jsx
            │   ├── MakeAdmin.jsx
            │   └── SubmissionHistory.jsx
            ├── pages/
            │   ├── Admin.jsx
            │   ├── Home.jsx
            │   ├── Login.jsx
            │   ├── ProblemPage.jsx
            │   ├── Signup.jsx
            │   └── test.js
            ├── store/
            │   └── Store.js
            └── utils/
                ├── axiosClient.js
                ├── getProblem.js
                └── getVideoData.js
