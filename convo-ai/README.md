# Convo-AI — Rupeezy RM Workspace

> AI-powered lead processing simulation system for Rupeezy financial services.

---

## What is Convo-AI?

Convo-AI is an internal tool that simulates how an AI system would process sales leads for a stock brokerage platform (Rupeezy). It shows:

- **Live AI console** — watch the AI "call" each lead in real time
- **Objection handling** — the AI detects and responds to common objections
- **Lead classification** — each lead is classified as Hot 🔥, Warm 🌡️, or Cold 🧊
- **Analytics dashboard** — funnel view, conversion rates, and lead details

This is a **frontend-only demo** with no backend or real APIs required.

---

## Tech Stack

| Tool | Version |
|------|---------|
| Next.js (App Router) | 14.2 |
| React | 18 |
| TypeScript | 5 |
| Tailwind CSS | 3.4 |
| Lucide Icons | Latest |

---

## Step-by-Step Setup (Beginner-Friendly)

### Step 1 — Install Node.js

If you don't have Node.js, download and install it from:
👉 https://nodejs.org (choose the LTS version)

Verify it works by opening a terminal and typing:
```
node --version
```
You should see something like `v20.x.x`

---

### Step 2 — Open the project in VS Code

1. Extract the project zip folder
2. Open **VS Code**
3. Go to **File → Open Folder**
4. Select the `convo-ai` folder

---

### Step 3 — Open the terminal in VS Code

- Go to **Terminal → New Terminal** (in the top menu)
- A terminal will appear at the bottom of VS Code

---

### Step 4 — Install dependencies

In the terminal, type exactly:

```bash
npm install
```

Wait for it to finish. You'll see a message like `added 300 packages`.

---

### Step 5 — Start the development server

```bash
npm run dev
```

You'll see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
✓ Ready
```

---

### Step 6 — Open in browser

Open your browser and go to:
```
http://localhost:3000
```

You'll see the login page.

---

## How to Use the App (Demo Flow)

### 1. Login
- The email and password are **pre-filled**
- Just click **"Enter RM Workspace"**

### 2. Load Leads
- Click **"Load Sample Leads"** in the left panel
- You'll see 15 mock leads are loaded

### 3. Start Processing
- Click **"Start Processing"**
- Watch the **AI Console** in the center panel
- Each lead is analyzed, objections are detected, conversations are simulated
- The **Stats Panel** on the right updates in real time

### 4. View Dashboard
- Once processing completes, click **"View Dashboard"**
- You'll see summary cards, funnel view, top objections, and a lead table
- Click any row in the table to see the **lead detail modal** with full conversation

---

## Project Structure

```
convo-ai/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Redirects to /login
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── workspace/
│   │   └── page.tsx        # Main 3-panel workspace
│   └── dashboard/
│       └── page.tsx        # Analytics dashboard
├── components/
│   ├── Navbar.tsx          # Top navigation bar
│   ├── LeftPanel.tsx       # Control panel (load/start)
│   ├── ConsolePanel.tsx    # AI processing console
│   ├── StatsPanel.tsx      # Live stats sidebar
│   ├── ProgressBar.tsx     # Processing progress bar
│   └── LeadModal.tsx       # Lead detail modal
├── data/
│   └── mockLeads.ts        # 15 mock leads + AI logic
├── lib/
│   └── utils.ts            # Helper utilities
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Notes

- **No backend required** — all data is simulated
- **No paid APIs** — 100% free and open source
- **No database** — lead data is stored in browser sessionStorage
- Built for **hackathon demo purposes**
- All leads are fictional and for demonstration only

---

## Quick Commands Reference

```bash
npm install     # Install all dependencies
npm run dev     # Start development server (http://localhost:3000)
npm run build   # Create production build
npm run lint    # Run code linter
```

---

*Built for Rupeezy · Convo-AI v2.1 · Internal Demo*
