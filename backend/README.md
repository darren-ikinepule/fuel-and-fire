# Backend API

Express server for food-item CRUD and a secure Gemini proxy used during local development.

Environment variables (copy `.env.example` to `.env`):

- `MONGODB_URI` - MongoDB connection string
- `GEMINI_API_KEY` - API key from [Google AI Studio](https://aistudio.google.com/apikey) (also accepts `GENERATIVE_API_KEY` or `GOOGLE_API_KEY`)
- `PORT` - optional, defaults to `3000`

Endpoints:

- `GET /food-items` - list food items
- `POST /api/generate` - Gemini nutrition proxy. Body:
  - `payload` - Gemini request shape built by the frontend (`contents` + `generationConfig`)
  - `useStructuredOutput` (optional, default `true`)

Local dev: run this server on port 3000, then `npm run dev` in `frontend/` (Vite proxies `/api` here).

Production: Vercel serves `frontend/api/generate` with the same SDK-based logic. Set `GEMINI_API_KEY` in Vercel project settings.

Security: never commit API keys. New Google keys often start with `AQ.` and require the `@google/genai` SDK (not raw REST `?key=` URLs).
