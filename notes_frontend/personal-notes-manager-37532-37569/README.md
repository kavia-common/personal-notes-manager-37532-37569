# personal-notes-manager-37532-37569

This repository contains the frontend for a simple personal notes manager built with React and Supabase.

## Project Structure

- `notes_frontend/` — React application (Create React App)

## Quick Start

1) Copy the environment example and set your Supabase variables:

cp notes_frontend/.env.example notes_frontend/.env

Then edit `notes_frontend/.env` and set:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

2) Install dependencies and start the dev server:

cd notes_frontend
npm install
npm start

Open http://localhost:3000 in your browser.

## Supabase

- The app uses a `notes` table. See `assets/supabase.md` for table definition and configuration.
- Frontend Supabase docs and CRUD usage: `notes_frontend/src/lib/README_SUPABASE.md`.

## Notes

- Do not hardcode secrets in code. Use the `.env` file (Create React App requires REACT_APP_ prefix).
- After changing `.env`, restart `npm start`.
