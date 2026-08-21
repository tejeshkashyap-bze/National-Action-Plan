#!/usr/bin/env node
/**
 * Design-review dev server — static site + click-to-comment tooling.
 *
 * Zero dependencies (Node built-ins only, Node 18+). Nothing here is required
 * to deploy the site: production stays plain HTML/CSS/JS. Delete the review/
 * folder and package.json and the site is unchanged.
 *
 *   npm run dev                  → http://localhost:5173
 *   npm run dev -- --open        → and open a browser
 *   npm run dev -- --port 4000   → custom port
 *   npm run dev -- --no-review   → serve the site exactly as it deploys
 *   npm run review:show          → print current comments to stdout
 *   npm run review:normalise     → dedupe + renumber (run after a git merge)
 *
 * What it does:
 *   • serves the repo root as a static site
 *   • injects review/overlay.js into every HTML response (dev only)
 *   • live-reloads open tabs when a file changes
 *   • stores review comments in review/comments.json
 *   • "Clear" archives that file to review/archive/ then empties it
 *
 * Portable: this folder is repo-agnostic. Copy review/ + package.json into any
 * static-site repo and `npm run dev` serves that repo's root.
 */

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REVIEW_DIR = __dirname;
const ARCHIVE_DIR = path.join(REVIEW_DIR, 'archive');
const COMMENTS_FILE = path.join(REVIEW_DIR, 'comments.json');
const OVERLAY_FILE = path.join(REVIEW_DIR, 'overlay.js');

/* ------------------------------------------------------------------ args */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const REVIEW_ENABLED = !flag('--no-review');
const START_PORT = Number(opt('--port', process.env.PORT || 5173));
const HOST = opt('--host', '127.0.0.1');
const OPEN_BROWSER = flag('--open');

/** Project name comes from package.json so this folder stays repo-agnostic. */
const PROJECT = await (async () => {
  try {
    const pkg = JSON.parse(await fsp.readFile(path.join(ROOT, 'package.json'), 'utf8'));
    return pkg.name || path.basename(ROOT);
  } catch {
    return path.basename(ROOT);
  }
})();

/* ------------------------------------------------------- comments store */

const EMPTY_STORE = () => ({
  version: 1,
  project: PROJECT,
  updatedAt: new Date().toISOString(),
  comments: [],
});

async function ensureDirs() {
  await fsp.mkdir(ARCHIVE_DIR, { recursive: true });
}

async function readStore() {
  try {
    const raw = await fsp.readFile(COMMENTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.comments)) throw new Error('malformed');
    return parsed;
  } catch {
    return EMPTY_STORE();
  }
}

let writeQueue = Promise.resolve();
function writeStore(store) {
  store.updatedAt = new Date().toISOString();
  // Serialise writes so concurrent requests can't interleave.
  writeQueue = writeQueue.then(async () => {
    await ensureDirs();
    const tmp = `${COMMENTS_FILE}.tmp`;
    await fsp.writeFile(tmp, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
    await fsp.rename(tmp, COMMENTS_FILE);
  });
  return writeQueue;
}

function timestampSlug(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
    `_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`
  );
}

async function archiveAndClear() {
  const store = await readStore();
  await ensureDirs();

  let archivedTo = null;
  if (store.comments.length > 0) {
    const name = `comments-${timestampSlug()}.json`;
    archivedTo = path.join(ARCHIVE_DIR, name);
    const payload = { ...store, archivedAt: new Date().toISOString() };
    await fsp.writeFile(archivedTo, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  }

  const fresh = EMPTY_STORE();
  await writeStore(fresh);

  return {
    archived: archivedTo ? path.relative(ROOT, archivedTo).split(path.sep).join('/') : null,
    count: store.comments.length,
    store: fresh,
  };
}

/* ------------------------------------------------------ CLI-only modes */

if (flag('--print-comments')) {
  const store = await readStore();
  if (!store.comments.length) {
    console.log('No review comments yet.');
  } else {
    console.log(`${store.comments.length} comment(s), last updated ${store.updatedAt}\n`);
    for (const c of store.comments) {
      const who = c.reviewer ? ` — ${c.reviewer}` : '';
      console.log(`#${c.seq ?? '?'} [${c.status}] ${c.page}  ${c.category}/${c.priority}${who}`);
      console.log(`    selector: ${c.target?.selector}`);
      if (c.target?.text) console.log(`    text:     ${JSON.stringify(c.target.text.slice(0, 90))}`);
      console.log(`    comment:  ${c.comment}\n`);
    }
  }
  process.exit(0);
}

/**
 * comments.json is committed to git, so two reviewers on separate branches can
 * end up with duplicate `seq` numbers or a duplicated entry after a merge.
 * `id` is the real key; this renumbers `seq` in chronological order and drops
 * exact duplicates. Run it after resolving a merge conflict.
 */
if (flag('--normalise') || flag('--normalize')) {
  const store = await readStore();
  const before = store.comments.length;

  const seen = new Set();
  const unique = [];
  for (const c of store.comments) {
    const key = c.id || `${c.createdAt}|${c.comment}|${c.target?.selector}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(c);
  }

  unique.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  unique.forEach((c, i) => {
    c.seq = i + 1;
  });

  store.comments = unique;
  await writeStore(store);
  console.log(
    `Normalised review/comments.json — ${before} → ${unique.length} comment(s), renumbered #1–#${unique.length}.`,
  );
  process.exit(0);
}

/* -------------------------------------------------------------- static */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const INJECT_TAG =
  '\n<!-- design-cycle review tooling (dev server only, never deployed) -->\n' +
  '<script src="/__review/overlay.js" defer></script>\n';

/** Ribbon stamped onto scratch concepts so they're never mistaken for the real site. */
const SCRATCH_RIBBON = `
<style>
  .__scratchRibbon{
    position: fixed; left: 0; top: 0; z-index: 2147482000;
    display: flex; align-items: center; gap: 8px;
    background: #6b3fa0; color: #fff;
    font: 600 11px/1 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: .04em; text-transform: uppercase;
    padding: 6px 12px; border-bottom-right-radius: 10px;
    box-shadow: 0 4px 14px rgba(0,0,0,.18);
  }
  .__scratchRibbon a{ color: #e6d9f7; text-decoration: none; text-transform: none; letter-spacing: 0; }
  .__scratchRibbon a:hover{ text-decoration: underline; }
</style>
<div class="__scratchRibbon">Scratch concept — not deployed <a href="/scratch/">← all concepts</a></div>
`;

function injectBefore(html, snippet) {
  if (/<\/body\s*>/i.test(html)) return html.replace(/<\/body\s*>/i, `${snippet}</body>`);
  if (/<\/html\s*>/i.test(html)) return html.replace(/<\/html\s*>/i, `${snippet}</html>`);
  return html + snippet;
}

/**
 * @param {string} html
 * @param {{scratch?: boolean, embed?: boolean}} [o] embed = rendered inside a
 *   compare iframe, where a nested overlay would just be noise.
 */
function injectOverlay(html, o = {}) {
  let out = html;
  if (o.scratch && !o.embed) out = injectBefore(out, SCRATCH_RIBBON);
  if (!REVIEW_ENABLED || o.embed) return out;
  return injectBefore(out, INJECT_TAG);
}

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const resolved = path.resolve(root, `.${path.posix.normalize(decoded)}`);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

/* ---------------------------------------------------------- live reload */

const sseClients = new Set();

function broadcast(event, data = {}) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch {
      sseClients.delete(res);
    }
  }
}

const IGNORED = /(^|[\\/])(\.git|node_modules|review[\\/]archive)([\\/]|$)/;
const ASSET_RE = /\.(html?|css|js|mjs|png|jpe?g|svg|webp|gif)$/i;
let reloadTimer = null;
let commentsTimer = null;

function onFileChange(filename) {
  if (!filename) return;
  const f = String(filename);
  if (IGNORED.test(f)) return;

  // comments.json is handled by watchComments() below — fs.watch misses some of
  // its atomic rewrites, so it gets an mtime poll instead of a reload.
  if (f.endsWith('comments.json') || f.endsWith('comments.json.tmp')) return;
  if (!ASSET_RE.test(f)) return;

  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    console.log(`  ↻ changed: ${f} — reloading ${sseClients.size} tab(s)`);
    broadcast('reload', { file: f });
  }, 120);
}

function watchFiles() {
  // Recursive fs.watch works on Windows and macOS everywhere, and on Linux
  // from Node 20. Fall back to watching the top level plus review/, which is
  // all a flat static site needs.
  try {
    fs.watch(ROOT, { recursive: true }, (_type, filename) => onFileChange(filename));
    return;
  } catch (err) {
    console.warn(`  (recursive watch unavailable: ${err.code || err.message} — using flat watch)`);
  }

  for (const dir of [ROOT, REVIEW_DIR]) {
    try {
      fs.watch(dir, (_type, filename) => {
        if (!filename) return;
        const rel = path.relative(ROOT, path.join(dir, String(filename)));
        onFileChange(rel);
      });
    } catch (err) {
      console.warn(`  (cannot watch ${path.relative(ROOT, dir) || '.'}: ${err.message})`);
    }
  }
}

/**
 * Poll comments.json's mtime and tell open tabs to re-fetch when it changes —
 * so a colleague's `git pull`, or Claude marking a batch done, shows up without
 * a manual refresh. Polling rather than fs.watch because the store is written
 * via write-tmp-then-rename, which the recursive watcher reports inconsistently
 * across platforms.
 */
function watchComments() {
  let last = -1;
  const tick = async () => {
    if (!sseClients.size) return;
    let mtime = 0;
    try {
      mtime = (await fsp.stat(COMMENTS_FILE)).mtimeMs;
    } catch {
      mtime = 0; // file absent — treat as a change once
    }
    if (last === -1) {
      last = mtime;
      return;
    }
    if (mtime !== last) {
      last = mtime;
      broadcast('comments', {});
    }
  };
  const timer = setInterval(tick, 1000);
  timer.unref?.();
}

function openBrowser(url) {
  const cmd =
    process.platform === 'win32' ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  try {
    spawn(cmd, args, { stdio: 'ignore', detached: true }).unref();
  } catch {
    /* not fatal — the URL is printed anyway */
  }
}

/* ------------------------------------------------------------- helpers */

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(data),
    'cache-control': 'no-store',
  });
  res.end(data);
}

function readBody(req, limit = 2_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const str = (v, max = 4000) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v) => (Number.isFinite(v) ? Math.round(v * 100) / 100 : null);

function normaliseIncoming(body, store) {
  const seq = (store.comments.reduce((m, c) => Math.max(m, c.seq || 0), 0) || 0) + 1;
  const t = body.target || {};
  return {
    id: `c${Date.now().toString(36)}${Math.floor(seq).toString(36)}`,
    seq,
    createdAt: new Date().toISOString(),
    status: 'open',
    reviewer: str(body.reviewer, 80),
    page: str(body.page, 200) || 'unknown',
    url: str(body.url, 500),
    category: str(body.category, 40) || 'general',
    priority: ['low', 'normal', 'high'].includes(body.priority) ? body.priority : 'normal',
    comment: str(body.comment, 4000),
    target: {
      selector: str(t.selector, 1000),
      tag: str(t.tag, 40),
      elementId: str(t.elementId, 200),
      classes: str(t.classes, 400),
      text: str(t.text, 600),
      html: str(t.html, 1500),
      ancestors: str(t.ancestors, 600),
      rect: t.rect
        ? { x: num(t.rect.x), y: num(t.rect.y), w: num(t.rect.w), h: num(t.rect.h) }
        : null,
      styleHints: t.styleHints && typeof t.styleHints === 'object' ? t.styleHints : null,
    },
    viewport: body.viewport && typeof body.viewport === 'object'
      ? { w: num(body.viewport.w), h: num(body.viewport.h), dpr: num(body.viewport.dpr) }
      : null,
  };
}

/* -------------------------------------------------------------- routing */

async function handleApi(req, res, url) {
  const route = url.pathname.replace(/^\/__review/, '') || '/';

  if (route === '/overlay.js') {
    try {
      const js = await fsp.readFile(OVERLAY_FILE);
      res.writeHead(200, {
        'content-type': 'text/javascript; charset=utf-8',
        'cache-control': 'no-store',
      });
      res.end(js);
    } catch {
      res.writeHead(404).end('overlay.js missing');
    }
    return true;
  }

  if (route === '/events') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
      connection: 'keep-alive',
    });
    res.write('retry: 1000\n\n');
    sseClients.add(res);
    const ping = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        /* ignore */
      }
    }, 25_000);
    req.on('close', () => {
      clearInterval(ping);
      sseClients.delete(res);
    });
    return true;
  }

  if (route === '/comments' && req.method === 'GET') {
    sendJson(res, 200, await readStore());
    return true;
  }

  if (route === '/comments' && req.method === 'POST') {
    const body = JSON.parse((await readBody(req)) || '{}');
    if (!str(body.comment).trim()) {
      sendJson(res, 400, { error: 'comment is required' });
      return true;
    }
    const store = await readStore();
    const comment = normaliseIncoming(body, store);
    store.comments.push(comment);
    await writeStore(store);
    console.log(`  ✎ #${comment.seq} ${comment.page} → ${comment.target.selector}`);
    sendJson(res, 201, { comment, store });
    return true;
  }

  const idMatch = route.match(/^\/comments\/([\w-]+)$/);
  if (idMatch && (req.method === 'PATCH' || req.method === 'DELETE')) {
    const store = await readStore();
    const idx = store.comments.findIndex((c) => c.id === idMatch[1]);
    if (idx === -1) {
      sendJson(res, 404, { error: 'not found' });
      return true;
    }
    if (req.method === 'DELETE') {
      store.comments.splice(idx, 1);
    } else {
      const body = JSON.parse((await readBody(req)) || '{}');
      const c = store.comments[idx];
      if (typeof body.comment === 'string') c.comment = str(body.comment, 4000);
      if (['open', 'done'].includes(body.status)) c.status = body.status;
      if (['low', 'normal', 'high'].includes(body.priority)) c.priority = body.priority;
      if (typeof body.category === 'string') c.category = str(body.category, 40);
      c.updatedAt = new Date().toISOString();
    }
    await writeStore(store);
    sendJson(res, 200, { store });
    return true;
  }

  if (route === '/clear' && req.method === 'POST') {
    const result = await archiveAndClear();
    console.log(
      result.archived
        ? `  ⌫ cleared ${result.count} comment(s) → ${result.archived}`
        : '  ⌫ nothing to clear',
    );
    sendJson(res, 200, result);
    return true;
  }

  sendJson(res, 404, { error: `unknown review route: ${route}` });
  return true;
}

/* ------------------------------------------------------ scratch gallery */

const SCRATCH_DIR = path.join(ROOT, 'scratch');

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Read the concepts in scratch/, newest first, with title + note metadata. */
async function listConcepts() {
  let names = [];
  try {
    names = (await fsp.readdir(SCRATCH_DIR)).filter((n) => /\.html?$/i.test(n));
  } catch {
    return [];
  }

  const out = [];
  for (const name of names) {
    const full = path.join(SCRATCH_DIR, name);
    const [stat, raw] = await Promise.all([
      fsp.stat(full).catch(() => null),
      fsp.readFile(full, 'utf8').catch(() => ''),
    ]);
    if (!stat?.isFile()) continue;
    out.push({
      file: name,
      href: `/scratch/${encodeURIComponent(name)}`,
      title: (raw.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || name).trim(),
      // <!-- concept: one line about the idea --> and optional "replaces:"
      note: (raw.match(/<!--\s*concept:\s*([\s\S]*?)-->/i)?.[1] || '').trim(),
      replaces: (raw.match(/<!--\s*replaces:\s*([\s\S]*?)-->/i)?.[1] || '').trim(),
      mtime: stat.mtimeMs,
      bytes: stat.size,
    });
  }
  return out.sort((a, b) => b.mtime - a.mtime);
}

const SCRATCH_CSS = `
  :root{ --ink:#0f2a3a; --muted:#5a7486; --line:#d9e4ec; --accent:#6b3fa0; }
  *{ box-sizing:border-box }
  body{ margin:0; background:#f4f1f8; color:var(--ink);
        font:15px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .wrap{ max-width:1100px; margin:0 auto; padding:34px 22px 60px }
  .kicker{ font-size:11px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--accent) }
  h1{ font-size:26px; margin:6px 0 6px; letter-spacing:-.01em }
  .lede{ color:var(--muted); font-size:14px; margin:0 0 26px; max-width:62ch }
  .lede code{ background:#ece5f5; border-radius:4px; padding:1px 5px; font-size:12.5px }
  .bar{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:16px }
  .btn{ font:inherit; font-size:13px; font-weight:600; cursor:pointer;
        background:var(--accent); color:#fff; border:0; border-radius:9px; padding:9px 15px; }
  .btn[disabled]{ opacity:.4; cursor:not-allowed }
  .btn.ghost{ background:#fff; color:var(--accent); border:1px solid #d5c6e8 }
  .hint{ font-size:12px; color:var(--muted) }
  .cards{ display:grid; gap:14px; grid-template-columns:1fr }
  @media (min-width:760px){ .cards{ grid-template-columns:1fr 1fr } }
  .card{ background:#fff; border:1px solid var(--line); border-radius:14px; padding:15px 16px;
         box-shadow:0 4px 16px rgba(15,42,58,.05); display:flex; flex-direction:column; gap:8px }
  .card h2{ font-size:16px; margin:0 }
  .card h2 a{ color:var(--ink); text-decoration:none }
  .card h2 a:hover{ text-decoration:underline }
  .file{ font:11.5px ui-monospace, SFMono-Regular, Menlo, monospace; color:var(--muted) }
  .note{ font-size:13px; color:#40566a; margin:0 }
  .replaces{ font-size:11.5px; color:var(--muted) }
  .replaces b{ color:var(--accent); font-weight:600 }
  .row{ display:flex; align-items:center; gap:10px; margin-top:auto; padding-top:6px }
  .row label{ font-size:12px; color:var(--muted); display:flex; align-items:center; gap:5px; cursor:pointer }
  .open{ font-size:13px; font-weight:600; color:var(--accent); text-decoration:none }
  .open:hover{ text-decoration:underline }
  .empty{ background:#fff; border:1px dashed #c9b8de; border-radius:14px; padding:28px; color:var(--muted); font-size:13.5px }
  .empty b{ color:var(--ink) }
  pre{ background:#f7f4fb; border:1px solid #e6dcf2; border-radius:9px; padding:11px 13px;
       font-size:12px; overflow-x:auto; color:#3c2a55 }
  .back{ font-size:13px; color:var(--accent); text-decoration:none }
  .back:hover{ text-decoration:underline }
`;

function scratchGalleryHtml(concepts) {
  const cards = concepts
    .map(
      (c) => `
      <div class="card">
        <div>
          <h2><a href="${esc(c.href)}">${esc(c.title)}</a></h2>
          <div class="file">${esc(c.file)} · ${new Date(c.mtime).toLocaleString()}</div>
        </div>
        ${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}
        ${c.replaces ? `<div class="replaces">candidate for <b>${esc(c.replaces)}</b></div>` : ''}
        <div class="row">
          <a class="open" href="${esc(c.href)}">Open →</a>
          <label><input type="checkbox" class="cmp" value="${esc(c.file)}"> compare</label>
        </div>
      </div>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scratch concepts</title>
<style>${SCRATCH_CSS}</style>
</head><body>
<div class="wrap">
  <div class="kicker">Scratchpad</div>
  <h1>Design concepts</h1>
  <p class="lede">Throwaway explorations, served but never linked from the site. Comment on them with
  the review overlay exactly like a real page — comments are tagged <code>scratch/</code> so it's
  clear they're about a concept. When one wins, ask Claude to port it into the real page.</p>

  ${
    concepts.length
      ? `<div class="bar">
           <button class="btn" id="cmpBtn" disabled>Compare side by side</button>
           <span class="hint" id="cmpHint">Tick two concepts to compare.</span>
         </div>
         <div class="cards">${cards}</div>`
      : `<div class="empty">
           <b>No concepts yet.</b><br><br>
           Ask Claude for one — e.g. “make me two scratch concepts for the home page”. It'll drop
           files in <code>scratch/</code> and they'll appear here.<br><br>
           A concept is just an HTML file. These optional comments feed this gallery:
           <pre>&lt;!-- concept: warmer palette, single column --&gt;
&lt;!-- replaces: index.html --&gt;</pre>
         </div>`
  }

  <p style="margin-top:28px"><a class="back" href="/index.html">← back to the real site</a></p>
</div>
<script>
  const boxes = [...document.querySelectorAll('.cmp')];
  const btn = document.getElementById('cmpBtn');
  const hint = document.getElementById('cmpHint');
  function sync(){
    const on = boxes.filter(b => b.checked);
    if (on.length > 2) { on[0].checked = false; return sync(); }
    if (btn) btn.disabled = on.length !== 2;
    if (hint) hint.textContent = on.length === 2
      ? 'Ready — ' + on.map(b => b.value).join(' vs ')
      : 'Tick two concepts to compare.';
  }
  boxes.forEach(b => b.addEventListener('change', sync));
  if (btn) btn.addEventListener('click', () => {
    const [a, b] = boxes.filter(x => x.checked).map(x => x.value);
    location.href = '/scratch/compare?a=' + encodeURIComponent(a) + '&b=' + encodeURIComponent(b);
  });
  sync();
</script>
</body></html>`;
}

function scratchCompareHtml(a, b) {
  const frame = (file, side) => `
    <div class="pane">
      <div class="paneHead">
        <span class="side">${side}</span>
        <span class="paneFile">${esc(file)}</span>
        <span style="flex:1"></span>
        <a class="open" href="/scratch/${encodeURIComponent(file)}" target="_blank" rel="noopener">open ↗</a>
      </div>
      <div class="frameBox"><iframe src="/scratch/${encodeURIComponent(file)}?embed=1" title="${esc(file)}"></iframe></div>
    </div>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Compare: ${esc(a)} vs ${esc(b)}</title>
<style>
  ${SCRATCH_CSS}
  body{ background:#efeaf6 }
  .wrap{ max-width:1600px; padding:20px 18px 30px }
  .panes{ display:grid; gap:14px; grid-template-columns:1fr }
  @media (min-width:1000px){ .panes{ grid-template-columns:1fr 1fr } }
  .pane{ background:#fff; border:1px solid var(--line); border-radius:13px; overflow:hidden;
         box-shadow:0 6px 20px rgba(15,42,58,.07) }
  .paneHead{ display:flex; align-items:center; gap:9px; padding:9px 12px; border-bottom:1px solid var(--line); background:#faf8fd }
  .side{ background:var(--accent); color:#fff; font-size:10.5px; font-weight:700; letter-spacing:.06em;
         padding:2px 7px; border-radius:5px }
  .paneFile{ font:12px ui-monospace, Menlo, monospace; color:var(--muted) }
  .frameBox{ background:#fff; overflow:auto; resize:vertical }
  iframe{ display:block; width:100%; height:74vh; border:0; background:#fff }
  .widths{ display:flex; gap:6px; align-items:center }
  .wbtn{ font:inherit; font-size:12px; cursor:pointer; background:#fff; color:var(--muted);
         border:1px solid #d5c6e8; border-radius:7px; padding:5px 10px }
  .wbtn[aria-pressed="true"]{ background:var(--accent); color:#fff; border-color:var(--accent); font-weight:600 }
</style>
</head><body>
<div class="wrap">
  <div class="bar">
    <a class="back" href="/scratch/">← all concepts</a>
    <span style="flex:1"></span>
    <div class="widths">
      <span class="hint">width</span>
      <button class="wbtn" data-w="0" aria-pressed="true">fill</button>
      <button class="wbtn" data-w="1280">1280</button>
      <button class="wbtn" data-w="834">834</button>
      <button class="wbtn" data-w="390">390</button>
    </div>
  </div>
  <div class="panes" id="panes">
    ${frame(a, 'A')}
    ${frame(b, 'B')}
  </div>
  <p class="hint" style="margin-top:14px">Frames are embedded without the review overlay — open a
  concept in its own tab to comment on it.</p>
</div>
<script>
  const btns = [...document.querySelectorAll('.wbtn')];
  const frames = [...document.querySelectorAll('iframe')];
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const w = Number(b.dataset.w);
    frames.forEach(f => { f.style.width = w ? w + 'px' : '100%'; });
  }));
</script>
</body></html>`;
}

/**
 * The gallery and compare views are tooling, not design artifacts — commenting
 * on their own chrome is meaningless, and an active pick mode would swallow
 * their buttons. They get live reload only.
 */
const RELOAD_ONLY =
  '\n<script>try{new EventSource("/__review/events")' +
  '.addEventListener("reload",()=>location.reload())}catch(e){}</script>\n';

function withReload(html) {
  return REVIEW_ENABLED ? injectBefore(html, RELOAD_ONLY) : html;
}

function sendHtml(res, html, status = 200) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'content-length': Buffer.byteLength(html),
    'cache-control': 'no-store',
  });
  res.end(html);
}

/** Generated scratch routes. Returns true if it handled the request. */
async function handleScratch(req, res, url) {
  const p = url.pathname.replace(/\/+$/, '');

  if (p === '/scratch') {
    const concepts = await listConcepts();
    sendHtml(res, withReload(scratchGalleryHtml(concepts)));
    return true;
  }

  if (p === '/scratch/compare') {
    const concepts = await listConcepts();
    const known = new Set(concepts.map((c) => c.file));
    const a = url.searchParams.get('a') || '';
    const b = url.searchParams.get('b') || '';
    if (!known.has(a) || !known.has(b)) {
      sendHtml(
        res,
        withReload(
          `<!doctype html><meta charset="utf-8"><title>Compare</title><style>${SCRATCH_CSS}</style>` +
            `<div class="wrap"><h1>Pick two concepts</h1><p class="lede">Those files aren't in ` +
            `<code>scratch/</code>.</p><a class="back" href="/scratch/">← all concepts</a></div>`,
        ),
        404,
      );
      return true;
    }
    sendHtml(res, withReload(scratchCompareHtml(a, b)));
    return true;
  }

  return false;
}

async function serveStatic(req, res, url) {
  let filePath = safeJoin(ROOT, url.pathname);
  if (!filePath) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  let stat = await fsp.stat(filePath).catch(() => null);
  if (stat?.isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    const indexStat = await fsp.stat(indexPath).catch(() => null);
    if (indexStat) {
      filePath = indexPath;
      stat = indexStat;
    }
  }
  // Allow extension-less URLs like /city → city.html
  if (!stat && !path.extname(filePath)) {
    const htmlPath = `${filePath}.html`;
    const htmlStat = await fsp.stat(htmlPath).catch(() => null);
    if (htmlStat) {
      filePath = htmlPath;
      stat = htmlStat;
    }
  }

  if (!stat || !stat.isFile()) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(
      injectOverlay(
        `<!doctype html><meta charset="utf-8"><title>404</title>` +
          `<body style="font:16px/1.5 system-ui;padding:40px;color:#0f2a3a;background:#eef6fb">` +
          `<h1 style="font-size:20px">404 – not found</h1>` +
          `<p><code>${url.pathname}</code> isn't in this repo.</p>` +
          `<p><a href="/index.html">← back to home</a></p></body>`,
      ),
    );
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';

  if (ext === '.html' || ext === '.htm') {
    const html = await fsp.readFile(filePath, 'utf8');
    const out = injectOverlay(html, {
      scratch: /^\/scratch\//.test(url.pathname),
      embed: url.searchParams.get('embed') === '1',
    });
    res.writeHead(200, {
      'content-type': type,
      'content-length': Buffer.byteLength(out),
      'cache-control': 'no-store',
    });
    res.end(out);
    return;
  }

  res.writeHead(200, {
    'content-type': type,
    'content-length': stat.size,
    'cache-control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (REVIEW_ENABLED && url.pathname.startsWith('/__review')) {
      await handleApi(req, res, url);
      return;
    }
    if (url.pathname === '/') {
      res.writeHead(302, { location: '/index.html' }).end();
      return;
    }
    if (await handleScratch(req, res, url)) return;
    await serveStatic(req, res, url);
  } catch (err) {
    console.error('  ! request failed:', err.message);
    if (!res.headersSent) sendJson(res, 500, { error: err.message });
    else res.end();
  }
});

/* ---------------------------------------------------------------- boot */

function listen(port, attemptsLeft = 12) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.log(`  port ${port} busy, trying ${port + 1}…`);
      listen(port + 1, attemptsLeft - 1);
    } else {
      console.error(err.message);
      process.exit(1);
    }
  });
  server.listen(port, HOST, async () => {
    await ensureDirs();
    const store = await readStore();
    const url = `http://localhost:${port}/`;
    const open = store.comments.filter((c) => c.status !== 'done').length;
    const lines = [
      '',
      `  ${PROJECT} — design-review dev server`,
      `  ➜  ${url}`,
      `  ➜  review overlay: ${REVIEW_ENABLED ? 'ON  (click the ⌖ button, or press "r")' : 'off (--no-review)'}`,
      `  ➜  comments file:  review/comments.json (${store.comments.length} total, ${open} open)`,
      `  ➜  scratchpad:     ${url}scratch/  (${(await listConcepts()).length} concept(s))`,
      '  ➜  live reload:    on',
      '',
      '  Nothing here ships — production stays plain HTML/CSS/JS.',
      '',
    ];
    console.log(lines.join(os.EOL));
    watchFiles();
    watchComments();
    if (OPEN_BROWSER) openBrowser(url);
  });
}

listen(START_PORT);
