# Frontend README

## Peblo Workplace Client

React + Vite frontend for Peblo Workplace. This application provides the landing page, authentication screens, responsive dashboard, AI insights UI, and public shared note view.

### Tech

- React 19
- Vite
- React Router
- Axios
- Lucide React

### Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Environment:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

### Main Screens

- Landing page
- Login page
- Signup page
- Dashboard
- Shared note page

### Dashboard Capabilities

- Note creation and editing
- Auto-save
- Tagging and search
- Starred and archived flows
- AI summaries and action items
- Share link management
- Weekly activity and AI usage stats

### Important Files

- `src/pages/Dashboard.jsx`
- `src/pages/LandingPage.jsx`
- `src/components/Sidebar.jsx`
- `src/styles/dashboard.css`
- `src/styles/landing.css`
