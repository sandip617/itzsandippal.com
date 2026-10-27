const siteConfig = {
  email: "itzsandip617@gmail.com",
  whatsapp: "917022232721"
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("briefDate").textContent = new Date().toLocaleDateString("en-IN", {
  day: "2-digit", month: "short", year: "numeric"
}).toUpperCase();

/* ---------- mobile menu ---------- */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- scroll progress + header ---------- */
const progress = document.getElementById("scrollProgress");
const header = document.querySelector(".site-header");
const funnel = document.getElementById("funnel");

/* ---------- funnel meter: which AIDA stage is the visitor in? ---------- */
const stageOrder = ["awareness", "interest", "desire", "action"];
const stageHints = {
  awareness: "This site is a marketing funnel. You’re in it.",
  interest: "Interest: getting to know the product (me).",
  desire: "Desire: seeing what I can do for you.",
  action: "Action: one brief away from converting."
};
const stageSections = [...document.querySelectorAll("[data-stage]")].filter(el => el.tagName === "SECTION");
const funnelItems = [...funnel.querySelectorAll("li")];
const funnelHint = document.getElementById("funnelHint");
let currentStage = "";
let converted = false;

function setStage(stage) {
  if (stage === currentStage || converted) return;
  currentStage = stage;
  const idx = stageOrder.indexOf(stage);
  funnelItems.forEach((li, i) => {
    li.classList.toggle("passed", i < idx);
    li.classList.toggle("current", i === idx);
  });
  funnelHint.textContent = stageHints[stage];
}

const navAnchors = [...navLinks.querySelectorAll("a")];

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  header.classList.toggle("scrolled", y > 10);
  funnel.classList.toggle("show", y > 200);

  // the section crossing 40% of the viewport decides the stage + active nav link
  const line = window.innerHeight * 0.4;
  let active = stageSections[0];
  stageSections.forEach(sec => {
    if (sec.getBoundingClientRect().top <= line) active = sec;
  });
  // at the very bottom, always count as Action
  if (max - y < 4) active = stageSections[stageSections.length - 1];
  setStage(active.dataset.stage);
  navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${active.id}`));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- reveal on scroll ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add("visible");
      observer.unobserve(el);
      // drop the stagger delay afterwards so hover effects respond instantly
      setTimeout(() => { el.style.transitionDelay = ""; }, 1300);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  // small stagger for items that sit in the same grid
  const siblings = el.parentElement.querySelectorAll(":scope > .reveal");
  if (siblings.length > 1) el.style.transitionDelay = `${[...siblings].indexOf(el) * 70}ms`;
  observer.observe(el);
});

/* ---------- rotating hero word ---------- */
const words = ["noticed", "trusted", "chosen", "talked about", "remembered"];
const rotatorWord = document.getElementById("rotatorWord");
if (!reduceMotion) {
  let w = 0;
  setInterval(() => {
    rotatorWord.classList.add("out");
    setTimeout(() => {
      w = (w + 1) % words.length;
      rotatorWord.textContent = words[w];
      rotatorWord.classList.remove("out");
      rotatorWord.classList.add("in");
      void rotatorWord.offsetWidth; // restart transition
      rotatorWord.classList.remove("in");
    }, 420);
  }, 2400);
}

/* ---------- photo tilt ---------- */
const photoFrame = document.getElementById("photoFrame");
const heroVisual = document.querySelector(".hero-visual");
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  heroVisual.addEventListener("mousemove", e => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photoFrame.style.setProperty("--ry", `${x * 10}deg`);
    photoFrame.style.setProperty("--rx", `${-y * 10}deg`);
  });
  heroVisual.addEventListener("mouseleave", () => {
    photoFrame.style.setProperty("--ry", "0deg");
    photoFrame.style.setProperty("--rx", "0deg");
  });
}

/* ---------- service card spotlight ---------- */
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- 4Ps flip (tap / keyboard) ---------- */
document.querySelectorAll(".mix-card").forEach(card => {
  card.addEventListener("click", () => {
    card.setAttribute("aria-pressed", card.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });
});

/* ---------- positioning map notes ---------- */
const mapNote = document.getElementById("mapNote");
const meDot = document.querySelector(".me-dot");
const defaultNote = meDot.dataset.note;
document.querySelectorAll(".quad, .me-dot").forEach(el => {
  const show = () => { mapNote.textContent = el.dataset.note; };
  el.addEventListener("mouseenter", show);
  el.addEventListener("focus", show);
  el.addEventListener("click", show);
  el.addEventListener("mouseleave", () => { mapNote.textContent = defaultNote; });
});

/* ---------- playbook modal ---------- */
const playbooks = {
  growth: {
    type: "Digital Marketing",
    title: "Growth Campaign",
    text: "A campaign built to move one clear number, whether that’s followers, footfall, sign-ups or sales.",
    steps: [
      ["Brief & goal", "Agree on one measurable objective and who we’re talking to."],
      ["Audience research", "Competitors, customer pain points and the platforms that matter."],
      ["Campaign idea", "One strong message, adapted for each channel."],
      ["Launch & track", "Publish, watch the numbers and adjust what isn’t working."],
      ["Report", "A simple summary of what worked and what to do next."]
    ]
  },
  visual: {
    type: "Photography",
    title: "Visual Story",
    text: "Photos that do more than look nice. Each frame should say something about the person, product or brand.",
    steps: [
      ["Mood & references", "Lock the look, colours and feeling before the shoot."],
      ["Shot list", "Plan every frame the brand actually needs: hero, detail, lifestyle."],
      ["Shoot day", "Direct, capture and keep the energy natural."],
      ["Edit & grade", "A consistent colour style that fits the brand."],
      ["Deliver", "Sized and exported for web, social and print."]
    ]
  },
  reel: {
    type: "Video",
    title: "Brand Reel",
    text: "Short-form video designed around the first three seconds, because that’s where attention is won or lost.",
    steps: [
      ["Hook first", "Write the opening line or visual before anything else."],
      ["Script & storyboard", "A tight structure that fits 15–60 seconds."],
      ["Shoot", "Vertical-first framing, good light, clean audio."],
      ["Edit", "Pacing, captions, motion text and sound design."],
      ["Post & learn", "Check retention and use it to improve the next reel."]
    ]
  },
  series: {
    type: "Content",
    title: "Content Series",
    text: "A repeatable content format that makes a brand recognisable and gives people a reason to come back.",
    steps: [
      ["Content pillars", "Three or four themes the brand can own."],
      ["Format design", "Templates, tone of voice and a look people recognise."],
      ["Calendar", "A realistic posting plan the team can keep up with."],
      ["Batch create", "Produce in batches so quality stays consistent."],
      ["Community", "Reply, repost and turn followers into fans."]
    ]
  }
};

const modal = document.getElementById("projectModal");
const modalType = document.getElementById("modalType");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalSteps = document.getElementById("modalSteps");
const modalClose = document.getElementById("modalClose");
let lastFocus = null;

function openModal(key) {
  const p = playbooks[key];
  if (!p) return;
  modalType.textContent = `Playbook · ${p.type}`;
  modalTitle.textContent = p.title;
  modalText.textContent = p.text;
  modalSteps.replaceChildren(...p.steps.map(([title, desc]) => {
    const li = document.createElement("li");
    const wrap = document.createElement("div");
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    strong.textContent = title;
    span.textContent = desc;
    wrap.append(strong, span);
    li.append(wrap);
    return li;
  }));
  lastFocus = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.project));
});
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target.dataset.close === "true") closeModal(); });
document.getElementById("modalContact").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---------- creative brief form ---------- */
const form = document.getElementById("contactForm");
form.querySelectorAll(".brief-text input, .brief-text select").forEach(field => {
  const mark = () => field.classList.toggle("filled", field.value.trim() !== "" && field.checkValidity());
  field.addEventListener("input", mark);
  field.addEventListener("change", mark);
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const d = new FormData(form);
  const company = d.get("company") ? ` from ${d.get("company")}` : "";
  const subject = encodeURIComponent(`New brief: ${d.get("service")} for ${d.get("company") || d.get("name")}`);
  const body = encodeURIComponent(
    `Hi Sandip,\n\nI'm ${d.get("name")}${company}. We're a ${d.get("type")} and we need help with ${d.get("service")} so we can ${d.get("goal")}.\n\n` +
    (d.get("message") ? `More details:\n${d.get("message")}\n\n` : "") +
    `You can reach me at ${d.get("email")}.`
  );
  window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  document.getElementById("formNote").textContent = "Opening your email app… Converted! 🎉";

  // complete the funnel
  converted = true;
  funnelItems.forEach(li => { li.classList.remove("current"); li.classList.add("passed"); });
  funnelItems[3].classList.add("converted");
  funnelHint.textContent = "Converted. Thanks for the brief!";
  const ff = document.getElementById("ffAction");
  ff.textContent = "Action";
  ff.classList.add("done");
});

/* keep WhatsApp links in sync with config */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
  a.href = `https://wa.me/${siteConfig.whatsapp}`;
});
