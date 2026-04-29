# D&G Constructora - Guía de Deploy

## Arquitectura: Netlify (Frontend) + Render (Backend)

```
Netlify (Static)          Render (Node.js)
+-------------+           +-------------------+
|  React App  | --------> |  Hono API + tRPC  |
|  (dist/)    |   HTTPS   |  MySQL Database   |
+-------------+           |  MercadoPublico   |
  dygconstructora.cl      +-------------------+
                          dyg-api.onrender.com
```

---

## PARTE 1: Backend en Render

### 1. Crear cuenta en [render.com](https://render.com)
- Registrate con GitHub (más fácil)

### 2. Crear Web Service
1. Dashboard → **New +** → **Web Service**
2. Conectá tu repo de GitHub (o subí el código manual)
3. Configuración:
   - **Name**: `dyg-constructora-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Variables de entorno (Environment)
En el dashboard de tu servicio → **Environment** → agregá estas variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=mysql://tu_usuario:tu_pass@tu_host:4000/tu_database
APP_ID=19dd750a-d572-8e89-8000-00000a10f5cf
APP_SECRET=tu-app-secret
VITE_APP_ID=19dd750a-d572-8e89-8000-00000a10f5cf
KIMI_AUTH_URL=https://auth.kimi.com
KIMI_OPEN_URL=https://open.kimi.com
OWNER_UNION_ID=tu-owner-union-id
MP_TICKET=8BBCAB7E-0911-4E40-BD68-C56A0A33FF78
```

### 4. Base de datos MySQL
Opciones:
- **PlanetScale** (gratis, MySQL serverless)
- **TiDB Cloud** (gratis, ya tenés una)
- **Railway** (gratis $5/mes)
- **Aiven** (gratis 5GB)

Para usar tu DB actual de TiDB:
- Copiá el `DATABASE_URL` de tu archivo `.env`
- Pegalo en las variables de entorno de Render

### 5. Deploy
- Click **Manual Deploy** → **Deploy latest commit**
- Esperá a que termine (~3-5 minutos)
- Copiá la URL: `https://dyg-constructora-api.onrender.com`

---

## PARTE 2: Frontend en Netlify

### 1. Crear cuenta en [netlify.com](https://netlify.com)
- Registrate (puede ser con email)

### 2. Deploy manual (más fácil)
1. Dashboard → **Add new site** → **Deploy manually**
2. Subí el archivo `dyg-constructora-netlify.zip`
3. Click **Deploy site**

### 3. O deploy desde Git
1. Dashboard → **Add new site** → **Import from GitHub**
2. Seleccioná el repo → **Deploy**

### 4. Configurar variables de entorno
En el dashboard → **Site settings** → **Environment variables**:

```
VITE_API_URL=https://dyg-constructora-api.onrender.com/api/trpc
```

Reemplazá `dyg-constructora-api` con el nombre que le pusiste a tu servicio en Render.

### 5. Conectar dominio propio
1. **Domain settings** → **Add custom domain**
2. Ingresá: `dygconstructora.cl`
3. Seguí las instrucciones para configurar los DNS en tu proveedor de dominio

---

## PARTE 3: Configurar OAuth (Kimi Login)

En el portal de Kimi donde creaste la app, actualizá el **OAuth Callback URL**:

```
https://dyg-constructora-api.onrender.com/api/oauth/callback
```

---

## Verificación

| Endpoint | URL esperada |
|----------|-------------|
| Frontend | `https://dygconstructora.cl` |
| API | `https://dyg-constructora-api.onrender.com/api/trpc` |
| Ping | `https://dyg-constructora-api.onrender.com/api/trpc/ping` |

Para probar el backend:
```bash
curl https://dyg-constructora-api.onrender.com/api/trpc/ping
# Debería responder: {"result":{"data":{"ok":true,"ts":...}}}
```

---

## Troubleshooting

### "CORS error" en el navegador
- Verificá que el backend tenga la variable `NODE_ENV=production`
- Verificá que `VITE_API_URL` apunte al backend correcto

### "Cannot connect to database"
- Verificá que `DATABASE_URL` esté correcta en Render
- Asegurate de que la base de datos acepte conexiones desde Render (whitelist de IPs)

### El scraper no funciona
- Verificá que `MP_TICKET` esté configurado en Render
- El ticket tiene expiración - si falla, generá uno nuevo en MercadoPublico.cl

### Frontend muestra "Cargando..." infinito
- Verificá que `VITE_API_URL` esté configurada en Netlify
- Verificá que el backend esté corriendo (hacé ping a la URL)
