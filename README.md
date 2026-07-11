# Amani Medini Portfolio

Vite + React frontend (Netlify) with a FastAPI + Postgres CMS API (Railway).

## Architecture

- **Netlify** - static SPA + `/admin` UI
- **Railway** - FastAPI service and Postgres in one project
- Content is one JSON document in Postgres (`content_documents.payload`)

## Local development

### 1. API + Postgres

```bash
cd backend
docker compose up -d
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
python hash_password.py "choose-a-password"
```

Copy `backend/.env.example` to `backend/.env`, set `ADMIN_PASSWORD_HASH` from the hash script, then:

```bash
uvicorn app.main:app --reload --app-dir .
```

Run uvicorn from `backend/` with:

```bash
cd backend
uvicorn app.main:app --reload
```

Health: `GET http://localhost:8000/api/health`  
Content: `GET http://localhost:8000/api/content`

### 2. Frontend

```bash
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8000` in `.env`.

Admin: `http://localhost:5173/admin/login`

After login you land on the **live visual editor** (`/admin`, `/admin/work`, …): click text on the real pages to edit JSON fields in place, use **Upload** / **URL** on images, use **+** markers (or the top **Add** menu) for list items, then **Save**.

Uploaded images are stored by the API at `/uploads/…` (persist that folder on Railway via a volume if you redeploy).

## Deploy

### Railway (backend + DB)

1. Create a Railway project
2. Add a **Postgres** plugin
3. Add a service from this repo, root directory `backend`, Dockerfile builder
4. Set variables:
   - `DATABASE_URL` - Railway Postgres URL (use `postgresql+psycopg://…` scheme if needed)
   - `JWT_SECRET` - long random string
   - `ADMIN_USERNAME` - e.g. `admin`
   - `ADMIN_PASSWORD_HASH` - from `python hash_password.py "…"`
   - `CORS_ORIGINS` - your Netlify URL(s), comma-separated (include `https://yoursite.netlify.app`)
5. Expose the service publicly; note the public HTTPS URL

If Railway injects `DATABASE_URL` as `postgresql://`, rewrite to `postgresql+psycopg://` in the service start command or variable.

### Netlify (frontend)

1. Connect the GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set `VITE_API_URL` to the Railway API URL (no trailing slash)
5. `netlify.toml` already configures SPA redirects

## Seed data

Initial CMS payload lives in `backend/app/seed_data.json`. It is inserted once when the database row is empty.
