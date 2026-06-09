import { GoogleGenAI } from '@google/genai';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

export function getGeminiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GENERATIVE_API_KEY ||
    process.env.GOOGLE_API_KEY
  );
}

function extractPrompt(clientPayload) {
  const text = clientPayload?.contents?.[0]?.parts?.[0]?.text;
  return typeof text === 'string' && text.length > 0 ? text : null;
}

function buildSdkConfig(clientPayload, useStructuredOutput) {
  const generationConfig = clientPayload?.generationConfig || {};
  const config = {
    temperature: generationConfig.temperature ?? 0,
    topP: generationConfig.topP ?? 0.1,
  };

  if (!useStructuredOutput) {
    return config;
  }

  config.responseMimeType = generationConfig.responseMimeType || 'application/json';
  if (generationConfig.responseSchema) {
    config.responseJsonSchema = generationConfig.responseSchema;
  }

  return config;
}

function toFrontendShape(text) {
  return {
    candidates: [
      {
        content: {
          parts: [{ text }],
        },
      },
    ],
  };
}

function parseGeminiError(err) {
  const raw = String(err?.message || err);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error) {
      return {
        status: parsed.error.code || 502,
        body: parsed,
      };
    }
  } catch {
    // not JSON
  }

  return {
    status: 502,
    body: { error: { message: raw } },
  };
}

function isSchemaError(message) {
  return (
    message.includes('responseSchema') ||
    message.includes('responseJsonSchema') ||
    message.includes('responseMimeType') ||
    message.includes('generation_config')
  );
}

export async function generateWithGemini(clientPayload, useStructuredOutput = true) {
  const geminiKey = getGeminiKey();
  if (!geminiKey) {
    return {
      status: 500,
      body: { error: { message: 'Server missing GEMINI_API_KEY environment variable' } },
    };
  }

  const prompt = extractPrompt(clientPayload);
  if (!prompt) {
    return {
      status: 400,
      body: { error: { message: 'Invalid payload: missing prompt text' } },
    };
  }

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  let structured = useStructuredOutput;
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: buildSdkConfig(clientPayload, structured),
      });

      const text = response.text;
      if (!text) {
        lastError = new Error('Empty response from model');
        continue;
      }

      return { status: 200, body: toFrontendShape(text) };
    } catch (err) {
      lastError = err;
      const message = String(err?.message || err);

      if (structured && isSchemaError(message)) {
        structured = false;
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: buildSdkConfig(clientPayload, false),
          });
          if (response.text) {
            return { status: 200, body: toFrontendShape(response.text) };
          }
        } catch (retryErr) {
          lastError = retryErr;
        }
      }

      if (message.includes('NOT_FOUND') || message.includes('"code":404')) {
        continue;
      }

      const parsed = parseGeminiError(err);
      if (parsed.status === 401 || parsed.status === 403) {
        return parsed;
      }
    }
  }

  if (lastError) {
    const parsed = parseGeminiError(lastError);
    if (parsed.status === 401 || parsed.status === 403) {
      return parsed;
    }
  }

  return {
    status: 502,
    body: {
      error: {
        message: 'All Gemini models failed',
        details: String(lastError?.message || lastError),
      },
    },
  };
}
