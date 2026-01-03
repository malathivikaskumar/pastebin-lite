# 📋 Pastebin-Lite

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

A **Pastebin-Lite** application built with **Next.js**, **Node.js**, and **PostgreSQL (Neon)**.  
It allows users to create temporary pastes with **TTL (time-to-live)** and **maximum view limits**, similar to Pastebin but lightweight and production-ready.

---

## 🌐 Live Deployment

- **Frontend**: [https://pastebin-lite-vikas-fe.vercel.app](https://pastebin-lite-vikas-fe.vercel.app)  
- **Backend**: [https://pastebin-lite-vikas-be.vercel.app](https://pastebin-lite-vikas-be.vercel.app)  
- **Database**: Neon PostgreSQL (Serverless)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon) |
| Hosting | Vercel |

---

## ✨ Features

- 📝 Create text pastes
- ⏳ Auto-expiry using TTL
- 👀 Max view count enforcement
- 🔗 Shareable short URLs
- 🛡️ Server-side validation
- ⚡ Serverless-ready backend

---
<img width="749" height="461" alt="image" src="https://github.com/user-attachments/assets/18f128c0-6d79-4b94-960e-0784593ae165" />

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
```

### 2️⃣ Frontend Setup

```bash
cd pastebin-lite-frontend

create .env.local file and add below property
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

npm install
npm run dev
```

Frontend will run at:
```
http://localhost:3000
```

### 3️⃣ Backend Setup

```bash
From root directory
cd pastebin-lite-backend
```

Create `.env` file:
```env
DATABASE_URL=postgresql://pastebin:npg_ZRXB7lGeV8Jg@ep-raspy-cloud-a43ddwcz-pooler.us-east-1.aws.neon.tech/pastebin?sslmode=require&channel_binding=require
PORT=8000
```

Install dependencies and start backend:
```bash
npm install
npm start
```

Backend will run at:
```
http://localhost:8000
```

---

## 🔌 Backend API Endpoints

### ✅ Health Check

```http
GET /api/healthz
```

### 📝 Create Paste

```http
POST /api/pastes
```

Request Body:
```json
{
  "content": "test locally",
  "ttl_seconds": 100,
  "max_views": 4
}
```

### 👀 View Paste

```http
GET /p/:id
```

### 📄 Fetch Paste Details

```http
GET /pastes/:id
```

---

## 🛠️ Environment Variables

| Variable | Description |
|----------|------------|
| DATABASE_URL | Neon PostgreSQL connection string |
| PORT | Backend server port |

---

## 🔐 Security Notes

- SSL is mandatory for Neon PostgreSQL
- Pastes expire automatically after TTL
- Max view count enforced server-side
- `.env` secrets should never be committed

---

## 📌 Future Improvements

- 🔐 Authentication for private pastes
- 📊 Analytics dashboard
- 🧾 Syntax highlighting
- 📁 File uploads
- 🖼️ Optional screenshot previews

---

## 📜 License

MIT License

---

## 🙌 Author

**Vikas**  
Built with ❤️ using Node.js, Next.js, and Neon PostgreSQL
