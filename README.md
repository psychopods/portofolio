# Paschal Joseph Portfolio

An Astro SSR personal portfolio with an IDE-inspired interface, SQLite-backed content, and a small admin workspace for editing profile copy, projects, skills, and current status.

## Stack

- Astro 6 with the Node standalone adapter
- Tailwind CSS 4
- better-sqlite3 for local content storage
- bcryptjs for admin password hashing

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

The dev server defaults to `http://localhost:4321`.

## Admin

Open `/admin` to manage portfolio content. The initial password is read from `ADMIN_PASSWORD`; if it is not set, the app seeds a local default of `admin`.

Set a stronger password before deploying:

```sh
ADMIN_PASSWORD="replace-with-a-strong-password" npm run dev
```

The admin panel can also rehash and update the password after login.

## Data

Portfolio content lives in `data.db` at the project root. The database is initialized automatically by [src/lib/db.ts](/home/paschaltimoth/Work/personal/portofolio/src/lib/db.ts) if the tables are empty.
