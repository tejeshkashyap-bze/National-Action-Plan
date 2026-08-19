/**
 * Design review overlay — click any element, leave a comment.
 *
 * Injected ONLY by review/server.mjs (npm run dev). It is never referenced by
 * the committed HTML, so it cannot reach the deployed site.
 *
 *   ⌖ button / press "r"   toggle pick mode
 *   click any element      attach a comment to it
 *   press "c"              open the comment panel
 *   Esc                    cancel
 *   Ctrl/Cmd + Enter       save the comment
 *
 * Comments are POSTed to the dev server and stored in review/comments.json.
 * Repo-agnostic: no assumptions about this site's markup or CSS.
 */
(() => {
  'use strict';

  if (window.__bzeReview) return;

  const API = '/__review';
  const HOST_ID = 'bze-review-root';
  const SS_KEY = 'bze-review-state';
  const NAME_KEY = 'bze-review-reviewer';

  const CATEGORIES = [
    ['layout', 'Layout'],
    ['type', 'Typography'],
    ['colour', 'Colour'],
    ['copy', 'Copy'],
    ['content', 'Content'],
    ['behaviour', 'Behaviour'],
    ['bug', 'Bug'],
    ['remove', 'Remove'],
    ['general', 'General'],
  ];

  /* ------------------------------------------------------------ state */

  const state = {
    picking: false,
    panelOpen: false,
    filterThisPage: true,
    filterReviewer: '', // '' = everyone
    comments: [],
    hovered: null,
    selected: null,
    composerOpen: false,
    connected: false,
    reviewer: '',
  };

  /* Reviewer identity — remembered per browser so it survives restarts. */
  function loadReviewer() {
    try {
      state.reviewer = localStorage.getItem(NAME_KEY) || '';
    } catch {
      state.reviewer = '';
    }
  }
  function saveReviewer(name) {
    state.reviewer = name.trim().slice(0, 80);
    try {
      localStorage.setItem(NAME_KEY, state.reviewer);
    } catch {
      /* ignore */
    }
  }

  const pageName = (() => {
    const p = location.pathname.replace(/^\/+/, '');
    return (p || 'index.html') + (location.search || '');
  })();

  const readSession = () => {
    try {
      return JSON.parse(sessionStorage.getItem(SS_KEY) || '{}');
    } catch {
      return {};
    }
  };
  const writeSession = () => {
    try {
      sessionStorage.setItem(
        SS_KEY,
        JSON.stringify({ picking: state.picking, panelOpen: state.panelOpen }),
      );
    } catch {
      /* ignore */
    }
  };

  /* --------------------------------------------------------- selectors */

  const isOurs = (el) => !!(el && el.closest && el.closest(`#${HOST_ID}`));

  function cssEscape(v) {
    return window.CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/([^\w-])/g, '\\$1');
  }

  function nthOfType(el) {
    let i = 1;
    let sib = el;
    while ((sib = sib.previousElementSibling)) {
      if (sib.tagName === el.tagName) i++;
    }
    return i;
  }

  function isUnique(sel) {
    try {
      return document.querySelectorAll(sel).length === 1;
    } catch {
      return false;
    }
  }

  /** Build a short-but-stable CSS selector for an element. */
  function buildSelector(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el === document.body) return 'body';

    if (el.id && isUnique(`#${cssEscape(el.id)}`)) return `#${cssEscape(el.id)}`;

    const parts = [];
    let node = el;

    while (node && node.nodeType === 1 && node !== document.documentElement) {
      const tag = node.tagName.toLowerCase();
      if (node.id && isUnique(`#${cssEscape(node.id)}`)) {
        parts.unshift(`#${cssEscape(node.id)}`);
        break;
      }

      let part = tag;
      const classes = (node.getAttribute('class') || '')
        .trim()
        .split(/\s+/)
        .filter((c) => c && !/^(is-|js-)/.test(c))
        .slice(0, 2);
      if (classes.length) part += `.${classes.map(cssEscape).join('.')}`;

      const parent = node.parentElement;
      if (parent) {
        const sameTag = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
        if (sameTag.length > 1) part += `:nth-of-type(${nthOfType(node)})`;
      }

      parts.unshift(part);

      const candidate = parts.join(' > ');
      if (isUnique(candidate)) return candidate;
      if (parts.length >= 6) break;
      node = parent;
    }

    return parts.join(' > ') || el.tagName.toLowerCase();
  }

  function ancestorTrail(el) {
    const trail = [];
    let node = el.parentElement;
    while (node && node !== document.body && trail.length < 4) {
      const cls = (node.getAttribute('class') || '').trim().split(/\s+/)[0];
      trail.unshift(node.tagName.toLowerCase() + (cls ? `.${cls}` : ''));
      node = node.parentElement;
    }
    return trail.join(' › ');
  }

  function styleHints(el) {
    const cs = getComputedStyle(el);
    const pick = [
      'display',
      'font-size',
      'font-weight',
      'line-height',
      'color',
      'background-color',
      'border-radius',
      'padding',
      'margin',
      'text-align',
    ];
    const out = {};
    for (const p of pick) out[p] = cs.getPropertyValue(p);
    return out;
  }

  function describe(el) {
    const rect = el.getBoundingClientRect();
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return {
      selector: buildSelector(el),
      tag: el.tagName.toLowerCase(),
      elementId: el.id || '',
      classes: (el.getAttribute('class') || '').trim(),
      text: text.slice(0, 300),
      html: el.outerHTML.replace(/\s+/g, ' ').slice(0, 1200),
      ancestors: ancestorTrail(el),
      rect: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        w: rect.width,
        h: rect.height,
      },
      styleHints: styleHints(el),
    };
  }

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[ch]);

  const shortLabel = (t) => {
    const cls = t.classes ? `.${t.classes.split(/\s+/).slice(0, 2).join('.')}` : '';
    return `${t.tag}${t.elementId ? `#${t.elementId}` : ''}${cls}`;
  };

  /* ------------------------------------------------------------- shell */

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.setAttribute('data-bze-review', '');
  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
<style>
  :host{ all: initial; }
  *{ box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

  .layer{
    position: fixed; inset: 0; z-index: 2147483000;
    pointer-events: none;
    color: #0f2a3a;
  }
  .layer > *{ pointer-events: auto; }

  /* ---------- highlight ---------- */
  .hi{
    position: fixed; pointer-events: none;
    border: 2px solid #1f6fa7;
    border-radius: 6px;
    background: rgba(31,111,167,.10);
    box-shadow: 0 0 0 1px rgba(255,255,255,.7), 0 8px 24px rgba(15,42,58,.16);
    transition: all 60ms linear;
    display: none;
  }
  .hi.sel{ border-color: #b8860b; border-style: dashed; background: rgba(184,134,11,.10); }
  .hi .tag{
    position: absolute; left: -2px; top: -24px;
    background: #1f6fa7; color: #fff;
    font-size: 11px; font-weight: 600; letter-spacing: .01em;
    padding: 3px 7px; border-radius: 5px; white-space: nowrap;
    max-width: 62vw; overflow: hidden; text-overflow: ellipsis;
  }
  .hi.sel .tag{ background: #b8860b; }
  .hi .dims{
    position: absolute; right: -2px; bottom: -22px;
    background: rgba(15,42,58,.86); color: #fff;
    font-size: 10px; padding: 2px 6px; border-radius: 5px; white-space: nowrap;
  }

  /* ---------- crosshair banner ---------- */
  .banner{
    position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
    background: #0f2a3a; color: #fff;
    font-size: 12.5px; font-weight: 500;
    padding: 8px 14px; border-radius: 999px;
    box-shadow: 0 10px 30px rgba(15,42,58,.3);
    display: none; align-items: center; gap: 10px;
    pointer-events: none; /* must not block picking elements underneath it */
  }
  .banner.on{ display: flex; }
  .banner kbd{
    background: rgba(255,255,255,.16); border-radius: 4px;
    padding: 1px 5px; font-size: 11px; font-family: ui-monospace, monospace;
  }

  /* ---------- pins ---------- */
  .pin{
    position: absolute;
    width: 22px; height: 22px; margin: -11px 0 0 -11px;
    border-radius: 999px;
    background: #b8860b; color: #fff;
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff;
    box-shadow: 0 3px 10px rgba(15,42,58,.35);
    cursor: pointer;
  }
  .pin.done{ background: #1e7e34; }
  .pinLayer{ position: absolute; inset: 0; pointer-events: none; }
  .pinLayer > *{ pointer-events: auto; }
  /* while picking, pins must not shadow the element they're attached to */
  .pinLayer.picking > *{ pointer-events: none; opacity: .55; }

  /* ---------- launcher ---------- */
  .fab{
    position: fixed; right: 18px; bottom: 18px;
    display: flex; gap: 8px; align-items: center;
    transition: transform 200ms cubic-bezier(.22,.61,.36,1);
  }
  /* keep the launcher clear of the panel when it's open */
  .fab.shifted{ transform: translateX(calc(-1 * min(384px, 92vw) - 10px)); }
  /* on narrow screens the panel is nearly full-width — hide the launcher instead of pushing it off-screen */
  @media (max-width: 620px){
    .fab.shifted{ transform: none; opacity: 0; pointer-events: none; }
  }
  button{
    font: inherit; cursor: pointer; border: 0; background: none; color: inherit;
  }
  .fabBtn{
    height: 44px; padding: 0 16px;
    border-radius: 999px;
    background: #1f6fa7; color: #fff;
    font-size: 13.5px; font-weight: 650;
    display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 24px rgba(31,111,167,.35);
    transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
  }
  .fabBtn:hover{ transform: translateY(-1px); box-shadow: 0 12px 30px rgba(31,111,167,.45); }
  .fabBtn.on{ background: #b8860b; box-shadow: 0 8px 24px rgba(184,134,11,.4); }
  .fabBtn.ghost{
    background: #fff; color: #1f6fa7;
    box-shadow: 0 6px 20px rgba(15,42,58,.16);
    border: 1px solid #cfdce6;
    height: 44px; width: 44px; padding: 0; justify-content: center;
  }
  .badge{
    min-width: 20px; height: 20px; padding: 0 6px;
    border-radius: 999px; background: rgba(255,255,255,.22);
    font-size: 11px; font-weight: 700;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .fabBtn.ghost .badge{ background: #eef6fb; color: #1f6fa7; }

  /* ---------- composer ---------- */
  .composer{
    position: absolute; width: 340px;
    background: #fff; border: 1px solid #cfdce6; border-radius: 14px;
    box-shadow: 0 24px 60px rgba(15,42,58,.28);
    padding: 14px; display: none;
  }
  .composer.on{ display: block; }
  .cTarget{
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px; color: #1f6fa7;
    background: #eef6fb; border: 1px solid #dbe8f2; border-radius: 8px;
    padding: 6px 8px; margin-bottom: 4px;
    overflow-wrap: anywhere;
  }
  .cText{
    font-size: 11.5px; color: #5a7486; margin: 0 0 10px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  textarea{
    width: 100%; min-height: 84px; resize: vertical;
    border: 1px solid #cfdce6; border-radius: 10px; padding: 9px 10px;
    font-size: 13.5px; line-height: 1.45; color: #0f2a3a;
    background: #fff;
  }
  textarea:focus, select:focus, input:focus, .chip:focus-visible, button:focus-visible{
    outline: 2px solid #1f6fa7; outline-offset: 1px;
  }
  input[type="text"]{
    width: 100%; border: 1px solid #cfdce6; border-radius: 9px;
    padding: 7px 9px; font-size: 13px; color: #0f2a3a; background: #fff;
  }
  .nameRow{ display: none; margin-bottom: 9px; }
  .nameRow.on{ display: block; }
  .nameRow label{
    display: block; font-size: 11px; font-weight: 600; color: #5a7486;
    margin-bottom: 4px;
  }
  .chips{ display: flex; flex-wrap: wrap; gap: 5px; margin: 9px 0; }
  .chip{
    font-size: 11.5px; padding: 4px 9px; border-radius: 999px;
    border: 1px solid #cfdce6; background: #f7fbff; color: #5a7486;
  }
  .chip[aria-pressed="true"]{ background: #1f6fa7; border-color: #1f6fa7; color: #fff; font-weight: 600; }
  .row{ display: flex; align-items: center; gap: 8px; }
  .spacer{ flex: 1; }
  select{
    font-size: 12px; padding: 5px 7px; border-radius: 8px;
    border: 1px solid #cfdce6; background: #fff; color: #0f2a3a;
  }
  .primary{
    background: #1f6fa7; color: #fff; font-size: 13px; font-weight: 650;
    padding: 8px 14px; border-radius: 9px;
  }
  .primary:disabled{ opacity: .45; cursor: not-allowed; }
  .subtle{
    font-size: 12.5px; color: #5a7486; padding: 8px 10px; border-radius: 9px;
  }
  .subtle:hover{ background: #eef6fb; }
  .hintKeys{ font-size: 10.5px; color: #8aa2b1; margin-top: 8px; }

  /* ---------- panel ---------- */
  .panel{
    position: fixed; top: 0; right: 0; bottom: 0; width: 384px; max-width: 92vw;
    background: #fff; border-left: 1px solid #cfdce6;
    box-shadow: -18px 0 48px rgba(15,42,58,.16);
    display: flex; flex-direction: column;
    transform: translateX(100%); transition: transform 200ms cubic-bezier(.22,.61,.36,1);
  }
  .panel.on{ transform: none; }
  .pHead{ padding: 14px 14px 10px; border-bottom: 1px solid #e6eef5; }
  .pTitle{ display: flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 700; }
  .dot{ width: 7px; height: 7px; border-radius: 999px; background: #c0392b; }
  .dot.live{ background: #1e7e34; }
  .pSub{ font-size: 11.5px; color: #5a7486; margin-top: 3px; }
  .whoRow{
    display: flex; align-items: center; gap: 6px; margin-top: 8px;
    font-size: 11.5px; color: #5a7486;
  }
  .whoName{ font-weight: 650; color: #0f2a3a; }
  .segs{ display: flex; gap: 4px; margin-top: 8px; }
  .filterWho{ width: 100%; margin-top: 6px; font-size: 11.5px; }
  .seg{
    flex: 1; font-size: 11.5px; padding: 5px 8px; border-radius: 8px;
    border: 1px solid #cfdce6; background: #f7fbff; color: #5a7486;
  }
  .seg[aria-pressed="true"]{ background: #0f2a3a; border-color: #0f2a3a; color: #fff; font-weight: 600; }

  .list{ flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .empty{ color: #8aa2b1; font-size: 12.5px; text-align: center; padding: 32px 18px; line-height: 1.6; }

  .item{
    border: 1px solid #e0eaf2; border-radius: 11px; padding: 10px;
    background: #fff; transition: border-color 120ms ease, box-shadow 120ms ease;
  }
  .item:hover{ border-color: #b9d3e6; box-shadow: 0 6px 18px rgba(15,42,58,.07); }
  .item.done{ opacity: .58; }
  .iTop{ display: flex; align-items: center; gap: 7px; font-size: 11px; color: #5a7486; flex-wrap: wrap; }
  .who{ background: #f0ece0; color: #7a6320; border-radius: 5px; padding: 1px 6px; font-weight: 600; }
  .scratchTag{ background: #ede4f7; color: #6b3fa0; border-radius: 5px; padding: 1px 6px; font-weight: 600; }
  .seq{
    width: 19px; height: 19px; border-radius: 999px; background: #b8860b; color: #fff;
    font-size: 10.5px; font-weight: 700;
    display: inline-flex; align-items: center; justify-content: center; flex: none;
  }
  .item.done .seq{ background: #1e7e34; }
  .cat{ background: #eef6fb; color: #1f6fa7; border-radius: 5px; padding: 1px 6px; font-weight: 600; }
  .prio-high{ color: #c0392b; font-weight: 700; }
  .iBody{ font-size: 13px; line-height: 1.45; margin: 7px 0 6px; white-space: pre-wrap; overflow-wrap: anywhere; }
  .iSel{
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10.5px; color: #5a7486; overflow-wrap: anywhere;
  }
  .iActs{ display: flex; gap: 4px; margin-top: 8px; }
  .mini{
    font-size: 11px; padding: 3px 8px; border-radius: 7px;
    border: 1px solid #cfdce6; background: #f7fbff; color: #5a7486;
  }
  .mini:hover{ background: #eef6fb; color: #1f6fa7; }
  .mini.danger:hover{ background: #fdecea; color: #c0392b; border-color: #f0c2bc; }
  .xpage{ font-size: 10.5px; color: #8aa2b1; }

  .pFoot{ border-top: 1px solid #e6eef5; padding: 10px 12px; display: flex; gap: 8px; align-items: center; }
  .clearBtn{
    font-size: 12px; font-weight: 650; padding: 8px 12px; border-radius: 9px;
    border: 1px solid #f0c2bc; background: #fdecea; color: #c0392b;
  }
  .clearBtn:hover{ background: #c0392b; color: #fff; border-color: #c0392b; }
  .clearBtn:disabled{ opacity: .45; cursor: not-allowed; }
  .confirm{
    background: #fdecea; border: 1px solid #f0c2bc; border-radius: 10px;
    padding: 10px; font-size: 12px; color: #7b2018; display: none; margin: 0 12px 10px;
  }
  .confirm.on{ display: block; }
  .toast{
    position: fixed; left: 50%; bottom: 78px; transform: translate(-50%, 14px);
    background: #0f2a3a; color: #fff; font-size: 12.5px;
    padding: 9px 15px; border-radius: 999px;
    box-shadow: 0 12px 32px rgba(15,42,58,.32);
    opacity: 0; transition: opacity 180ms ease, transform 180ms ease;
    pointer-events: none; /* never blocks a click on the page beneath */
  }
  .toast.on{ opacity: 1; transform: translate(-50%, 0); }
</style>

<div class="layer">
  <div class="pinLayer" id="pins"></div>
  <div class="hi" id="hi"><span class="tag" id="hiTag"></span><span class="dims" id="hiDims"></span></div>
  <div class="hi sel" id="hiSel"><span class="tag" id="hiSelTag"></span></div>

  <div class="banner" id="banner">
    <span>⌖ Pick mode — click any element to comment</span>
    <kbd>Esc</kbd><span>exit</span>
  </div>

  <div class="composer" id="composer" role="dialog" aria-label="Add review comment">
    <div class="cTarget" id="cTarget"></div>
    <p class="cText" id="cText"></p>
    <div class="nameRow" id="nameRow">
      <label for="cName">Your name (saved for next time)</label>
      <input type="text" id="cName" maxlength="80" placeholder="Who's reviewing?" />
    </div>
    <textarea id="cInput" placeholder="What should change here?" aria-label="Comment"></textarea>
    <div class="chips" id="cChips"></div>
    <div class="row">
      <select id="cPrio" aria-label="Priority">
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="low">Low</option>
      </select>
      <span class="spacer"></span>
      <button class="subtle" id="cCancel">Cancel</button>
      <button class="primary" id="cSave" disabled>Add comment</button>
    </div>
    <div class="hintKeys">Ctrl/⌘ + Enter to save · Esc to cancel</div>
  </div>

  <div class="panel" id="panel" aria-label="Review comments">
    <div class="pHead">
      <div class="pTitle"><span class="dot" id="conn"></span> Design review <span class="spacer"></span>
        <button class="mini" id="pClose" title="Close panel">✕</button>
      </div>
      <div class="pSub" id="pSub">review/comments.json</div>
      <div class="whoRow">
        <span id="whoStatic">Reviewing as <span class="whoName" id="whoName">—</span></span>
        <input type="text" id="whoInput" maxlength="80" placeholder="Your name" hidden />
        <button class="mini" id="whoEdit">change</button>
        <span class="spacer"></span>
        <button class="mini" id="refreshBtn" title="Re-read comments.json">↻</button>
      </div>
      <div class="segs">
        <button class="seg" id="segPage" aria-pressed="true">This page</button>
        <button class="seg" id="segAll" aria-pressed="false">All pages</button>
      </div>
      <select class="filterWho" id="filterWho" aria-label="Filter by reviewer">
        <option value="">Everyone</option>
      </select>
    </div>
    <div class="list" id="list"></div>
    <div class="confirm" id="confirm">
      <strong>Clear all comments?</strong><br>
      They'll be archived to <code>review/archive/</code> first, then the file is emptied.
      <div class="row" style="margin-top:9px">
        <span class="spacer"></span>
        <button class="mini" id="confirmNo">Cancel</button>
        <button class="clearBtn" id="confirmYes">Archive &amp; clear</button>
      </div>
    </div>
    <div class="pFoot">
      <button class="mini" id="copyBtn" title="Copy all comments as markdown">Copy for Claude</button>
      <span class="spacer"></span>
      <button class="clearBtn" id="clearBtn">Clear</button>
    </div>
  </div>

  <div class="fab">
    <button class="fabBtn ghost" id="listBtn" title="Open review panel (comments)">
      <span aria-hidden="true">☰</span><span class="badge" id="countBadge">0</span>
    </button>
    <button class="fabBtn" id="pickBtn" title='Toggle pick mode (shortcut: r)'>
      <span aria-hidden="true">⌖</span> Review
    </button>
  </div>

  <div class="toast" id="toast"></div>
</div>`;

  const $ = (id) => shadow.getElementById(id);
  const el = {
    hi: $('hi'),
    hiTag: $('hiTag'),
    hiDims: $('hiDims'),
    hiSel: $('hiSel'),
    hiSelTag: $('hiSelTag'),
    banner: $('banner'),
    composer: $('composer'),
    cTarget: $('cTarget'),
    cText: $('cText'),
    cInput: $('cInput'),
    cChips: $('cChips'),
    cPrio: $('cPrio'),
    cCancel: $('cCancel'),
    cSave: $('cSave'),
    nameRow: $('nameRow'),
    cName: $('cName'),
    panel: $('panel'),
    list: $('list'),
    pSub: $('pSub'),
    whoName: $('whoName'),
    whoStatic: $('whoStatic'),
    whoInput: $('whoInput'),
    whoEdit: $('whoEdit'),
    refreshBtn: $('refreshBtn'),
    filterWho: $('filterWho'),
    conn: $('conn'),
    segPage: $('segPage'),
    segAll: $('segAll'),
    pClose: $('pClose'),
    clearBtn: $('clearBtn'),
    confirm: $('confirm'),
    confirmYes: $('confirmYes'),
    confirmNo: $('confirmNo'),
    copyBtn: $('copyBtn'),
    pickBtn: $('pickBtn'),
    listBtn: $('listBtn'),
    countBadge: $('countBadge'),
    pins: $('pins'),
    toast: $('toast'),
  };

  let category = 'layout';
  for (const [value, label] of CATEGORIES) {
    const b = document.createElement('button');
    b.className = 'chip';
    b.type = 'button';
    b.textContent = label;
    b.dataset.value = value;
    b.setAttribute('aria-pressed', String(value === category));
    b.addEventListener('click', () => {
      category = value;
      for (const c of el.cChips.children) {
        c.setAttribute('aria-pressed', String(c.dataset.value === category));
      }
    });
    el.cChips.appendChild(b);
  }

  /* ---------------------------------------------------------- toasting */

  let toastTimer = null;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('on'), 2400);
  }

  /* --------------------------------------------------------------- api */

  async function api(path, options) {
    const res = await fetch(API + path, {
      headers: { 'content-type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  async function loadComments() {
    try {
      const store = await api('/comments');
      state.comments = store.comments || [];
      state.connected = true;
    } catch {
      state.connected = false;
    }
    render();
  }

  /* ------------------------------------------------------- highlighting */

  function placeHighlight(box, target, tagEl, dimsEl) {
    if (!target) {
      box.style.display = 'none';
      return;
    }
    const r = target.getBoundingClientRect();
    if (!r.width && !r.height) {
      box.style.display = 'none';
      return;
    }
    box.style.display = 'block';
    box.style.left = `${r.left}px`;
    box.style.top = `${r.top}px`;
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
    if (tagEl) tagEl.textContent = buildSelector(target);
    if (dimsEl) dimsEl.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
  }

  function refreshHighlights() {
    if (state.picking && state.hovered && !state.composerOpen) {
      placeHighlight(el.hi, state.hovered, el.hiTag, el.hiDims);
    } else {
      el.hi.style.display = 'none';
    }
    if (state.selected) {
      placeHighlight(el.hiSel, state.selected, el.hiSelTag, null);
    } else {
      el.hiSel.style.display = 'none';
    }
  }

  /* --------------------------------------------------------------- pins */

  function renderPins() {
    el.pins.innerHTML = '';
    if (!state.panelOpen && !state.picking) return;
    for (const c of state.comments) {
      if (c.page !== pageName) continue;
      let node = null;
      try {
        node = document.querySelector(c.target.selector);
      } catch {
        node = null;
      }
      if (!node) continue;
      const r = node.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      const pin = document.createElement('button');
      pin.className = `pin${c.status === 'done' ? ' done' : ''}`;
      pin.textContent = c.seq;
      pin.title = c.comment;
      pin.style.left = `${r.left + window.scrollX + 8}px`;
      pin.style.top = `${r.top + window.scrollY + 8}px`;
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        openPanel();
        const row = shadow.querySelector(`[data-cid="${c.id}"]`);
        if (row) {
          row.scrollIntoView({ block: 'center', behavior: 'smooth' });
          row.style.borderColor = '#b8860b';
          setTimeout(() => (row.style.borderColor = ''), 1200);
        }
      });
      el.pins.appendChild(pin);
    }
    // pinLayer is inside a fixed layer; offset it by scroll so pins track the page
    el.pins.style.transform = `translate(${-window.scrollX}px, ${-window.scrollY}px)`;
  }

  let rafPending = false;
  function scheduleReposition() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      refreshHighlights();
      renderPins();
      if (state.composerOpen && state.selected) positionComposer(state.selected);
    });
  }

  /* ----------------------------------------------------------- composer */

  /**
   * Place the composer beside the selected element: below → above → right →
   * left, first that fits. Falls back to a clamped position. Coordinates are
   * viewport-relative because .composer lives inside a position:fixed layer.
   */
  function positionComposer(target) {
    const r = target.getBoundingClientRect();
    const w = 340;
    const h = el.composer.offsetHeight || 300;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const M = 12; // margin from viewport edges
    const G = 10; // gap from the element
    const TOP_SAFE = 50; // keep clear of the pick-mode banner
    const panelW = state.panelOpen ? Math.min(384, vw * 0.92) : 0;
    const maxRight = vw - panelW - M;

    const fits = (l, t) => l >= M && l + w <= maxRight && t >= TOP_SAFE && t + h <= vh - M;
    const clampL = (l) => Math.min(Math.max(l, M), Math.max(M, maxRight - w));
    const clampT = (t) => Math.min(Math.max(t, TOP_SAFE), Math.max(TOP_SAFE, vh - h - M));

    const candidates = [
      [clampL(r.left), r.bottom + G], // below
      [clampL(r.left), r.top - h - G], // above
      [r.right + G, clampT(r.top)], // right
      [r.left - w - G, clampT(r.top)], // left
    ];

    let [left, top] = candidates.find(([l, t]) => fits(l, t)) || [
      clampL(r.left),
      clampT(r.bottom + G),
    ];

    el.composer.style.left = `${clampL(left)}px`;
    el.composer.style.top = `${clampT(top)}px`;
  }

  function openComposer(target) {
    state.selected = target;
    state.composerOpen = true;
    const info = describe(target);
    el.cTarget.textContent = info.selector;
    el.cText.textContent = info.text ? `“${info.text.slice(0, 90)}”` : `<${info.tag}> · ${info.ancestors}`;
    el.cText.title = info.text || '';
    el.cInput.value = '';
    el.cPrio.value = 'normal'; // priority resets each time; category stays sticky for batches
    el.cSave.disabled = true;

    // Ask for a name once, then remember it.
    const needsName = !state.reviewer;
    el.nameRow.classList.toggle('on', needsName);
    el.cName.value = state.reviewer;

    el.composer.classList.add('on');
    positionComposer(target);
    refreshHighlights();
    (needsName ? el.cName : el.cInput).focus();
  }

  function closeComposer() {
    state.composerOpen = false;
    state.selected = null;
    el.composer.classList.remove('on');
    refreshHighlights();
  }

  el.cInput.addEventListener('input', () => {
    el.cSave.disabled = !el.cInput.value.trim();
  });

  el.cInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveComment();
    }
  });

  el.cName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      el.cInput.focus();
    }
  });

  function commitName() {
    saveReviewer(el.whoInput.value);
    el.whoInput.hidden = true;
    el.whoStatic.hidden = false;
    el.whoEdit.textContent = 'change';
    render();
  }

  el.whoEdit.addEventListener('click', () => {
    if (el.whoInput.hidden) {
      el.whoInput.value = state.reviewer;
      el.whoInput.hidden = false;
      el.whoStatic.hidden = true;
      el.whoEdit.textContent = 'save';
      el.whoInput.focus();
      el.whoInput.select();
    } else {
      commitName();
    }
  });

  el.whoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitName();
    }
  });

  el.refreshBtn.addEventListener('click', async () => {
    await loadComments();
    toast('Reloaded review/comments.json');
  });

  el.filterWho.addEventListener('change', () => {
    state.filterReviewer = el.filterWho.value;
    render();
  });

  el.cCancel.addEventListener('click', closeComposer);

  async function saveComment() {
    const text = el.cInput.value.trim();
    if (!text || !state.selected) return;
    if (el.nameRow.classList.contains('on') && el.cName.value.trim()) saveReviewer(el.cName.value);
    el.cSave.disabled = true;
    const payload = {
      reviewer: state.reviewer,
      page: pageName,
      url: location.href,
      comment: text,
      category,
      priority: el.cPrio.value,
      target: describe(state.selected),
      viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
    };
    try {
      const { store } = await api('/comments', { method: 'POST', body: JSON.stringify(payload) });
      state.comments = store.comments;
      state.connected = true;
      closeComposer();
      openPanel();
      render();
      toast('Comment saved to review/comments.json');
    } catch (err) {
      el.cSave.disabled = false;
      toast(`Couldn't save: ${err.message}`);
    }
  }
  el.cSave.addEventListener('click', saveComment);

  /* ------------------------------------------------------- pick plumbing */

  function setPicking(on) {
    state.picking = on;
    el.pickBtn.classList.toggle('on', on);
    el.banner.classList.toggle('on', on);
    el.pins.classList.toggle('picking', on);
    document.documentElement.style.cursor = on ? 'crosshair' : '';
    if (!on) {
      state.hovered = null;
      closeComposer();
    }
    writeSession();
    refreshHighlights();
    renderPins();
  }

  document.addEventListener(
    'mousemove',
    (e) => {
      if (!state.picking || state.composerOpen) return;
      const t = e.target;
      if (!t || t.nodeType !== 1 || isOurs(t) || t === document.documentElement) return;
      if (state.hovered !== t) {
        state.hovered = t;
        refreshHighlights();
      }
    },
    true,
  );

  const swallow = (e) => {
    if (!state.picking) return;
    if (isOurs(e.target) || (e.composedPath && e.composedPath().includes(host))) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  for (const type of ['mousedown', 'mouseup', 'submit', 'dblclick']) {
    document.addEventListener(type, swallow, true);
  }

  document.addEventListener(
    'click',
    (e) => {
      if (!state.picking) return;
      if (isOurs(e.target) || (e.composedPath && e.composedPath().includes(host))) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const target = e.target;
      if (!target || target.nodeType !== 1) return;
      openComposer(target);
    },
    true,
  );

  document.addEventListener('keydown', (e) => {
    const inField =
      e.target &&
      (isOurs(e.target) ||
        /^(input|textarea|select)$/i.test(e.target.tagName) ||
        e.target.isContentEditable);

    if (e.key === 'Escape') {
      if (state.composerOpen) {
        closeComposer();
        return;
      }
      if (el.confirm.classList.contains('on')) {
        el.confirm.classList.remove('on');
        return;
      }
      if (state.picking) {
        setPicking(false);
        return;
      }
      if (state.panelOpen) closePanel();
      return;
    }
    if (inField) return;
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      setPicking(!state.picking);
    }
    if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      state.panelOpen ? closePanel() : openPanel();
    }
  });

  el.pickBtn.addEventListener('click', () => setPicking(!state.picking));
  el.listBtn.addEventListener('click', () => (state.panelOpen ? closePanel() : openPanel()));
  el.pClose.addEventListener('click', closePanel);

  function openPanel() {
    state.panelOpen = true;
    el.panel.classList.add('on');
    shadow.querySelector('.fab').classList.add('shifted');
    writeSession();
    render();
  }
  function closePanel() {
    state.panelOpen = false;
    el.panel.classList.remove('on');
    el.confirm.classList.remove('on');
    shadow.querySelector('.fab').classList.remove('shifted');
    writeSession();
    renderPins();
  }

  el.segPage.addEventListener('click', () => {
    state.filterThisPage = true;
    render();
  });
  el.segAll.addEventListener('click', () => {
    state.filterThisPage = false;
    render();
  });

  /* ------------------------------------------------------------- render */

  function render() {
    el.segPage.setAttribute('aria-pressed', String(state.filterThisPage));
    el.segAll.setAttribute('aria-pressed', String(!state.filterThisPage));
    el.conn.classList.toggle('live', state.connected);
    el.conn.title = state.connected ? 'Connected to dev server' : 'Dev server unreachable';
    el.whoName.textContent = state.reviewer || 'anonymous';

    const open = state.comments.filter((c) => c.status !== 'done').length;
    el.countBadge.textContent = String(open);
    el.pSub.textContent = state.connected
      ? `review/comments.json · ${state.comments.length} total · ${open} open`
      : 'dev server unreachable — comments not saving';

    // Reviewer filter options, rebuilt from whoever appears in the store.
    const reviewers = [...new Set(state.comments.map((c) => c.reviewer).filter(Boolean))].sort();
    if (state.filterReviewer && !reviewers.includes(state.filterReviewer)) state.filterReviewer = '';
    const wanted = ['', ...reviewers];
    const current = [...el.filterWho.options].map((o) => o.value);
    if (current.join('|') !== wanted.join('|')) {
      el.filterWho.innerHTML = '';
      for (const r of wanted) {
        const o = document.createElement('option');
        o.value = r;
        o.textContent = r || 'Everyone';
        el.filterWho.appendChild(o);
      }
    }
    el.filterWho.value = state.filterReviewer;
    el.filterWho.hidden = reviewers.length < 2;

    let shown = state.filterThisPage
      ? state.comments.filter((c) => c.page === pageName)
      : state.comments;
    if (state.filterReviewer) shown = shown.filter((c) => c.reviewer === state.filterReviewer);

    el.clearBtn.disabled = state.comments.length === 0;
    el.list.innerHTML = '';

    if (!shown.length) {
      const d = document.createElement('div');
      d.className = 'empty';
      d.innerHTML = state.filterThisPage
        ? 'No comments on this page yet.<br>Hit <b>Review</b> (or press <b>r</b>) and click something.'
        : 'No comments recorded yet.';
      el.list.appendChild(d);
      renderPins();
      return;
    }

    const sorted = [...shown].sort((a, b) => {
      if ((a.status === 'done') !== (b.status === 'done')) return a.status === 'done' ? 1 : -1;
      return b.seq - a.seq;
    });

    for (const c of sorted) {
      const item = document.createElement('div');
      item.className = `item${c.status === 'done' ? ' done' : ''}`;
      item.dataset.cid = c.id;

      const top = document.createElement('div');
      top.className = 'iTop';
      top.innerHTML =
        `<span class="seq">${c.seq}</span>` +
        `<span class="cat">${c.category}</span>` +
        (c.reviewer ? `<span class="who">${escapeHtml(c.reviewer)}</span>` : '') +
        (c.priority === 'high' ? '<span class="prio-high">high</span>' : '') +
        (/^scratch\//.test(c.page) ? '<span class="scratchTag">scratch</span>' : '') +
        (c.page !== pageName ? `<span class="xpage">${escapeHtml(c.page)}</span>` : '') +
        '<span class="spacer"></span>' +
        `<span class="xpage">${new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
      item.appendChild(top);

      const body = document.createElement('div');
      body.className = 'iBody';
      body.textContent = c.comment;
      item.appendChild(body);

      const sel = document.createElement('div');
      sel.className = 'iSel';
      sel.textContent = c.target.selector + (c.target.text ? ` — “${c.target.text.slice(0, 48)}”` : '');
      item.appendChild(sel);

      const acts = document.createElement('div');
      acts.className = 'iActs';

      const samePage = c.page === pageName;
      const jump = document.createElement('button');
      jump.className = 'mini';
      jump.textContent = samePage ? 'Show' : 'Open page';
      jump.addEventListener('click', () => {
        if (!samePage) {
          location.href = c.url || `/${c.page}`;
          return;
        }
        let node = null;
        try {
          node = document.querySelector(c.target.selector);
        } catch {
          node = null;
        }
        if (!node) {
          toast('Element not found — the page may have changed');
          return;
        }
        node.scrollIntoView({ block: 'center', behavior: 'smooth' });
        state.selected = node;
        refreshHighlights();
        setTimeout(() => {
          if (state.selected === node && !state.composerOpen) {
            state.selected = null;
            refreshHighlights();
          }
        }, 2200);
      });
      acts.appendChild(jump);

      const doneBtn = document.createElement('button');
      doneBtn.className = 'mini';
      doneBtn.textContent = c.status === 'done' ? 'Reopen' : 'Done';
      doneBtn.addEventListener('click', async () => {
        try {
          const { store } = await api(`/comments/${c.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: c.status === 'done' ? 'open' : 'done' }),
          });
          state.comments = store.comments;
          render();
        } catch (err) {
          toast(err.message);
        }
      });
      acts.appendChild(doneBtn);

      const spacer = document.createElement('span');
      spacer.className = 'spacer';
      acts.appendChild(spacer);

      const del = document.createElement('button');
      del.className = 'mini danger';
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        try {
          const { store } = await api(`/comments/${c.id}`, { method: 'DELETE' });
          state.comments = store.comments;
          render();
        } catch (err) {
          toast(err.message);
        }
      });
      acts.appendChild(del);

      item.appendChild(acts);
      el.list.appendChild(item);
    }

    renderPins();
  }

  /* --------------------------------------------------- clear / archive */

  el.clearBtn.addEventListener('click', () => el.confirm.classList.add('on'));
  el.confirmNo.addEventListener('click', () => el.confirm.classList.remove('on'));
  el.confirmYes.addEventListener('click', async () => {
    el.confirmYes.disabled = true;
    try {
      const result = await api('/clear', { method: 'POST' });
      state.comments = result.store.comments || [];
      el.confirm.classList.remove('on');
      render();
      toast(
        result.archived
          ? `Archived ${result.count} comment(s) → ${result.archived}`
          : 'Nothing to clear',
      );
    } catch (err) {
      toast(`Clear failed: ${err.message}`);
    } finally {
      el.confirmYes.disabled = false;
    }
  });

  el.copyBtn.addEventListener('click', async () => {
    if (!state.comments.length) {
      toast('No comments to copy');
      return;
    }
    const byPage = new Map();
    for (const c of state.comments) {
      if (!byPage.has(c.page)) byPage.set(c.page, []);
      byPage.get(c.page).push(c);
    }
    let md = '# Design review comments\n\n';
    for (const [page, list] of byPage) {
      md += `## ${page}\n\n`;
      for (const c of list.sort((a, b) => a.seq - b.seq)) {
        const who = c.reviewer ? ` — ${c.reviewer}` : '';
        md += `- **#${c.seq} [${c.category}${c.priority === 'high' ? '/high' : ''}]${who}** ${c.comment}\n`;
        md += `  - selector: \`${c.target.selector}\`\n`;
        if (c.target.text) md += `  - text: "${c.target.text.slice(0, 120)}"\n`;
        if (c.status === 'done') md += '  - status: done\n';
      }
      md += '\n';
    }
    try {
      await navigator.clipboard.writeText(md);
      toast('Copied as markdown');
    } catch {
      toast('Clipboard blocked — read review/comments.json instead');
    }
  });

  /* ---------------------------------------------------- live reload SSE */

  function connectSSE() {
    try {
      const es = new EventSource(`${API}/events`);
      es.addEventListener('reload', () => location.reload());
      // comments.json changed on disk (Claude actioned a batch, or a git pull)
      es.addEventListener('comments', () => loadComments());
      es.addEventListener('error', () => {
        /* EventSource retries on its own */
      });
    } catch {
      /* ignore */
    }
  }

  /* --------------------------------------------------------------- boot */

  function boot() {
    loadReviewer();
    document.documentElement.appendChild(host);
    window.addEventListener('scroll', scheduleReposition, { passive: true });
    window.addEventListener('resize', scheduleReposition);

    const saved = readSession();
    if (saved.panelOpen) openPanel();
    if (saved.picking) setPicking(true);

    loadComments().then(() => {
      // Re-pin after client-side rendering (data.js builds most pages).
      setTimeout(renderPins, 300);
      setTimeout(renderPins, 1200);
    });
    connectSSE();

    console.log(
      '%c⌖ BZE design review%c  press "r" to pick an element, "c" for the comment panel',
      'background:#1f6fa7;color:#fff;padding:2px 6px;border-radius:4px;font-weight:600',
      'color:#5a7486',
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.__bzeReview = { state, loadComments, setPicking, openPanel, closePanel };
})();
