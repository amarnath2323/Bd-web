const $ = s => document.querySelector(s);
const status = $("#status");
let savedMemories = [];
async function request(url, options={}) {
  const token = $("#token").value.trim();
  options.headers = {...(options.headers||{}), ...(token ? {"x-admin-token": token} : {})};
  const r = await fetch(url, options);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
  return data;
}
function renderMemories(memories) {
  savedMemories = memories || [];
  const root = $("#memories"); root.innerHTML = "";
  savedMemories.forEach((m, i) => {
    const wrap = document.createElement("div"); wrap.className = "memory-editor";
    const title = document.createElement("label"); title.textContent = `Memory ${i+1} title`;
    const titleInput = document.createElement("input"); titleInput.value = m.title || ""; titleInput.dataset.title = i;
    const textLabel = document.createElement("label"); textLabel.textContent = "Memory text";
    const textInput = document.createElement("textarea"); textInput.value = m.text || ""; textInput.dataset.text = i;
    wrap.append(title, titleInput, textLabel, textInput); root.append(wrap);
  });
}
async function load() {
  status.textContent = "Loading…";
  try {
    const data = await request("/api/content");
    $("#recipient").value = data.recipient || "Amma";
    $("#sender").value = data.sender || "Your loving child";
    $("#birthdayMessage").value = data.birthdayMessage || "Happy Birthday, Amma!";
    $("#quotes").value = (data.quotes || []).join("\n");
    renderMemories(data.memories || []);
    status.textContent = "Saved content loaded.";
  } catch (e) { status.textContent = e.message; }
}
async function save() {
  const memories = [...$("#memories").querySelectorAll("[data-title]")].map((el, i) => ({
    title: el.value.trim(),
    text: $("#memories").querySelector(`[data-text="${i}"]`)?.value.trim() || ""
  }));
  const payload = {
    recipient: $("#recipient").value.trim(),
    sender: $("#sender").value.trim(),
    birthdayMessage: $("#birthdayMessage").value.trim(),
    quotes: $("#quotes").value.split("\n").map(x => x.trim()).filter(Boolean),
    memories
  };
  status.textContent = "Saving…";
  try {
    await request("/api/content", {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
    status.textContent = "Saved! Refresh the birthday page to see your changes. ❤️";
  } catch (e) { status.textContent = e.message; }
}
$("#load").addEventListener("click", load);
$("#save").addEventListener("click", save);
$("#messagesBtn").addEventListener("click", async () => {
  $("#messages").textContent = "Loading messages…";
  try {
    const messages = await request("/api/messages");
    const root = $("#messages"); root.innerHTML = "";
    if (!messages.length) { root.textContent = "No messages saved yet."; return; }
    messages.forEach(item => {
      const p = document.createElement("p");
      p.textContent = `${new Date(item.createdAt).toLocaleString()} — ${item.message}`;
      root.append(p);
    });
  } catch(e) { $("#messages").textContent = e.message; }
});
load();
