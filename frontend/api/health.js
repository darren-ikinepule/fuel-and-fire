function getGeminiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GENERATIVE_API_KEY ||
    process.env.GOOGLE_API_KEY
  );
}

export default function handler(_req, res) {
  const hasKey = Boolean(getGeminiKey());
  return res.status(200).json({
    ok: true,
    api: 'fuel-and-fire',
    geminiKeyConfigured: hasKey,
  });
}
