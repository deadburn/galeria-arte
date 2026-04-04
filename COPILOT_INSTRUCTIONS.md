# Art Gallery — Instrucciones para GitHub Copilot (Claude Sonnet 4.6)

## Contexto del proyecto

Galería de arte digital para 30 artistas. Evento de 48 horas.
Stack: React 18 + Vite, TypeScript, Supabase (Auth + PostgreSQL +
Storage), React Router v6, Tailwind CSS, Zod, React Hook Form.
Deploy: Vercel (SPA estática). Backend: Supabase BaaS.

## Reglas de arquitectura (SIEMPRE seguir)

- SPA pura: React en Vercel, sin servidor propio
- Todo acceso a datos va por el cliente de Supabase (@supabase/supabase-js)
- NUNCA usar la service_role key en el frontend (solo anon key)
- La lógica de permisos vive en Row Level Security de Supabase, no en el frontend
- Validación de formularios con Zod + React Hook Form
- Tipado estricto TypeScript, sin `any`
- Variables sensibles solo en .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Separar queries en /src/lib/supabase/\*.ts (no hacer queries en componentes)
- Componentes en /src/components/, páginas en /src/pages/

## Modelo de datos (Supabase PostgreSQL)

Tabla `profiles`: id (uuid, FK auth.users), name, bio,
technique, portfolio_url, role (ARTIST|ADMIN),
status (PENDING|APPROVED|REJECTED), created_at

Tabla `artworks`: id (uuid), artist_id (FK profiles.id),
title, description, technique, year, image_url,
created_at, updated_at

## Roles y acceso (verificar siempre por status en profiles)

- PÚBLICO: /gallery — sin auth, solo lectura obras APPROVED
- ARTIST (status=APPROVED): /dashboard — CRUD sus propias obras
- ADMIN: /admin — aprobar/rechazar artistas, ver todo

## Autenticación

- Usar supabase.auth.signUp() y supabase.auth.signInWithPassword()
- Al registrarse, crear fila en `profiles` con status=PENDING
- Proteger rutas con componente <PrivateRoute> que lee el perfil
- El rol ADMIN se asigna manualmente en Supabase dashboard

## Emails (único caso que necesita función serverless)

- Usar Supabase Edge Function para llamar a Resend
- Trigger: cuando admin cambia status en tabla profiles
- Función: notify-artist (aprobado o rechazado)

## Identidad visual

- Paleta: negro profundo (#0A0A0A) + blanco roto (#F5F0EB)
  - acento dorado (#C9A84C)
- Tipografía: Cormorant Garamond (títulos) + Inter (cuerpo)
- Estética: galería de arte de lujo, minimalista, elegante
- Grid masonry para las obras, espaciado generoso

## Fase actual: [ACTUALIZAR AL EMPEZAR CADA SESIÓN]

Ejemplo: "Fase 3 — Implementando dashboard del artista"
