const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const fs = require("fs");

/**
 * Universal Browser Launcher
 * Works on Local Windows (discovery mode) and Vercel (sparticuz mode)
 */
const getBrowser = async () => {
  const isVercel = !!process.env.VERCEL;
  const isProduction = process.env.NODE_ENV === "production";
  
  if (isVercel || isProduction) {
    console.log("--- PROD: Launching Chromium on Vercel ---");
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  }

  // Windows Local
  console.log("--- LOCAL: Launching Browser for Windows ---");
  
  // 1. Clear any Linux-specific cache settings
  delete process.env.PUPPETEER_CACHE_DIR;

  // 2. Discover Chrome/Edge/Brave
  const paths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    process.env.CHROME_PATH
  ].filter(Boolean);

  let chromePath = null;
  for (const p of paths) {
    if (fs.existsSync(p)) {
      chromePath = p;
      break;
    }
  }

  if (!chromePath) {
    throw new Error("No browser found (Chrome/Edge). Please install Chrome.");
  }

  console.log(`Using system browser at: ${chromePath}`);

  return await puppeteer.launch({
    executablePath: chromePath,
    headless: true, // Use standard headless for recent Puppeteer
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process" // More stable for some Windows configs
    ]
  });
};

module.exports = { getBrowser };
