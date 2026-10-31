# Supabase Cloud Sync for Wordle Unlimited ☁️

## Is Supabase Needed?
**No, Supabase is strictly optional.**
- By default, Wordle Unlimited uses an **offline-first local storage architecture**. Your stats, scoresheets, streaks, level progression, and in-progress games work 100% locally without any external accounts or internet connection.
- **When to use Supabase**: If you want your **Level progress, stars, streaks, and history to sync across multiple devices** (e.g., switch between your iPhone, iPad, and Laptop seamlessly).

---

## ⚡ 2-Minute Deployment Guide

### Step 1: Create a Free Supabase Project
1. Go to **[https://database.new](https://database.new)** and sign in / create a free project.
2. Note your **Project URL** and **Anon Public Key** (under `Project Settings` → `API`).

### Step 2: Deploy the Database Schema
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Open or copy the contents of [`supabase/schema.sql`](./schema.sql).
3. Paste into the SQL Editor and click **Run**.
   - This creates `wordle_profiles`, `wordle_stats`, and `wordle_history` tables.
   - Configures indexes and Row Level Security (RLS) policies.

### Step 3: Connect Wordle to Supabase
You can connect in either of two ways:

#### Option A: Direct In-App Setup (Zero Code / Zero Rebuild)
1. Open the Wordle game in your browser.
2. Click the ⚙️ **Settings** gear icon.
3. Under **Cloud Sync (Supabase)**, click **Configure**.
4. Paste your **Supabase URL** and **Anon Key**.
5. Click **Save & Test** → **Backup**.

#### Option B: Environment Variables
Create a file named `.env.local` in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🔄 Multi-Device Syncing Workflow
1. On your primary device (e.g. PC):
   - Open ⚙️ **Settings** → note your **Device Sync Code** (e.g. `player_9x4f82a`).
   - Click **Backup**.
2. On your second device (e.g. iPhone):
   - Open Wordle and go to ⚙️ **Settings**.
   - Paste the same **Device Sync Code** (`player_9x4f82a`).
   - Click **Restore**.
   - Your levels, stars, XP, and stats will instantly load!
