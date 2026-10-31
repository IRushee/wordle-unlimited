# Wordle Unlimited & Journey 🎯

A feature-complete, modern Wordle web application built for personal use with unlimited play, level progression, selectable $N$-letter words (4–8 letters), authentic animations, Web Audio sound effects, multi-device touch & desktop UI, dictionary definitions, and complete local memory persistence.

---

## 🌟 Key Features

### 1. 🔠 Selectable N-Letter Words (4, 5, 6, 7, 8 Letters)
- Switch instantly between **4, 5, 6, 7, or 8-letter** word lengths.
- Dynamic guess allowances:
  - 4, 5, 6 letters: 6 guesses
  - 7 letters: 7 guesses
  - 8 letters: 8 guesses
- Backed by an offline dictionary of **over 98,000 verified English words** and **10,000+ curated target words**.

### 2. 🚀 Unlimited & Never-Ending Gameplay Modes
- **Unlimited Mode**: Play endless games back-to-back. Tap **"New Word"** anytime for a fresh puzzle.
- **Level Journey Mode**: Progress through **100+ escalating levels**:
  - Levels 1–10: 4-letter words (Warm-up)
  - Levels 11–35: 5-letter words (Standard)
  - Levels 36–65: 6-letter words (Intermediate)
  - Levels 66–90: 7-letter words (Expert)
  - Levels 91–100+: 8-letter words (Grandmaster)
  - Earn **1 to 3 Stars** based on guess count.
  - Track your **Rank** (from *Novice Apprentice* to *Mythic Grandmaster*) and total XP.
  - Replay any completed level anytime from the **Level Map**.
- **Daily Challenge Mode**: A synchronized word deterministically generated for each calendar day.

### 3. 🎨 Proper Color Palettes & Accessibility
- **Classic Dark Theme**: Deep `#121213` background, `#538d4e` Emerald Green (correct), `#b59f3b` Gold (present), `#3a3a3c` Slate (absent).
- **Crisp Light Theme**: Clean light background with `#6aaa64` green and `#c9b458` gold.
- **High Contrast Mode**: Accessible high-visibility colors with Vivid Orange (`#f5793a`) and Sky Blue (`#85c0f9`).

### 4. ✨ Complete Animations & Micro-Interactions
- **3D Flip Card Animation**: Tiles rotate sequentially on the X-axis with staggered delays (250ms per letter) as clues are revealed.
- **Pop-In Bounce**: Gentle scale bounce when typing each letter.
- **Error Shake**: Smooth horizontal shake when entering an invalid word, insufficient letters, or violating Hard Mode.
- **Win Wave Bounce**: Victory wave bounce on the winning row.
- **Confetti Explosion**: Full-screen celebratory fireworks when you solve a word!

### 5. 📱 Multi-Device UI Support (Mobile, Tablet, Desktop)
- Dynamic `100dvh` viewport support prevents vertical scrolling on mobile browsers (Safari, Chrome).
- Proportional grid auto-scaling: 4-letter through 8-letter boards fit on any screen size (from 375px phone screens to 4K monitors).
- Full **physical keyboard** support (A-Z, Enter, Backspace, Esc).
- Ergonomic **on-screen touch keyboard** with `touch-action: manipulation` (no 300ms tap delay).
- **Haptic Feedback**: Micro-vibrations for key presses, invalid word alerts, and win celebrations on supported mobile devices.

### 6. 🔊 Zero-Latency Web Audio Synthesizer
- Built with browser Web Audio API (no external audio files needed).
- Subtle key clicks and backspace clicks.
- Ascending pitch chimes on tile flips.
- Invalid buzz tone for errors.
- Harmonic major victory fanfare on winning and sad chord on game over.
- One-click mute toggle in the header.

### 7. 🧠 Hints & Dictionary Lookups
- **Progressive Clues**:
  - *Hint 1*: Vowels count and vowel letters in the word.
  - *Hint 2*: First and last letter revealed.
  - *Hint 3*: 3 unused wrong keys eliminated from the virtual keyboard.
- **Live Dictionary Lookups**: Click **"Definition"** on any completed word to see pronunciation, audio pronunciation playback, definitions by part of speech, and synonyms!

### 8. 📊 Complete Scoresheet & History with Memory
- **Persistent Memory**: In-progress games, stats, streaks, settings, and level progress are automatically saved to `localStorage`. Refreshing or closing the tab preserves your game!
- **Detailed Statistics**:
  - Games Played, Win %, Current Streak, Max Streak.
  - Interactive **Guess Distribution** bar chart (1 to 8 guesses) highlighting the current game.
  - Per-length filter tabs (**All**, **4L**, **5L**, **6L**, **7L**, **8L**).
- **History Log**: Chronological archive of all past games with date, length, attempts, and definition lookups.
- **Share Button**: Copies authentic Wordle emoji squares (`🟩🟨⬛`) to your clipboard with one click.

---

## 🚀 Quick Start

### Run Locally:
```bash
cd /Users/rushee/wordle-unlimited
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Play on Mobile (Same Wi-Fi Network):
The Vite dev server is configured with `host: true`. Open the Network URL shown in your terminal (e.g. `http://<your-ip>:3000/`, like `http://192.168.1.90:3000/`) on your smartphone or tablet!

## 🚀 Deployment & Cloud Sync

### 1. Vercel Local & Cloud Deployment
- **Local Vercel Dev Environment**:
  ```bash
  npm run vercel:dev
  ```
  Runs the local Vercel runtime server at **[http://localhost:3000](http://localhost:3000)** (or port 3001).

- **Deploy Live to Vercel Cloud**:
  ```bash
  npx vercel
  # or for production
  npm run vercel:deploy
  ```
  The included [`vercel.json`](./vercel.json) automatically handles SPA routing and asset caching.

---

### 2. Supabase Cloud Sync (Optional)
Wordle Unlimited is **offline-first**: it works 100% locally with `localStorage`. If you want your **scoresheet, streaks, and Level Journey progress to synchronize across multiple devices** (e.g. PC, iPhone, Android):

1. Create a free project at **[database.new](https://database.new)**.
2. In Supabase **SQL Editor**, paste and run [`supabase/schema.sql`](./supabase/schema.sql).
3. In Wordle, open ⚙️ **Settings** → **Cloud Sync** → paste your Project URL and Anon Key → click **Save & Test**.
4. Use the **Device Sync Code** to link your phone, tablet, and PC! See [`supabase/README.md`](./supabase/README.md) for details.
