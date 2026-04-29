import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// CORS (permite Netlify)
app.use('*', cors({
origin: '*',
credentials: true,
}))

// Endpoint para iniciar OAuth
app.get('/api/oauth/authorize', async (c) => {
const url = new URL('https://www.kimi.com/authorize')

url.searchParams.set('client_id', process.env.KIMI_CLIENT_ID || '')
url.searchParams.set('client_name', 'D&G Constructora')

// 🔥 FIX CLAVE: forzar HTTPS en redirect_uri
url.searchParams.set(
'redirect_uri',
'https://dyg-constructora-backend.onrender.com/api/oauth/callback'
)

url.searchParams.set('response_type', 'code')
url.searchParams.set('scope', 'profile')

// guardar retorno al frontend
const frontendReturn = c.req.query('redirect_uri') || 'https://voluble-brioche-70156f.netlify.app/'
const state = Buffer.from(frontendReturn).toString('base64')

url.searchParams.set('state', state)

return c.redirect(url.toString())
})

// Callback OAuth
app.get('/api/oauth/callback', async (c) => {
const code = c.req.query('code')
const state = c.req.query('state')

if (!code) {
return c.text('Missing code', 400)
}

// 👉 aquí normalmente intercambias el code por token con Kimi
// (asumo que ya lo tienes implementado en otro archivo)

// decodificar state → URL de retorno frontend
let redirectUrl = 'https://voluble-brioche-70156f.netlify.app/'

try {
if (state) {
redirectUrl = Buffer.from(state, 'base64').toString('utf-8')
}
} catch (e) {
console.error('Error decoding state', e)
}

// 👉 aquí deberías setear cookie/sesión si ya tienes lógica
// ejemplo:
// c.header('Set-Cookie', `session=abc123; Path=/; HttpOnly; Secure`)

return c.redirect(redirectUrl)
})

export default app
