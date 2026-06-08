# Backend proxy for Gemini API

This backend provides a secure proxy endpoint to call the Google Generative Language (Gemini) API without exposing the API key in the frontend.

Environment variables (set in `.env`):

- `MONGODB_URI` - existing MongoDB connection string
- `GEMINI_API_KEY` - your Google Generative Language API key (preferred). The server will also accept `GENERATIVE_API_KEY` or `GOOGLE_API_KEY`.

Endpoint:

- `POST /api/generate` - forwards the request to Gemini models. JSON body should include:
  - `payload` - the request payload to send to the Gemini endpoint (same format the frontend previously built)
  - `useStructuredOutput` (optional) - boolean, whether to request structured output (default: true)

Responses from the Gemini API are proxied back with the same status code and body where possible.

Security note: keep `GEMINI_API_KEY` secret and do not commit it to source control.
