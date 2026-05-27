# 🔍 FindIt — Lost & Found Reporting System
### React + Node.js + Express + Supabase (PostgreSQL)

---

## Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Redux Toolkit |
| Backend | Node.js + Express |
| Database | **Supabase (PostgreSQL)** |
| Auth | bcryptjs (password hashing) + JWT |
| Deployment | Render |

---

## Quick Start

### 1. Set up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) → create a free project
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → click **Run**
3. Go to **Settings → API** → copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secret) → `SUPABASE_SERVICE_KEY`

### 2. Configure server environment

```bash
cd server
cp .env.example .env
```

Fill in your `.env`:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your service role key...
SECRETKEY=any_long_random_string_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
PORT=5000
```

### 3. Run the server

```bash
cd server
npm install
npm run dev
```

You should see: `✅ Server running on port 5000`

### 4. Run the frontend (new terminal)

```bash
cd client
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm install
npm start
```

### 5. Make yourself admin

After signing up, go to Supabase → **Table Editor** → `users` table → find your row → edit `role` from `user` to `admin`.

Or run in **SQL Editor**:
```sql
update public.users set role = 'admin' where email = 'your@email.com';
```

---

## Deploy to Render

1. Push to GitHub
2. [render.com](https://render.com) → New → Blueprint → connect repo
3. `render.yaml` auto-configures both services
4. Add environment variables in the Render dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `SECRETKEY`
   - `CLIENT_URL` (your frontend Render URL)
   - `REACT_APP_API_URL` (your backend Render URL)

---

## Database Tables

| Table | Purpose |
|---|---|
| `users` | User accounts with bcrypt hashed passwords and role |
| `items` | Lost/found item reports |
| `claimants` | People claiming a found item |
| `helpers` | People offering to help return a lost item |
