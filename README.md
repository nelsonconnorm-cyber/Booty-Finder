# Booty-Finder
Solar Sales Lead Gen
# ☠️ Booty Finder! — Solar Lead Generation

> *"Thar she blows — a roof without panels!"*

Booty Finder is a browser-based tool for solar sales teams. It scans a ZIP code using the **ATTOM property data API** and surfaces homeowners who bought their house between a set date range, whose home was built before a chosen year — prime candidates for a solar pitch. Results are loaded into a lead list, then organized into an optimized door-to-door route you can print and take into the field.

---

## ⚓ What You Need

### 1. An ATTOM API Key
Booty Finder pulls property data from [ATTOM Data Solutions](https://www.attomdata.com). You'll need an active API subscription with access to the **Property Snapshot** endpoint.

- Sign up at [attomdata.com](https://www.attomdata.com)
- Your API key will be a long alphanumeric string
- A basic subscription covers the data fields this tool uses (address, year built, sale date, sale price)

### 2. Node.js (for live data)
The tool requires a small local proxy script (`proxy.js`) to relay requests to ATTOM, since browsers can't call the ATTOM API directly due to CORS restrictions.

- Download Node.js (free) from [nodejs.org](https://nodejs.org) — use the LTS version
- No other packages or installs are needed; the proxy uses only built-in Node modules

### 3. A Modern Web Browser
Chrome, Firefox, Edge, or Safari. The HTML file runs entirely in your browser — no installation required.

---

## 🗺️ Setup & Usage

### Step 1 — Start the proxy
Open a terminal (Command Prompt on Windows, Terminal on Mac/Linux) in the folder where you saved the files and run:

```
node proxy.js
```

You should see:

```
GEOLead Proxy is running!
Listening on http://localhost:3000
```

Leave this window open while you use the tool.

### Step 2 — Open the tool
Open `booty-finder.html` in your browser. You can double-click the file or drag it into a browser window.

### Step 3 — Configure and scan

Fill in the sidebar fields:

| Field | What to enter |
|---|---|
| **ATTOM API Key** | Your ATTOM API key |
| **Target ZIP Code** | The 5-digit ZIP you want to scan |
| **Proxy URL** | Leave as `http://localhost:3000/proxy?url=` (default) |
| **Sale Year — From / To** | The range of years the home was purchased |
| **Built Before** | Only return homes constructed before this year |

Click **Hunt the Booty!** to start the scan. Results appear in the table below.

### Step 4 — Build your route
- Click any row in the results table to add it to your route
- Or click **Chart All Stops** to add every lead at once
- Click **Optimize the Route** to reorder stops by geographic proximity (fastest path)
- Click **Print the Map** to get a clean, printer-friendly route sheet

---

## ⚡ Demo Mode

Don't have an API key yet, or just want to test the tool? Click **Load Demo Treasure** — this loads 10 sample San Diego properties so you can try every feature without any setup.

---

## 📁 Files

| File | Purpose |
|---|---|
| `booty-finder.html` | The main application — open this in your browser |
| `proxy.js` | Local server that forwards requests to ATTOM — must be running for live data |
| `README.md` | This file |

---

## 🏴‍☠️ How the Scan Works

1. Booty Finder calls ATTOM's `/property/snapshot` endpoint with your ZIP code and date range, paginating through up to 1,000 results
2. Results are filtered client-side to only keep homes built before your chosen year
3. Matching properties are displayed in the lead table with address, year built, sale date, and sale price
4. Selecting properties for your route triggers a nearest-neighbor optimization algorithm that orders stops by proximity to minimize drive time

---

## ⚠️ Important Notes

- **The proxy must be running** on your computer while you use the tool. If you close the terminal window running `proxy.js`, live scans will stop working. Demo mode always works without it.
- **ATTOM data coverage varies by county.** Some counties have richer data than others. Sale price and exact sale date availability depends on local assessor reporting.
- **This tool does not detect solar panels.** It finds properties that *match your target profile* — homes bought in your date range, built before your cutoff year. Confirming the absence of solar requires a visual check during your visit or a separate data source.
- **For team use**, each person running the tool needs Node.js and the proxy running locally on their own machine. The hosted version on GitHub Pages serves the frontend only.

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| "The messenger parrot died!" error | Make sure `node proxy.js` is running in your terminal |
| "The kraken rejected yer API key!" | Double-check your ATTOM API key is correct and your subscription is active |
| Scan returns 0 results | Try widening your date range or checking that the ZIP code is valid |
| Page won't load from GitHub URL | Open the file locally instead — GitHub Pages serves the frontend but can't run the proxy |

---

*Built with ATTOM Data API · Runs entirely in your browser · No data is stored anywhere*
