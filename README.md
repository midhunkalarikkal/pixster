# 📸 Pixster — A Social Media Platform with AI-Powered Features

Pixster is a full-featured, Instagram-inspired social media platform built using the **MERN stack**. What started as a simple chat app has evolved into a complete social experience, packed with real-time features, rich UI/UX, scalable architecture, and **AI-powered functionality**.

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
- **UI Utilities**: Aceternity UI compoenents, DaisyUI Themes and compoenents
- **In-Memory Store**: Upstash Redis ⚡
- **HTTP Client**: Axios
- **Notifications**: React Toastify 🍞

---

## ✨ Inspiration & Story

While working on another project, I needed a chat feature. After building a mini chat app, I asked myself — _"Why stop here?"_ 🤔  
So I challenged myself to go all in and transform that simple idea into a full-fledged social media application.  
From chat features to posts, profiles, stories, and more — **Pixster** was born. 💥

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
- Advanced **aggregation pipelines** to efficiently fetch deeply connected data.

---

## 🌟 Core Features

- 🔐 **User Authentication** with OTP verification (Sign up, Login, Password reset)
- 🔐 **Public/Private Account Type**: Users can now toggle between public or private profiles.
- 📝 **Posts** with image and caption OR just text (Threads)
- 🤖 **AI-Powered Post Caption Generation** using **Gemini 1.5**
- 🕒 **Rate Limiting** for AI caption generation (5 requests per day)
- 📷 **Stories** that disappear after a day
- 💬 **Real-time Chat** with online user indicators and typing effects
- 🛎️ **Real-time Notifications** for follows, messages, likes, and comments
- 🧑‍🤝‍🧑 Follow/Unfollow, Accept/Reject requests
- 🔎 **User Search** with suggestions
- 🔄 **Debouncing** in search to reduce server load
- 💾 Save posts, ❤️ Like posts/comments, 💬 Reply to comments (1-level nesting)
- 📁 Media uploads via **signed AWS S3 URLs**
- 🎨 Fully responsive UI with **theme switching**
- 🧩 Reusable Components, Lazy Loading, Shimmer & Skeleton loaders

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

- All media files are uploaded securely to **AWS S3 Buckets**.
- Files are accessed via **signed URLs** to ensure secure and private access.

---

## 🚀 Final Words

Pixster is more than just a clone — it’s a showcase of passion, problem-solving, and full-stack mastery. From planning the data structure and managing user connections to handling complex aggregations, every feature is hand-crafted with care, keeping scalability and real-world usage in mind.  

The development process involved continuous testing and optimization, ensuring smooth performance while also making the UI fully responsive. Tackling challenges like real-time updates, managing data flows, and refining backend performance were key parts of the journey.

_This project is a big step in my journey as a developer, and I hope you enjoy exploring it as much as I enjoyed building it, learning from every challenge and continually adding new features along the way._ 💙

---

> _“Built with ❤️, bugs, rewrites, and late nights.”_
