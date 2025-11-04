# RFC App

A lightweight Express application for browsing RFCs and sharing feedback. Users can create an account with their email address, sign in via a one-time code delivered to that email, and post comments on individual RFCs. Authentication state and discussion data are persisted locally using SQLite, while RFC documents themselves live on disk as Markdown files.

## Getting started

```bash
npm install --workspace=apps/rfc-app
npm run dev --workspace=apps/rfc-app
```

The app runs on [http://localhost:3000](http://localhost:3000) by default.

## Features

- Browse a list of Markdown-backed RFCs with summaries and comment counts.
- View the full content of each RFC rendered from Markdown stored in `docs/rfc`.
- Create an account and sign in with passwordless email codes.
- Post comments on RFCs when signed in.
- Data stored in a local SQLite database (`apps/rfc-app/data/app.db`).

## Project structure

- `src/server.js` – Express application entry point and route definitions.
- `src/db.js` – SQLite database setup and helper queries.
- `src/rfcs.js` – Helpers for reading RFC Markdown from `docs/rfc`.
- `views/` – EJS templates for rendering the UI.
- `public/` – Static assets, including the main stylesheet.

## RFC content

- Markdown RFCs live under `docs/rfc`. The filename (without `.md`) becomes the slug used in URLs and when storing comments.
- Metadata such as **Status**, **Author**, **Created**, and **Updated** is parsed from the bold key/value pairs at the top of each Markdown file.
- To add a new RFC, drop a Markdown file into `docs/rfc` and the app will pick it up automatically the next time it runs.

## Database

SQLite files are created automatically when the server starts. The database stores:

- Users created through the passwordless email login flow
- Pending login tokens for verification
- Comments that users leave on RFCs (keyed by the RFC's slug)

The database no longer stores RFC documents themselves—they are always read from the Markdown files on disk.
