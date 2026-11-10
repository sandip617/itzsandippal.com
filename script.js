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
    title: "Project",
    text: "A repeatable content format that makes a brand recognisable and gives people a reason to come back.",
    work: [
      {
        type: "Web App · HTML, CSS, JavaScript",
        title: "Happy Birthday Mittar",
        desc: "A birthday wish maker in Bangla and English. Pick a theme, add a photo and music, then download a card or record a short animation video and share it on WhatsApp or Facebook.",
        url: "https://sandip617.github.io/happy-birthday-mittar/",
        code: "https://github.com/sandip617/happy-birthday-mittar",
        thumb: "birthday"
      },
      {
        type: "Browser Extension · Safari & Chrome",
        title: "NN Tab",
        desc: "A minimalist dark new tab page for Safari and Chrome. Live clock, editable quotes, a notes list and a bookmarks grid with categories, drag-and-drop and auto-fetched icons. Plain HTML, CSS and JavaScript, so it opens instantly.",
        code: "https://github.com/sandip617/Safari-New_Tab_Extension",
        page: "projects/nn-tab/",
        thumb: "newtab"
      },
      {
        type: "Browser Extension · Safari for Mac",
        title: "YT Premium Vibe",
        desc: "Makes YouTube feel premium in Safari. Blocks ads, skips sponsors, hides Shorts, summarises any video with AI in English or Bangla, downloads video or audio and boosts volume up to 300%. Eleven features in one extension, each one switchable.",
        code: "https://github.com/sandip617/YT-Premium-Vibe-Extension",
        page: "projects/yt-premium-vibe/",
        thumb: "ytvibe"
      },
      {
        type: "Daily Newspaper · Bangla & English",
        title: "News Board",
        desc: "A daily business newspaper for BBA students that updates itself every morning at 7 AM. Global news with a \"why it matters\" note, an AI-written blog, term of the day, GD topic, quiz, weekly case study and market snapshot. Free and open source, with a guide to run your own.",
        url: "https://sandip617.github.io/news-board/",
        code: "https://github.com/sandip617/news-board",
        page: "projects/news-board/",
        cta: "See how it works →",
        thumb: "news"
      }
    ],
    help: { text: "Installing a Safari extension?", link: "Step-by-step setup guide →", href: "guides/safari-extensions/" },
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
const modalWork = document.getElementById("modalWork");

/* Artwork for each live project's thumbnail */
const workThumbs = {
  birthday: '<i class="wb wb1"></i><i class="wb wb2"></i><i class="wb wb3"></i><span lang="bn">শুভ জন্মদিন!</span>',
  newtab: '<img class="nt-logo" src="projects/nn-tab/logo.png" alt="" width="40" height="40">' +
    '<span class="nt-clock">09:41</span>' +
    '<span class="nt-tiles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>',
  ytvibe: '<img class="yv-logo" src="projects/yt-premium-vibe/logo.png" alt="" width="56" height="56">' +
    '<span class="yv-pills" aria-hidden="true"><i>✦ AI Summary</i><i>↓ Download</i></span>',
  news: '<span class="nb-date">TUESDAY · 3 NOVEMBER</span><span class="nb-mast">News Board</span>' +
    '<span class="nb-cols" aria-hidden="true"><i></i><i></i><i></i></span>'
};

/* Builds the "Live project" cards shown inside a playbook */
function renderWork(list, help) {
  if (!modalWork) return;
  modalWork.hidden = !list || !list.length;
  if (modalWork.hidden) { modalWork.replaceChildren(); return; }
  const label = document.createElement("p");
  label.className = "eyebrow";
  label.textContent = list.length > 1 ? "Live projects" : "Live project";
  const cards = list.map(w => {
    const card = document.createElement("div");
    card.className = "work-item";
    // A project page on this site opens in the same tab; outside links open a new tab
    const link = w.page || w.url || w.code;
    const sameTab = Boolean(w.page);
    const setLink = el => {
      el.href = link;
      if (!sameTab) { el.target = "_blank"; el.rel = "noopener"; }
    };
    const thumb = document.createElement("a");
    thumb.className = "work-thumb";
    setLink(thumb);
    thumb.setAttribute("aria-label", w.cta ? `${w.title}: ${w.cta.replace(/ [→↗]$/, "")}` : w.page ? `Download and install ${w.title}` : w.url ? `Open ${w.title} live demo` : `Open ${w.title} on GitHub`);
    thumb.innerHTML = workThumbs[w.thumb] || "";
    if (w.thumb) thumb.classList.add(`work-thumb-${w.thumb}`);
    const type = document.createElement("p");
    type.className = "project-type";
    type.textContent = w.type;
    const h = document.createElement("h3");
    h.textContent = w.title;
    const d = document.createElement("p");
    d.className = "work-desc";
    d.textContent = w.desc;
    const actions = document.createElement("div");
    actions.className = "work-actions";
    const main = document.createElement("a");
    main.className = "btn btn-primary";
    setLink(main);
    main.textContent = w.cta || (w.page ? "Download & install →" : w.url ? "Live demo ↗" : "View on GitHub ↗");
    actions.append(main);
    // A project with its own page can also link straight to its live demo
    if (w.page && w.url) {
      const demo = document.createElement("a");
      demo.className = "project-open"; demo.href = w.url; demo.target = "_blank"; demo.rel = "noopener";
      demo.textContent = "Live demo ↗";
      actions.append(demo);
    }
    if (w.code && link !== w.code) {
      const code = document.createElement("a");
      code.className = "project-open"; code.href = w.code; code.target = "_blank"; code.rel = "noopener";
      code.textContent = "View code";
      actions.append(code);
    }
    const info = document.createElement("div");
    info.className = "work-info";
    info.append(type, h, d, actions);
    card.append(thumb, info);
    return card;
  });
  // Optional help line under the cards (e.g. the Safari setup guide)
  const extra = [];
  if (help) {
    const line = document.createElement("p");
    line.className = "work-help";
    const a = document.createElement("a");
    a.href = help.href;
    a.textContent = help.link;
    line.append(`${help.text} `, a);
    extra.push(line);
  }
  modalWork.replaceChildren(label, ...cards, ...extra);
}
const modalClose = document.getElementById("modalClose");
let lastFocus = null;

function openModal(key) {
  const p = playbooks[key];
  if (!p) return;
  modalType.textContent = `Playbook · ${p.type}`;
  modalTitle.textContent = p.title;
  modalText.textContent = p.text;
  renderWork(p.work, p.help);
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

/* ---------- newsletter popup: opens once at 50% scroll ---------- */
(() => {
  const pop = document.getElementById("nlPop");
  if (!pop) return;
  const nlForm = document.getElementById("nlForm");
  const nlNote = document.getElementById("nlNote");
  const nlBody = pop.querySelector(".nl-body");
  const nlDone = document.getElementById("nlDone");
  const nlEmail = nlForm.querySelector('input[type="email"]');
  const nlBtn = nlForm.querySelector('button[type="submit"]');
  const defaultNote = nlNote.textContent;
  const KEY_SUBSCRIBED = "nl:subscribed";
  const KEY_DISMISSED = "nl:dismissedAt";
  const SNOOZE_DAYS = 7; // after "No thanks", stay quiet for a week

  // localStorage can be blocked (private mode etc.); the popup then just won't remember
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } }
  };
  const track = (name, params) => { if (typeof gtag === "function") gtag("event", name, params); };

  function snoozed() {
    if (store.get(KEY_SUBSCRIBED)) return true;
    const at = Number(store.get(KEY_DISMISSED));
    return at > 0 && Date.now() - at < SNOOZE_DAYS * 864e5;
  }

  let lastFocus = null;

  function openPop() {
    window.removeEventListener("scroll", checkScroll);
    lastFocus = document.activeElement;
    pop.classList.add("open");
    pop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => nlEmail.focus({ preventScroll: true }), 80);
    track("newsletter_popup_view");
  }

  function closePop() {
    if (!pop.classList.contains("open")) return;
    pop.classList.remove("open");
    pop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (!store.get(KEY_SUBSCRIBED)) store.set(KEY_DISMISSED, String(Date.now()));
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  function checkScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0 || window.scrollY / max < 0.5) return;
    // never stack on top of the playbook modal; try again on the next scroll after it closes
    if (modal.classList.contains("open")) return;
    openPop();
  }

  if (!snoozed()) window.addEventListener("scroll", checkScroll, { passive: true });

  pop.querySelectorAll("[data-nl-close]").forEach(el => el.addEventListener("click", closePop));
  document.addEventListener("keydown", e => {
    if (!pop.classList.contains("open")) return;
    if (e.key === "Escape") closePop();
    if (e.key === "Tab") { // keep keyboard focus inside the popup
      const items = [...pop.querySelectorAll("button, input:not([type=hidden])")].filter(el => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function setNote(text, isError = false) {
    nlNote.textContent = text;
    nlNote.classList.toggle("is-error", isError);
    nlForm.classList.toggle("has-error", isError);
  }

  async function subscribe(form = nlForm) {
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (data.success) return { ok: true };
      return { ok: false, msg: data.errors?.fields?.email?.[0] || "That didn’t work. Please check the email and try again." };
    } catch {
      return { ok: false, msg: "Couldn’t reach the server. Please try again in a moment." };
    }
  }

  nlForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (nlForm.classList.contains("is-loading")) return;
    if (!nlEmail.value.trim() || !nlEmail.checkValidity()) {
      setNote("Please enter a valid email address.", true);
      nlEmail.focus();
      return;
    }
    nlForm.classList.add("is-loading");
    nlBtn.setAttribute("aria-disabled", "true");
    setNote("Subscribing…");
    const result = await subscribe();
    nlForm.classList.remove("is-loading");
    nlBtn.removeAttribute("aria-disabled");
    if (!result.ok) { setNote(result.msg, true); return; }

    store.set(KEY_SUBSCRIBED, "1");
    nlBody.hidden = true;
    nlDone.hidden = false;
    nlDone.querySelector("button").focus({ preventScroll: true });
    track("sign_up", { method: "newsletter_popup" });
  });

  nlEmail.addEventListener("input", () => {
    if (nlNote.classList.contains("is-error")) setNote(defaultNote);
  });

  /* footer signup: same MailerLite form; subscribing here also stops the popup */
  const fnForm = document.getElementById("footerNlForm");
  if (fnForm) {
    const fnNote = document.getElementById("footerNlNote");
    const fnEmail = fnForm.querySelector('input[type="email"]');
    const fnDefault = fnNote.textContent;
    const setFn = (text, state = "") => {
      fnNote.textContent = text;
      fnNote.classList.toggle("is-error", state === "error");
      fnNote.classList.toggle("is-done", state === "done");
      fnForm.classList.toggle("has-error", state === "error");
    };
    fnForm.addEventListener("submit", async e => {
      e.preventDefault();
      if (fnForm.classList.contains("is-loading")) return;
      if (!fnEmail.value.trim() || !fnEmail.checkValidity()) {
        setFn("Please enter a valid email address.", "error");
        fnEmail.focus();
        return;
      }
      fnForm.classList.add("is-loading");
      setFn("Subscribing…");
      const result = await subscribe(fnForm);
      fnForm.classList.remove("is-loading");
      if (!result.ok) { setFn(result.msg, "error"); return; }
      store.set(KEY_SUBSCRIBED, "1");
      window.removeEventListener("scroll", checkScroll);
      fnForm.hidden = true;
      setFn("You’re in. Check your inbox and tap the confirmation link.", "done");
      track("sign_up", { method: "newsletter_footer" });
    });
    fnEmail.addEventListener("input", () => {
      if (fnNote.classList.contains("is-error")) setFn(fnDefault);
    });
  }
})();

/* Coming back from a project page (…/#series) reopens that playbook */
if (location.hash === "#series") {
  document.getElementById("work")?.scrollIntoView();
  openModal("series");
}
