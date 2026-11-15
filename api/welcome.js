import { askGemini } from './_gemini.js'
import { knowledgeText } from './_knowledge.js'

const clean = (v) => String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 80)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const name = clean(req.body?.name)
  const className = clean(req.body?.className)
  const modes = Array.isArray(req.body?.modes) ? req.body.modes.map(clean).join(' and ') : ''
  if (!name) return res.status(400).json({ error: 'Missing name' })

  const system = `You write a short, warm confirmation message to a parent whose child's admission form was just received.
Write 3 to 4 sentences in simple English. Mention the student's name, class and class mode. Say the team will contact them on WhatsApp soon. Do not promise fees, dates or timings. No emojis, no markdown, no subject line.

${knowledgeText()}`

  try {
    const text = await askGemini({
      system,
      contents: [{ role: 'user', parts: [{ text: `Student: ${name}. Class: ${className}. Class mode: ${modes}.` }] }],
      maxTokens: 1024,
    })
    return res.status(200).json({ message: text })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not create message' })
  }
}
