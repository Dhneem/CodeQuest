/* ============================================================
   CodeQuest — editor.js
   Zero-dependency code editor upgrade for the challenge runner:
   - syntax highlighting (JS / C / C++ / HTML tokenizer)
   - line-number gutter
   - Tab / Shift+Tab indentation, Enter auto-indent
   Technique: a highlighted <pre> sits behind a transparent-text
   <textarea>; both scroll in lockstep. The textarea keeps native
   selection, undo, IME and mobile behavior.
   ============================================================ */

const CodeEditor = {
  langOf(stepKind) {
    if (stepKind === "html" || stepKind === "canvas") return "html";
    if (stepKind === "c") return "c";
    if (stepKind === "cpp") return "cpp";
    return "js";
  },

  /* ---------- tiny tokenizers (return safe-escaped HTML) ---------- */
  esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); },

  highlight(code, lang) {
    if (lang === "html") return this.html(code);
    return this.cLike(code, lang);
  },

  /* JS / C / C++ share a shape: comments, strings, keywords, numbers, punctuation */
  cLike(src, lang) {
    const isCpp = lang === "cpp";
    const kw = isCpp
      ? ["int", "double", "float", "char", "bool", "void", "return", "if", "else", "for", "while", "do",
         "break", "continue", "class", "struct", "public", "private", "using", "namespace", "const",
         "true", "false", "include", "std", "new", "delete", "this"]
      : ["function", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
         "const", "let", "var", "class", "new", "this", "typeof", "of", "in", "true", "false", "null",
         "undefined", "try", "catch", "finally", "throw"];
    const kwRe = new RegExp("^(?:" + kw.join("|") + ")\\b");

    let i = 0, out = "";
    const n = src.length;
    const push = (txt, cls) => { out += cls ? '<span class="' + cls + '">' + txt + "</span>" : txt; };

    while (i < n) {
      const rest = src.slice(i);

      /* comments */
      if (rest.startsWith("//")) {
        let end = src.indexOf("\n", i); if (end < 0) end = n;
        push(this.esc(src.slice(i, end)), "tok-comment"); i = end; continue;
      }
      if (rest.startsWith("/*")) {
        let end = src.indexOf("*/", i + 2); end = end < 0 ? n : end + 2;
        push(this.esc(src.slice(i, end)), "tok-comment"); i = end; continue;
      }
      /* preprocessor (#include <stdio.h>, #define) — C/C++ */
      if ((lang === "c" || isCpp) && rest[0] === "#" && (i === 0 || src[i - 1] === "\n")) {
        let end = src.indexOf("\n", i); if (end < 0) end = n;
        push(this.esc(src.slice(i, end)), "tok-pre"); i = end; continue;
      }
      /* strings */
      if (rest[0] === '"' || rest[0] === "'" || (rest[0] === "`" && !isCpp)) {
        const q = rest[0]; let j = i + 1;
        while (j < n && src[j] !== q) { if (src[j] === "\\") j++; j++; }
        j = Math.min(j + 1, n);
        push(this.esc(src.slice(i, j)), "tok-string"); i = j; continue;
      }
      /* numbers */
      const num = rest.match(/^(\d+\.?\d*)/);
      if (num && /[\s;,)=+\-*/%<>!&|:{[.]/.test(" " + src[i - 1])) {
        push(this.esc(num[1]), "tok-num"); i += num[1].length; continue;
      }
      /* identifiers / keywords */
      const id = rest.match(/^[A-Za-z_$][\w$]*/);
      if (id) {
        const word = id[0];
        const after = rest.slice(word.length).match(/^\s*\(/);
        if (kwRe.test(word)) push(this.esc(word), "tok-kw");
        else if (after) push(this.esc(word), "tok-fn");
        else push(this.esc(word));
        i += word.length; continue;
      }
      /* everything else */
      push(this.esc(rest[0])); i++;
    }
    return out;
  },

  /* HTML: tags, attribute names/values, comments; embedded <script> keeps JS colors */
  html(src) {
    let out = "", i = 0;
    const n = src.length;
    while (i < n) {
      const lt = src.indexOf("<", i);
      if (lt < 0) { out += this.esc(src.slice(i)); break; }
      if (lt > i) out += this.esc(src.slice(i, lt));
      /* comment */
      if (src.startsWith("<!--", lt)) {
        let end = src.indexOf("-->", lt); end = end < 0 ? n : end + 3;
        out += '<span class="tok-comment">' + this.esc(src.slice(lt, end)) + "</span>"; i = end; continue;
      }
      const gt = src.indexOf(">", lt);
      if (gt < 0) { out += this.esc(src.slice(lt)); break; }
      const tag = src.slice(lt, gt + 1);
      const m = tag.match(/^<\/?\s*([a-zA-Z][\w-]*)/);
      if (!m) { out += this.esc(tag); i = gt + 1; continue; }
      /* <script>/<style> bodies highlighted with their own language */
      const name = m[1].toLowerCase();
      const isScript = name === "script", isStyle = name === "style";
      out += '<span class="tok-tag">' + this.esc(src.slice(lt, lt + m[0].length)) + "</span>";
      /* attributes inside the tag */
      const attrPart = src.slice(lt + m[0].length, gt);
      const attrRe = /([\w-]+)(\s*=\s*)("[^"]*"|'[^']*')?/g;
      let am, last = 0;
      while ((am = attrRe.exec(attrPart))) {
        out += this.esc(attrPart.slice(last, am.index));
        out += '<span class="tok-attr">' + this.esc(am[1]) + "</span>" + this.esc(am[2] || "");
        if (am[3]) out += '<span class="tok-string">' + this.esc(am[3]) + "</span>";
        last = am.index + am[0].length;
      }
      out += this.esc(attrPart.slice(last)) + '<span class="tok-tag">' + this.esc(">") + "</span>";
      i = gt + 1;
      if ((isScript || isStyle) && !src.slice(lt, gt + 1).includes("</" + name)) {
        const closeRe = new RegExp("</" + name, "i");
        const close = src.slice(i).search(closeRe);
        const bodyEnd = close < 0 ? n : i + close;
        const body = src.slice(i, bodyEnd);
        out += isScript ? this.cLike(body, "js") : this.css(body);
        i = bodyEnd;
      }
    }
    return out;
  },

  /* minimal CSS highlighter for <style> bodies */
  css(src) {
    return src
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>')
      .replace(/([.#]?[\w-]+)(\s*)(\{)/g, '<span class="tok-tag">$1</span>$2$3')
      .replace(/([\w-]+)(\s*:\s*)([^;{}\n]+)/g, '<span class="tok-attr">$1</span>$2<span class="tok-string">$3</span>');
  },

  /* ---------- mount ---------- */
  mount(textarea) {
    const lang = this.langOf((window.State && State.data && State.data.currentStepKind) || "js");
    const wrap = textarea.closest(".code-wrap");
    if (!wrap || wrap.dataset.enhanced) return;
    wrap.dataset.enhanced = "1";
    wrap.dataset.lang = lang;

    const pre = document.createElement("pre");
    pre.className = "code-hl";
    pre.setAttribute("aria-hidden", "true");
    const gutter = document.createElement("div");
    gutter.className = "code-gutter";
    wrap.prepend(pre, gutter);
    textarea.classList.add("with-gutter");

    const state = { lang };

    const render = () => {
      const code = textarea.value;
      pre.innerHTML = this.highlight(code, state.lang) + "\n";
      const lines = code.split("\n").length;
      if (gutter.childElementCount !== lines) {
        let g = "";
        for (let k = 1; k <= lines; k++) g += k + "\n";
        gutter.textContent = g;
      }
    };

    const sync = () => {
      pre.style.transform = "translate(" + (-textarea.scrollLeft) + "px," + (-textarea.scrollTop) + "px)";
      gutter.style.transform = "translateY(" + (-textarea.scrollTop) + "px)";
    };

    /* keep highlight & preview in the existing input pipeline */
    textarea.addEventListener("input", () => {
      render();
      textarea.dispatchEvent(new CustomEvent("cq:input", { bubbles: true }));
    });
    textarea.addEventListener("scroll", sync);
    new ResizeObserver(sync).observe(textarea);
    textarea.addEventListener("cq:render", () => { render(); sync(); });

    /* Tab / Shift+Tab indent, Enter auto-indent */
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const { selectionStart: s, selectionEnd: en, value: v } = textarea;
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        if (s !== en && v.slice(s, en).includes("\n")) {
          const block = v.slice(lineStart, en);
          const shifted = e.shiftKey
            ? block.replace(/^ {1,2}/gm, "")
            : block.replace(/^/gm, "  ");
          const next = v.slice(0, lineStart) + shifted + v.slice(en);
          textarea.value = next;
          textarea.selectionStart = lineStart;
          textarea.selectionEnd = lineStart + shifted.length;
        } else if (e.shiftKey) {
          const lineText = v.slice(lineStart, s);
          const strip = lineText.match(/^ {1,2}/);
          if (strip) {
            const next = v.slice(0, lineStart) + v.slice(lineStart + strip[0].length);
            textarea.value = next;
            textarea.selectionStart = textarea.selectionEnd = s - strip[0].length;
          }
        } else {
          const next = v.slice(0, s) + "  " + v.slice(en);
          textarea.value = next;
          textarea.selectionStart = textarea.selectionEnd = s + 2;
        }
        render(); textarea.dispatchEvent(new CustomEvent("cq:input", { bubbles: true }));
      } else if (e.key === "Enter") {
        const { selectionStart: s, value: v } = textarea;
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        const line = v.slice(lineStart, s);
        const indent = (line.match(/^\s*/) || [""])[0];
        const extra = /[{(\[]\s*$/.test(line) ? "  " : "";
        if (indent || extra) {
          e.preventDefault();
          const ins = "\n" + indent + extra;
          textarea.value = v.slice(0, s) + ins + v.slice(textarea.selectionEnd);
          textarea.selectionStart = textarea.selectionEnd = s + ins.length;
          render(); textarea.dispatchEvent(new CustomEvent("cq:input", { bubbles: true }));
        }
      }
    });

    state.render = render;
    textarea.__cq = { render, sync };
    render();
  },

  refresh(textarea) {
    if (textarea && textarea.__cq) { textarea.__cq.render(); textarea.__cq.sync(); }
  }
};

window.CodeEditor = CodeEditor;
