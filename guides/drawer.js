/*
 * "Show me how" side panel for project pages.
 * Any link with class="howto" pointing at a guide opens that guide in a panel
 * that slides in from the right, so visitors never leave the page.
 * Without JavaScript the link still opens the full guide page.
 */
(() => {
  const css = `
    .howto { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 7px 14px; border-radius: 999px;
      background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff !important; font-weight: 700; font-size: .84rem;
      text-decoration: none; box-shadow: 0 6px 16px -8px rgba(236, 72, 153, .8); transition: transform .2s, filter .2s; }
    .howto:hover { transform: translateY(-1px); filter: brightness(1.08); }
    .gd-backdrop { position: fixed; inset: 0; z-index: 3000; background: rgba(17, 16, 20, .45); backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px); opacity: 0; visibility: hidden; transition: opacity .3s, visibility .3s; }
    .gd-panel { position: fixed; top: 0; right: 0; bottom: 0; z-index: 3001; width: min(560px, 100vw); display: flex; flex-direction: column;
      background: var(--paper, #f5f2ec); border-left: 1px solid var(--line, #ddd); box-shadow: -30px 0 60px -30px rgba(17, 16, 20, .4);
      transform: translateX(100%); transition: transform .4s cubic-bezier(.2, .8, .2, 1); }
    .gd-open .gd-backdrop { opacity: 1; visibility: visible; }
    .gd-open .gd-panel { transform: none; }
    .gd-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--line, #ddd); }
    .gd-head strong { font-size: 1rem; }
    .gd-head a { font-size: .85rem; font-weight: 700; color: var(--ink, #111); }
    .gd-close { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line, #ddd); background: var(--card, #fff);
      font-size: 1.1rem; cursor: pointer; }
    .gd-close:hover { background: var(--ink, #111); color: var(--paper, #fff); }
    .gd-panel iframe { flex: 1; width: 100%; border: 0; background: var(--paper, #f5f2ec); }
    html.gd-lock { overflow: hidden; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  let root, frame, full;
  function build() {
    if (root) return;
    root = document.createElement("div");
    root.innerHTML = `
      <div class="gd-backdrop"></div>
      <aside class="gd-panel" role="dialog" aria-modal="true" aria-label="Step-by-step guide">
        <div class="gd-head">
          <strong>Step-by-step guide</strong>
          <span style="display:flex;align-items:center;gap:14px">
            <a class="gd-full" target="_blank" rel="noopener">Open full page ↗</a>
            <button class="gd-close" type="button" aria-label="Close">✕</button>
          </span>
        </div>
        <iframe title="Guide"></iframe>
      </aside>`;
    document.body.append(root);
    frame = root.querySelector("iframe");
    full = root.querySelector(".gd-full");
    root.querySelector(".gd-backdrop").addEventListener("click", close);
    root.querySelector(".gd-close").addEventListener("click", close);
  }

  function open(href) {
    build();
    const url = new URL(href, location.href);
    full.href = url.href;
    url.searchParams.set("embed", "1");
    frame.src = url.href;
    document.documentElement.classList.add("gd-open", "gd-lock");
    setTimeout(() => root.querySelector(".gd-close").focus(), 350);
  }
  function close() {
    document.documentElement.classList.remove("gd-open", "gd-lock");
  }

  document.addEventListener("click", e => {
    const link = e.target.closest("a.howto");
    if (!link || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    open(link.href);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();
