# WHOOP Marlon — WHOOP 4.0 en Bluefy + Supabase

Panel web estático para abrir desde **Bluefy en el iPhone**. Netlify publica la web por HTTPS; la conexión Bluetooth se inicia desde el botón de la página. Las muestras que el navegador entiende se guardan en Supabase bajo la cuenta autenticada del dueño.

## Estado y límites claros

- La página ofrece conexión Web Bluetooth, pulso en vivo del servicio Bluetooth estándar (si el strap lo anuncia), batería y guardado de muestras autorizadas. Incluye espacios para falta de sueño, energía/recuperación y cansancio; quedan como pendientes hasta tener un flujo de sueño y recuperación WHOOP 4.0 validado.
- El servicio propietario de WHOOP 4.0 aparece como soporte experimental: Bluefy debe permitir descubrirlo y recibir notificaciones. La lectura histórica completa y la reproducción de métricas derivadas de la app oficial **no están garantizadas** ni se dan por listas hasta probarlas con ese strap desde Bluefy. No se inventan Recovery, Strain o Sleep Scores.
- Safari en iPhone no ofrece Web Bluetooth. Abrir este sitio dentro de Bluefy y mantenerlo al frente mientras sincroniza. Para ver luego los datos desde otro teléfono, basta con iniciar sesión en la misma cuenta; eso no requiere Bluetooth cerca.

## Ejecutar localmente

1. Instala Node.js LTS en la Mac.
2. En esta carpeta: `npm install`.
3. Copia `.env.example` a `.env.local` y rellena URL y clave pública de Supabase.
4. Ejecuta `npm run dev`; abre el enlace HTTPS/local indicado desde un navegador compatible. Para probar desde Bluefy, despliega a Netlify, que provee HTTPS.

## Supabase

1. Crea un proyecto y ejecuta `supabase/schema.sql` en SQL Editor.
2. En Project Settings → API, toma **Project URL** y la **publishable key** (`sb_publishable_...`).
3. En Netlify configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` como variables de entorno de build. La app también acepta `VITE_SUPABASE_ANON_KEY` para proyectos que aún usan la clave pública legacy.
4. La persona dueña crea su usuario con su propio correo/contraseña en el panel. Supabase Auth puede requerir confirmar el correo.

La clave pública (`sb_publishable_...`) o legacy `anon` se puede usar en el navegador porque RLS limita el acceso a `auth.uid()`. **Nunca poner aquí la `service_role`/secret key, contraseña de base de datos ni token privado.**

## Netlify

Importa el repositorio `mywhoop` desde GitHub en Netlify (**Add new site → Import an existing project**). La configuración de `netlify.toml` usa `npm run build` y la carpeta de salida `dist`. Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` (o `VITE_SUPABASE_ANON_KEY`) en **Site configuration → Environment variables** y despliega. Abre la URL `https://...netlify.app` dentro de Bluefy en el iPhone.
