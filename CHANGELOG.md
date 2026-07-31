# Changelog

Kept from 2026-07-31. Earlier work is in the git history and is not reconstructed
here.

## 2026-07-31

Current state as of this entry:

- **Page.** `duration-convexity.html` — annual-pay bond, four tabs (the function,
  duration, convexity, validation), derivation led by the Taylor expansion. Coupon,
  maturity and rate are editable; every displayed figure is computed at run time.
- **Study build.** `duration-convexity-study.html` — the same page with a local
  reading tracker appended. Generated from the main file, never hand-edited.
- **Tests.** `test/baseline.test.js` — 26 assertions, run with `npm test`. Loads
  the page in jsdom and reads what it rendered; the bond formulas are not
  reimplemented.
- **Docs.** `README.md`, `SPEC.md`, `STUDY.md`, this file.

Notes recorded rather than changed:

- Inputs are parsed with `parseFloat`, which prefix-parses — `5%` and `5..0` are
  accepted as `5`. Current behaviour, not a decision.
- Tracker dwell times can overlap on short viewports, so they are ordinal rather
  than absolute.
