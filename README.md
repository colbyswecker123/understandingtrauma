# Understanding Trauma Cloudflare Rebuild

This is a cleaner, warmer, Cloudflare-ready rebuild of the current Understanding Trauma site.

## What is included

- Same basic structure as the current site:
  - `/` — A Note For You home page
  - `/user_messages/` — Submit a Custom Message page
  - `/admin/` — private message review page
- Modern mobile-first design
- Random approved message display
- Custom message submission
- Review-before-publish workflow
- Cloudflare Pages Functions backend
- Cloudflare D1 database migration
- Optional relaxing music file path

## Recommended Cloudflare setup

### 1. Create a GitHub repo

Create a new repository named `understandingtrauma` and upload these files.

### 2. Create a Cloudflare Pages project

1. Go to Cloudflare Dashboard.
2. Go to Workers & Pages.
3. Create a Pages project.
4. Connect the GitHub repo.
5. Use these build settings:
   - Framework preset: None
   - Build command: leave blank
   - Build output directory: `/`

### 3. Create the D1 database

Install Wrangler locally or use Cloudflare's dashboard/terminal.

```bash
npm install -g wrangler
wrangler login
wrangler d1 create understandingtrauma-db
```

Copy the database ID into `wrangler.toml` where it says:

```toml
database_id = "REPLACE_WITH_YOUR_D1_DATABASE_ID"
```

### 4. Run the migration

```bash
wrangler d1 migrations apply understandingtrauma-db --remote
```

### 5. Add the admin token

Create a long private admin token, then add it as a Pages environment variable named:

```text
ADMIN_TOKEN
```

You can do this in Cloudflare Pages settings or with Wrangler:

```bash
wrangler pages secret put ADMIN_TOKEN
```

### 6. Bind the D1 database to Pages

In the Cloudflare Pages project settings:

1. Go to Settings.
2. Go to Functions.
3. Add D1 database binding.
4. Variable name: `DB`
5. D1 database: `understandingtrauma-db`

### 7. Add the custom domain

1. Open your Pages project.
2. Go to Custom domains.
3. Add `understandingtrauma.org`.
4. Add `www.understandingtrauma.org`.
5. Point the domain nameservers to Cloudflare if prompted.

### 8. Add relaxing music

Place your licensed MP3 file here:

```text
/assets/audio/relaxing-music.mp3
```

The home page button is already wired to that file.

## Admin review page

Visit:

```text
/admin/
```

Paste your `ADMIN_TOKEN` to load pending messages.

## API routes

- `GET /api/random-message` — returns one approved message
- `POST /api/messages` — submits a pending message
- `GET /api/admin/messages` — lists pending messages with admin token
- `POST /api/admin/messages/:id/approve` — approves a message
- `POST /api/admin/messages/:id/reject` — rejects a message

## Notes

This site is intentionally lightweight. It does not require WordPress, DreamHost, PHP, or a traditional server.


## Message seed bank

This version includes `seed_messages.sql` with more than 100 approved encouragement messages. After deploying the files, open Cloudflare D1 > understandingtrauma-db > Console, paste the contents of `seed_messages.sql`, and run it. It is safe to run more than once because each insert checks for existing message text first.


## Advanced full revamp

This version keeps the gray/black/white identity, uses the cleaned transparent UT logo, adds a more polished mobile-first interface, and includes a `seed_messages.sql` file with 100+ approved messages. After deploying, run `seed_messages.sql` in Cloudflare D1 Console to populate the live database.


## Admin login upgrade

This version includes a standard admin username/password login that works with iPhone/Safari Passwords. Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in Cloudflare Pages variables. See `SECURITY_NOTES.md` for details.


## Admin portal split

The admin area now has `/admin/` as a private portal/dashboard and `/admin/messages/` as the protected pending-message review page.
