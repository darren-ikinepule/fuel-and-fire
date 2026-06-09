import { getGeminiKey } from './_gemini.js';

export default function handler(_req, res) {
  const hasKey = Boolean(getGeminiKey());
  return res.status(200).json({
    ok: true,
    api: 'fuel-and-fire',
    geminiKeyConfigured: hasKey,
    geminiSdk: true,
  });
}
