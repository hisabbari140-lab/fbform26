export async function askGemini({ system, contents, maxTokens = 1024 }) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY is missing')
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.6 },
      }),
    }
  )
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${await r.text()}`)
  const d = await r.json()
  return (d.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim()
}
