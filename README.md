# 🌐 MERN Social Media App

A modern **full-stack social media platform** built with the **MERN Stack** — MongoDB, Express.js, React.js, and Node.js.

The application allows users to create an account, share posts, interact with other users, follow/unfollow people, and manage their profiles through a clean and responsive interface.

---

## ✨ Features

* 🔐 **Secure User Authentication** — JWT-based authentication
* 📝 **Create, Edit & Delete Posts**
* ❤️ **Like Posts**
* 💬 **Comment on Posts**
* 👥 **Follow / Unfollow Users**
* 👤 **User Profiles** with personal posts
* 📸 **Image Upload Support**
* 🔎 **Search Users**
* 📱 **Responsive UI** for different screen sizes
* 🛡️ **Protected Routes & API Authentication**

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js
* 🧭 React Router DOM
* 🎨 CSS
* 📡 Axios

### Backend

* 🟢 Node.js
* 🚂 Express.js
* 🔐 JWT Authentication
* 🔒 bcrypt.js

### Database

* 🍃 MongoDB
* ☁️ MongoDB Atlas

---

## 📁 Project Structure

```text
social-media-app/
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── app.js
│   ├── index.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── api.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/mishraakansha12/social-media-app.git
cd social-media-app
```

### 2. Install Dependencies

#### Backend

```bash
cd Backend
npm install
```

#### Frontend

Open another terminal and run:

```bash
cd Frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

> ⚠️ Never upload your `.env` file or database credentials to GitHub.

---

## ▶️ Run the Application

### Start Backend

```bash
cd Backend
npm start
```

The backend server will run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd Frontend
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

---

## 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  │ Axios API Requests
  ▼
Express / Node.js Backend
  │
  ▼
MongoDB Atlas
```

---

## 📸 Screenshots

Add screenshots of the application here to showcase the UI.

### 🏠 Home Page

*Add your screenshot here*

### 👤 Profile Page

*Add your screenshot here*

### 🔐 Login / Register

*Add your screenshot here*

---

## 🌍 Deployment

The application can be deployed using:

| Part     | Platform         |
| -------- | ---------------- |
| Frontend | Vercel / Netlify |
| Backend  | Render / Railway |
| Database | MongoDB Atlas    |

---

## 🔮 Future Improvements

Some features that can be added in future versions:

* 🔔 Real-time Notifications
* 💬 Real-time Chat
* 🌙 Dark Mode
* 📩 Private Messaging
* 🔖 Save / Bookmark Posts
* 🎥 Video Upload Support
* 🔴 Online / Offline User Status

---

## 👩‍💻 Author

**Akansha Mishra**

Built with ❤️ using the MERN Stack.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
