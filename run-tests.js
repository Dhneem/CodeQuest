/* ============================================================
   run-tests.js — headless runner for the CodeQuest test suite.
   Runs the same five scripts and the same inline harness as
   test.html inside a minimal VM context (no browser needed).
   DOM-dependent checks (html/canvas iframe steps) are reported
   as SKIPPED — run those by opening test.html in the browser.
   Usage:  node run-tests.js [harness.html]     (default: test.html)
   Exit:   0 = all passed, 1 = failures
   ============================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const harnessPath = path.resolve(root, process.argv[2] || "test.html");
const SKIP = "SKIP_NO_DOM";   /* marker: browser-only, not a failure */

if (!fs.existsSync(harnessPath)) { console.error("Harness not found: " + harnessPath); process.exit(1); }
const html = fs.readFileSync(harnessPath, "utf8");
const inline = html.match(/<script>([\s\S]*?)<\/script>/);   /* first tag-free <script> = the harness */
if (!inline) { console.error("No inline harness script found in " + harnessPath); process.exit(1); }

/* ---------- minimal browser-ish globals ---------- */
/* browser-faithful localStorage: string-in / string-out, like the real thing */
const __store = new Map();
const __ls = {
  getItem: k => (__store.has(String(k)) ? __store.get(String(k)) : null),
  setItem: (k, v) => { __store.set(String(k), String(v)); },
  removeItem: k => { __store.delete(String(k)); },
  clear: () => { __store.clear(); },
  key: i => Array.from(__store.keys())[i] ?? null,
  get length() { return __store.size; }
};
const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  localStorage: __ls,
  document: {
    documentElement: { lang: "", dir: "", setAttribute() {} },
    body: { appendChild() {} },
    createElement: () => ({ style: {}, setAttribute() {}, remove() {} }),
    querySelector: () => null,
    querySelectorAll: () => []
  },
  navigator: {},
  matchMedia: () => ({ matches: false })
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

/* ---------- app scripts, same order as test.html ---------- */
const files = ["i18n.js", "content.js", "knowledge.js", "engine.js", "mentor.js"];
for (const f of files) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
}

/* ---------- bridge: html/canvas steps need a real DOM (iframes).
   Route them to a marked skip so headless runs never fake a pass. ---------- */
vm.runInContext(`
  (function () {
    const orig = Engine.checkStep.bind(Engine);
    Engine.checkStep = async function (step, code) {
      if (step.kind === "html" || step.kind === "canvas") {
        return { results: [{ label: ${JSON.stringify(SKIP)}, pass: false }],
                 logs: [], error: ${JSON.stringify(SKIP)}, allPass: false, skipped: true };
      }
      return orig(step, code);
    };
  })();
`, ctx, { filename: "run-tests-bridge.js" });

/* ---------- run the harness ---------- */
try {
  vm.runInContext(inline[1], ctx, { filename: harnessPath });
} catch (e) {
  console.error("Harness crashed:", e);
  process.exit(1);
}

/* ---------- wait for every async section, then score ---------- */
const deadline = Date.now() + 30000;
(function poll() {
  const w = sandbox;
  if (!(w.done && w.__htmlDone && w.__canvasDone && w.__cppDone)) {
    if (Date.now() > deadline) {
      console.error("Timed out: done=" + w.done + " html=" + w.__htmlDone +
                    " canvas=" + w.__canvasDone + " cpp=" + w.__cppDone);
      process.exit(1);
    }
    return setTimeout(poll, 100);
  }
  score(w);
})();

function score(w) {
  let failed = 0;

  console.log("\nCore tests (" + w.results.length + "):");
  for (const r of w.results) {
    const browserOnly = !r.pass && String(r.detail || "").indexOf(SKIP) !== -1;
    if (browserOnly) { console.log("  \u25CB SKIP (browser-only)  " + r.name); continue; }
    if (r.pass) { console.log("  \u2713 " + r.name); continue; }
    failed++;
    console.log("  \u2717 " + r.name + (r.detail ? "  \u2014 " + r.detail : ""));
  }
  if (w.results.length < 20) {
    failed++;
    console.log("  \u2717 suite shrank: expected \u226520 core tests, got " + w.results.length);
  }

  const cpp = w.__cppOut || [];
  console.log("\nC/C++ solutions (" + cpp.length + "):");
  for (const c of cpp) {
    if (c.pass) { console.log("  \u2713 " + c.id); continue; }
    failed++;
    console.log("  \u2717 " + c.id + " " + JSON.stringify(c.fails || []) + (c.err ? " " + c.err : ""));
  }

  for (const pair of [["HTML solutions", "__htmlOut"], ["Canvas solutions", "__canvasOut"]]) {
    const arr = w[pair[0] === "HTML solutions" ? "__htmlOut" : "__canvasOut"] || [];
    const unexpected = arr.filter(e => e.err !== SKIP).length;
    if (unexpected) { failed++; console.log(pair[0] + ": " + unexpected + " unexpected error(s) \u2014 bridge not applied?"); }
    console.log(pair[0] + ": " + arr.length + " browser-only (skipped headless)");
  }

  console.log("\n" + (failed ? "FAILED \u2014 " + failed + " problem(s)" : "All headless tests passed \u2713"));
  console.log("Full browser suite (incl. html/canvas): start the server and open /test.html\n");
  process.exit(failed ? 1 : 0);
}
