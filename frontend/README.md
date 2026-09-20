# Personal profile website

The deployed website is the React application in this directory. The root Express server serves its production build.

## Install and verify

Run from the repository root:

```sh
npm ci
npm --prefix frontend ci
npm run lint
npm run build
npm start
```

The server uses the hosting provider's PORT environment variable, or port 3000 locally.

## Contact form configuration

Copy frontend/.env.example to frontend/.env.local for local development. On your hosting provider, set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY before building. Vite includes these public settings in the build, so rebuild after changing them. Never use a Supabase secret or service-role key in frontend settings.

The form inserts name, email, and message into the existing contact_messages table. The Supabase project must permit the intended anonymous inserts through its row-level security policy. Confirm delivery in your own project before launch; browser regression checks simulate responses and do not create real messages.

Missing settings no longer crash the profile, but contact submissions cannot succeed without a configured service.

## Hosting

For static hosting, install frontend dependencies, run npm run build from the repository root, and publish frontend/dist. For Node hosting, also install root dependencies and use npm start after building.

Keep the existing hash navigation: #home, #about, #skills, #contact, and #/resume. Hash routes do not require server rewrites. The public directory contains the images, favicon, and resume.pdf copied into the build.

For frontend development, run npm --prefix frontend run dev. The frontend sends contact requests directly to Supabase; it does not use the former demonstration API routes.
