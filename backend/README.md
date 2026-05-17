# Backend README

## Peblo Workplace API

Express-based backend for Peblo Workplace. This service handles authentication, note CRUD, shareable links, AI orchestration, and productivity insights.

### Tech

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT
- Google Gemini
- Optional OpenRouter fallback

### Setup

```bash
cd backend
npm install
cp .env.example .env
```

Populate:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-4o-mini
CLIENT_URL=http://localhost:5173
```

### Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

### Main Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `PUT /api/notes/share/:id`
- `PUT /api/notes/share/:id/private`
- `GET /api/notes/shared/:shareId`
- `POST /api/notes/:id/generate-summary`
- `GET /api/notes/insights`

### Health Check

```text
GET /
```

### Notes

- JWT protects private routes via `middleware/authMiddleware.js`
- AI generation is managed in `controllers/aiController.js`
- Analytics are returned from `controllers/noteController.js`
