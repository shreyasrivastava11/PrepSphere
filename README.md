# PrepSphere 🚀

PrepSphere is a mock interview practice website.

It helps users:
- Practice interview questions
- Track their progress
- Improve their preparation step-by-step

The system saves your data so your progress is not lost when you log out.

## 🏗 Architecture Overview

- React frontend communicates with Spring Boot REST APIs.
- Spring Boot connects to a MySQL database.
- Docker containers manage frontend, backend, and database services.
- GitHub Actions handles:
  - Continuous Integration (build & verification)
  - Continuous Deployment (automated server deployment)
- Deployment occurs via SSH to a Linux server using Docker Compose.

## 🧩 What This Project Uses

- **Frontend (User Interface):** React  
  → This is what you see on the screen.

- **Backend (Server Logic):** Spring Boot  
  → This handles login, saving progress, and managing data.

- **Database:** MySQL  
  → This stores user information and test results safely.

- **Docker:**  
  → Helps run the whole project easily on any system.

- **GitHub Actions:**  
  → Automatically builds and deploys the project when code is updated.

## 💻 How To Run The Project On Your Computer

### Step 1 – Start Frontend

Open terminal in project folder and run:

```
npm install
npm run dev
```

Now open:
http://localhost:5173

You will see the website.



### Step 2 – Start Backend

Go to backend folder:

```
cd backend
mvn spring-boot:run
```

Backend runs at:
http://localhost:8080

Now frontend and backend are connected.



## 🔐 Login System

- Users can register and login.
- Data is saved in the database.
- When you logout and login again, your progress remains saved.



## 🌍 Deployment (Putting Website Online)

This project can be deployed on a Linux server.

It uses:
- Docker (to package the project)
- GitHub Actions (to automatically deploy when code is updated)

This means:
Whenever new code is pushed to GitHub, the server updates automatically.



## 📂 How To Upload To GitHub

Run these commands in your project folder:

```
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

After pushing:
The automatic build process will start.



## 🎯 Purpose Of This Project

This project shows:

- Full-stack development skills
- Database integration
- Backend + Frontend connection
- Deployment knowledge
- Basic DevOps understanding



## 🔮 Future Improvements

- Add AI-based interview evaluation
- Add email notifications
- Reintroduce role-based access with secure admin panel



## 👩‍💻 Created By

Shreya Srivastava  
Full-Stack Developer
