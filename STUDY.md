# Reader testing

The page claims a reader who knows calculus can arrive at duration and convexity
without being told to accept them. That claim is testable. This is how.

Use `duration-convexity-study.html` — the page plus a reading tracker. Everything
stays in the browser; nothing is sent anywhere.

## Who to recruit

**Comfortable with calculus, unfamiliar with bonds.** Both halves matter. Screen
with two questions:

- *What does a second derivative tell you about a curve?* — should be answered
  without hesitation or hedging.
- *What is a bond's duration?* — should draw a blank, or a vague "something about
  interest rate risk". Anyone who answers correctly is testing a different page.

Engineers, physicists, maths and economics students fit. Anyone who has worked in
fixed income does not — including people who "only did a summer there". Five to
eight readers is enough; the same confusions repeat quickly.

## Running it

**Silence is the method.** The whole point is to find out where the page fails to
explain itself, and a reader who can ask questions will route around every gap
you were trying to detect.

1. Send the file. Ask them to open it on a laptop, not a phone.
2. Tell them: read it as you would anything you were curious about, take as long
   as you like, click whatever you want. Nothing is being timed or graded.
3. **Answer no questions during reading.** If asked, say "whatever you'd do if I
   weren't here" and write the question down — an asked question is a finding.
4. When they are done, they click **Finish and save**. A `reading-*.json` file
   lands in their downloads. Collect it.

Do not sit over their shoulder if you can avoid it. Being watched makes people
read dutifully rather than naturally, and dutiful reading hides exactly the
skimming and backtracking you are trying to see.

## The interview

Afterwards, and only afterwards. Open questions before specific ones, and let
silences run.

1. What was that page about?
2. Was there a point where you felt lost? Where?
3. Did anything change your mind, or land differently than you expected?
4. *(pointing, not naming)* This number — where does it come from?
5. Would you be able to explain duration to someone else now? Try.

Question 5 is the real test. Question 4 catches readers who followed the shape of
the argument without the substance.

## Reading the JSON

```
started, totalSeconds     when and how long
tabs[]                    {tab, seconds} each time they left a tab
blocks{}                  every readable block: {tab, name, seconds, views}
backs[]                   ← start here
drawers[]                 which derivations were opened, and when
slider{moves,min,max}     whether they explored, and how far
inputs[]                  edits to coupon / maturity / rate
depth{}                   deepest scroll reached per tab, as a percentage
```

### `backs` is the finding

Each entry records the reader scrolling **down, then reversing to go back up** —
and names the block they settled on:

```json
{ "at": "142.3s", "tab": 2, "to": "t2.03", "what": "chain: Σ t(t+1) w …" }
```

A reversal means the page asked them to hold something they had not kept. That is
a defect in the writing, at the place they returned to — not at the place they
were when they turned around.

How to read it:

- **The same `to` across several readers** is the strongest signal available. Fix
  that block first.
- **Several `backs` clustered within a few seconds** is one moment of confusion,
  not several. Count the moment, not the entries.
- **Zero `backs`** is ambiguous. Cross-check against `depth` and `totalSeconds`:
  a reader who never went back and covered the page in 90 seconds skimmed it.
- **`backs` late in the session pointing at an early block** means a definition
  did not stick the first time.

Then use the rest as context. High `seconds` on a block that also appears in
`backs` is a struggle; high `seconds` with no reversal is engagement. A drawer
that no one opens is either unnecessary or badly labelled — the interview tells
you which. `slider.moves` near zero means the interactivity was not discovered,
which is a finding about the control, not about the reader.

Do not aggregate across readers into averages. Five readers is a sample for
finding defects, not for measuring anything.
