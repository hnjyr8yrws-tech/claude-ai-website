# GetPromptly — Vercel Deployment Guide

**For:** Charles
**Project:** GetPromptly.co.uk
**Stack:** React + Vite + TypeScript
**Host:** Vercel (free tier is fine to start)

---

## Before you begin

Make sure you have:
- [ ] A GitHub account
- [ ] A Vercel account (sign up free at vercel.com — use your GitHub login)
- [ ] Your Anthropic API key (from console.anthropic.com)
- [ ] Access to your domain registrar (wherever getpromptly.co.uk is registered)

---

## Step 1 — Push the project to GitHub

If you haven't already pushed the code:

```bash
cd claude-ai-website
git add .
git commit -m "feat: ready for Vercel deployment"
git remote add origin https://github.com/hnjyr8yrws-tech/claude-ai-website.git
git push -u origin main
```

If the remote already exists, just run:

```bash
git push origin main
```

---

## Step 2 — Import the repo into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New…" → "Project"**
3. Under "Import Git Repository", find **claude-ai-website** and click **Import**

---

## Step 3 — Set Framework Preset

In the "Configure Project" screen:

- **Framework Preset:** `Vite`
  *(Vercel should detect this automatically)*

---

## Step 4 — Set Build Command

- **Build Command:** `npm run build`

---

## Step 5 — Set Output Directory

- **Output Directory:** `dist`

---

## Step 6 — Add Environment Variables

Still in the "Configure Project" screen, scroll to **Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-api...` *(your key from console.anthropic.com)* |
| `VITE_BREVO_API_KEY` | `xkeysib-...` *(your Brevo key — optional for now)* |
| `VITE_SITE_URL` | `https://www.getpromptly.co.uk` |

> **Important:** these must start with `VITE_` or they won't be available in the browser.

Click **Deploy**. Vercel will build and deploy — takes about 60 seconds.

---

## Step 7 — Add your custom domain

Once deployed:

1. In your Vercel project, go to **Settings → Domains**
2. Type `getpromptly.co.uk` and click **Add**
3. Also add `www.getpromptly.co.uk`
4. Vercel will show you the DNS records to set — see Step 8

---

## Step 8 — Update DNS at your domain registrar

Log in to wherever you registered `getpromptly.co.uk` and set these records:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

DNS changes can take up to 24 hours to propagate, but usually under 30 minutes.

Once Vercel detects the DNS change it will automatically provision an SSL certificate (HTTPS). No action needed.

---

## Step 9 — Automatic deploys on every push

From this point on, every time you push to the `main` branch on GitHub, Vercel will automatically rebuild and redeploy the site. Zero extra steps.

```bash
# To deploy a change:
git add .
git commit -m "your message"
git push origin main
# → Vercel picks it up automatically
```

---

## Troubleshooting

**Page not found on refresh / direct URL**
→ The `vercel.json` rewrite rule handles this. Make sure `vercel.json` is in the project root and committed.

**Agent widget not responding**
→ Check the `VITE_ANTHROPIC_API_KEY` is set correctly in Vercel → Settings → Environment Variables. After adding/changing env vars you need to redeploy (Vercel → Deployments → Redeploy).

**Build fails**
→ Run `npm run build` locally first to catch errors before pushing. Check the Vercel build logs for the exact error.

**Domain not connecting**
→ Use [dnschecker.org](https://dnschecker.org) to confirm the A record is pointing to `76.76.21.21`. Check Vercel → Settings → Domains for the status.

---

## Useful links

- Vercel dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Anthropic console: [console.anthropic.com](https://console.anthropic.com)
- Brevo dashboard: [app.brevo.com](https://app.brevo.com)
- DNS checker: [dnschecker.org](https://dnschecker.org)
