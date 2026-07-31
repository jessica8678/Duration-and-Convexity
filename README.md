# Duration and Convexity

An interactive page that derives a bond's duration and convexity from the Taylor
expansion, rather than presenting them as formulas to memorise. Both numbers turn
out to be derivatives of the same pricing formula — the page shows them falling
out of it, then proves the pieces add back to the real price exactly.

Four tabs: **The function → Duration → Convexity → Validation.** Coupon, maturity
and rate are editable; a slider moves the rate and everything on the page follows.

## Who it is for

Someone comfortable with calculus who has never priced a bond. The page assumes
you know what a derivative is and explains everything about bonds; it never
assumes the reverse. Notation is used openly — `P′`, `P″`, `n!` — because for this
reader that is the shortest path, not an obstacle.

## How to open it

Download `duration-convexity.html` and double-click it. One file, no
dependencies, no build step, no network access.

A yellow banner means scripts have not run — you are looking at a static preview
pane, so download the file instead. A red banner means the page failed to start
and shows the error. No banner means everything is live.

## Files

| File | What it is |
|---|---|
| `duration-convexity.html` | The page. The only file a reader needs. |
| `duration-convexity-study.html` | The same page plus a reading tracker, for user testing. Generated — see `SPEC.md`. |
| `SPEC.md` | Design invariants, decisions, and the numbers any change must still produce. |
| `STUDY.md` | How to run a reader test and how to read the output. |
| `test/baseline.test.js` | Checks the page against those numbers. `npm install && npm test`. |
