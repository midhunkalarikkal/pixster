# 📸 Pixster — A Social Media Platform

Pixster is a full-featured, Instagram-inspired social media platform built using the **MERN stack**. The idea started as a simple chat app but evolved into a complete social experience, packed with real-time features, rich UI/UX, and scalable architecture.

> _“What started as a side project for testing a chat feature... turned into a full-blown social media app.”_ 🤯

---

## 🛠 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + DaisyUI 🌼
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with complex aggregation pipelines)
- **File Storage**: AWS S3 with signed URLs for privacy 🔐
- **State Management**: Zustand 🐻
- **Real-Time**: Socket.IO for chat, notifications, online users 🔄
- **Animations**: GSAP 🎞️
- **UI Utilities**: Aceternity UI (File Upload), DaisyUI Themes, custom `screen-size-indicator`
- **In-Memory Store**: Upstash Redis ⚡
- **HTTP Client**: Axios
- **Notifications**: React Toastify 🍞

---

## ✨ Inspiration & Story

While working on another project, I needed a chat feature. After building a mini chat app, I asked myself — _"Why stop here?"_ 🤔  
So I challenged myself to go all in and transform that simple idea into a full-fledged social media application.  
From chat features to posts, profiles, stories, and more — Pixster was born. 💥

---

## 🧱 Why MERN Stack?

- 💡 It's ideal for full-stack JavaScript development.
- 🧠 I’m learning MERN in-depth, and this project helped reinforce key concepts.
- 🚀 It allows for a powerful, end-to-end, scalable application development experience.

---

## 🧠 Architecture

- Follows **MVC architecture** for clean separation of concerns.
- Backend logic is modular and **continuously optimized**.
- Used **scalable schemas** with references and population where needed.
- Advanced **aggregation pipelines** to fetch deeply connected data efficiently.

---

## 🌟 Core Features

- 🔐 **User Authentication** with OTP verification (Sign up, Login, Password reset)
- 📝 **Posts** with image and caption OR just text (Threads)
- 📷 **Stories** that disappear after a day
- 💬 **Real-time Chat** with online user indicators and typing effects
- 🛎️ **Real-time Notifications** for follows, messages, likes, and comments
- 🧑‍🤝‍🧑 Follow/Unfollow, Accept/Reject requests
- 🔎 **User Search** with suggestions
- 💾 Save posts, ❤️ Like posts/comments, 💬 Reply to comments (1-level nesting)
- 📁 Media uploads via **signed AWS S3 URLs**
- 🎨 Fully responsive UI with **theme switching**
- 🧩 Reusable Components, Lazy Loading, Shimmer & Skeleton loaders
- 🧪 Custom **screen-size-indicator** library for responsive testing

---

## 📄 Main Pages

- 🏠 **Home Page** — Scrollable posts + Story section
- 🔍 **Search Page** — Search and explore users
- 🧑 **Profile Page** — Complete user details, posts, followers/following
- 🔔 **Notifications Page** — Real-time updates and follow suggestions
- 💬 **Chat Page** — Real-time private messaging
- 🖊️ **Create Page** — Create posts or text threads
- ⚙️ **Settings Page** — Update info, change theme, privacy controls

---

## ☁️ Media & Privacy

- All media files are uploaded securely to **AWS S3 Buckets**
- Files are accessed via **signed URLs** to ensure secure and private access

---

## 🚀 Final Words

Pixster is more than just a clone — it’s a showcase of passion, problem-solving, and full-stack mastery.  
Every feature is hand-crafted with care, keeping scalability and real-world usage in mind.  
_This project is a big step in my journey as a developer — and I hope you enjoy exploring it as much as I enjoyed building it._ 💙

---

> _“Built with ❤️, bugs, rewrites, and late nights.”_
