# No White Walls — project memory for Claude

Read this first in every session. Keep it up to date: when something
important changes (setup, decisions, state of the project), edit this file
and push it with the rest of the work.

## Who you are working with

- The person using Claude here is **not technical**. Speak **English**,
  in plain everyday words (the technical owner may write in French; answer
  each person in the language they use). No jargon; if a technical word is unavoidable,
  explain it in one short sentence.
- Work **autonomously**. Make sensible technical decisions yourself and
  explain them briefly afterwards. Do not ask technical questions unless
  you are truly blocked or the decision is risky (see "Always ask first").
- Ask about **what she wants** (look, text, content, priorities), not about
  **how to build it**.
- Show results visually when you can (screenshots of the test site) rather
  than describing code.
- If something is beyond what she can do (server access, o2switch support,
  GitHub settings she cannot find), say so simply and suggest she contacts
  the project's technical owner, the person who set up this project.

## Always ask first (even when working autonomously)

- Anything that changes the **live website** at nowhitewalls.gallery
  (merging into `main` deploys it automatically — see below).
- **Database structure changes** (`prisma/schema.prisma`): they can delete
  or reshape real data on the server. Explain the risk in simple words.
- Deleting content, artworks, images or files that are not clearly yours.
- Anything involving money, payments, or personal data of customers.

## Security rules (never break these)

- Never ask for, accept or write the real `.env`, passwords, or SSH private
  keys in the chat or in the repo. If she starts to paste one, tell her to
  stop. Secrets live only on the server and in GitHub encrypted secrets.
- `.env` is gitignored; never commit it.

## What the project is

- Website for **No White Walls**, a gallery of vintage and contemporary art
  (https://nowhitewalls.gallery). Public pages: home, gallery, artwork
  pages, about. Admin area at `/admin` (artworks, categories, inline editing
  of homepage photo and About text).
- Stack: Next.js 14 (App Router, TypeScript), Prisma 5 + MySQL, sharp for
  image processing. Uploaded images live in `uploads/` on the server (not in
  git) and are served by `src/app/media/[filename]/route.ts`.
- Hosting: o2switch shared hosting (cPanel, Passenger). See `DEPLOY.md`.

## How work flows

1. Claude changes code on a working branch (`claude/...`), never directly
   on `main`.
2. Claude tests on the local test copy (see below), then commits and pushes.
3. Claude opens a pull request and explains the change in simple English.
4. She (or the technical owner) merges it on GitHub — a single green button.
5. Merging into `main` runs `.github/workflows/deploy.yml`, which deploys to
   o2switch automatically, then checks the site answers. She can see the
   result in the repo's **Actions** tab (green = OK, red = failed).

## Test copy of the site (cloud sessions)

The cloud machine is temporary; recreate this at the start of a session
when you need to run the site:

```
apt-get install -y mariadb-server && service mariadb start
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS nww; CREATE USER IF NOT EXISTS 'nww'@'localhost' IDENTIFIED BY 'devpass'; GRANT ALL ON nww.* TO 'nww'@'localhost'; GRANT CREATE, DROP ON *.* TO 'nww'@'localhost';"
npm install
```

Then write a **test-only** `.env` with `DATABASE_URL=mysql://nww:devpass@localhost:3306/nww`,
`ADMIN_USERNAME=admin`, a random `ADMIN_PASSWORD_SALT`, the matching
`ADMIN_PASSWORD_HASH` (scrypt of `testpass`, 64 bytes hex — see
`src/lib/auth.ts`), and a random `AUTH_SECRET`. Run `npx prisma db push`,
insert a few sample categories/artworks, `npm run build`, `node server.js`
(port 3000). Test admin login: `admin` / `testpass`.

## Current state (update as things change)

- Automatic deploy workflow written (`.github/workflows/deploy.yml`) on the
  working branch, **not yet merged into `main`**, **not yet tested**.
- Waiting for the GitHub secrets `SSH_PRIVATE_KEY` and `SSH_KNOWN_HOSTS`
  to be added (steps in `DEPLOY.md`; on mobile the key can be generated in
  cPanel → SSH Access → Manage SSH Keys). Once added: open the PR, merge,
  and watch the first run.
- Known risk: o2switch usually only allows SSH from approved IP addresses;
  GitHub's servers change IP. If the "Check SSH connection" step fails,
  this is the likely cause — she should contact o2switch support or the
  technical owner.
- The public homepage currently shows a "coming soon" holding page.
