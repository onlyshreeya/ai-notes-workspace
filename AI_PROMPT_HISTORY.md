# AI Prompt History

This document is a reconstructed and representative prompt history for the Peblo Workplace project. It is based on the current codebase and reflects the kinds of prompts that would reasonably have been used during planning, implementation, debugging, and UI iteration.

## Project

Peblo Workplace is a full-stack AI notes application with:
- React frontend
- Node.js and Express backend
- MongoDB with Mongoose
- JWT authentication
- AI-powered note summaries
- Public note sharing
- Productivity insights dashboard

## Representative Prompt Log

### 1. Project Planning Prompt

**Prompt**

```text
I want to build a full-stack notes application called Peblo Workplace. Help me define the core features, tech stack, folder structure, and development roadmap. The app should support authentication, creating notes, tagging notes, AI-generated summaries, public sharing, and a productivity dashboard.
```

**Likely AI Output Summary**

- Suggested MERN-style architecture
- Recommended React for frontend and Express/MongoDB for backend
- Proposed modules for auth, notes, AI, sharing, and analytics
- Gave a step-by-step build roadmap

### 2. Backend Authentication Prompt

**Prompt**

```text
Generate Node.js Express controllers and routes for user signup and login using MongoDB, bcrypt, and JWT. I need validation, password hashing, token generation, and error handling.
```

**Likely AI Output Summary**

- Auth controller structure for signup and login
- JWT creation flow
- Password hashing with bcrypt
- Protected route strategy using middleware

### 3. JWT Middleware Prompt

**Prompt**

```text
Create Express middleware to protect private routes using JWT from the Authorization header. If the token is invalid or missing, return proper error responses.
```

**Likely AI Output Summary**

- Middleware for parsing Bearer token
- JWT verification logic
- Request user attachment for downstream controllers
- 401 handling for unauthorized access

### 4. Notes CRUD Prompt

**Prompt**

```text
Create a notes API in Express with MongoDB for creating, reading, updating, and deleting notes. Each note should belong to a logged-in user. Include title, content, tags, and optional metadata like starred or archived.
```

**Likely AI Output Summary**

- Note schema design
- CRUD controller logic
- User-scoped queries
- Allowed update fields and basic validation

### 5. Public Share Link Prompt

**Prompt**

```text
Help me add a public sharing feature for notes. I want an authenticated route that generates a unique share ID and a public route that lets anyone read the note if sharing is enabled.
```

**Likely AI Output Summary**

- Share ID generation using random tokens
- `isPublic` and `shareId` fields in notes
- Authenticated share/unshare endpoints
- Public read-only endpoint for shared notes

### 6. AI Summary Prompt Design

**Prompt**

```text
Write a prompt for an AI model that reads note content and returns only valid JSON with a summary, a suggested title, and action items. The output must be compact and easy to parse in a backend service.
```

**Likely AI Output Summary**

- Strict JSON-only response format
- Fields: `summary`, `suggestedTitle`, `actionItems`
- Clear rules for concise output
- Prompt wording suited for Gemini or OpenRouter

### 7. AI Controller Integration Prompt

**Prompt**

```text
Generate a backend controller that takes a note from MongoDB, sends its content to Gemini, parses the response safely, and saves the AI summary, suggested title, and action items back to the note.
```

**Likely AI Output Summary**

- AI controller flow for note lookup
- Prompt generation and model call
- Fallback-safe response parsing
- Database persistence for AI fields

### 8. Fallback Provider Prompt

**Prompt**

```text
I want my AI summary feature to use Gemini primarily but fall back to OpenRouter if Gemini fails. Show me how to structure this cleanly in Node.js with environment variables and error aggregation.
```

**Likely AI Output Summary**

- Provider priority logic
- Environment-based configuration
- Error collection from multiple providers
- Consistent normalized output layer

### 9. Insights Dashboard Prompt

**Prompt**

```text
Help me design a notes insights endpoint that returns useful productivity stats such as total notes, AI summary count, top tags, and recent activity over the last 7 days.
```

**Likely AI Output Summary**

- Metrics for notes dashboard
- Tag frequency aggregation
- Weekly activity calculations
- Clean JSON response for frontend consumption

### 10. React Dashboard Prompt

**Prompt**

```text
Build a React dashboard page for a notes app with a sidebar, note cards, AI insights view, starred notes, archived notes, tag filtering, and modals for editing notes and sharing links.
```

**Likely AI Output Summary**

- Multi-view dashboard structure
- Sidebar navigation ideas
- Note editor modal
- Share modal and AI panel concepts

### 11. Landing Page UI Prompt

**Prompt**

```text
Create a premium-looking landing page for Peblo Workplace with a fixed navbar, hero section, product preview, features grid, about section, how-it-works section, CTA, and footer. The style should feel modern and AI-product inspired.
```

**Likely AI Output Summary**

- Landing page section hierarchy
- Visual language with gradients and glassmorphism
- CTA placement and feature storytelling
- Responsive layout suggestions

### 12. Authentication Page UI Prompt

**Prompt**

```text
Design React login and signup pages for an AI notes product. I want a split-screen layout with strong branding on the left and a clean form card on the right.
```

**Likely AI Output Summary**

- Split-screen auth layout
- Shared auth stylesheet approach
- Form field structure
- Brand messaging and conversion copy

### 13. Frontend API Integration Prompt

**Prompt**

```text
Show me how to connect a React frontend to my Express backend using axios for signup, login, fetching notes, creating notes, updating notes, deleting notes, and generating AI summaries.
```

**Likely AI Output Summary**

- Axios request patterns
- Token storage with localStorage
- Authorization headers
- Route-based navigation flow

### 14. Shared Note Page Prompt

**Prompt**

```text
Create a public note page in React that loads a shared note by shareId, shows title, content, tags, and AI summary, and handles the case where the note is no longer public.
```

**Likely AI Output Summary**

- Read-only shared note page
- Loading and error states
- AI summary display block
- Public-facing presentation style

### 15. Debugging Prompt for Scroll Issue

**Prompt**

```text
My React landing page is not scrolling. Help me inspect global CSS, route-level CSS leakage, and anything setting overflow hidden on body, root, or page containers.
```

**Likely AI Output Summary**

- Identified `overflow: hidden` as likely cause
- Suggested scoping fullscreen dashboard styles
- Prevented route CSS from affecting landing page

### 16. UI Scaling Prompt

**Prompt**

```text
I want the frontend to render at roughly 80% scale. What is the quickest global way to do this, and what are the tradeoffs between zoom and transform-based scaling?
```

**Likely AI Output Summary**

- Suggested global scaling approach
- Mentioned browser compatibility considerations
- Recommended applying the rule in a shared stylesheet

## How AI Was Likely Used In This Project

- For planning the app structure and sequencing the build
- For generating boilerplate controllers, routes, and schemas
- For designing prompts for the AI summary feature itself
- For frontend layout ideation and component scaffolding
- For debugging CSS and route-specific issues
- For refining feature wording, labels, and product copy

## Submission Note

If you are submitting this for selection, the safest wording is:

```text
This is a reconstructed AI prompt history prepared from the final project codebase. It represents the types of prompts used during development and debugging, even though the original chat logs were not preserved verbatim.
```

