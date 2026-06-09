import { generateWithGemini } from './_gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientPayload = req.body?.payload ?? null;
  if (!clientPayload) {
    return res.status(400).json({ error: 'Missing payload in request body' });
  }

  const useStructuredOutput = req.body.useStructuredOutput !== undefined
    ? Boolean(req.body.useStructuredOutput)
    : true;

  const { status, body } = await generateWithGemini(clientPayload, useStructuredOutput);
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}
