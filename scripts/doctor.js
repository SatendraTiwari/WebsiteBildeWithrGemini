require("dotenv").config({ path: ".env.local" });

const required = [
  "NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY",
  "CONVEX_DEPLOYMENT",
  "NEXT_PUBLIC_CONVEX_URL",
  "GEMINI_API_KEY",
];

function mask(value) {
  if (!value) return "missing";
  if (value.length <= 8) return "*".repeat(value.length);
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

async function checkGemini() {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent("Reply with OK");
  return result.response.text();
}

async function checkConvex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const response = await fetch(url);
  return response.status >= 200 && response.status < 500;
}

async function run() {
  let hasMissing = false;
  let hasFailure = false;
  console.log("Environment check:");
  for (const key of required) {
    const value = process.env[key];
    if (!value) hasMissing = true;
    console.log(`- ${key}: ${mask(value)}`);
  }

  if (hasMissing) {
    console.error("\nMissing required env vars in .env.local");
    process.exit(1);
  }

  try {
    const convexOk = await checkConvex();
    console.log(`\nConvex check: ${convexOk ? "ok" : "failed"}`);
    if (!convexOk) hasFailure = true;
  } catch (error) {
    console.error("\nConvex check failed:", error.message || error);
    hasFailure = true;
  }

  try {
    const text = await checkGemini();
    console.log(`Gemini check: ok (${String(text).trim()})`);
  } catch (error) {
    const status = Number(error?.status) || "unknown";
    const message = error?.message || String(error);
    console.error(`Gemini check failed [${status}]: ${message}`);
    if (status === 429) {
      console.error(
        "Action: enable Gemini API billing/quota for the Google project behind this API key."
      );
    }
    hasFailure = true;
  }

  if (hasFailure) {
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
