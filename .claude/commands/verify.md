---
name: verify
description: Pre-delivery checklist for the swap duration & convexity HTML doc. Run after any edit to the HTML, before declaring a change done or committing.
---

Run these in order. Report each result explicitly — "looks good" is not a pass; state what you actually checked and what you found.

1. **Diff scope** — `git diff --stat`. Confirm only the intended region changed. If anything else moved, stop and explain before continuing.

2. **Notation grep** — for every symbol touched this turn, `grep -c` each spelling/marker variant across the file. One concept = one count, one spelling. Flag any second form.

3. **Render check** — open the file in Chrome (claude-in-chrome, or navigate to the `file://` path) and screenshot each of the 4 tabs. If a prior screenshot exists to compare against, diff them and flag anything that changed outside this turn's intended edit.

4. **Occlusion / spacing** — for any two elements the doc claims are visually distinguishable, read actual computed positions with `getBoundingClientRect()` in the rendered page and report the real gap or contrast number. No visual guessing.

5. **Promise audit** — for every legend/label/caption string, confirm the element it names actually exists in the rendered DOM and is non-empty.

6. **Derivation continuity** — for each `.step` / `.derive` block, confirm consecutive steps differ by exactly one nameable operation, no unlabeled jump.

7. **Script sanity** (only if `<script>` was touched) — style/layout changes must not have altered the swap math. If no golden reference values exist yet for this file, flag that explicitly rather than assuming the numbers are still correct.

Only after 1–6 (and 7 where relevant) pass: `git add -A && git commit -m "<one line: what changed>"`.

If anything fails: fix it, then re-run `/verify` from step 1 — a fix can shift the diff scope, so don't only re-check the step that failed.