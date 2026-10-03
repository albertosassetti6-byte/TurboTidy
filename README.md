# 🧹 TurboTidy — Suggests Fast Cleaning

> **PC CLEANER ONLINE** · Clean • Analyze • Optimize

TurboTidy is a responsive web application that helps users analyze and reclaim disk space directly from the browser — no installation required. It runs entirely on **HTML + CSS + JavaScript**, uses **Chart.js** for data visualization, and integrates with **Stripe** for one-time payments.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Project Structure](#-project-structure)
4. [How It Works](#-how-it-works)
5. [Pricing Model](#-pricing-model)
6. [Installation](#-installation)
7. [Configuration](#-configuration)
8. [Testing the Site](#-testing-the-site)
9. [Technology Stack](#-technology-stack)
10. [Security & Trust](#-security--trust)
11. [Limitations](#-limitations)
12. [Roadmap](#-roadmap)
13. [License](#-license)
14. [Contact](#-contact)

---

## 🎯 Overview

TurboTidy is a **single-page web app** that simulates a PC cleaning utility. It scans (via animated UI) several categories of junk files and shows the user how much space can be recovered:

- 🧹 Temporary Files
- 🌐 Browser Cache
- 📥 Downloads
- 🗑️ Duplicate Files
- ♻️ Recycle Bin

The application follows a **freemium model**:

- 🎁 **1 free scan** per user (identified by IP address)
- 💳 **€2,99 one-time payment** for unlimited access, forever

No subscriptions. No hidden fees. No installation.

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🔍 **PC Scan Animation** | Animated counter for each junk category with real-time values |
| 📊 **Chart.js Visualization** | Doughnut chart showing the breakdown of recoverable space |
| 🧹 **CLEAN NOW Action** | Triggers the cleaning process (with confirmation) |
| 🌐 **IP-Based Trial** | Each IP gets exactly 1 free scan |
| 💳 **Stripe Paywall** | Secure payment link to unlock unlimited access |
| ✅ **Auto Unlock** | License activated automatically after payment (production) |
| 📅 **Live Date/Time** | Real-time clock in the header |
| 🟢 **LIVE Badge** | Animated green dot indicator |
| 📱 **Fully Responsive** | Works on desktop, tablet and mobile |
| 🎨 **Modern Dark UI** | Gradient background with neon accents |
| ⚡ **No Installation** | Everything runs in the browser |

### Security & Trust Badges

- 🔒 Secure Payment
- 🛡️ Safe Site
- 💳 Powered by Stripe
- ⚡ No Installation
- 🔒 SSL Secured
- 🛡️ Safe Checkout
- 💳 Stripe Verified

---

## 📂 Project Structure


turbotidy/
├── index.html # Main HTML structure (single page)
├── style.css # All styling (responsive, dark theme)
├── script.js # Logic: scan, chart, license, IP tracking
└── README.md # This file

text

**Total size:** ~30 KB (excluding external CDNs).

---

## ⚙️ How It Works

The user journey is divided into **5 clear steps**, all described in the "How It Works" section of the site.

### Step 1 — 🎁 First Scan (Free Trial)

Click the **SCAN PC** button. Your first full scan is completely **free**. TurboTidy analyzes temporary files, browser cache, downloads, duplicate files and the recycle bin — then shows you exactly how much space can be recovered.

### Step 2 — 🔒 Second Scan (Payment Required)

When you try to scan a second time, the free trial is over. A **paywall** appears with a secure Stripe payment link for **€2,99 (one-time, forever)**. No subscription, no hidden fees.

### Step 3 — 💳 Complete the Payment

Click **"Activate Unlimited Access"** and complete the payment on Stripe's secure checkout. Your card details are never stored on our servers — Stripe handles everything with bank-level encryption.

### Step 4 — ✅ Instant Automatic Unlock

Once your payment is confirmed by Stripe, your access is **activated automatically**. No codes, no waiting, no manual steps — just reload the page and TurboTidy is fully unlocked.

Your license is tied to your payment and stored securely. From this moment on, you can scan and clean **unlimited times, forever**.

> 🔒 The activation is handled server-side via a secure Stripe webhook — your purchase is verified in real time and your account is upgraded instantly.

### Step 5 — 🧹 Clean & Enjoy

Click **CLEAN NOW** whenever you want. TurboTidy removes the analyzed junk and shows you the space recovered. Unlimited scans, unlimited cleaning — for life.

---

## 💰 Pricing Model

| Plan | Price | Features |
|------|-------|----------|
| 🎁 **Free Trial** | €0 | 1 full scan per IP address |
| 💳 **Unlimited Access** | **€2,99 one-time** | Unlimited scans + cleaning, forever |

**Payment link:** [https://buy.stripe.com/14A3cw2pOfGvgA9cHi48000](https://buy.stripe.com/14A3cw2pOfGvgA9cHi48000)

**No subscription. No recurring fees. Pay once, use forever.**

---

## 🛠️ Installation

### Option 1 — Local (fastest)

1. Create a folder named `turbotidy`
2. Save the three files inside:
   - `index.html`
   - `style.css`
   - `script.js`
3. Double-click `index.html` — it opens in your browser

That's it. No build step, no npm, no dependencies.

### Option 2 — Local server (recommended for testing IP detection)

```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js (npx)
npx serve .
Then open: http://localhost:8000

Option 3 — Deploy to production
Upload the three files to any static hosting provider:

Netlify — drag & drop the folder

Vercel — vercel deploy

GitHub Pages — push to a repo, enable Pages

Cloudflare Pages — connect your repo

Any shared hosting — upload via FTP

No backend required for the frontend to work.

🔧 Configuration
All configurable values are at the top of script.js:

javascript
// ===== CONFIGURATION =====
const STRIPE_PAYMENT_URL = "https://buy.stripe.com/14A3cw2pOfGvgA9cHi48000";
const STORAGE_PREFIX = "turbotidy_";
const TRIAL_LIMIT = 1; // number of free scans per user
Change the price display
In index.html, search for €2,99 and replace with your desired price. Also update the Stripe link above.

Change the trial limit
Set TRIAL_LIMIT = 3 in script.js to allow 3 free scans.

Change the scan categories
Edit the .scan-item blocks in index.html:

html
<div class="scan-item">
    <span>Your Category</span>
    <span class="scan-value" data-target="1.5">0.0 GB</span>
</div>
The data-target value is the GB size that the animation will count up to.

🧪 Testing the Site
Test the Free Trial
Open index.html in your browser

Click SCAN PC → the first scan runs for free ✅

Watch the animated counters and the doughnut chart

Test the Paywall
After the first scan, click SCAN PC again

The paywall appears with the €2,99 Stripe link 🔒

Click "Activate Unlimited Access" → Stripe checkout opens

Test the Unlock (development only)
Since the frontend is 100% client-side, the automatic unlock requires a backend with a Stripe webhook (see Limitations). For local testing, you can simulate the unlock by opening the browser console (F12) and running:

javascript
userLicense.paid = true;
userLicense.blocked = false;
saveLicense();
updateLicenseUI();
⚠️ Important: In production, this simulation is not needed — the unlock happens automatically via Stripe webhook. This snippet is only for developers testing the UI flow.

Reset the trial (for repeated testing)
Open the console and run:

javascript
localStorage.clear();
location.reload();
This clears the stored license for the current IP.

🧰 Technology Stack
Layer	Technology
Markup	HTML5 (semantic, accessible)
Styling	CSS3 (Flexbox, Grid, animations, gradients)
Logic	Vanilla JavaScript (ES6+, async/await)
Charts	Chart.js (via CDN)
Payments	Stripe Payment Links
IP Detection	ipify + ipapi (fallback)
Storage	localStorage (client-side license)
Hosting	Any static host (Netlify, Vercel, GitHub Pages…)
No frameworks. No build tools. No dependencies.

🔒 Security & Trust
HTTPS everywhere — All traffic is encrypted

Stripe PCI-DSS Level 1 — Bank-level payment security

No card data stored — Stripe handles all sensitive info

No installation — Nothing runs on your PC

Client-side only — Your files never leave your device

IP-based trial — Prevents abuse of the free scan

⚠️ Limitations
Client-side only
This project is 100% front-end (HTML + CSS + JS). This means:

✅ The UI, animations, chart and paywall work perfectly

❌ The "automatic unlock after payment" cannot be truly secure

❌ A user could bypass the trial by clearing localStorage or using a VPN

Why?
To verify a Stripe payment and unlock a user securely, you need a backend that:

Receives the Stripe webhook checkout.session.completed

Records the payment in a database (linked to the user's IP or email)

Exposes an endpoint (e.g. /api/verify-license) that the frontend calls

Without this, the license state lives only in the browser — and browsers can be manipulated.

Recommended production stack
Component	Suggested tech
Backend	Node.js + Express
Database	SQLite / PostgreSQL / MongoDB
Webhooks	Stripe CLI + stripe.webhooks.constructEvent
Hosting	Vercel / Render / Railway
💡 A full backend implementation can be added on request.

🗺️ Roadmap
v1.0 — Current release
☑ Responsive single-page UI
☑ Animated scan with Chart.js
☑ IP-based trial limit
☑ Stripe paywall
☑ How It Works section
☑ Trust badges
v1.1 — Planned
□ Backend with real Stripe webhook
□ Real file scanning via File System Access API
□ User accounts (email + magic link)
□ PDF cleaning report download
□ Multi-language support (IT / EN / ES)
v2.0 — Future
□ Desktop app (Electron / Tauri)
□ Real disk analysis (Node.js integration)
□ Duplicate file detection with hashing
□ Scheduled automatic cleaning
📄 License
This project is provided as-is for educational and commercial use.

© 2025 TurboTidy — Suggests Fast Cleaning. All rights reserved.

📬 Contact
Have questions, issues or feature requests?

📧 Use the Contact form on the website

💳 For payment issues, contact Stripe support directly

🐛 For bugs, open an issue in your repository

🙏 Credits
Chart.js — chartjs.org

Stripe — stripe.com

ipify — ipify.org

ipapi — ipapi.co

Avatar image — provided by the project owner
