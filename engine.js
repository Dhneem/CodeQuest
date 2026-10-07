/* ============================================================
   CodeQuest — engine.js
   Runs user code safely-ish in the browser:
   - js: function-in-scope harness + assertion tests
   - html: iframe sandbox + DOM tests + element interactions
   - canvas: iframe with canvas + pixel & source tests
   - c / cpp: teaching subset of C & C++ transpiled to JS and
     executed in the same harness (printf / cout emulated)
   ============================================================ */

const Engine = {

  /* ---------- JS runner ---------- */
  runJs(code) {
    const logs = [];
    const consoleObj = {
      log: (...args) => logs.push(args.map(a => this.stringify(a)).join(" ")),
      warn: (...a) => logs.push("⚠️ " + a.map(x => this.stringify(x)).join(" ")),
      error: (...a) => logs.push("✖ " + a.map(x => this.stringify(x)).join(" ")),
      info: (...a) => logs.push(a.map(x => this.stringify(x)).join(" "))
    };
    const scope = {};
    try {
      /* capture every top-level function/class/const declaration name dynamically */
      const declRe = /(?:^|\n)\s*(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/g;
      const names = [...new Set([...code.matchAll(declRe)].map(m => m[1]).filter(n => !/^(console|scope|__capture)$/.test(n)))];
      const fn = new Function("console", `"use strict";
        const scope = {};
        const __capture = (name, val) => { scope[name] = val; return val; };
        ${code}
        ;${JSON.stringify(names)}
          .forEach(n => { try { if (typeof eval(n) !== "undefined") scope[n] = eval(n); } catch(e){} });
        return scope;`);
      const result = fn(consoleObj);
      Object.assign(scope, result || {});
    } catch (err) {
      return { ok: false, error: String(err && err.message || err), logs, scope };
    }
    return { ok: true, error: null, logs, scope };
  },

  stringify(v) {
    if (typeof v === "string") return v;
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  },

  /* run a list of test specs against js scope */
  checkJs(tests, scope) {
    return tests.map(t => {
      let pass = false;
      try { pass = !!t.fn(scope); } catch (e) { pass = false; }
      return { label: L(t.label), pass };
    });
  },

  /* ============================================================
     C / C++ teaching subset → JS transpiler + runner
     Supports: #include/#define stripping, using namespace std,
     int/double/char/bool/string declarations, functions with
     typed params/return, if/else, for, while, ++/--, printf,
     cout<< chains, endl, pow/sqrt/abs/floor/ceil/round, casts,
     to_string, C integer-division truncation semantics.
     NOT supported (kept out of the curriculum): pointers,
     structs/classes, arrays passed to functions, vectors, cin.
     ============================================================ */

  runCpp(code, langName) {
    const logs = [];
    const consoleObj = {
      log: (...args) => logs.push(args.map(a => this.stringify(a)).join(" ")),
      warn: (...a) => logs.push("⚠️ " + a.map(x => this.stringify(x)).join(" ")),
      error: (...a) => logs.push("✖ " + a.map(x => this.stringify(x)).join(" ")),
      info: (...a) => logs.push(a.map(x => this.stringify(x)).join(" "))
    };
    const scope = {};
    let compiled;
    try {
      compiled = this.transpileCpp(code, langName);
    } catch (err) {
      return { ok: false, error: "✖ " + (langName === "c" ? "C" : "C++") + " error: " + String(err && err.message || err), logs, scope };
    }
    try {
      const fn = new Function("console", `"use strict";
        const scope = {};
        ${compiled.js}
        ;${JSON.stringify(compiled.funcs)}.forEach(n => { try { if (typeof eval(n) !== "undefined") scope[n] = eval(n); } catch(e){} });
        return scope;`);
      const result = fn(consoleObj);
      Object.assign(scope, result || {});
    } catch (err) {
      return { ok: false, error: "✖ " + (langName === "c" ? "C" : "C++") + " runtime: " + String(err && err.message || err), logs, scope };
    }
    return { ok: true, error: null, logs, scope };
  },

  transpileCpp(code, langName) {
    const isC = langName === "c";
    const funcs = [];

    const stripComments = (src) => src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");

    let src = stripComments(code);

    // remove preprocessor lines (#include, #define …)
    src = src.split("\n").filter(l => !/^[ \t]*#/.test(l)).join("\n");
    src = src.replace(/using[ \t]+namespace[ \t]+std\s*;/g, "");

    const JS_KEYWORDS = new Set(["function","return","if","else","for","while","do","switch","case","break","continue","new","typeof","var","let","const","true","false","null","in","of","try","catch","throw"]);
    const ident = (name) => JS_KEYWORDS.has(name) ? name + "_" : name;

    /* mask string/char literals so conversions never touch them.
       Each call gets a unique token so nested masks never collide. */
    let maskCounter = 0;
    function maskStrings(text) {
      const token = "K" + (maskCounter++);
      const store = [];
      const masked = text.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, (mm) => {
        store.push(mm);
        return "\x00" + token + ":" + (store.length - 1) + "\x00";
      });
      const re = new RegExp("\\x00" + token + ":(\\d+)\\x00", "g");
      return { masked, restore: (t) => t.replace(re, (a, i) => store[+i]) };
    }

    /* index of the } matching the { at openIdx */
    function matchBrace(text, openIdx) {
      let depth = 0;
      for (let i = openIdx; i < text.length; i++) {
        if (text[i] === "{") depth++;
        else if (text[i] === "}") { depth--; if (depth === 0) return i; }
      }
      return -1;
    }

    /* a / b → __div(a, b) outside string literals (chains converge).
       - operands wrapped in __tof(…) or dotted literals (2.0) divide as float
       - in floatCtx (function declared to return double/float) use __fdiv */
    function convertDivision(text, floatCtx) {
      const { masked, restore } = maskStrings(text);
      const operand = "(?:[A-Za-z_$][\\w$]*(?:\\([^()]*\\))?|\\([^()]*\\)|\\d+(?:\\.\\d+)?)";
      const divRe = new RegExp("(" + operand + ")[ \\t]*/[ \\t]*(" + operand + ")", "g");
      let cur = masked;
      for (let i = 0; i < 10; i++) {
        const next = cur.replace(divRe, (all, a, b) => {
          if (a.includes("__tof") || b.includes("__tof") || /\\d+\\.\\d+/.test(a) || /\\d+\\.\\d+/.test(b)) return `(${a}) / (${b})`;
          return (floatCtx ? "__fdiv" : "__div") + `(${a}, ${b})`;
        });
        if (next === cur) break;
        cur = next;
      }
      return restore(cur);
    }

    /* cout << a << "x" << endl;  →  __print(a, "x", "\n"); */
    function convertCout(stmt) {
      let inner = stmt.replace(/;\s*$/, "").replace(/^\s*(cout|cerr)[ \t]*<</, "");
      const parts = splitTop(inner, "<<").map(p => p.trim()).filter(Boolean).map(p => {
        if (/^"/.test(p) || /^'/.test(p) || /^\x00/.test(p)) return p;
        if (p === "endl" || p === "std::endl") return '"\\n"';
        return convExpr(p);
      });
      return `__print(${parts.join(", ")});`;
    }

    function splitTop(s, op) {
      const outP = [];
      let depth = 0, cur = "";
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === "(" || c === "[") depth++;
        else if (c === ")" || c === "]") depth--;
        if (depth === 0 && s.startsWith(op, i)) { outP.push(cur); cur = ""; i += op.length - 1; continue; }
        cur += c;
      }
      outP.push(cur);
      return outP;
    }

    function convExpr(e) {
      return e.replace(/\bstd::/g, "");
    }

    /* ---- statement-level conversion (floatCtx: function returns double/float) ---- */
    function convertBody(bodySrc, floatCtx) {
      const { masked, restore } = maskStrings(bodySrc);
      let b = masked;
      // declarations with init: int x = 5;  double t = 0.0;  const int N = 10;  string s = "..";
      b = b.replace(/\b(?:const[ \t]+)?(?:unsigned[ \t]+)?(int|long|long[ \t]+long|double|float|char|bool|auto|string)[ \t]+([A-Za-z_][A-Za-z0-9_]*)[ \t]*(\[[^\]]*\])?[ \t]*=/g,
        (all, ty, name, arr) => (arr !== undefined ? all : `let ${ident(name)} = `));
      // declarations without init: int count;  double x;
      b = b.replace(/\b(?:unsigned[ \t]+)?(?:int|long|long[ \t]+long|double|float|char|bool|string)[ \t]+([A-Za-z_][A-Za-z0-9_]*)[ \t]*(\[[^\]]*\])?[ \t]*;/g,
        (all, name, arr) => (arr !== undefined ? all : `let ${ident(name)} = 0;`));
      // for-loop header decl: for (int i = 0; …)
      b = b.replace(/for[ \t]*\([ \t]*(?:int|long|double|float|auto|size_t)[ \t]+([A-Za-z_][A-Za-z0-9_]*)[ \t]*=/g,
        (all, name) => `for (let ${ident(name)} =`);
      // C-style casts: (int)(expr) → Math.trunc((expr)); (int) x → Math.trunc(x)
      b = b.replace(/\(\s*int\s*\)\s*\(/g, "Math.trunc((");
      b = b.replace(/\(\s*int\s*\)\s*([A-Za-z_][A-Za-z0-9_]*)/g, "Math.trunc($1)");
      // (double)/(float)/(long) casts → __tof(…) marker so division stays floating point
      b = b.replace(/\(\s*(?:double|float|long(?:[ \t]+long)?)\s*\)\s*\(/g, "__tof((");
      b = b.replace(/\(\s*(?:double|float|long(?:[ \t]+long)?)\s*\)\s*([A-Za-z_][A-Za-z0-9_]*)/g, "__tof($1)");
      // math library: bare calls → Math.* (not preceded by a dot)
      b = b.replace(/(?<!\.)\b(pow|sqrt|fabs|abs|floor|ceil|round)[ \t]*\(/g, (all, fn) => "Math." + (fn === "fabs" ? "abs" : fn) + "(");
      if (!isC) b = b.replace(/(?<!\.)\b(max|min)[ \t]*\(/g, (all, fn) => "Math." + fn + "(");
      // to_string / stoi / std:: helpers
      b = b.replace(/\b(?:std::)?to_string[ \t]*\(/g, "String(");
      b = b.replace(/\b(?:std::)?(?:stoi|stol|atoi)[ \t]*\(([^()]*)\)/g, "parseInt($1, 10)");
      // string method shims
      b = b.replace(/\.length\(\)/g, ".length");
      b = b.replace(/\.substr\(/g, ".slice(");
      b = b.replace(/\.push_back\(/g, ".push(");
      // cout / cerr chains → __print(...)  (before std:: stripping so <<std::endl is seen)
      b = b.replace(/(?:cout|cerr)((?:[ \t]*<<[^;\n]+)+)[ \t]*;/g, (all, chain) => convertCout("cout" + chain + ";"));
      // leftover std:: prefixes
      b = b.replace(/\bstd::/g, "");
      // any remaining bare endl (rare, outside cout)
      b = b.replace(/\bendl\b/g, '"\\n"');
      // printf → __printf
      b = b.replace(/(?<!\w)printf[ \t]*\(/g, "__printf(");
      // compound int division: x /= n → x = __div(x, n)
      b = b.replace(/([A-Za-z_$][\w$]*)[ \t]*\/=[ \t]*([^;\n]+);/g, "$1 = __div($1, $2);");
      // integer division semantics: a / b → __div(a, b) or __fdiv in float context
      b = convertDivision(b, floatCtx);
      return restore(b);
    }

    /* ---- rewrite each non-main function to JS ----
       The type token must be a real C/C++ type keyword so that the
       generated "function name(...) {" lines never re-match. */
    const C_TYPE_TOKEN = /(?:(?:unsigned|signed|const|inline|static|long|struct)[ \t\*&]+)*(?:int|double|float|char|bool|void|string|auto|size_t)[ \t\*&]+/;
    function rewriteFunctions(text) {
      const re = new RegExp("(?:^|\\n)[ \\t]*(" + C_TYPE_TOKEN.source + ")([A-Za-z_][A-Za-z0-9_]*)[ \\t]*\\(([^)]*)\\)[ \\t]*(?:const[ \\t]*)?\\{");
      let guard = 0;
      while (guard++ < 200) {
        const mm = re.exec(text);
        if (!mm) break;
        const retType = mm[1].trim();
        const fname = ident(mm[2]);
        const openIdx = mm.index + mm[0].length - 1;
        const endIdx = matchBrace(text, openIdx);
        if (endIdx < 0) throw new Error("missing } for function " + mm[2]);
        const body = text.slice(mm.index + mm[0].length, endIdx);
        const params = mm[3].split(",").map(p => p.trim()).filter(Boolean).map(p => {
          const parts = p.replace(/\b(?:const|struct)\b/g, "").replace(/&|\*/g, "").trim().split(/\s+/);
          return ident(parts[parts.length - 1]);
        });
        if (!funcs.includes(fname)) funcs.push(fname);
        const newBody = convertBody(body, /\b(?:double|float)\b/.test(retType));
        const isVoid = /\bvoid\b/.test(retType);
        const fnJs = `function ${fname}(${params.join(", ")}) {\n${newBody}\n${isVoid ? "" : "  return undefined;\n"}}`;
        text = text.slice(0, mm.index) + "\n" + fnJs + "\n" + text.slice(endIdx + 1);
      }
      return text;
    }

    /* ---- 1. extract main() before rewriting other functions ---- */
    let mainExec = "";
    const mainRe = /(?:^|\n)[ \t]*(?:int|void)[ \t]+main[ \t]*\([^)]*\)[ \t]*\{/;
    const mainMatch = mainRe.exec(src);
    if (mainMatch) {
      const openIdx = mainMatch.index + mainMatch[0].length - 1;
      const endIdx = matchBrace(src, openIdx);
      if (endIdx < 0) throw new Error("missing } for main");
      const raw = src.slice(mainMatch.index + mainMatch[0].length, endIdx);
      // strip top-level returns so the JS wrapper keeps running to the scope capture
      mainExec = convertBody(raw, false).replace(/\breturn\b[^;\n]*;/g, ";");
      src = src.slice(0, mainMatch.index) + "\n" + src.slice(endIdx + 1);
    }

    /* ---- 2. rewrite remaining helper functions ---- */
    src = rewriteFunctions(src);

    const prelude = `
      function __print(...args) { console.log(args.map(a => (typeof a === "boolean" ? (a ? "true" : "false") : String(a))).join("")); }
      function __printf(fmt, ...args) {
        let ai = 0;
        const s = String(fmt).replace(/%[-+ #0]*[0-9]*(?:\\.[0-9]+)?[dioxXufFeEgGscp%]/g, (spec) => {
          if (spec === "%%") return "%";
          const v = args[ai++];
          const prec = /\.([0-9]+)/.exec(spec);
          if (/[fFeE]/.test(spec)) return Number(v).toFixed(prec ? parseInt(prec[1], 10) : 6);
          if (/[gG]/.test(spec)) return String(Number(v));
          if (/[dioxXu]/.test(spec)) return String(Math.round(Number(v)));
          return String(v);
        });
        console.log(s);
      }
      function __div(a, b) {
        const r = a / b;
        return (Number.isInteger(a) && Number.isInteger(b)) ? Math.trunc(r) : r;
      }
      function __fdiv(a, b) { return a / b; }
      function __tof(v) { return v; }
      const string = String;
    `;

    const js = prelude + "\n" + src + "\n" + mainExec;
    if (/\b#include/.test(js)) throw new Error("preprocessor left");
    return { js, funcs };
  },

  checkCpp(tests, scope) {
    return tests.map(t => {
      let pass = false;
      try { pass = !!t.fn(scope); } catch (e) { pass = false; }
      return { label: L(t.label), pass };
    });
  },

  /* ---------- HTML runner (sandboxed iframe -> document) ---------- */
  buildHtmlDoc(code) {
    // Ensure scripts execute: inject into a full doc with base reset.
    return "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>" + code + "</body></html>";
  },

  /* Load code into a hidden iframe and run DOM tests.
     Interactions are done through the iframe's document.
     IMPORTANT: the iframe must stay attached while tests run. */
  runHtml(code) {
    return new Promise((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:800px;height:600px;";
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
      document.body.appendChild(iframe);

      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        resolve(result); // caller removes the iframe after tests run
      };

      iframe.srcdoc = this.buildHtmlDoc(code);
      iframe.onload = () => {
        setTimeout(() => {
          try {
            const doc = iframe.contentDocument;
            if (!doc) return finish({ ok: false, error: "Could not access sandbox document", logs: [] });
            finish({ ok: true, error: null, logs: [], doc, iframe });
          } catch (err) {
            finish({ ok: false, error: String(err), logs: [] });
          }
        }, 120);
      };
      iframe.onerror = () => finish({ ok: false, error: "Sandbox load error", logs: [] });
      setTimeout(() => finish({ ok: false, error: "Sandbox timeout", logs: [] }), 4000);
    });
  },

  checkHtml(tests, doc) {
    return tests.map(t => {
      let pass = false;
      try { pass = !!t.fn(doc); } catch (e) { pass = false; }
      return { label: L(t.label), pass };
    });
  },

  /* ---------- combined check for a step ---------- */
  async checkStep(step, code) {
    if (step.kind === "js") {
      const run = this.runJs(code);
      if (!run.ok) {
        return { results: [], logs: run.logs, error: run.error, allPass: false };
      }
      const results = this.checkJs(step.tests, run.scope);
      return { results, logs: run.logs, error: null, allPass: results.every(r => r.pass) };
    }
    if (step.kind === "c" || step.kind === "cpp") {
      const run = this.runCpp(code, step.kind);
      if (!run.ok) {
        return { results: [], logs: run.logs, error: run.error, allPass: false };
      }
      const results = this.checkCpp(step.tests, run.scope);
      return { results, logs: run.logs, error: null, allPass: results.every(r => r.pass) };
    }
    // html & canvas: run in sandbox, then test DOM (canvas tests read pixels through the doc)
    const run = await this.runHtml(code);
    if (!run.ok) {
      return { results: [], logs: run.logs, error: run.error, allPass: false };
    }
    const results = this.checkHtml(step.tests, run.doc);
    run.iframe.remove();
    return { results, logs: run.logs, error: null, allPass: results.every(r => r.pass) };
  },

  /* Build the live preview document for html/canvas steps */
  previewDoc(code) {
    return this.buildHtmlDoc(code);
  }
};
