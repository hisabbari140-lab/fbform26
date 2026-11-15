import { askGemini } from './_gemini.js'
import { knowledgeText } from './_knowledge.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const list = Array.isArray(req.body?.messages) ? req.body.messages.slice(-10) : []
  const contents = list
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text.slice(0, 500) }],
    }))
  if (!contents.length || contents[contents.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'No question' })
  }

  const system = `You are the friendly assistant on the admission page of a school/coaching centre.
Answer parents' questions in simple, short English (max 4 sentences). If the parent writes in another language, reply in that language.
Use ONLY the information below. If something is not listed (fees, timing, phone, teachers, results, etc.), say you do not have that information and tell them: Contact WhatsApp 01309794485. Never invent prices, dates or promises.
Help with how to fill the form: all fields are required, the student must be 4 to 13 years old, WhatsApp number must be a Bangladesh number.

${knowledgeText()}`

  try {
    const reply = await askGemini({ system, contents, maxTokens: 1024 })
    return res.status(200).json({ reply: reply || 'Sorry, please try again.' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Assistant is not available right now.' })
  }
}