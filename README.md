# Peblo Workplace

Production-style AI notes workspace built for the **Peblo Full Stack Developer Challenge**. Peblo Workplace combines secure authentication, a polished glassmorphism dashboard, structured note management, and AI-assisted productivity features into a modern SaaS-style collaboration experience.

---
<img width="1920" height="1080" alt="Screenshot (24)" src="https://github.com/user-attachments/assets/424602ae-32ed-48b5-90e6-1591e092b5ac" />


## Overview

Peblo Workplace is a full stack application designed for users who want more than a basic note-taking app. It provides a structured workspace for capturing ideas, organizing notes, generating AI summaries, extracting action items, sharing content publicly, and tracking writing activity over time.

The product is intentionally designed like a scalable startup workspace:

- A **React + Vite frontend** for fast, responsive interactions
- A **Node.js + Express API** for authentication, note workflows, AI orchestration, and sharing
- **MongoDB** for persistent user and note storage
- **JWT-based auth** for protected dashboard access
- **Google Gemini** as the primary AI provider, with optional OpenRouter fallback already supported in the backend

---

## Live Demo

- App: [Peblo Workspace](https://ai-notes-workspace-neon.vercel.app/)

## Demo Video

- Walkthrough: [Watch Demo](https://1drv.ms/v/c/f1ef0ae8f13f2f55/IQBIBIdGUSMbS7btMiqr-MzIAWmg0TNE4crhxkettKUT5Rs)

---

## Key Features

### Core Workspace

- Secure sign up and login with JWT authentication
- Create, edit, update, and delete notes
- Auto-save workflow for a smoother editing experience
- Tagging and note categorization
- Search and filtering across titles, content, and tags
- Color-coded note organization
- Starred notes for quick prioritization
- Archive and restore flows for long-term note management


### AI Productivity Layer

- AI-generated note summaries
- AI-generated action items
- AI-suggested note titles
- Structured JSON-based AI response normalization
- Gemini as the primary provider with optional OpenRouter fallback

### Sharing and Collaboration

- Public share links for notes
- Private/public visibility management
- Dedicated public note view route

### Analytics and Dashboard Experience
- Productivity insights endpoint
- AI usage statistics
- Weekly activity summary
- Responsive dashboard layout
- Modern dark/light visual system with glassmorphism styling

---

## Screenshots

> Replace these placeholders with real project images before submitting or publishing.

| View | Placeholder |
|------|-------------|
| Landing Page | `<img width="1920" height="1080" alt="Screenshot (19)" src="https://github.com/user-attachments/assets/664d5e07-3b61-470a-a7f3-284c30d1bda4" />
` |
| Authentication | `<img width="1920" height="1080" alt="Screenshot (23)" src="https://github.com/user-attachments/assets/595f2613-a74b-4f7e-aa6e-ca3a0529cd4f" />
` |
| Dashboard Home | `<img width="1920" height="1080" alt="Screenshot (24)" src="https://github.com/user-attachments/assets/a88afd06-5585-4568-bade-641edc21bcac" />
` |
| Notes Workspace | `<img width="1920" height="1080" alt="Screenshot (25)" src="https://github.com/user-attachments/assets/582e2362-8c3f-4d7b-9287-22c2c378dd55" />
` |
| AI Insights | `<img width="1920" height="1080" alt="Screenshot (26)" src="https://github.com/user-attachments/assets/03528d49-2ea1-48b8-82ef-f761463a6d72" />
` |
| Public Shared Note | `<img width="1920" height="1080" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/38c5021f-5bc0-49de-ba2b-2d9e608ef79f" />
` |

---

## Architecture Overview

Peblo Workplace is split into two independently runnable applications:

### Frontend

- Built with **React 19 + Vite**
- Uses **React Router** for route-based navigation
- Uses **Axios** for backend communication
- Handles auth token persistence in local storage
- Renders the landing page, auth screens, dashboard, AI insights, and public shared note views

### Backend

- Built with **Node.js + Express 5**
- Uses **Mongoose** to model users and notes in MongoDB
- Secures protected routes using **JWT middleware**
- Encapsulates note CRUD, share/unshare flows, analytics, and AI summarization logic

### High-Level Request Flow

```text
React Client
   |
   | HTTP / JSON
   v
Express API
   |-- Auth routes -> JWT issue / validation
   |-- Note routes -> CRUD / archive / share / insights
   |-- AI controller -> Gemini / OpenRouter provider orchestration
   v
MongoDB
```

---

## Folder Structure

```text
peblo_fixed/
├── README.md
├── backend/
│   ├── README.md
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   └── utils/
├── frontend/
│   ├── README.md
│   ├── .env.example
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   └── Sidebar.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── SharedNote.jsx
│       │   └── SignupPage.jsx
│       └── styles/
│           ├── auth.css
│           ├── dashboard.css
│           ├── landing.css
│           └── sidebar.css
```

---

## Local Setup

### Prerequisites

- Node.js `18+`
- npm
- MongoDB Atlas account or local MongoDB instance
- Google AI Studio / Gemini API key

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd peblo_fixed
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend `.env.example`

Create `backend/.env` using the following values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/peblodb?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
CLIENT_URL=http://localhost:5173
```

### Frontend `.env.example`

Create `frontend/.env` using:

```env
VITE_API_URL=http://localhost:5000/api
```

### Variable Notes

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port. Defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens. |
| `GEMINI_API_KEY` | Recommended | Primary AI provider key used by Google Gemini. |
| `GEMINI_MODEL` | No | Gemini model name. Defaults to `gemini-2.0-flash`. |
| `OPENROUTER_API_KEY` | Optional | Fallback AI provider key if Gemini is unavailable. |
| `OPENROUTER_MODEL` | No | Fallback provider model name. |
| `CLIENT_URL` | Yes | Allowed frontend origin for CORS and AI request metadata. |
| `VITE_API_URL` | Yes | Frontend base URL for the backend API. |

---

## MongoDB Setup

### Option A: MongoDB Atlas

1. Create a MongoDB Atlas project.
2. Create a cluster.
3. Create a database user with read/write access.
4. Allow your IP address in Network Access.
5. Copy the connection string.
6. Paste it into `backend/.env` as `MONGO_URI`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/peblodb?retryWrites=true&w=majority
```

### Option B: Local MongoDB

If running MongoDB locally:

```env
MONGO_URI=mongodb://127.0.0.1:27017/peblodb
```

---

## Gemini API Setup

1. Open Google AI Studio.
2. Generate an API key for Gemini.
3. Add it to `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### AI Provider Behavior

- The backend tries **Gemini first**
- If Gemini is unavailable and `OPENROUTER_API_KEY` exists, it falls back to **OpenRouter**
- AI responses are normalized into a strict structure:

```json
{
  "summary": "2-4 sentence summary",
  "suggestedTitle": "Concise note title",
  "actionItems": ["Action 1", "Action 2"]
}
```

---

## Run Commands

### Backend

```bash
cd backend
npm run dev
```

Production run:

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

Production build:

```bash
cd frontend
npm run build
```

Preview production build locally:

```bash
cd frontend
npm run preview
```

---

## API Endpoints

### Auth

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/auth/signup` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Authenticate user and return JWT |

### Notes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/notes` | Yes | Fetch all notes for the authenticated user |
| `POST` | `/api/notes` | Yes | Create a new note |
| `PUT` | `/api/notes/:id` | Yes | Update a note |
| `DELETE` | `/api/notes/:id` | Yes | Delete a note |

### Sharing

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `PUT` | `/api/notes/share/:id` | Yes | Make a note public and generate or reuse a share ID |
| `PUT` | `/api/notes/share/:id/private` | Yes | Make a note private again |
| `GET` | `/api/notes/shared/:shareId` | No | Retrieve a public shared note |

### AI and Analytics

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/notes/:id/generate-summary` | Yes | Generate AI summary, suggested title, and action items |
| `GET` | `/api/notes/insights` | Yes | Get dashboard analytics including AI usage and weekly activity |

---

## Notes Data Model

The `Note` schema supports:

- `title`
- `content`
- `tags`
- `colorId`
- `starred`
- `archived`
- `isPublic`
- `shareId`
- `aiSummary`
- `actionItems`
- `suggestedTitle`
- `createdAt` / `updatedAt`

This makes the system flexible enough for future additions such as collaboration metadata, folders, permissions, and revision history.

---

## Deployment

## Frontend Deployment

Recommended targets:

- Vercel
- Netlify

Environment variable:

```env
VITE_API_URL=YOUR_DEPLOYMENT_LINK/api
```

Build settings:

```bash
npm install
npm run build
```

Output directory:

```text
dist
```


## Future Improvements

- Real-time collaborative editing with WebSockets
- Multi-user workspaces and team permissions
- Rich text editor with attachments
- Note version history and recovery
- Folder/project hierarchy
- AI semantic search over notes
- Notifications and mention system
- Rate limiting and audit logging
- Automated test coverage and CI pipeline
- Dockerized local development and production deployment

---

## Why This Project Stands Out

Peblo Workplace is more than a CRUD exercise. It demonstrates:

- Full stack application architecture
- Authentication and protected route design
- AI provider integration with fallback logic
- Clean separation between frontend experience and backend business logic
- Shareable public content flows
- Analytics-aware product thinking
- UI systems that feel like a modern productivity SaaS

---

## Acknowledgements

- **Peblo** for the challenge brief
- **Google Gemini** for AI capabilities
- **MongoDB Atlas** for hosted database infrastructure
- The **React**, **Express**, and **Vite** ecosystems for the core developer experience

---

## Sub-Project READMEs

- Backend guide: `backend/README.md`
- Frontend guide: `frontend/README.md`

These contain setup details tailored to each application boundary.
