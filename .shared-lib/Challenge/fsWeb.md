On-Site Full-Stack Programming Project (2 Hours)

Generative Instagram — Project Overview

Instagram is so 2023! Instead of taking photos yourself, you’ll generate them with AI and share them with friends and the world.

This project guides you through building a simple full-stack application that uses Next.js/React, OpenAI’s DALL·E 2, and a minimal backend to store/generated published images.
---

✅ Requirements

🧩 Core Features
- Build a Next.js/React frontend where the user enters a prompt.
- App generates several images using OpenAI DALL·E 2.
- User selects favorites and publishes them to a feed.
- Feed displays all published images and allows users to ❤️ heart them.


🏗️ Architecture
Two components:
- Frontend: React/Next.js application
- Backend API: Manages requests + database persistence
- Backend must store & return published images.
- No authentication required.


🛠️ Development Setup
Run locally (localhost).
- Optional: deploy to Vercel or any hosting service.

AI-assisted tools encouraged:
- ChatGPT
- GitHub Copilot
- Aider
- Any generative AI coding helper

---

UI Mockup (from screenshot)
+--------------------------------------------+
| [ Prompt Input Field ]  (Generate button)  |
+--------------------------------------------+

Generated Images:
[ img ] [ img ] [ img ] ...

Published Feed:
[ img ❤️ ] [ img ❤️ ] [ img ❤️ ] ...
---

📘 Notion-Ready Project Template

🎯 Project Goal
Build a Generative Instagram app using Next.js, DALL·E, and a small backend.

---

🔧 Tech Stack
- Next.js / React
- Node.js backend API
- OpenAI DALL·E 2
- SQLite / Postgres / any simple DB
- Optional: Vercel deployment
---

```
📂 Project Structure

/
├── frontend/
│   ├── pages/
│   ├── components/
│   └── styles/
└── backend/
    ├── api/
    ├── db/
    └── services/
```

---

📝 Task Breakdown

▶️ 1. Frontend Setup
[ ] Initialize Next.js app
[ ] Add input field for prompt
[ ] Display generated images
[ ] Allow selecting images
[ ] Publish selected images to backend

▶️ 2. Backend Setup
[ ] Create REST endpoints
[ ] Endpoint: /generate → Calls DALL·E
[ ] Endpoint: /publish → Stores chosen image
[ ] Endpoint: /feed → Returns feed


▶️ 3. Database
[ ] Create table: published_images
- Fields:
- id
- image_url
- prompt
- hearts
- created_at



▶️ 4. Feed Page
[ ] Fetch feed from backend
[ ] Display all published images
[ ] Add ❤️ heart button
[ ] Increment heart count on click

---

Example API Contract (Toggle)

<details>
    <summary>
        <strong>Show API Contract</strong>
    
    </summary>

POST /generate
Request:
{ "prompt": "cat astronaut" }
Response:
{
  "images": [
    "url1",
    "url2",
    "url3"
  ]
}

---

POST /publish

Request:
{
  "image_url": "url1",
  "prompt": "cat astronaut"
}

Response:
{ "success": true }

---

GET /feed
Response:
[
  {
    "id": 1,
    "image_url": "url1",
    "hearts": 12
  }
]
</details>

---

AI Helpers You Can Use

- ChatGPT (for code, UI, architecture help)
- GitHub Copilot (inline code suggestions)
- Aider (AI pair-programming tool)
- Any gen-AI tool to accelerate development