const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

function getGeminiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GENERATIVE_API_KEY ||
    process.env.GOOGLE_API_KEY
  );
}

function buildEndpoint(model, key) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

async function proxyToGemini(clientPayload, useStructuredOutput) {
  const geminiKey = getGeminiKey();
  if (!geminiKey) {
    return { status: 500, body: JSON.stringify({ error: 'Server missing GEMINI_API_KEY environment variable' }) };
  }

  let structured = useStructuredOutput;
  let lastError = null;

  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const url = buildEndpoint(GEMINI_MODELS[i], geminiKey);
    const currentPayload = structured
      ? clientPayload
      : {
          contents: clientPayload.contents,
          generationConfig: {
            temperature: 0,
            topP: 0.1,
            responseMimeType: 'application/json',
          },
        };

    try {
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPayload),
      });

      const bodyText = await upstream.text().catch(() => '');

      if (upstream.status === 400 && structured) {
        if (
          bodyText.includes('responseSchema') ||
          bodyText.includes('responseMimeType') ||
          bodyText.includes('generation_config') ||
          bodyText.includes('unknown field')
        ) {
          structured = false;
          i--;
          continue;
        }
      }

      if (upstream.status === 404 && i < GEMINI_MODELS.length - 1) {
        continue;
      }

      return { status: upstream.status, body: bodyText };
    } catch (err) {
      lastError = err;
      if (i < GEMINI_MODELS.length - 1) continue;
      return { status: 502, body: JSON.stringify({ error: 'Failed to reach upstream API', details: String(err) }) };
    }
  }

  return {
    status: 502,
    body: JSON.stringify({ error: 'All upstream endpoints failed', details: String(lastError) }),
  };
}

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

  const { status, body } = await proxyToGemini(clientPayload, useStructuredOutput);
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).send(body);
}
