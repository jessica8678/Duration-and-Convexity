# Changelog

Kept from 2026-07-31. Earlier work is in the git history and is not reconstructed
here.

## 2026-08-14

- **index.html v1.0 released.** Five-module bond lab (four guided modules plus a
  Playground), with product README, screenshots in `Assets/`, and GitHub Pages
  enabled — the repository is now public and the lab is live at
  <https://jessica8678.github.io/Duration-and-Convexity/>.
- **Swap lab (`swap-duration-convexity.html`), separate deliverable:**
  - Gamma figures displayed at a 100bp² reference (display layer only; raw
    second derivatives unchanged), labelled at every occurrence.
  - gammaMatrix: first-derivative column corrected to ∂PV/∂z_d = −T·PV,
    final-form-only expressions across Formula/D/P columns, plain D/P header
    pills defined in the curve-pair legend.
  - Risk-card digits fixed to actually render 26px/22px (an over-broad
    `.riskCell span` rule had been shrinking the injected value spans to 11px).
  - Discount factor renamed `D_i` → `DF_i` (14 sites) to free `D` for the
    delta column; second-line risk-manager layer added (4 lens callouts,
    plain-language gamma legend, learning goals); DP legend wording tightened
    and first-order pills reordered ahead of second-order.
- **Docs synced:** README live-demo link filled in, licence section now states
  MIT, repository structure lists all four HTML files with their roles, and
  `Claude.md` maps both deliverables.

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

- Tracker dwell times can overlap on short viewports, so they are ordinal rather
  than absolute.

### Changed

- **Input parsing tightened.** A value must now match
  `/^\s*\d*\.?\d+\s*%?\s*$/` before `parseFloat` is applied. `5%` is still
  accepted; `5abc`, `5..0`, `0x10` and `1e9` are now rejected and flag the field
  instead of being silently prefix-parsed into a number.
- **CI added.** `.github/workflows/test.yml` runs `npm ci && npm test` on push and
  pull request, ubuntu-latest, node 22. No branch protection.
- **MIT licence added**, referenced from the README.
- **Tests: 26 → 34.** Three cover the tightened parsing; five cover the
  initialisation-failure banner, which was specified but never exercised.
- Study file regenerated against the changed main file, per SPEC §5.
