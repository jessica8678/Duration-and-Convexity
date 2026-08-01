/*
 * Baseline tests for duration-convexity.html.
 *
 * The bond mathematics is deliberately NOT reimplemented here. The page is the
 * single source of truth; this file loads it in a real DOM, reads what it
 * rendered, and compares against the fixed baselines recorded in SPEC.md. A
 * second implementation would only ever prove the two copies agree with each
 * other, which is not the property worth testing.
 */
"use strict";

const { test, describe, before } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const PAGE = path.join(__dirname, "..", "duration-convexity.html");
const html = fs.readFileSync(PAGE, "utf8");

/* Baselines from SPEC.md, at the default inputs: c=5%, T=10, r=5%, move=+100bp. */
const BASE = {
  priceToday: "100.0000",
  sumTW: "8.1078",       // Macaulay duration, Σ t·w
  negPpOverP: "7.7217",  // modified duration, −P′/P
  sumTT1W: "82.6849",    // Σ t(t+1)·w
  PppOverP: "74.9977",   // convexity, P″/P
};

/* Load the page and collect anything the scripts threw.
   `source` lets a test load a deliberately broken copy. */
function open(source = html) {
  const thrown = [];  // uncaught — reaches jsdom as an error event
  const logged = [];  // caught and passed to console.error by the page
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => thrown.push(e));
  vc.on("error", (...args) => logged.push(args.map(String).join(" ")));
  const dom = new JSDOM(source, { runScripts: "dangerously", virtualConsole: vc });
  return { dom, win: dom.window, doc: dom.window.document, thrown, logged };
}

const $ = (doc, id) => doc.getElementById(id);
const text = (doc, id) => $(doc, id).textContent.trim();

/* A .chain is: [box: symbolic] = [box: numeric fraction] = [box.hiN: result].
   The numerator of the middle box is the sum; the highlighted box is the ratio. */
const chainNumerator = (doc, id) =>
  $(doc, id).querySelectorAll(".box")[1].querySelector(".n").textContent.trim();
const chainResult = (doc, id, hi) =>
  $(doc, id).querySelector(".box." + hi).textContent.trim();

function fire(win, node, type) {
  node.dispatchEvent(new win.Event(type, { bubbles: true }));
}
function setInput(win, node, value) {
  node.value = value;
  fire(win, node, "input");
}
/* Some tables are rendered into a host div, so scope to tbody: a bare "tr"
   query would also pick up the head and the totals row. */
const rowsOf = (doc, hostId) => Array.from($(doc, hostId).querySelectorAll("tbody tr"));
const cells = (tr) => Array.from(tr.querySelectorAll("td")).map((td) => td.textContent.trim());

describe("page boots", () => {
  let ctx;
  before(() => { ctx = open(); });

  test("initialisation does not throw", () => {
    assert.deepEqual(ctx.thrown.map(String), []);
  });

  test("the liveness banner is removed once init completes", () => {
    assert.equal($(ctx.doc, "jswarn"), null);
  });

  test("the no-js guard is lifted", () => {
    assert.equal($(ctx.doc, "wrap").classList.contains("no-js"), false);
  });

  test("defaults are the documented ones: c=5%, T=10, r=5%, move=+100bp", () => {
    assert.equal($(ctx.doc, "i-c").value, "5.00");
    assert.equal($(ctx.doc, "i-T").value, "10");
    assert.equal($(ctx.doc, "i-y").value, "5.00");
    assert.equal($(ctx.doc, "sl").value, "100");
    assert.match(text(ctx.doc, "slout"), /^\+100bp/);
  });
});

/* The state D10 exists to catch: init throws, so the page is dead. It must say
   so rather than sit there looking like an ordinary static preview. */
describe("initialisation failure is visible", () => {
  // Break a required element so update() throws inside the guarded block.
  const broken = html.replace('id="o-p0"', 'id="o-p0-gone"');
  let ctx;
  before(() => {
    assert.notEqual(broken, html, "fault was actually injected");
    ctx = open(broken);
  });

  test("the banner survives instead of being removed", () => {
    assert.notEqual($(ctx.doc, "jswarn"), null);
  });

  test("the banner is marked bad", () => {
    assert.equal($(ctx.doc, "jswarn").classList.contains("bad"), true);
  });

  test("it says the page failed and carries the error message", () => {
    const t = $(ctx.doc, "jswarn").textContent;
    assert.match(t, /failed to start/i);
    assert.match(t, /Cannot set properties of null/);
    assert.doesNotMatch(t, /Static preview/i, "no longer claims to be a preview");
  });

  test("#wrap keeps no-js, so nothing pretends to be live", () => {
    assert.equal($(ctx.doc, "wrap").classList.contains("no-js"), true);
  });

  test("the original exception reached the console", () => {
    // the page catches it, so it arrives as console.error rather than uncaught
    assert.ok(
      ctx.logged.some((line) => /Cannot set properties of null/.test(line)),
      "expected the original error on the console, got: " + JSON.stringify(ctx.logged)
    );
  });
});

describe("baseline figures at the default inputs", () => {
  let ctx;
  before(() => { ctx = open(); });

  test("Price today", () => {
    assert.equal(text(ctx.doc, "o-p0"), BASE.priceToday);
  });

  test("Σ t·w  (Macaulay duration)", () => {
    assert.equal(chainNumerator(ctx.doc, "chain1"), BASE.sumTW);
  });

  test("−P′/P  (modified duration)", () => {
    assert.equal(chainResult(ctx.doc, "chain1", "hi1"), BASE.negPpOverP);
  });

  test("Σ t(t+1)·w", () => {
    assert.equal(chainNumerator(ctx.doc, "chain2"), BASE.sumTT1W);
  });

  test("P″/P  (convexity)", () => {
    assert.equal(chainResult(ctx.doc, "chain2", "hi2"), BASE.PppOverP);
  });

  test("the tables agree with the chains", () => {
    // tables render only for the active tab, so visit each one
    $(ctx.doc, "tb1").click();
    const foot1 = cells($(ctx.doc, "tbl1").querySelector("tfoot tr"));
    assert.equal(foot1.at(-1), BASE.sumTW);
    assert.equal(foot1[2], BASE.priceToday);

    $(ctx.doc, "tb2").click();
    const foot2 = cells($(ctx.doc, "tbl2").querySelector("tfoot tr"));
    assert.equal(foot2.at(-1), BASE.sumTT1W);
    assert.equal(foot2.at(-2), BASE.sumTW);
  });
});

describe("validation tab adds back to the real price", () => {
  let ctx;
  before(() => {
    ctx = open();
    $(ctx.doc, "tb3").click();
  });

  test("running total of the last row equals Price now", () => {
    const last = cells(rowsOf(ctx.doc, "valb").at(-1));
    assert.equal(last.at(-1), text(ctx.doc, "v-act"));
  });

  test("running total of the last row equals the blotter's Price now", () => {
    const last = cells(rowsOf(ctx.doc, "valb").at(-1));
    assert.equal(last.at(-1), text(ctx.doc, "o-p"));
  });

  test("the identity holds across the slider range, not just at +100bp", () => {
    const sl = $(ctx.doc, "sl");
    for (const bp of ["-700", "-250", "-10", "0", "10", "250", "700"]) {
      setInput(ctx.win, sl, bp);
      const last = cells(rowsOf(ctx.doc, "valb").at(-1));
      assert.equal(last.at(-1), text(ctx.doc, "v-act"), `at ${bp}bp`);
    }
    assert.deepEqual(ctx.thrown.map(String), []);
  });
});

describe("zero coupon", () => {
  let ctx;
  before(() => {
    ctx = open();
    setInput(ctx.win, $(ctx.doc, "i-c"), "0");
    $(ctx.doc, "tb1").click();
  });

  test("every row but the last carries no share of the price", () => {
    const shares = rowsOf(ctx.doc, "tbl1").map((tr) => cells(tr)[3]);
    assert.equal(shares.length, 10);
    assert.deepEqual(shares.slice(0, -1), Array(9).fill("0.00%"));
    assert.equal(shares.at(-1), "100.00%");
  });

  test("Σ t·w is exactly the maturity", () => {
    assert.equal(chainNumerator(ctx.doc, "chain1"), "10.0000");
    assert.equal(cells($(ctx.doc, "tbl1").querySelector("tfoot tr")).at(-1), "10.0000");
  });

  test("Σ t·w tracks maturity when the term changes", () => {
    for (const T of ["1", "7", "30"]) {
      setInput(ctx.win, $(ctx.doc, "i-T"), T);
      assert.equal(chainNumerator(ctx.doc, "chain1"), Number(T).toFixed(4), `T=${T}`);
    }
    assert.deepEqual(ctx.thrown.map(String), []);
  });
});

describe("tabs", () => {
  let ctx;
  before(() => { ctx = open(); });

  test("all four switch, one panel visible at a time, nothing throws", () => {
    for (const i of [0, 1, 2, 3, 2, 0, 3, 1]) {
      $(ctx.doc, "tb" + i).click();
      const shown = [0, 1, 2, 3].filter((k) => !$(ctx.doc, "p" + k).hidden);
      assert.deepEqual(shown, [i], `after clicking tab ${i}`);
      assert.equal($(ctx.doc, "tb" + i).getAttribute("aria-selected"), "true");
    }
    assert.deepEqual(ctx.thrown.map(String), []);
  });

  test("arrow keys move between tabs and wrap around", () => {
    $(ctx.doc, "tb0").click();
    const press = (id, key) =>
      $(ctx.doc, id).dispatchEvent(
        new ctx.win.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
      );
    press("tb0", "ArrowLeft"); // wraps to the last tab
    assert.equal($(ctx.doc, "p3").hidden, false);
    press("tb3", "ArrowRight"); // wraps back to the first
    assert.equal($(ctx.doc, "p0").hidden, false);
    assert.deepEqual(ctx.thrown.map(String), []);
  });
});

describe("drawers", () => {
  let ctx;
  before(() => { ctx = open(); });

  test("there are three, and each opens and closes", () => {
    const drawers = Array.from(ctx.doc.querySelectorAll("details"));
    assert.equal(drawers.length, 3);
    for (const d of drawers) {
      const summary = d.querySelector("summary");
      assert.ok(summary, "drawer has a summary");
      assert.equal(d.open, false);
      summary.click();
      assert.equal(d.open, true);
      summary.click();
      assert.equal(d.open, false);
    }
    assert.deepEqual(ctx.thrown.map(String), []);
  });
});

describe("illegal input", () => {
  /* Junk common to all three fields: empty, non-numeric, and out of every range.
     `extra` holds values only that field rejects — 3.7 is a fine coupon or rate
     but not a maturity, which must be a whole number of years. */
  const FIELDS = [
    { id: "i-c", wrap: "w-c", label: "coupon", extra: [] },
    { id: "i-T", wrap: "w-T", label: "maturity", extra: ["3.7", "0.5", "10.0001"] },
    { id: "i-y", wrap: "w-y", label: "rate", extra: ["0.1", "0"] },
  ];
  const JUNK = ["", "  ", "abc", "-5", "999", "1e9", "NaN", "Infinity"];

  for (const f of FIELDS) {
    test(`${f.label}: junk is rejected, the last good value survives`, () => {
      const { win, doc, thrown } = open();
      const before = {
        p0: text(doc, "o-p0"),
        d: chainResult(doc, "chain1", "hi1"),
        c: chainResult(doc, "chain2", "hi2"),
      };
      for (const bad of JUNK.concat(f.extra)) {
        setInput(win, $(doc, f.id), bad);
        assert.equal(text(doc, "o-p0"), before.p0, `${f.label}=${JSON.stringify(bad)}`);
        assert.equal(chainResult(doc, "chain1", "hi1"), before.d, `${f.label}=${JSON.stringify(bad)}`);
        assert.equal(chainResult(doc, "chain2", "hi2"), before.c, `${f.label}=${JSON.stringify(bad)}`);
      }
      assert.deepEqual(thrown.map(String), []);
    });

    test(`${f.label}: the field is flagged while invalid and clears when fixed`, () => {
      const { win, doc } = open();
      const good = $(doc, f.id).value;
      setInput(win, $(doc, f.id), "abc");
      assert.equal($(doc, f.wrap).classList.contains("err"), true);
      setInput(win, $(doc, f.id), good);
      assert.equal($(doc, f.wrap).classList.contains("err"), false);
    });
  }

  /* parseFloat alone prefix-parses, so these used to be accepted as 5. */
  test('"5%" is still accepted', () => {
    const { win, doc } = open();
    setInput(win, $(doc, "i-c"), "5%");
    assert.equal($(doc, "w-c").classList.contains("err"), false);
    assert.equal(text(doc, "o-p0"), BASE.priceToday);
    assert.equal(chainResult(doc, "chain1", "hi1"), BASE.negPpOverP);
  });

  test('"5abc" is rejected', () => {
    const { win, doc } = open();
    setInput(win, $(doc, "i-c"), "5abc");
    assert.equal($(doc, "w-c").classList.contains("err"), true);
    assert.equal(text(doc, "o-p0"), BASE.priceToday, "last good value survives");
  });

  test('"" is rejected', () => {
    const { win, doc } = open();
    setInput(win, $(doc, "i-c"), "");
    assert.equal($(doc, "w-c").classList.contains("err"), true);
    assert.equal(text(doc, "o-p0"), BASE.priceToday, "last good value survives");
  });

  test("all three junked at once still leaves the page rendering", () => {
    const { win, doc, thrown } = open();
    const p0 = text(doc, "o-p0");
    for (const f of FIELDS) setInput(win, $(doc, f.id), "???");
    assert.equal(text(doc, "o-p0"), p0);
    for (const i of [0, 1, 2, 3]) $(doc, "tb" + i).click();
    assert.deepEqual(thrown.map(String), []);
  });
});
