# SAARTHI Civic Technology Platform - Complete Restoration Guide

This document explains how to completely restore the SAARTHI platform from a backup repository or source checkout.

---

## 📋 Overview of Platform Source Contents

A complete SAARTHI repository contains:

1. **Frontend (`/src`, `/index.html`)**: React 18 SPA components, tailwind styles, asset icons.
2. **Backend (`/server.ts`, `/src/serverApp.ts`, `/api`)**: Express server and Vercel serverless entry points.
3. **Database (`/database`)**: Relational PostgreSQL schema (`schema.sql`), seed state (`seed.json`), TypeScript types (`schema.ts`), and stored procedures (`stored_procedures.sql`).
4. **Migrations (`/migrations`)**: Sequential SQL schema migrations (`0001_initial_saarthi_civic_schema.sql`, `0002_add_developer_command_center.sql`).
5. **AI Configuration (`/ai-config`)**: Gemini model settings, aliases, safety thresholds (`gemini-config.json`, `ai-rules.json`).
6. **Prompts (`/prompts`)**: System instructions for Saarthi AI Chat, Receipt Scanner, Grounded Search, and Developer Assistant.
7. **Documentation (`/docs`)**: Restoration guide, changelog, architecture diagrams, knowledge base.
8. **Assets (`/assets`)**: Static branding and visual assets.
9. **Configuration Templates (`/config-template`, `.env.example`)**: Safe, non-secret environment templates and `vercel.json`.
10. **Package Manifests (`package.json`, `bun.lock`, `metadata.json`, `tsconfig.json`, `vite.config.ts`)**: Dependencies and build configs.

---

## 🚀 Restoration Steps for Vercel Deployment

### Step 1: Push / Import Repository to GitHub
1. Clone or extract the repository source into a clean directory.
2. Initialize git and push to your GitHub account:
   ```bash
   git init -b main
   git add .
   git commit -m "Restore SAARTHI Platform from Full Backup"
   git remote add origin https://github.com/sudipadhikari8107/saarthi.git
   git push -u origin main --force
   ```

### Step 2: Connect Repository to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import `saarthi` from GitHub.
4. Select **Vite** as the Framework Preset.

### Step 3: Configure Environment Variables in Vercel
In Vercel **Project Settings > Environment Variables**, add:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `ALLOWED_OWNER_EMAIL`: `sudipadhikari8107@gmail.com`
- `DATABASE_URL`: (Optional) PostgreSQL database connection string

### Step 4: Database Setup (PostgreSQL / Cloud SQL)
If using an external database:
1. Execute `/database/schema.sql` on your PostgreSQL database.
2. Execute `/database/stored_procedures.sql`.
3. Load initial seed data from `/database/seed.json`.
4. Verify migrations from `/migrations`.

### Step 5: Deploy
Click **Deploy**. Vercel will run `npm run build` and route `/api/*` to serverless handlers and `/*` to the Vite SPA.

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Start development server
npm run dev
```

The app will be accessible at `http://localhost:3000`.
