# National Action Plan — working notes for Claude

A clickable prototype of BZE's National Action Plan: the regional assessment
criteria, the methodology behind each indicator, and per-region scores.

**Read `review/comments.json` before starting design work.** That file is how the
team hands you work. See *The review loop* below.

## What this repo is

Plain static HTML/CSS/JS. No framework, no bundler, no build step. Pages are
hand-written HTML that pull shared data from top-level JS files and render it
client-side:

| File | Role |
| --- | --- |
| `index.html` | Home — three entry points |
| `map.html` | Clickable map of Australia; city labels positioned in `%` |
| `city.html`, `CSC.html` | Criteria grids (built at runtime from `data.js`) |
| `criterion.html`, `learn.html`, `assess*.html`, `previous.html` | Indicator detail pages |
| `contributors.html`, `editor.html` | Contributor list; scoring editor |
| `styles.css` | The whole design system — single stylesheet, CSS variables at the top |
| `data.js` | Criteria structure (pillars → groups → items) |
| `scores.js` | Per-city scores |
| `learn-data.js`, `evidence-*.js` | Methodology and evidence content (large) |

### House rules

1. **Never add a build step.** No npm dependencies for anything the site needs,
   no framework, no transpiling. It deploys as static files.
2. **`styles.css` is the design system.** Change the variables and shared
   classes there rather than piling up inline styles or per-page `<style>`
   blocks. Exception: files in `scratch/` may do whatever they like.
3. **Most markup is generated at runtime.** A visual change often lives in a
   template string inside `data.js`, `learn.html` or `CSC.html`, not in static
   HTML. Grep for the class name before assuming.
4. **`review/` and `package.json` are dev-only.** They are not part of the
   deployed site. Never add a `<script src="review/overlay.js">` to a page — the
   dev server injects it into HTML responses at request time, which is what
   keeps it out of production.
5. Australian English in all copy (organise, prioritise, colour).

## The review loop

The team reviews visually in the browser and hands you structured comments.

```
npm run dev        → http://localhost:5173   (zero dependencies, Node 18+)
```

They press `r`, click any element, and type what should change. Each comment is
appended to `review/comments.json`.

**When asked to action comments:**

1. Read `review/comments.json`.
2. Work only on `status: "open"` comments. Group them by `page`, then by the
   file that actually owns the markup.
3. Use `target.selector` plus `target.text` and `target.html` to find the source.
   Remember rule 3 above — the selector describes the *rendered* DOM.
4. `target.styleHints` records the computed styles at review time (font-size,
   colour, padding, radius…), which tells you what the reviewer was reacting to.
5. Make the changes. Prefer editing `styles.css` variables and shared classes
   over one-off overrides.
6. Set each handled comment's `status` to `"done"` in `review/comments.json`
   (leave everything else in the entry untouched). Open browser tabs pick the
   change up automatically. Don't clear or archive the file — the **Clear**
   button in the overlay is the reviewer's call.
7. Summarise what changed per comment number, and flag anything you chose not to
   do and why.

### Comment shape

```json
{
  "id": "cmszsn3x41",
  "seq": 1,
  "createdAt": "2026-08-19T07:52:19.096Z",
  "status": "open",
  "reviewer": "Tejesh",
  "page": "index.html",
  "category": "type",
  "priority": "high",
  "comment": "Make these nav pills smaller — 32px is too big.",
  "target": {
    "selector": "a.homeNavCard:nth-of-type(1)",
    "tag": "a",
    "classes": "homeNavCard",
    "text": "Contributors",
    "html": "<a class=\"homeNavCard\" href=\"contributors.html\">Contributors</a>",
    "ancestors": "div.container › div.homeNav",
    "rect": { "x": 60, "y": 355, "w": 375, "h": 122 },
    "styleHints": { "font-size": "32px", "padding": "22px 20px", "…": "…" }
  }
}
```

`id` is the stable key. `seq` is just the display number.

`page` values starting `scratch/` are comments on a throwaway concept, not the
real site — fix them in the concept file, not in the deployed pages.

## The scratchpad

`scratch/` holds throwaway design concepts, browsable at `/scratch/` with a
side-by-side compare view. Nothing on the real site links to it.

Use it whenever a request is exploratory — *"try a different home page"*,
*"what would this look like with more whitespace"*. Build the idea as a new file
in `scratch/` rather than editing `index.html`, so the deployed pages stay
stable until a concept is approved.

- Name files by intent: `home-editorial.html`, `csc-two-column.html`.
- Add the metadata comments so the gallery can describe them:
  `<!-- concept: … -->` and `<!-- replaces: index.html -->`.
- Link `../styles.css` so concepts inherit the design system, then override in a
  page-level `<style>` block. A concept exploring a different look may ignore it.
- Offer two or three genuinely different directions rather than one.
- Only port a concept into the real pages when asked. Porting means folding the
  concept's CSS into `styles.css` properly — not copying a `<style>` block
  across.

## Comments and git

`review/comments.json` is committed, so two reviewers can end up with duplicate
`seq` numbers or a duplicated entry after a merge. Keep both sides when
resolving a conflict in that file, then run:

```
npm run review:normalise
```

which dedupes by `id` and renumbers `seq` chronologically.

Archived batches live in `review/archive/` and are also committed — they're the
record of what each design round asked for. Never edit or delete an archive.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Serve the site with review overlay + live reload |
| `npm start` | Same, and open a browser |
| `npm run dev -- --port 4000` | Use a specific port |
| `npm run dev:noreview` | Serve exactly what deploys — no overlay |
| `npm run review:show` | Print current comments to the terminal |
| `npm run review:normalise` | Dedupe + renumber after a git merge |

Full human-facing docs: `review/README.md` and `scratch/README.md`.
