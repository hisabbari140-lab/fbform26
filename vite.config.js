import { loadEnv } from 'vite'

// Runs the /api functions locally with `npm run dev` (Vercel runs them online)
function apiDev(env) {
  return {
    name: 'api-dev',
    configureServer(server) {
      Object.assign(process.env, env)
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()
        const name = req.url.split('?')[0].replace('/api/', '')
        if (!/^[a-z-]+$/.test(name)) return next()
        let raw = ''
        for await (const c of req) raw += c
        try { req.body = raw ? JSON.parse(raw) : {} } catch { req.body = {} }
        res.status = (c) => { res.statusCode = c; return res }
        res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)) }
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          await mod.default(req, res)
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'Server error' })
        }
      })
    },
  }
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [apiDev(env)] }
}
