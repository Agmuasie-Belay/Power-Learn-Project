/* =========================
       CONFIG
    ========================== */
const USE_MOCK_API = false; // 👉 set to false when your Flask backend is running
const ENDPOINTS = {
  ask: "http://127.0.0.1:5000/ask",
  flashcards: "http://127.0.0.1:5000/flashcards",
  save: "http://127.0.0.1:5000/save",
  dashboard: "http://127.0.0.1:5000/dashboard",
};

/* =========================
       UTILITIES
    ========================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
function notify(msg, ok = true) {
  const n = $("#notice"),
    t = $("#noticeText");
  t.textContent = msg;
  n.style.background = ok ? "var(--success)" : "var(--warning)";
  n.classList.add("show");
  setTimeout(() => n.classList.remove("show"), 2500);
}
function fileToText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    // NOTE: Without a PDF parser in-browser, this reads raw text. Backend should parse real PDFs.
    reader.readAsText(file);
  });
}

/* =========================
       STATE
    ========================== */
let currentMood = "happy";
let flashcards = [];
let moodChart, topicChart;

/* =========================
       TABS
    ========================== */
$$(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    ["tutor", "flashcards", "dashboard"].forEach((id) =>
      $("#" + id).classList.add("hidden")
    );
    $("#" + tab).classList.remove("hidden");
    if (tab === "dashboard") loadDashboard();
  });
});

/* =========================
       MOOD BUTTONS
    ========================== */
$$(".mood-btn").forEach((b) => {
  b.addEventListener("click", () => {
    $$(".mood-btn").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    currentMood = b.dataset.mood;
  });
});

/* =========================
       TUTOR MODE
    ========================== */
// $("#askBtn").addEventListener("click", async () => {
//   const q = $("#question").value.trim();
//   if (!q) {
//     notify("Type a question first", false);
//     return;
//   }
//   $("#askBtn").disabled = true;
//   $("#askBtn").innerHTML =
//     '<i class="fa-solid fa-spinner fa-spin"></i> Thinking...';

//   try {
//     let answer;
//     if (USE_MOCK_API) {
//       answer = mockAsk(q, currentMood);
//     } else {
//       const fd = new FormData();
//       fd.append("question", q);
//       fd.append("mood", currentMood);
//       const res = await fetch(ENDPOINTS.ask, {
//         method: "POST",
//         body: fd,
//       });
//       const data = await res.json();
//       answer = data.answer || "No answer returned.";
//     }
//     $("#answerBox").innerHTML = renderAnswer(answer);
//     notify("Tutor response ready");
//   } catch (e) {
//     console.error(e);
//     notify("Failed to get answer", false);
//   } finally {
//     $("#askBtn").disabled = false;
//     $("#askBtn").innerHTML = '<i class="fa-solid fa-paper-plane"></i> Ask';
//   }
// });

$("#askBtn").addEventListener("click", async () => {
  const q = $("#question").value.trim();
  if (!q) return notify("Type a question first", false);

  $("#askBtn").disabled = true;
  $("#askBtn").innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Thinking...';

  try {
    const fd = new FormData();
    fd.append("question", q);
    fd.append("mood", currentMood);
    fd.append("context", $("#context")?.value || ""); // optional context

    const res = await fetch(ENDPOINTS.ask, { method: "POST", body: fd });

    const text = await res.text();
    console.log(text); // check what you actually received
    const data = JSON.parse(text);

    $("#answerBox").innerHTML = renderAnswer(data.answer);
    notify("Tutor response ready");
  } catch (e) {
    console.error(e);
    notify("Failed to get answer", false);
  } finally {
    $("#askBtn").disabled = false;
    $("#askBtn").innerHTML = '<i class="fa-solid fa-paper-plane"></i> Ask';
  }
});

function renderAnswer(text) {
  // Simple markdown-ish formatting for steps
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<div style="white-space:pre-wrap;font-size:1rem">${esc(text)}</div>`;
}

/* =========================
       FLASHCARD MODE
    ========================== */
$("#loadSampleBtn").addEventListener("click", () => {
  $("#notes").value = SAMPLE_NOTES;
  notify('Sample notes loaded. Click "Generate Flashcards".');
});
$("#clearNotesBtn").addEventListener("click", () => {
  $("#notes").value = "";
  $("#pdf").value = "";
  notify("Cleared.");
});
$("#resetFlashBtn").addEventListener("click", () => {
  flashcards = [];
  renderFlashcards();
  notify("Reset flashcards.");
});

$("#genFlashBtn").addEventListener("click", async () => {
  const text = $("#notes").value.trim();
  const file = $("#pdf").files[0];
  if (!text && !file) {
    notify("Paste text or upload a PDF first.", false);
    return;
  }

  $("#genFlashBtn").disabled = true;
  $("#genFlashBtn").innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

  try {
    let cards;
    if (USE_MOCK_API) {
      const content = text || (file ? await fileToText(file) : "");
      cards = mockFlashcards(content);
    } else {
      const fd = new FormData();
      if (text) fd.append("text", text);
      if (file) fd.append("file", file);
      const res = await fetch(ENDPOINTS.flashcards, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      // expected: { flashcards: [{question, answer}, ...] } OR a single string to parse
      cards = Array.isArray(data.flashcards)
        ? data.flashcards
        : parseFlashcardBlock(data.flashcards || "");
    }
    flashcards = cards;
    renderFlashcards();
    notify(`Generated ${flashcards.length} flashcards`);
  } catch (e) {
    console.error(e);
    notify("Failed to generate flashcards", false);
  } finally {
    $("#genFlashBtn").disabled = false;
    $("#genFlashBtn").innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Flashcards';
  }
});

function parseFlashcardBlock(block) {
  // Accepts "Q: ...\nA: ...\n\nQ: ...\nA: ..."
  const parts = block.split(/\n\s*\n/).filter(Boolean);
  const cards = [];
  for (const p of parts) {
    const q = p.match(/Q\s*:\s*(.*)/i);
    const a = p.match(/A\s*:\s*(.*)/i);
    if (q && a) {
      cards.push({ question: q[1].trim(), answer: a[1].trim() });
    }
  }
  return cards.length
    ? cards
    : [
        {
          question: "What is the main idea?",
          answer: "Summary of the provided text.",
        },
      ];
}

function renderFlashcards() {
  const c = $("#fcContainer");
  c.innerHTML = "";
  if (!flashcards.length) {
    $("#fcCount").textContent = "(0)";
    c.innerHTML =
      '<div class="muted">Your flashcards will appear here after generation.</div>';
    return;
  }
  $("#fcCount").textContent = `(${flashcards.length})`;
  flashcards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "flashcard";
    el.innerHTML = `
          <div class="flashcard-inner">
            <div class="flashcard-side front">
              <div style="position:absolute;top:10px;right:12px;background:rgba(255,255,255,.2);width:32px;height:32px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-weight:800">${
                i + 1
              }</div>
              <div style="text-align:center;font-size:1.05rem">${escapeHtml(
                card.question
              )}</div>
              <div class="muted" style="text-align:center;margin-top:8px"><i>Click to flip</i></div>
            </div>
            <div class="flashcard-side back">
              <div style="position:absolute;top:10px;right:12px;background:rgba(255,255,255,.2);width:32px;height:32px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-weight:800">${
                i + 1
              }</div>
              <div style="text-align:center;font-size:1.05rem">${escapeHtml(
                card.answer
              )}</div>
              <div class="muted" style="text-align:center;margin-top:8px"><i>Click to flip back</i></div>
            </div>
          </div>`;
    el.addEventListener("click", () => el.classList.toggle("flipped"));
    c.appendChild(el);
  });
}
function escapeHtml(s) {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

// Save buttons
$("#saveFlashBtn").addEventListener("click", async () => {
  if (!flashcards.length) {
    notify("Generate some flashcards first.", false);
    return;
  }
  await saveToBackend({ type: "flashcards", flashcards });
  notify("Flashcards saved.");
});
$("#saveSetBtn").addEventListener("click", async () => {
  const name = $("#setName").value.trim();
  if (!name) {
    notify("Enter a name for the set.", false);
    return;
  }
  if (!flashcards.length) {
    notify("No flashcards to save.", false);
    return;
  }
  await saveToBackend({ type: "flashcard_set", name, flashcards });
  $("#setName").value = "";
  notify(`Saved "${name}"`);
});

async function saveToBackend(payload) {
  if (USE_MOCK_API) {
    return new Promise((r) => setTimeout(r, 300));
  }
  const res = await fetch(ENDPOINTS.save, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

/* =========================
       DASHBOARD
    ========================== */
async function loadDashboard() {
  try {
    let data;
    if (USE_MOCK_API) {
      data = mockDashboard();
    } else {
      const res = await fetch(ENDPOINTS.dashboard);
      data = await res.json();
    }
    // Stats
    $("#statQuestions").textContent = data.total_questions ?? 0;
    $("#statFlashcards").textContent = data.total_flashcards ?? 0;

    // Recent moods
    const list =
      data.moods
        ?.map(
          (m) =>
            `<li>${escapeHtml(m.student)} → <b>${escapeHtml(m.mood)}</b></li>`
        )
        .join("") || "";
    $("#recentMoods").innerHTML = list || "<li>No recent mood data.</li>";

    // Charts
    renderMoodChart(data.mood_series || []);
    renderTopicChart(data.top_topics || []);
  } catch (err) {
    console.error(err);
    notify("Failed to load dashboard", false);
  }
}

function renderMoodChart(series) {
  const ctx = $("#moodChart").getContext("2d");
  const labels = series.map((x) => x.label);
  const values = series.map((x) => x.value);
  if (moodChart) moodChart.destroy();
  moodChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Mood (happy=2, neutral=1, frustrated=0)",
          data: values,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 2, ticks: { stepSize: 1 } } },
    },
  });
}
function renderTopicChart(items) {
  const ctx = $("#topicChart").getContext("2d");
  const labels = items.map((x) => x.topic);
  const values = items.map((x) => x.count);
  if (topicChart) topicChart.destroy();
  topicChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Confusing Topic Mentions", data: values }],
    },
    options: { responsive: true },
  });
}

/* =========================
       MOCK DATA / FALLBACKS
    ========================== */
const SAMPLE_NOTES = `Photosynthesis is the process used by plants, algae and some bacteria to convert light energy into chemical energy. It occurs in chloroplasts and requires CO2, H2O and light. The general equation is: 6CO2 + 6H2O → C6H12O6 + 6O2.`;
function mockAsk(q, mood) {
  const tone =
    mood === "frustrated"
      ? "I'll simplify and encourage you."
      : mood === "happy"
      ? "Great energy! Here's a detailed breakdown."
      : "Here's a clear explanation.";
  return `(${tone})
Step 1: Identify the key concept in your question: "${q}".
Step 2: Explain it in simple terms with an example.
Step 3: Highlight common pitfalls and how to avoid them.
Step 4: Provide a quick practice question.
Tip: Learning builds with small wins — you're doing great!`;
}
function mockFlashcards(text) {
  if (text.toLowerCase().includes("photosynthesis")) {
    return [
      {
        question: "What is photosynthesis?",
        answer:
          "A process converting light energy into chemical energy (glucose).",
      },
      {
        question: "Where does photosynthesis occur?",
        answer: "In chloroplasts of plant cells.",
      },
      {
        question: "What are the inputs?",
        answer: "CO2, H2O, and light.",
      },
      {
        question: "What is the overall equation?",
        answer: "6CO2 + 6H2O → C6H12O6 + 6O2",
      },
      {
        question: "Why is it important?",
        answer: "It produces oxygen and organic compounds for life on Earth.",
      },
    ];
  }
  return [
    {
      question: "What is the main idea of the text?",
      answer: "It introduces the key concepts and structure of the content.",
    },
    {
      question: "List two key points.",
      answer: "Point A and point B summarize the most important ideas.",
    },
    {
      question: "How does this concept apply?",
      answer: "It can be used to solve related problems or explain phenomena.",
    },
  ];
}
function mockDashboard() {
  return {
    total_questions: 42,
    total_flashcards: 120,
    moods: [
      { student: "Abel", mood: "happy" },
      { student: "Hana", mood: "neutral" },
      { student: "Lulit", mood: "frustrated" },
      { student: "Yonas", mood: "happy" },
      { student: "Mahi", mood: "neutral" },
    ],
    mood_series: [
      { label: "S1", value: 2 },
      { label: "S2", value: 1 },
      { label: "S3", value: 0 },
      { label: "S4", value: 2 },
      { label: "S5", value: 1 },
      { label: "S6", value: 2 },
      { label: "S7", value: 1 },
    ],
    top_topics: [
      { topic: "Fractions", count: 8 },
      { topic: "Photosynthesis", count: 5 },
      { topic: "Acceleration", count: 4 },
      { topic: "Trigonometry", count: 3 },
    ],
  };
}
