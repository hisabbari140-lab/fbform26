import { askGemini } from './_gemini.js'
import { SCHOOL, knowledgeText } from './_knowledge.js'

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

  const system = `You are the friendly assistant for Abacus Expert Birganj.
Answer questions about Abacus Expert Birganj and the admission form in simple, short language (max 4 sentences). Reply in the same language as the question.
For general questions about the abacus as a learning tool, answer normally using your general knowledge. For school-specific facts, use only the information below.
If a school-specific answer is not listed or confirmed, say so clearly, then include: WhatsApp: 01309794485. Visit our Facebook page: https://www.facebook.com/profile.php?id=61596192016650
Never invent prices, dates, schedules or promises.
Help with how to fill the form: all fields are required, the student must be 4 to 13 years old, WhatsApp number must be a Bangladesh number.

${knowledgeText()}`

  try {
    const reply = await askGemini({ system, contents, maxTokens: 1024 })
    return res.status(200).json({
      reply: reply || 'Sorry, please try again.',
      facebook: SCHOOL.facebook,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Assistant is not available right now.' })
  }
}