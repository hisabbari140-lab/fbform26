// Runs once a day (see vercel.json) so the free Supabase project is never paused
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return res.status(500).json({ ok: false, error: 'Missing Supabase env' })
  try {
    const r = await fetch(`${url}/rest/v1/keep_alive?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`)
    return res.status(200).json({ ok: true, time: new Date().toISOString() })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ ok: false })
  }
}
