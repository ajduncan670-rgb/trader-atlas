# Trader Atlas

**25 legendary trading methodologies. One AI engine. Zero financial advice.**

Trader Atlas is a methodology reference app for serious students of the market. Browse the complete frameworks of 25 legendary traders — from Jesse Livermore's tape reading to Jim Simons' quant edge to Chris Camillo's social arbitrage — then run any ticker through their AI-powered analytical engine.

---

## What's Inside

- **25 Trader Profiles** — Complete methodology breakdowns including doctrine, rules, entry/exit logic, screening criteria, red flags, and signature trades
- **7 Archetypes** — Social Arbitrage, Momentum/Breakout, Trend/Macro, Value/Fundamental, Contrarian, Day Trading, Quantitative
- **AI Engine** — Claude-powered chat that embodies each trader's framework and applies it to any ticker or thesis you bring
- **Reference-Only Disclaimer** — Not financial advice. Educational tool only.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **AI:** Anthropic Claude API (Sonnet)
- **Styling:** Tailwind CSS + custom CSS variables
- **Deployment:** Vercel
- **Repo:** GitHub

---

## Quick Start (Local)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/trader-atlas.git
cd trader-atlas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at: https://console.anthropic.com/

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

During setup:
- Link to your GitHub repo
- Add `ANTHROPIC_API_KEY` as an environment variable

### Option B: Vercel Dashboard (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. In **Environment Variables**, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-key-here`
5. Click **Deploy**

### Setting the Vercel Secret (recommended)

```bash
vercel secrets add anthropic-api-key "sk-ant-your-key-here"
```

The `vercel.json` is already configured to use `@anthropic-api-key` as the secret reference.

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Trader Atlas v1"
git remote add origin https://github.com/YOUR_USERNAME/trader-atlas.git
git branch -M main
git push -u origin main
```

---

## Adding More Traders

Edit `src/data/traders.ts` and add a new `Trader` object to the `TRADERS` array. Copy the structure from any existing trader. The required fields are:

- `id` — URL slug (e.g., `"ray-dalio"`)
- `name` — Full name
- `archetype` — One of the 7 archetype keys
- `tagline` — Their most iconic quote
- `doctrine` — Array of 5–8 core beliefs
- `rules` — Array of `{ label, detail }` objects
- `entryLogic` — Step-by-step entry process
- `exitLogic` — Exit conditions
- `screeningCriteria` — What to look for
- `redFlags` — What to avoid
- `signatureTrades` — Notable historical trades
- `aiPersona` — The system prompt injected into Claude to make it reason like this trader

---

## Project Structure

```
trader-atlas/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # Anthropic API streaming endpoint
│   │   ├── trader/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Individual trader profile + AI engine
│   │   ├── globals.css           # Design system + CSS variables
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Homepage + trader grid
│   └── data/
│       └── traders.ts            # All 25 trader profiles + AI personas
├── .env.example                  # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Disclaimer

**Trader Atlas is for educational and reference purposes only.** Nothing on this site constitutes financial advice, investment recommendations, or trading signals. All trading involves risk. Past performance of any trader or strategy does not guarantee future results. Always consult a qualified financial professional before making any investment decisions.

The AI engine applies publicly documented trading methodologies to educational questions. It does not access real-time market data and should never be used as the basis for actual trading decisions.

---

## Roadmap

- [ ] Trader comparison mode (run a ticker through 2+ frameworks simultaneously)
- [ ] Convergence scanner (find tickers that multiple archetypes would like)
- [ ] Historical trade database with annotated chart patterns
- [ ] User accounts + saved analyses
- [ ] Mobile app (React Native)
- [ ] Podcast/book resource library per trader

---

Built with Next.js + Anthropic Claude API
