# Deployment

The site is hosted on o2switch (cPanel/CloudLinux, Node.js app via Passenger).
Nothing about hosting changes when this repo moves accounts — same server,
same app path.

## One-time setup for a new machine/account

1. SSH access: generate your own SSH keypair, and have it added to
   `~/.ssh/authorized_keys` on the `smartfri` account on the o2switch server
   (don't share/reuse someone else's private key).
2. Add a host alias in `~/.ssh/config`, e.g.:
   ```
   Host nww-o2switch
     HostName 109.234.160.22
     User smartfri
     Port 22
     IdentityFile ~/.ssh/your_key
     IdentitiesOnly yes
   ```
3. `.env` lives only on the server at `nowhitewalls.gallery/app/.env` (never
   committed — see `.env.example` for the shape of it). Get the current
   values from whoever already has server access, or from the daily backup
   at `/home6/smartfri/backups/nowhitewalls` on the server.

## Deploying a change

The server doesn't have its own git remote — code is copied over, then
built in place.

1. Push your commit to the repo as usual.
2. Copy the changed files to the server, e.g.:
   ```
   scp -r src/... nww-o2switch:nowhitewalls.gallery/app/src/...
   ```
   (or `rsync -av --exclude node_modules --exclude .next --exclude .git ./ nww-o2switch:nowhitewalls.gallery/app/`
   for a full sync).
3. Build on the server:
   ```
   ssh nww-o2switch "source /home6/smartfri/nodevenv/nowhitewalls.gallery/app/22/bin/activate && cd nowhitewalls.gallery/app && npm run build"
   ```
4. Restart the app (Passenger doesn't pick up a new build on its own):
   ```
   ssh nww-o2switch "ps aux | grep 'Passenger NodeApp: /home6/smartfri/nowhitewalls.gallery/app'"
   # kill -9 <pid> from that output, then:
   ssh nww-o2switch "cloudlinux-selector start --json --interpreter nodejs --user smartfri --app-root nowhitewalls.gallery/app"
   ```
5. Verify: `curl -sI https://nowhitewalls.gallery/` should return `200`.

## Schema changes

This project uses `prisma db push --accept-data-loss` directly on the server
(no migration files). Before pushing a schema change that could drop or
reshape existing data, read out the affected rows first so they can be
restored after the push if needed.
