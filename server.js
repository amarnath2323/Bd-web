const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");
const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.json({ limit: "2mb" }));
app.use(express.static(PUBLIC_DIR));

function readContent() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {
      recipient: "Amma",
      sender: "Your loving child",
      birthdayMessage: "Happy Birthday, Amma!",
      quotes: [
        "Before the world knew me, you loved me.",
        "No matter how old I grow, I will always be your little child.",
        "Your love is my greatest blessing. Your happiness is my biggest wish."
      ],
      memories: [
        { title: "My First Home", text: "Your arms were my first safe place, and your love will always be home." },
        { title: "My Biggest Supporter", text: "Every dream feels possible because you believe in me." },
        { title: "Forever Your Child", text: "Growing up will never change the place you hold in my heart." }
      ]
    };
  }
}

function writeContent(content) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), "utf8");
}

app.get("/api/content", (_req, res) => res.json(readContent()));

app.post("/api/message", (req, res) => {
  const message = String(req.body?.message || "").trim().slice(0, 1500);
  if (!message) return res.status(400).json({ error: "Please write a message first." });
  const file = path.join(DATA_DIR, "messages.json");
  let messages = [];
  try { messages = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  messages.push({ message, createdAt: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(messages, null, 2), "utf8");
  res.json({ ok: true, message: "Your message has been saved. ❤️" });
});

app.get("/api/messages", (_req, res) => {
  const file = path.join(DATA_DIR, "messages.json");
  try { res.json(JSON.parse(fs.readFileSync(file, "utf8"))); }
  catch { res.json([]); }
});

// Optional local admin endpoint. Set ADMIN_TOKEN before using it on a public deployment.
app.put("/api/content", (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (token && req.headers["x-admin-token"] !== token) {
    return res.status(401).json({ error: "Admin token required." });
  }
  const incoming = req.body || {};
  const safe = {
    recipient: String(incoming.recipient || "Amma").slice(0, 60),
    sender: String(incoming.sender || "Your loving child").slice(0, 80),
    birthdayMessage: String(incoming.birthdayMessage || "Happy Birthday, Amma!").slice(0, 300),
    quotes: Array.isArray(incoming.quotes) ? incoming.quotes.slice(0, 12).map(x => String(x).slice(0, 300)) : [],
    memories: Array.isArray(incoming.memories) ? incoming.memories.slice(0, 12).map(x => ({
      title: String(x.title || "A memory").slice(0, 100),
      text: String(x.text || "").slice(0, 500)
    })) : []
  };
  writeContent(safe);
  res.json({ ok: true, content: safe });
});

app.get("*", (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")));

app.listen(PORT, () => {
  console.log(`Amma Birthday Surprise is running at http://localhost:${PORT}`);
});
