const $ = (selector) => document.querySelector(selector);
const intro = $("#intro");
const envelope = $("#envelope");
const openButton = $("#openSurprise");
const musicToggle = $("#musicToggle");
const music = $("#music");
let musicOn = false;
let content = null;
let toastTimer = null;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function makePetal() {
  const p = document.createElement("span");
  p.className = "petal";
  p.textContent = ["✿", "❀", "♥", "✧"][Math.floor(Math.random() * 4)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = (10 + Math.random() * 16) + "px";
  p.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
  p.style.animationDuration = (7 + Math.random() * 8) + "s";
  $("#petals").appendChild(p);
  setTimeout(() => p.remove(), 16000);
}
let petalLoop;
function startPetals() {
  for (let i = 0; i < 18; i++) setTimeout(makePetal, i * 180);
  petalLoop = setInterval(() => { if (document.visibilityState === "visible") makePetal(); }, 750);
}

function setupReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

async function loadContent() {
  try {
    const response = await fetch("/api/content");
    if (!response.ok) throw new Error("Content unavailable");
    content = await response.json();
    if (content.quotes?.length) {
      const grid = $("#quoteGrid");
      grid.innerHTML = "";
      content.quotes.slice(0, 6).forEach((quote, i) => {
        const card = document.createElement("article");
        card.className = "quote-card reveal" + (i === 1 ? " quote-card-feature" : "");
        const num = String(i + 1).padStart(2, "0");
        const label = ["LOVE", "HOME", "BLESSING", "GRATITUDE", "ALWAYS", "FOREVER"][i % 6];
        const number = document.createElement("span");
        number.className = "quote-number";
        number.textContent = `${num} / ${label}`;
        const mark = document.createElement("span");
        mark.className = "big-quote";
        mark.textContent = "“";
        const text = document.createElement("p");
        text.textContent = quote;
        const heart = document.createElement("span");
        heart.className = "quote-heart";
        heart.textContent = "♡";
        card.append(number, mark, text, heart);
        grid.appendChild(card);
      });
    }
    if (content.memories?.length) {
      const list = $("#memoryList");
      list.innerHTML = "";
      content.memories.forEach((memory, i) => {
        const item = document.createElement("article");
        item.className = "memory-item reveal";
        const icon = document.createElement("span");
        icon.className = "memory-icon";
        icon.textContent = ["✿", "✧", "♡", "❀", "✦"][i % 5];
        const body = document.createElement("div");
        const heading = document.createElement("h3");
        heading.textContent = memory.title;
        const text = document.createElement("p");
        text.textContent = memory.text;
        body.append(heading, text);
        const index = document.createElement("span");
        index.className = "memory-index";
        index.textContent = String(i + 1).padStart(2, "0");
        item.append(icon, body, index);
        list.appendChild(item);
      });
    }
    setupReveal();
  } catch (err) {
    console.info("Using built-in birthday content.");
  }
}

openButton.addEventListener("click", async () => {
  // Starting audio inside this click is the most reliable way to satisfy browser autoplay rules.
  // Once started, the song loops continuously until the page is closed or the visitor pauses it.
  music.loop = true;
  try {
    await music.play();
    musicOn = true;
    musicToggle.innerHTML = "♫ <span>Music on</span>";
  } catch (err) {
    musicOn = false;
    musicToggle.innerHTML = "♫ <span>Start music</span>";
    showToast("Add your song as public/assets/birthday-song.mp3 to play it during the surprise.");
  }
  envelope.classList.add("open");
  openButton.disabled = true;
  openButton.textContent = "A little love is on its way…";
  setTimeout(() => {
    intro.classList.add("dismiss");
    document.body.classList.remove("locked");
    $("#hero").classList.remove("hidden");
    startPetals();
    setupReveal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1000);
});

musicToggle.addEventListener("click", async () => {
  if (!musicOn) {
    try {
      await music.play();
      musicOn = true;
      musicToggle.innerHTML = "♫ <span>Music on</span>";
    } catch {
      showToast("Please add your song file as public/assets/birthday-song.mp3 first.");
    }
  } else {
    music.pause();
    musicOn = false;
    musicToggle.innerHTML = "♫ <span>Music off</span>";
  }
});

const cake = $("#cakeWrap");
const wishButton = $("#wishButton");
let wished = false;
function makeWish() {
  if (wished) {
    showToast("That wish is wrapped in love forever. ❤️");
    return;
  }
  wished = true;
  $("#wishSection");
  $(".wish-section").classList.add("blown");
  $("#wishResult").textContent = "May every beautiful wish find its way to you, Amma. ♥";
  wishButton.textContent = "Wish sent with love ♥";
  for (let i = 0; i < 36; i++) {
    setTimeout(() => {
      const bit = document.createElement("span");
      bit.className = "petal";
      bit.textContent = ["✦", "♥", "✧", "❀"][i % 4];
      bit.style.left = (35 + Math.random() * 30) + "vw";
      bit.style.top = (40 + Math.random() * 20) + "vh";
      bit.style.fontSize = (12 + Math.random() * 20) + "px";
      bit.style.setProperty("--drift", (Math.random() * 260 - 130) + "px");
      bit.style.animationDuration = (2 + Math.random() * 3) + "s";
      document.body.appendChild(bit);
      setTimeout(() => bit.remove(), 6000);
    }, i * 30);
  }
  showToast("One beautiful wish, sent with all your love. ✨");
}
cake.addEventListener("click", makeWish);
wishButton.addEventListener("click", makeWish);
$("#celebrateAgain").addEventListener("click", () => {
  wished = false;
  $(".wish-section").classList.remove("blown");
  $("#wishResult").textContent = "";
  wishButton.textContent = "Make a wish with me ♥";
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Let's celebrate Amma all over again! ♥");
});

loadContent();
setupReveal();
