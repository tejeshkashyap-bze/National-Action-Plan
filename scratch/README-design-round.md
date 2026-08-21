# Design round — three directions for the NAP prototype

Three self-contained concepts in `scratch/`, built from `data.js` and `scores.js`. No new
assessment content: an indicator absent from a round renders unscored.

`_concept-data.js` holds the `CSC` and `ROUNDS` blocks copied verbatim from those two files.
When either changes, re-copy both blocks — the concepts read nothing else.

| File | Direction | Brand |
| --- | --- | --- |
| `nap-concept-a-report.html` | **Report** — the NAP as a published assessment | Conservative, close to bze.org.au |
| `nap-concept-b-console.html` | **Console** — the NAP as an assessment tool | Bolder, its own system, dark + light |
| `nap-concept-c-atlas.html` | **Atlas** — the map as the product | Middle ground |

Each file runs on its own (no server, no `styles.css`) so it can be opened or emailed as-is.
Navigation inside each one works: click regions, indicators, tabs, cells.

---

## What the current prototype is doing to itself

Six things, in the order they cost the most:

1. **The scores are under-used.** `scores.js` holds 87 scores across four regions — Port Hedland
   and Kwinana 24 each, Gladstone 20, Hunter Valley 19. The criteria grid shows them, but nothing
   compares regions, ranks indicators, or shows how much of a round is done. That comparison is
   the product.
2. **The 5-column criteria wall.** `CSC.html` and `city.html` render all 50 indicators at once in
   five columns at 13px. There is no way to tell an important indicator from an unimportant one,
   and no way to see how much of a round is done. All three concepts replace it — with an accordion
   (A), a matrix (B), or a ranked table (C).

   The wall has also been editing the content: `data.js` titles are now abbreviated to fit the
   columns — "Renewables", "Transmission", "R&D", "Decarb plans", "Common user infra". The
   concepts give each indicator a full row, so those can go back to being readable names.
3. **The type scale is inverted.** The home page nav sits at 32px bold; assessment content sits at
   13px. The biggest type on the site is the least informative.
4. **The map is a dead end.** `map.html` is an image with pills that jump straight to the 50-item
   wall. Concept C makes selecting a region fill a panel instead, so the map answers a question.
5. **"Choose an option below."** `criterion.html` offers three equal boxes — previous assessments,
   learn more, do your own assessment. The reader who wants to know *what the score is and why*
   has to guess. A, B and C all put the score and its reasoning first, with method and history
   secondary.
6. **No shell.** Every page starts with "← Back to home". There is no persistent header, no
   breadcrumb trail, no sense of where you are in 50 × 16 possible pages.

Smaller, but worth fixing whatever direction you pick:

- `map.html` never closes `.mapWrap` — the footnote div ends up inside the map wrapper.
- The "If any label is slightly off, adjust its left/top percentages" note is developer copy
  showing on a public page.
- The BZE logo renders at 300px tall on the home page, above 32px nav pills.

## The score scale

A 1–5 scale where 1 is bad and 5 is good needs a colour ramp, and the choice carries tone.
Two were built and both were checked with a colour-vision validator rather than by eye:

- **Sequential blue** (A and C): pale blue at 1, deep BZE blue at 5. One hue, so it reads as
  magnitude and nothing looks like an alarm. Passes monotonic-lightness, single-hue and
  surface-contrast checks in light and dark.
- **Diverging red–blue** (B): red at 1–2, neutral at 3, blue at 4–5. Deficiencies are visible at a
  glance across a whole matrix. Passes colourblind separation all-pairs in both modes (worst pair
  ΔE 17–18, floor is 8).

In both, every cell carries the **number as well as the colour**, and B has a plain-text table
view — colour is never the only channel.

## Judgement calls for you, not me

- **Sequential or diverging.** Diverging is more useful for spotting gaps; it also makes a region
  look worse than measured prose would. That's a communications call.
- **Averaging.** A and C show theme averages. With 19–24 of 50 indicators scored, an average is
  arguably misleading — and it moves for reasons that have nothing to do with the region, since
  which indicators got scored first differs per round. Every average is labelled with how many
  indicators it uses, but you may want them gone until a round is complete.
- **Comparing rounds a year apart.** Concept B's matrix puts Hunter Valley (April 2025) beside
  Port Hedland (August 2026) in one grid. Federal and state policy scores in particular may not
  be comparable across 16 months. The matrix currently doesn't warn about this.
- **Whether Port Hedland reads as assessed.** See point 4 below.

## Data inconsistencies found while building

Flagging rather than fixing, per the house rule:

1. **50 vs 55 indicators.** `data.js` has 50. bze.org.au says "five key themes and 55 indicators".
   The public page describes Version 1; the repo holds the Version 2 process PDF.
2. **`NAP Scores - Sheet1.csv` is stale and contradicts `scores.js`.** It has empty Port Hedland
   and Kwinana columns, 52 rows, and an older grouping (Digital Infrastructure under Social
   Infrastructure; Land-use planning under Engagement). `scores.js` is the live source. Two files
   holding the same numbers differently is how a wrong score reaches a published page — worth
   deleting the CSV or marking it an export.
3. **Nothing since April is pushed.** `scores.js`, `evidence-port-hedland.js`,
   `evidence-kwinana.js`, `review/`, `scratch/`, the rebuilt `styles.css` and `city.html` all exist
   in the working copy only. `main` on both the fork and `mattmckee-BZE/National-Action-Plan` is
   still at `ba30636`. A disk failure loses four regions of work.
4. **Port Hedland's round is dated August 2026 and `PORT-HEDLAND-DRAFT-ISSUES.md` is open.** The
   concepts label it "Assessed · August 2026" alongside the two published rounds. If it is still a
   draft it needs a distinct state, and I have not invented one.
