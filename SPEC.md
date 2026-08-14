# Duration and Convexity — specification

**Deliverable** `duration-convexity.html`, single file, zero dependencies, opens by double-click.
**Interface language** English. **This document** is for whoever changes the page.
**Reader** comfortable with calculus, new to bonds.

---

## 1. Invariants

Load-bearing. Breaking any of these is a regression, not a variation.

1. **Taylor first, names second.** The expansion is introduced as the general tool
   for moving along a bent curve. Duration and convexity then *appear* as its first
   two terms. They are never introduced as definitions to be accepted — the page
   says "nobody assumed it, it appeared", and that must stay true of the order in
   which the reader meets things.

2. **Calculus is spoken plainly.** `P′`, `P″`, `Δr²`, `1/n!` are used directly. This
   page does not paraphrase derivatives into folk language; its reader already has
   the concept and paraphrase would only add a translation step. What *is* explained
   at length is the bond.

3. **Nothing on the page is an estimate of the price.** Every quantity is a named
   part of one total, so the parts must add back exactly. Tab 3 exists to show that
   addition landing on the real price, to the last displayed digit, at every slider
   position. A residual line is always present and labelled; it is never rounded away.

4. **The HTML stores inputs, never outputs.** Coupon, maturity, rate and move are
   the only state. Every figure is computed at run time. No baseline number is
   hardcoded anywhere in the file — which is why the baselines below live in this
   document and nowhere else.

5. **Semantic colour is fixed.** Ink black = the truth. Blue `#1B54D6` = term 1 /
   first derivative / duration. Purple `#6B3FA0` = term 2 / second derivative /
   convexity. Grey `#8494A8` = residual, everything the two terms do not explain.
   Once bound, a colour is never reused for anything else.

6. **The page may not fail silently.** `#jswarn` is a liveness probe, not decoration.
   It is removed only after initialisation completes. Three states, always
   distinguishable: **gone** = live; **yellow** = scripts never ran; **red** = init
   threw, with the message shown in place and the exception logged to the console.

---

## 2. Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Four tabs: the function → duration → convexity → validation | Each tab is one Taylor term plus a proof that they reconcile. Depth unlocks in the reader's own order. |
| D2 | Tab 0 leads with the expansion and a convergence table (0/1/2/3 terms, and what each is still off by) | Makes "each correction is smaller than the last" a thing the reader watches happen, not a claim. |
| D3 | Derivations live in collapsed drawers, one per tab | The main column stays a spine; depth is opt-in. A reader who wants the algebra can have all of it without it being imposed on one who does not. |
| D4 | The same cash-flow table appears on tabs 1 and 2; the second derivative adds one column | The two numbers come from one object. Showing one table twice makes that structural, rather than asserting it. |
| D5 | Inputs are free text with range validation, not steppers | Typing 30 years is one gesture. Invalid entries flag the field and keep the last good value, so the page never blanks out mid-edit. |
| D6 | The slider is styled into the chart's frame and its track is inset to the plot area | It *is* the x-axis control. Aligning it to the plot removes the "which axis does this drive?" question. |
| D7 | The plot window widens on tab 0 and tightens around the move on tabs 1–3 | Tab 0 is about convergence and needs range; the later tabs are about one move, and a wide window would compress the very bars being measured. |
| D8 | The asymmetry table (down vs up, and the surplus) sits on tab 2 | Convexity in money: the same move down gains more than up loses, and the surplus is exactly twice term 2. This is the second derivative measured by hand. |
| D9 | Baselines live in `SPEC.md` and `test/`, never in the HTML | See invariant 4. A number written in two places will eventually disagree with itself. |
| D10 | `#jswarn` is a liveness probe | See invariant 6. Removing it before the work is validated disguises a dead page as a normal static preview and pushes diagnosis onto the naked eye. |
| D11 | `duration-convexity-study.html` is **generated**, never hand-edited | See §5. |

---

## 3. Baselines

**At the default inputs** — coupon 5%, maturity 10 years, rate 5%, annual pay,
face 100. These are *not* in the HTML; the page computes them from those inputs.

```
Price                P          100.0000
Macaulay duration    Σ t·w        8.1078
Modified duration    −P′/P        7.7217
                     Σ t(t+1)·w  82.6849
Convexity            P″/P        74.9977
```

At a move of **+100bp** the decomposition is:

| Part | Amount | Running total |
|---|---:|---:|
| Price today | — | 100.0000 |
| Duration (term 1) | −7.7217 | 92.2783 |
| Convexity (term 2) | +0.3750 | 92.6533 |
| Everything else | −0.0133 | 92.6399 |
| **Price now, actually** | | **92.6399** |

Degenerate case worth keeping: **coupon 0** makes every share but the last 0.00%,
and `Σ t·w` becomes exactly the maturity.

---

## 4. Acceptance

Run `npm test`. It loads the page in a real DOM and reads what it rendered; it
does not reimplement the bond formulas, because a second implementation would only
ever prove the two copies agree with each other.

- [ ] The five baselines above, at the default inputs.
- [ ] Tables and chains agree — the totals row of the cash-flow table matches the
      number in the chain beside it.
- [ ] Tab 3's running total equals the real price across the full slider range,
      including at 0bp and at both ends.
- [ ] Coupon 0: shares are 0.00% except the last, and `Σ t·w` equals the maturity
      for every maturity tested.
- [ ] All four tabs switch, exactly one panel visible; arrow keys move and wrap.
- [ ] All three drawers open and close.
- [ ] Junk in any input throws nothing, flags the field, and keeps the last good
      value. Input parsing is **tightened**: a value must match
      `/^\s*\d*\.?\d+\s*%?\s*$/` before `parseFloat` sees it, so `5%` is accepted
      while `5abc`, `5..0`, `0x10` and `1e9` are rejected. Bare `parseFloat`
      prefix-parsed all of those into a number.
- [ ] No banner after load; `#wrap` has lost `no-js`.
- [ ] When init throws, the banner **survives**, gains `bad`, shows the error
      message, and `#wrap` keeps `no-js`. This is the one state D10 exists for,
      and the suite injects a fault to prove it.

---

## 5. The study file is generated

`duration-convexity-study.html` is `duration-convexity.html` with a reading-tracker
`<script>` inserted before `</body>`. Because the insertion point is *before* the
closing tags, the study file is not "main plus a suffix" — no byte-prefix
comparison can validate it, and a hardcoded prefix length would silently rot as
the main file changes size.

**A change to the main file requires regenerating the study file. Never hand-sync
the two.** They will diverge silently otherwise, and the study will then be
measuring a page nobody is shipping.

Verify the structural invariant instead — every line of the main file must
survive unchanged in the study file, so the only differences are tracker
insertions:

```bash
diff <(tr -d '\r' < duration-convexity.html) \
     <(tr -d '\r' < duration-convexity-study.html) | grep -c '^<'   # must be 0
```

`^<` counts lines that exist only in the main file. Zero means the main file is
fully intact inside the study build; the `tr` guards against line-ending drift.

---

## 6. Known limitations

- The tracker's dwell timing uses `IntersectionObserver` against a middle band of
  the viewport. On a short viewport several blocks are in that band at once and
  their times overlap. Treat dwell as ordinal, not absolute. `IntersectionObserver`
  also does not exist in jsdom, so the tracker cannot be exercised by the test
  suite — only in a real browser.
- Input parsing leniency is **fixed**, not a limitation: see §4.
- Annual coupons only. Most real bonds pay twice a year; that changes the numbers
  but not one line of the structure.
