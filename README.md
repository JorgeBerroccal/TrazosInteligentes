# Trazo Inteligente: landing corporativa (MVP)

Sitio de una sola página para una empresa de TI: inicio, servicios, portafolio con modal, formulario de contacto funcional, botón flotante de WhatsApp y footer con aviso de privacidad.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · API Route de Next.js · despliegue en Vercel.

## Requisitos

- Node.js 20.9 o superior (`node -v` para verificar)
- Git y una cuenta de GitHub
- Una cuenta gratuita de Vercel (puedes entrar con tu cuenta de GitHub)

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Los envíos del formulario se guardan en `data/leads.json` (este archivo está en `.gitignore`, no se sube al repositorio).

Para probar la versión de producción:

```bash
npm run build
npm start
```

## Estructura

```
app/
  api/contact/route.ts   Endpoint del formulario (validación, honeypot, rate limit, duplicados)
  layout.tsx, page.tsx   Layout, metadatos SEO y composición de la página
  globals.css            Tokens de diseño (colores, tipografía) y estilos base
components/              Header, Hero, Services, Portfolio, ProjectModal, Contact, ContactForm, Footer, FloatingContact
data/
  services.ts            Servicios (contenido de ejemplo, máx. 6)
  projects.ts            Proyectos (contenido de ejemplo, máx. 5 destacados)
lib/
  site.ts                Datos de contacto: única fuente para header, formulario y footer
  validation.ts          Reglas de validación compartidas por cliente y servidor
  storage.ts             Guardado de leads, límite por IP y control de duplicados
  notify.ts              Aviso opcional por email (Resend)
public/images/           Imágenes del portafolio en WebP (< 15 KB cada una)
```

## Cómo funciona el formulario

1. El cliente valida mientras escribes: nombre de 2 caracteres o más, correo con formato válido y mensaje de 10 caracteres o más. La empresa es opcional.
2. El botón se deshabilita y muestra "Enviando…" mientras se procesa.
3. El servidor (`/api/contact`) vuelve a validar todo y además:
   - descarta en silencio los envíos que llenan el campo oculto **honeypot** (bots);
   - limita a **5 envíos cada 10 minutos por IP** (responde 429);
   - rechaza un segundo envío del **mismo correo en 24 horas** (responde 409);
   - guarda el lead con `id`, `createdAt` y `status: "new"`.

| Respuesta | Qué ve el usuario |
|---|---|
| 201 | Mensaje verde: "Gracias, te contactaremos pronto." |
| 409 | Aviso de que ya se recibió una solicitud con ese correo |
| 422 | Errores marcados en cada campo |
| 429 / 500 | Mensaje rojo para reintentar más tarde |

### Importante: dónde se guardan los leads en Vercel

Vercel no tiene disco persistente. Sin configurar nada, el formulario **funciona** (valida, responde y registra cada envío en los logs de la función, visibles en *Logs* dentro del proyecto de Vercel), pero los leads se guardan en `/tmp` y **se pierden** cuando la función se reinicia. El límite por IP también se reinicia.

Para que queden guardados de forma permanente, conecta **Upstash Redis** (plan gratuito):

1. En tu proyecto de Vercel, abre la pestaña **Storage** (o el **Marketplace**) y agrega **Upstash for Redis** con el plan gratuito. Conéctalo al proyecto.
2. Vercel agregará las variables de entorno automáticamente (`KV_REST_API_URL`/`KV_REST_API_TOKEN` o `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`; el código acepta ambas).
3. Vuelve a desplegar (**Deployments → Redeploy**).

Desde ese momento los leads se guardan en la lista `leads` de Redis. Para verlos, abre la consola de Upstash (Data Browser o CLI) y ejecuta:

```
LRANGE leads 0 -1
```
En los logs aparecerá `guardado (modo redis)` en lugar de `(modo local)`.

## Seguridad incluida

- Validación en cliente y servidor con las mismas reglas.
- Honeypot antibots y límite de peticiones por IP.
- Tamaño máximo del cuerpo de la petición (10 KB).
- Cabeceras de seguridad (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Credenciales solo en variables de entorno; `.env*` está en `.gitignore`.
- HTTPS automático en Vercel.

## Accesibilidad

Etiquetas visibles en todos los campos, errores vinculados con `aria-describedby`, mensajes de estado con `role="status"` / `role="alert"`, modal con `<dialog>` nativo (cierra con Escape y devuelve el foco), enlace "Saltar al contenido", foco visible con teclado y animaciones desactivadas si el sistema pide movimiento reducido.

## Fuera del alcance del MVP

Blog, panel de administración, autenticación, multi-idioma, pagos y CMS.
