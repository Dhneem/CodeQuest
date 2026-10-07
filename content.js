/* ============================================================
   CodeQuest — content.js
   The bilingual curriculum: 3 paths, units, challenges, projects,
   concepts, quizzes, hints, solutions, explore topics.
   All user-facing text is {en, ar}. Code is always real code.
   ============================================================ */

const PATHS = ["web", "se", "game"];

const PATH_INFO = {
  web: {
    color: "#38bdf8",
    skills: ["HTML", "CSS", "Flexbox", "Responsive", "JavaScript", "DOM", "Events", "Forms", "Validation", "Components", "localStorage", "APIs", "CSS Grid"],
    growth: {
      before: { en: "\"I don't know how HTML works.\"", ar: "\"لا أعرف كيف تعمل HTML.\"" },
      now: { en: "\"I can build a responsive, interactive website with HTML, CSS and JavaScript.\"", ar: "\"أستطيع بناء موقع تفاعلي ومتجاوب باستخدام HTML وCSS وJavaScript.\"" }
    }
  },
  se: {
    color: "#a78bfa",
    skills: ["Variables", "Functions", "Loops", "Algorithms", "Sorting", "Searching", "Big-O", "Recursion", "Higher-order Functions", "C", "Stack", "Queue", "Debugging", "Git", "Architecture", "Testing"],
    growth: {
      before: { en: "\"I can't write a program from scratch.\"", ar: "\"لا أستطيع كتابة برنامج من الصفر.\"" },
      now: { en: "\"I can design algorithms, use data structures, and build a complete application.\"", ar: "\"أستطيع تصميم خوارزميات واستخدام هياكل البيانات وبناء تطبيق كامل.\"" }
    }
  },
  game: {
    color: "#f472b6",
    skills: ["Game Loop", "Canvas", "Animation", "Input", "Collision", "AI", "Game States", "Levels", "Physics", "C++", "OOP", "Enemy AI"],
    growth: {
      before: { en: "\"Games feel like magic to me.\"", ar: "\"الألعاب تبدو لي كالسحر.\"" },
      now: { en: "\"I can build a complete playable game with mechanics, AI and levels.\"", ar: "\"أستطيع بناء لعبة كاملة قابلة للعب بميكانيكا وذكاء اصطناعي ومستويات.\"" }
    }
  }
};

/* ---------- helper shorthands ---------- */
const E = (en, ar) => ({ en, ar });

/* ---------------- WEB DEVELOPMENT PATH ---------------- */
const WEB_UNITS = [
  {
    id: "w1", emoji: "🧱",
    title: E("HTML Foundations", "أساسيات HTML"),
    desc: E("Structure is where every website begins. You'll build real pages from your very first step.", "الهيكل هو بداية كل موقع. ستبني صفحات حقيقية من خطوتك الأولى."),
    steps: [
      {
        id: "s-html-first", kind: "html", xp: 20, skill: "HTML",
        title: E("Your first real webpage", "أول صفحة ويب حقيقية لك"),
        brief: E(
          "Every website you've ever visited — built with the same thing you're about to write: **HTML**.\n\nHTML is not programming yet — it's *structure*. You mark what things **are**: a heading, a paragraph, a button.\n\nA heading looks like: `<h1>My text</h1>` — a tag opens, content lives inside, a tag closes.",
          "كل موقع زرته في حياتك — مبني بنفس الشيء الذي ستكتبه الآن: **HTML**.\n\nHTML ليست برمجة بعد — إنها *هيكل*. أنت تحدد ما هي الأشياء: عنوان، فقرة، زر.\n\nالعنوان يُكتب هكذا: `<h1>نصك هنا</h1>` — وسم يُفتح، والمحتوى بداخله، ثم وسم يُغلق."),
        task: E("Create a heading `<h1>` whose text is exactly **CodeQuest**.", "أنشئ عنوانًا `<h1>` نصه بالضبط **CodeQuest**."),
        starter: "<h1>...write here...</h1>\n<p>This page is yours now.</p>",
        tests: [
          { label: E("There is an <h1> element", "يوجد عنصر <h1>"), fn: (d) => !!d.querySelector("h1") },
          { label: E("The <h1> says \"CodeQuest\"", "الـ <h1> نصه \"CodeQuest\""), fn: (d) => (d.querySelector("h1")||{textContent:""}).textContent.trim() === "CodeQuest" }
        ],
        hints: [
          E("Replace the text between `<h1>` and `</h1>` with CodeQuest — nothing else inside the tags changes.", "استبدل النص بين `<h1>` و `</h1>` بكلمة CodeQuest — لا تغيّر الوسوم نفسها."),
          E("It should look like: <h1>CodeQuest</h1>", "يجب أن تبدو هكذا: <h1>CodeQuest</h1>")
        ],
        solution: "<h1>CodeQuest</h1>\n<p>This page is yours now.</p>"
      },
      {
        id: "s-html-structure", kind: "concept", xp: 10, skill: "HTML",
        title: E("The anatomy of a page", "تشريح الصفحة"),
        concept: E(
          "A full HTML page has a skeleton every browser expects:\n\n```\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>invisible page info</title>\n  </head>\n  <body>\n    ...everything visible lives here...\n  </body>\n</html>\n```\n\n- `head` holds *information about* the page (title, styles, scripts).\n- `body` holds *what people see*.\n- Tags nest like boxes — whatever opens last closes first.\n\nBrowsers are forgiving: they'll render a page without this skeleton. But professionals always include it, because it tells the browser exactly how to read your document.",
          "صفحة HTML الكاملة لها هيكل يتوقعه كل متصفح:\n\n```\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>معلومات غير مرئية عن الصفحة</title>\n  </head>\n  <body>\n    ...كل ما هو مرئي يعيش هنا...\n  </body>\n</html>\n```\n\n- `head` يحمل *معلومات عن* الصفحة (العنوان، الأنماط، السكربتات).\n- `body` يحمل *ما يراه الناس*.\n- الوسوم تتداخل مثل الصناديق — ما يُفتح أخيرًا يُغلق أولًا.\n\nالمتصفحات متسامحة: ستعرض الصفحة حتى بدون هذا الهيكل. لكن المحترفين يضعونه دائمًا، لأنه يخبر المتصفح بدقة كيف يقرأ مستندك."),
        quiz: { q: E("Where does visible content belong?", "أين يجب أن يكون المحتوى المرئي؟"), options: E(["Inside <body>", "Inside <head>", "Inside <title>"], ["داخل <body>", "داخل <head>", "داخل <title>"]), answer: 0 }
      },
      {
        id: "s-html-list", kind: "html", xp: 20, skill: "HTML",
        title: E("Lists: give things order", "القوائم: رتّب الأشياء"),
        brief: E(
          "Menus, product lists, steps, features — the web is full of lists.\n\n```\n<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>\n```\n\n`<ul>` = unordered list (bullet points). `<ol>` = ordered (numbers). Each `<li>` is one item.",
          "القوائم والمنتجات والخطوات والميزات — الويب مليء بالقوائم.\n\n```\n<ul>\n  <li>العنصر الأول</li>\n  <li>العنصر الثاني</li>\n</ul>\n```\n\n`<ul>` = قائمة غير مرتبة (نقاط). `<ol>` = مرتبة (أرقام). كل `<li>` عنصر واحد."),
        task: E("Build a `<ul>` with at least **3** `<li>` items — your hobbies, plans, anything.", "ابنِ `<ul>` فيها **3** عناصر `<li>` على الأقل — هواياتك أو خططك أو أي شيء."),
        starter: "<h2>My list</h2>\n<ul>\n  <li>...</li>\n</ul>",
        tests: [
          { label: E("There is a <ul> list", "توجد قائمة <ul>"), fn: (d) => !!d.querySelector("ul") },
          { label: E("The list has at least 3 items", "القائمة فيها 3 عناصر على الأقل"), fn: (d) => d.querySelectorAll("ul li").length >= 3 }
        ],
        hints: [
          E("Each item needs its own `<li>...</li>` line inside the `<ul>`.", "كل عنصر يحتاج سطر `<li>...</li>` خاص به داخل `<ul>`."),
          E("Three items = three <li> tags between <ul> and </ul>.", "ثلاثة عناصر = ثلاث وسوم <li> بين <ul> و </ul>.")
        ],
        solution: "<h2>My list</h2>\n<ul>\n  <li>Learn HTML</li>\n  <li>Learn CSS</li>\n  <li>Build a website</li>\n</ul>"
      },
      {
        id: "s-html-form", kind: "html", xp: 20, skill: "HTML",
        title: E("Inputs & buttons: pages that listen", "الحقول والأزرار: صفحات تصغي إليك"),
        brief: E(
          "Interactive pages need *controls*: places to type and things to press.\n\n```\n<input id=\"email\" placeholder=\"you@example.com\">\n<button id=\"go\">Sign up</button>\n```\n\nThe `id` is the element's name tag — JavaScript finds elements by their id. That's the bridge between structure and behavior, coming up in a few steps.",
          "الصفحات التفاعلية تحتاج *أدوات تحكم*: أماكن للكتابة وأشياء للضغط.\n\n```\n<input id=\"email\" placeholder=\"you@example.com\">\n<button id=\"go\">سجّل</button>\n```\n\nالـ `id` هو اسم العنصر — جافاسكريبت يجد العناصر من خلال id. هذا هو الجسر بين الهيكل والسلوك، وهو قادم بعد قليل."),
        task: E("Add a text `<input>` with id **name**, and a `<button>` with id **go**.", "أضف حقل `<input>` من نوع نص بمعرف **name**، وزر `<button>` بمعرف **go**."),
        starter: "<h2>Join us</h2>\n<!-- add the input and button here -->",
        tests: [
          { label: E("There is an input with id \"name\"", "يوجد حقل بمعرف \"name\""), fn: (d) => !!d.getElementById("name") },
          { label: E("There is a button with id \"go\"", "يوجد زر بمعرف \"go\""), fn: (d) => !!d.getElementById("go") }
        ],
        hints: [
          E("<input id=\"name\"> — inputs are self-closing, no </input> needed.", "<input id=\"name\"> — حقل الإدخال لا يحتاج وسم إغلاق."),
          E("The button wraps its label: <button id=\"go\">Text</button>", "الزر يلتف حول نصه: <button id=\"go\">نص</button>")
        ],
        solution: "<h2>Join us</h2>\n<input id=\"name\" placeholder=\"Your name\">\n<button id=\"go\">Join</button>"
      },
      {
        id: "p-web-1", kind: "html", xp: 60, project: true, skill: "HTML",
        title: E("PROJECT: Interactive webpage", "مشروع: صفحة تفاعلية"),
        brief: E(
          "Your first **project**. You already know enough to build something real.\n\nYou'll build a page with a button that *changes* the page. This is the heart of all interactivity: an event (click) causes a change (new content).",
          "أول **مشروع** لك. تعرف الآن ما يكفي لبناء شيء حقيقي.\n\nستبني صفحة فيها زر *يغيّر* الصفحة. هذا هو قلب التفاعل كله: حدث (نقرة) يسبب تغييرًا (محتوى جديد)."),
        task: E("Build a page with: a `<button id=\"colorBtn\">`, an empty `<p id=\"msg\">`. When the button is **clicked**, the paragraph's text must change (to anything non-empty). A working `<script>` is provided in the starter — study it!", "ابنِ صفحة فيها: `<button id=\"colorBtn\">` و `<p id=\"msg\">` فارغة. عند **النقر** على الزر يجب أن يتغير نص الفقرة (إلى أي نص غير فارغ). يوجد `<script>` جاهز في البداية — اقرأه جيدًا!"),
        starter: "<h1>My interactive page</h1>\n<button id=\"colorBtn\">Surprise me</button>\n<p id=\"msg\"></p>\n\n<script>\n  // This code runs when the page loads.\n  // querySelector finds an element. addEventListener waits for a click.\n  document.getElementById('colorBtn').addEventListener('click', function () {\n    document.getElementById('msg').textContent = 'You clicked me! 🎉';\n  });\n</script>",
        tests: [
          { label: E("Button and paragraph exist", "الزر والفقرة موجودان"), fn: (d) => !!d.getElementById("colorBtn") && !!d.getElementById("msg") },
          { label: E("Clicking the button changes the message", "النقر على الزر يغيّر الرسالة"), fn: (d) => { const b = d.getElementById("colorBtn"), p = d.getElementById("msg"); if (!b || !p) return false; const before = p.textContent; b.click(); return p.textContent.trim().length > 0 && p.textContent !== before; } }
        ],
        hints: [
          E("The starter already works — make sure the ids in your HTML exactly match the ids in the script.", "الكود الجاهز يعمل — تأكد أن المعرفات في HTML مطابقة تمامًا للمعرفات في السكربت."),
          E("If it doesn't work: are the ids spelled exactly `colorBtn` and `msg`? Capital letters matter!", "إذا لم يعمل: هل المعرفات مكتوبة بالضبط `colorBtn` و `msg`؟ الحروف الكبيرة مهمة!")
        ],
        solution: "<h1>My interactive page</h1>\n<button id=\"colorBtn\">Surprise me</button>\n<p id=\"msg\"></p>\n<script>\n  document.getElementById('colorBtn').addEventListener('click', function () {\n    document.getElementById('msg').textContent = 'You clicked me! 🎉';\n  });\n</script>"
      }
    ]
  },
  {
    id: "w2", emoji: "🎨",
    title: E("CSS Styling", "التنسيق بـ CSS"),
    desc: E("Structure is the skeleton — CSS is the style. You'll make pages look designed, not just correct.", "الهيكل هو الهيكل العظمي — والـ CSS هو الأناقة. ستجعل صفحاتك تبدو مصممة، لا صحيحة فقط."),
    steps: [
      {
        id: "s-css-selectors", kind: "html", xp: 20, skill: "CSS",
        title: E("Selectors: aiming at elements", "المحددات: استهدف العناصر"),
        brief: E(
          "CSS answers one question: *which elements get which styles?*\n\n```\n/* by tag */\np { color: gray; }\n\n/* by class */\n.card { border-radius: 10px; }\n\n/* by id — one specific element */\n#intro { color: tomato; }\n```\n\nColors can be names (`tomato`), hex (`#ff6347`), or rgb values.",
          "الـ CSS يجيب على سؤال واحد: *أي العناصر تحصل على أي أنماط؟*\n\n```\n/* بالوسم */\np { color: gray; }\n\n/* بالصنف */\n.card { border-radius: 10px; }\n\n/* بالمعرف — عنصر واحد محدد */\n#intro { color: tomato; }\n```\n\nالألوان تكون أسماء (`tomato`) أو هكس (`#ff6347`) أو قيم rgb."),
        task: E("Give the paragraph with id **intro** the color **tomato**, using CSS.", "امنح الفقرة ذات المعرف **intro** اللون **tomato** باستخدام CSS."),
        starter: "<p id=\"intro\">Style me!</p>\n\n<style>\n  /* your rule here */\n</style>",
        tests: [
          { label: E("A <style> block exists", "يوجد وسم <style>"), fn: (d) => !!d.querySelector("style") },
          { label: E("#intro is tomato-colored", "لون #intro أصبح tomato"), fn: (d) => { const el = d.getElementById("intro"); return !!el && getComputedStyle(el).color === "rgb(255, 99, 71)"; } }
        ],
        hints: [
          E("The id selector starts with a hash: `#intro { ... }`", "محدد المعرف يبدأ بعلامة # : `#intro { ... }`"),
          E("`#intro { color: tomato; }` — property, colon, value, semicolon.", "`#intro { color: tomato; }` — الخاصية، نقطتان، القيمة، فاصلة منقوطة.")
        ],
        solution: "<p id=\"intro\">Style me!</p>\n<style>\n  #intro { color: tomato; }\n</style>"
      },
      {
        id: "s-css-box", kind: "concept", xp: 10, skill: "CSS",
        title: E("The box model", "نموذج الصندوق"),
        concept: E(
          "To CSS, **every element is a rectangle** — a box with layers:\n\n```\n┌─────────────────────────┐\n│  margin  (space outside) │\n│  ┌───────────────────┐  │\n│  │ border            │  │\n│  │  ┌─────────────┐  │  │\n│  │  │ padding     │  │  │\n│  │  │  [content]  │  │  │\n│  │  └─────────────┘  │  │\n│  └───────────────────┘  │\n└─────────────────────────┘\n```\n\n- **content** — the text/image itself\n- **padding** — breathing room *inside* the border\n- **border** — the edge line\n- **margin** — personal space *outside*, pushing neighbors away\n\nAlmost every layout mystery (\"why is there a gap?!\") is the box model at work. DevTools' inspector shows these layers for any element — press F12 on any real site and look.",
          "بالنسبة للـ CSS، **كل عنصر هو مستطيل** — صندوق له طبقات:\n\n```\n┌─────────────────────────┐\n│  margin  (مسافة خارجية)  │\n│  ┌───────────────────┐  │\n│  │ border            │  │\n│  │  ┌─────────────┐  │  │\n│  │  │ padding     │  │  │\n│  │  │  [المحتوى]   │  │  │\n│  │  └─────────────┘  │  │\n│  └───────────────────┘  │\n└─────────────────────────┘\n```\n\n- **content** — النص أو الصورة نفسها\n- **padding** — مسافة تنفس *داخل* الحدود\n- **border** — خط الحافة\n- **margin** — مساحة شخصية *خارجية* تدفع الجيران بعيدًا\n\nتقريبًا كل لغز تخطيط (\"لماذا توجد فجوة؟!\") هو نموذج الصندوق في العمل. أدوات المطور تعرض هذه الطبقات لأي عنصر — اضغط F12 في أي موقع حقيقي وانظر."),
        quiz: { q: E("You want space *inside* an element, between its border and its text. What do you use?", "تريد مسافة *داخل* العنصر بين حدوده ونصه. ماذا تستخدم؟"), options: E(["padding", "margin", "border"], ["padding", "margin", "border"]), answer: 0 }
      },
      {
        id: "s-css-flex", kind: "html", xp: 20, skill: "Flexbox",
        title: E("Flexbox: layouts that behave", "فليكس بوكس: تخطيطات منضبطة"),
        brief: E(
          "For years, centering things in CSS was a joke among developers. Flexbox ended it.\n\n```\n.container {\n  display: flex;            /* children line up in a row */\n  justify-content: center;  /* horizontally centered */\n  align-items: center;      /* vertically centered */\n  gap: 16px;                /* space between children */\n}\n```\n\nOne line — `display: flex` — changes everything about how children are laid out.",
          "لسنوات، توسيط العناصر في CSS كان نكتة بين المطورين. فليكس بوكس أنهى تلك الحقبة.\n\n```\n.container {\n  display: flex;            /* الأبناء في صف واحد */\n  justify-content: center;  /* توسيط أفقي */\n  align-items: center;      /* توسيط رأسي */\n  gap: 16px;                /* مسافة بين الأبناء */\n}\n```\n\nسطر واحد — `display: flex` — يغيّر كل شيء في ترتيب الأبناء."),
        task: E("Make `.row` a flex container, and give its children a `gap` of at least 8px.", "اجعل `.row` حاوية flex، وامنح أبناءها `gap` مقداره 8px على الأقل."),
        starter: "<div class=\"row\">\n  <div class=\"box\">1</div>\n  <div class=\"box\">2</div>\n  <div class=\"box\">3</div>\n</div>\n\n<style>\n  .box { padding: 14px; background: #38bdf8; color: #04202b; border-radius: 8px; }\n  .row { /* your rule */ }\n</style>",
        tests: [
          { label: E(".row is display:flex", "الـ .row صارت display:flex"), fn: (d) => { const el = d.querySelector(".row"); return !!el && getComputedStyle(el).display === "flex"; } },
          { label: E("The gap is at least 8px", "الـ gap يساوي 8px على الأقل"), fn: (d) => { const el = d.querySelector(".row"); if (!el) return false; return parseFloat(getComputedStyle(el).gap) >= 8; } }
        ],
        hints: [
          E("Target the class with a dot: `.row { ... }`", "استهدف الصنف بنقطة: `.row { ... }`"),
          E("`.row { display: flex; gap: 12px; }`", "`.row { display: flex; gap: 12px; }`")
        ],
        solution: "<div class=\"row\">\n  <div class=\"box\">1</div>\n  <div class=\"box\">2</div>\n  <div class=\"box\">3</div>\n</div>\n<style>\n  .box { padding: 14px; background: #38bdf8; color: #04202b; border-radius: 8px; }\n  .row { display: flex; gap: 12px; }\n</style>"
      },
      {
        id: "p-web-2", kind: "html", xp: 60, project: true, skill: "Responsive",
        title: E("PROJECT: Landing page hero", "مشروع: واجهة صفحة هبوط"),
        brief: E(
          "Real websites open with a **hero**: full-height, centered, with a headline and a call-to-action button. You'll build one — and make it **responsive** (adapt to phones) with a media query.\n\n```\n@media (max-width: 600px) {\n  /* styles for small screens only */\n}\n```",
          "المواقع الحقيقية تفتح بـ **hero**: قسم بارز في أعلى الصفحة يتصدره عنوان كبير وزر إجراء رئيسي. ستبني واحدًا — وتجعله **متجاوبًا** (يتكيف مع الجوال) باستخدام media query.\n\n```\n@media (max-width: 600px) {\n  /* أنماط للشاشات الصغيرة فقط */\n}\n```"),
        task: E("Build a hero section: `#hero` must be a flex container with a centered `<h1>` and a `<button>`. Also include a `@media` block (any width) — that's what makes it responsive.", "ابنِ قسم hero: يجب أن يكون `#hero` حاوية flex فيها `<h1>` وزر `<button>` ممركزين. وأضف أيضًا كتلة `@media` (بأي عرض) — فهي التي تجعله متجاوبًا."),
        starter: "<section id=\"hero\">\n  <h1>Build things. Learn fast.</h1>\n  <button>Start now</button>\n</section>\n\n<style>\n  /* make #hero a centered flex column, min-height 100vh */\n  /* add a @media block */\n</style>",
        tests: [
          { label: E("#hero exists with an <h1> and <button>", "#hero موجود فيه <h1> و <button>"), fn: (d) => { const h = d.getElementById("hero"); return !!h && !!h.querySelector("h1") && !!h.querySelector("button"); } },
          { label: E("#hero is a flex container", "#hero حاوية flex"), fn: (d) => { const h = d.getElementById("hero"); return !!h && getComputedStyle(h).display === "flex"; } },
          { label: E("A @media block exists (responsiveness!)", "توجد كتلة @media (تجاوب!)"), fn: (d) => { const s = d.querySelector("style"); return !!s && /@media/i.test(s.textContent); } }
        ],
        hints: [
          E("`#hero { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }`", "`#hero { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }`"),
          E("`@media (max-width: 600px) { #hero h1 { font-size: 28px; } }` — any rule inside counts.", "`@media (max-width: 600px) { #hero h1 { font-size: 28px; } }` — أي قاعدة داخلها تُحتسب.")
        ],
        solution: "<section id=\"hero\">\n  <h1>Build things. Learn fast.</h1>\n  <button>Start now</button>\n</section>\n<style>\n  #hero { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 18px; }\n  @media (max-width: 600px) { #hero h1 { font-size: 28px; } }\n</style>"
      }
    ]
  },
  {
    id: "w9", emoji: "📐",
    title: E("CSS Grid: two-dimensional layouts", "شبكة CSS: تخطيطات ثنائية الأبعاد"),
    desc: E("Flexbox lines things up along one axis. Grid rules the whole plane — rows and columns together. Galleries, dashboards and page shells where every cell lines up.", "الفليكس يرتب في محور واحد. والشبكة تحكم المستوى كله — صفوفًا وأعمدة معًا. عارضات صور ولوحات تحكم وهيكل صفحات كل خلية فيها تنتظم."),
    steps: [
      {
        id: "s-grid-concept", kind: "concept", xp: 10, skill: "CSS Grid",
        title: E("Rows AND columns: thinking in grids", "صفوف وأعمدة معًا: التفكير بالشبكات"),
        concept: E(
          "Flexbox aligns items along **one** axis. CSS Grid controls **both** at once — rows *and* columns:\n\n```css\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```\n\n- `display: grid` — children become grid items, lined up in a row.\n- `repeat(3, 1fr)` — three columns, each one *fraction* of the free space, so always equal.\n- `gap` — the gutter between cells (no more margin math).\n- Rows are **implicit**: the grid creates as many as it needs.\n\nWhen to use which:\n- **Flex** → one dimension: a nav bar, a row of buttons, centering one thing.\n- **Grid** → two dimensions: a page shell, a dashboard, a gallery — whenever cells must line up in *both* directions.\n\nAnd the superpower, in the next step: `grid-template-areas` lets you **name regions** and place elements by name — a layout that reads like a floor plan.",
          "الفليكس يرتب العناصر في **محور واحد**. وشبكة CSS تحكم **كليهما** معًا — صفوفًا *وأعمدة*:\n\n```css\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```\n\n- `display: grid` — الأبناء يصبحون عناصر الشبكة، مصطفوفين في صف.\n- `repeat(3, 1fr)` — ثلاثة أعمدة، كل عمود *كسر* من المساحة الحرة، فتتساوى دائمًا.\n- `gap` — الفاصل بين الخلايا (لا حسابات margin بعد اليوم).\n- الصفوف **ضمنية**: الشبكة تنشئ منها ما تحتاجه.\n\nمتى تستخدم أيهما:\n- **Flex** → بُعد واحد: شريط تنقل، صف أزرار، توسيط عنصر واحد.\n- **Grid** → بُعدان: هيكل صفحة، لوحة تحكم، عارضة صور — أيما كانت الخلايا تنتظم في *كلا* الاتجاهين.\n\nوعملتها السحرية، في الخطوة التالية: `grid-template-areas` يسمح لك **تسمية المناطق** ووضع العناصر بأسمائها — تخطيط يُقرأ كمخطط معماري."),
        quiz: { q: E("Which declaration turns an element into a grid container?", "ما الذي يجعل العنصر حاوية شبكة؟"), options: E(["display: grid", "grid: true", "position: grid"], ["display: grid", "grid: true", "position: grid"]), answer: 0 }
      },
      {
        id: "s-grid-basics", kind: "html", xp: 25, skill: "CSS Grid",
        title: E("Your first grid", "أول شبكة لك"),
        brief: E(
          "One line creates the grid, one line shapes it:\n\n```css\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n```\n\nThe six cells now flow into a **3 × 2** table automatically — no floats, no clearfix hacks, no counting pixels. Change `repeat(3, ...)` to `repeat(4, ...)` and the whole gallery reflows in a single edit.",
          "سطر واحد ينشئ الشبكة، وسطر واحد يشكلها:\n\n```css\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n```\n\nالخلايا الست الآن تتدفق تلقائيًا في جدول **3 × 2** — بلا floats ولا حيل clearfix ولا عدّ بكسلات. غيّر `repeat(3, ...)` إلى `repeat(4, ...)` وستعيد العارضة كلها تنظيمها بتعديل واحد."),
        task: E("Make `.gallery` a grid with exactly **3 equal columns** and a `gap` of at least **12px**.", "اجعل `.gallery` شبكة بأعمدة **3 متساوية** بالضبط و`gap` لا يقل عن **12 بكسل**."),
        starter: "<div class=\"gallery\">\n  <div class=\"cell\">1</div>\n  <div class=\"cell\">2</div>\n  <div class=\"cell\">3</div>\n  <div class=\"cell\">4</div>\n  <div class=\"cell\">5</div>\n  <div class=\"cell\">6</div>\n</div>\n\n<style>\n  .cell { padding: 16px; background: #38bdf8; color: #04202b; border-radius: 8px; font-weight: 700; text-align: center; }\n  .gallery { /* turn this into a grid */ }\n</style>",
        tests: [
          { label: E(".gallery is a grid container", "الـ .gallery حاوية شبكة"), fn: (d) => { const el = d.querySelector(".gallery"); return !!el && getComputedStyle(el).display === "grid"; } },
          { label: E("It has 3 columns", "يوجد بها 3 أعمدة"), fn: (d) => { const el = d.querySelector(".gallery"); if (!el) return false; return getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length >= 3; } },
          { label: E("The gap is at least 12px", "الـ gap لا يقل عن 12px"), fn: (d) => { const el = d.querySelector(".gallery"); if (!el) return false; return parseFloat(getComputedStyle(el).gap) >= 12; } }
        ],
        hints: [
          E("`.gallery { display: grid; grid-template-columns: repeat(3, 1fr); }` — `1fr` is one equal share of the width.", "`.gallery { display: grid; grid-template-columns: repeat(3, 1fr); }` — ‏`1fr` نصيب متساوٍ من العرض."),
          E("Add `gap: 12px;` — it belongs to the container, not the cells.", "أضف `gap: 12px;` — إنها خاصية الحاوية لا الخلايا.")
        ],
        solution: "<div class=\"gallery\">\n  <div class=\"cell\">1</div>\n  <div class=\"cell\">2</div>\n  <div class=\"cell\">3</div>\n  <div class=\"cell\">4</div>\n  <div class=\"cell\">5</div>\n  <div class=\"cell\">6</div>\n</div>\n\n<style>\n  .cell { padding: 16px; background: #38bdf8; color: #04202b; border-radius: 8px; font-weight: 700; text-align: center; }\n  .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n</style>"
      },
      {
        id: "s-grid-areas", kind: "html", xp: 30, skill: "CSS Grid",
        title: E("Named regions: layout as a floor plan", "مناطق مسمّاة: التخطيط كمخطط معماري"),
        brief: E(
          "Real pages aren't rows of boxes — they're **regions**: a header across the top, a sidebar, a main area. Grid lets you declare the map, then place elements *by name*:\n\n```css\n#layout {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas: 'header header' 'nav main';\n}\nheader { grid-area: header; }\nnav    { grid-area: nav; }\nmain   { grid-area: main; }\n```\n\nEach quoted string is **one row**; identical names merge into a single region. The layout now reads like a floor plan — change the template and every element jumps to its new room.",
          "الصفحات الحقيقية ليست صفوفًا من المربعات — إنها **مناطق**: ترويسة تمتد أعلى الصفحة، شريط جانبي، ومنطقة رئيسية. الشبكة تتيح لك إعلان الخريطة ثم وضع العناصر *بالاسم*:\n\n```css\n#layout {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas: 'header header' 'nav main';\n}\nheader { grid-area: header; }\nnav    { grid-area: nav; }\nmain   { grid-area: main; }\n```\n\nكل نص بين قوسين هو **صف واحد**؛ والأسماء المتشابهة تندمج في منطقة واحدة. صار التخطيط يُقرأ كمخطط معماري — غيّر القالب وستنتقل كل عناصرها إلى مكانها الجديد."),
        task: E("On `#layout` add `grid-template-areas: 'header header' 'nav main'` (the header spans both columns), then place each child by name: `grid-area: header`, `grid-area: nav`, `grid-area: main`.", "أضف على `#layout` ‏`grid-template-areas: 'header header' 'nav main'` (الترويسة تمتد عبر العمودين)، ثم ضع كل ابن بالاسم: `grid-area: header` و`grid-area: nav` و`grid-area: main`."),
        starter: "<div id=\"layout\">\n  <header>My Site</header>\n  <nav>Home · About · Contact</nav>\n  <main>Everything else lives here.</main>\n</div>\n\n<style>\n  #layout { display: grid; grid-template-columns: 200px 1fr; gap: 10px; /* + template-areas */ }\n  header, nav, main { padding: 14px; border-radius: 10px; }\n  header { background: #f472b6; }\n  nav { background: #a78bfa; }\n  main { background: #38bdf8; }\n  /* place header, nav and main by name */\n</style>",
        tests: [
          { label: E("#layout is a grid container", "الـ #layout حاوية شبكة"), fn: (d) => { const el = d.getElementById("layout"); return !!el && getComputedStyle(el).display === "grid"; } },
          { label: E("The template names header and main regions", "القالب يسمّي منطقتي header و main"), fn: (d) => { const el = d.getElementById("layout"); if (!el) return false; const areas = getComputedStyle(el).gridTemplateAreas; return /header/.test(areas) && /main/.test(areas); } },
          { label: E("header and nav are placed by name", "header و nav موضوعان بالاسم"), fn: (d) => { const h = d.querySelector("#layout header"), n = d.querySelector("#layout nav"); if (!h || !n) return false; return /header/.test(getComputedStyle(h).gridArea) && /nav/.test(getComputedStyle(n).gridArea); } }
        ],
        hints: [
          E("Each quoted string in `grid-template-areas` is one row; identical names merge: 'header header' makes the header span both columns.", "كل نص مُقتوت في `grid-template-areas` صف واحد؛ والأسماء المتشابهة تندمج: 'header header' يجعل الترويسة تعمّم العمودين."),
          E("`header { grid-area: header; }` — the value is the region's name from the template.", "`header { grid-area: header; }` — القيمة هي اسم المنطقة من القالب.")
        ],
        solution: "<div id=\"layout\">\n  <header>My Site</header>\n  <nav>Home · About · Contact</nav>\n  <main>Everything else lives here.</main>\n</div>\n\n<style>\n  #layout { display: grid; grid-template-columns: 200px 1fr; grid-template-areas: 'header header' 'nav main'; gap: 10px; }\n  header, nav, main { padding: 14px; border-radius: 10px; }\n  header { background: #f472b6; grid-area: header; }\n  nav { background: #a78bfa; grid-area: nav; }\n  main { background: #38bdf8; grid-area: main; }\n</style>"
      },
      {
        id: "p-web-grid", kind: "html", xp: 80, project: true, skill: "CSS Grid",
        title: E("PROJECT: gallery that reflows", "مشروع: عارضة تتبدّل"),
        brief: E(
          "Every real gallery **reflows**: three columns on a laptop, two on a tablet, one on a phone — without writing three layouts. The one-line trick:\n\n```css\n#gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 12px;\n}\n```\n\n`minmax(140px, 1fr)` = *at least* 140px, *at most* one share. `auto-fit` asks the browser for as many columns as fit — responsiveness that comes from the grid itself. A `@media` block then tunes the details for phones.",
          "كل عارضة حقيقية **تتبدّل**: ثلاثة أعمدة على الحاسوب، اثنان على اللوح، واحد على الجوال — دون كتابة ثلاثة تخطيطات. الحيلة بسطر واحد:\n\n```css\n#gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 12px;\n}\n```\n\n`minmax(140px, 1fr)` = *140px على الأقل*، و*نصيبًا واحدًا على الأكثر*. و`auto-fit` يطلب من المتصفح عدد الأعمدة الذي يتسع — تجاوب نابع من الشبكة نفسها. ثم تضبط كتلة `@media` التفاصيل للجوال."),
        task: E("Make `#gallery` a grid with `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))` and a `gap`, then add a `@media` block for small screens (any rule inside it counts).", "اجعل `#gallery` شبكة بـ `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))` و`gap`، ثم أضف كتلة `@media` للشاشات الصغيرة (أي قاعدة داخلها تُحتسب)."),
        starter: "<h2>Gallery</h2>\n<div id=\"gallery\">\n  <div class=\"shot\">🌊</div>\n  <div class=\"shot\">🏜️</div>\n  <div class=\"shot\">🏙️</div>\n  <div class=\"shot\">🌲</div>\n  <div class=\"shot\">🏔️</div>\n  <div class=\"shot\">🌙</div>\n</div>\n\n<style>\n  .shot { height: 90px; background: #1e293b; border-radius: 12px; display: grid; place-items: center; font-size: 28px; }\n  #gallery { /* repeat(auto-fit, minmax(140px, 1fr)) + gap */ }\n  /* a @media block for phones */\n</style>",
        tests: [
          { label: E("#gallery is a grid container", "الـ #gallery حاوية شبكة"), fn: (d) => { const el = d.getElementById("gallery"); return !!el && getComputedStyle(el).display === "grid"; } },
          { label: E("It reflows with auto-fit + minmax", "تتبدّل بـ auto-fit + minmax"), fn: (d) => { const s = d.querySelector("style"); if (!s) return false; const css = s.textContent; return /auto-fit/.test(css) && /minmax\(/.test(css); } },
          { label: E("A @media block handles small screens", "كتلة @media تتعامل مع الشاشات الصغيرة"), fn: (d) => { const s = d.querySelector("style"); return !!s && /@media/i.test(s.textContent); } }
        ],
        hints: [
          E("`grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));` — every cell at least 140px, as many columns as fit.", "`grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));` — كل خلية 140px على الأقل، وعدد الأعمدة كما يتسع."),
          E("`@media (max-width: 520px) { .shot { height: 60px; } }` — smaller screens, smaller tiles.", "`@media (max-width: 520px) { .shot { height: 60px; } }` — شاشات أصغر وبلاطات أصغر.")
        ],
        solution: "<h2>Gallery</h2>\n<div id=\"gallery\">\n  <div class=\"shot\">🌊</div>\n  <div class=\"shot\">🏜️</div>\n  <div class=\"shot\">🏙️</div>\n  <div class=\"shot\">🌲</div>\n  <div class=\"shot\">🏔️</div>\n  <div class=\"shot\">🌙</div>\n</div>\n\n<style>\n  .shot { height: 90px; background: #1e293b; border-radius: 12px; display: grid; place-items: center; font-size: 28px; }\n  #gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }\n  @media (max-width: 520px) { .shot { height: 60px; } }\n</style>"
      }
    ]
  },
  {
    id: "w3", emoji: "⚡",
    title: E("JavaScript Basics", "أساسيات جافاسكريبت"),
    desc: E("Now the pages come alive. Variables, functions, conditions, loops — the engine of all web behavior.", "الآن تنبض الصفحات بالحياة. المتغيرات والدوال والشروط والحلقات — محرك سلوك الويب كله."),
    steps: [
      {
        id: "s-js-vars", kind: "js", xp: 20, skill: "JavaScript",
        title: E("Variables & functions", "المتغيرات والدوال"),
        brief: E(
          "A **variable** is a labeled box for a value. A **function** is a reusable machine: input goes in, output comes out.\n\n```javascript\nconst city = \"Riyadh\";          // box labeled 'city'\n\nfunction greet(name) {          // machine named 'greet'\n  return \"Hello, \" + name;      // output\n}\n\ngreet(\"Sara\");                  // → \"Hello, Sara\"\n```\n\n`const` declares a value that won't be reassigned. `return` sends the result back out.",
          "**المتغير** صندوق بعلامة يحمل قيمة. **الدالة** آلة قابلة لإعادة الاستخدام: مدخل يدخل، ومخرج يخرج.\n\n```javascript\nconst city = \"الرياض\";          // صندوق اسمه 'city'\n\nfunction greet(name) {          // آلة اسمها 'greet'\n  return \"مرحبًا، \" + name;      // المخرج\n}\n\ngreet(\"سارة\");                  // ← \"مرحبًا، سارة\"\n```\n\n`const` يعرّف قيمة لن تُستبدل. `return` يرسل النتيجة للخارج."),
        task: E("Write a function `greet(name)` that returns a greeting **containing** the name (any words you like), and a `const myName` holding your name as a string.", "اكتب دالة `greet(name)` تُرجع تحية **تحتوي** على الاسم (بأي كلمات تحبها)، و `const myName` تحمل اسمك كنص."),
        starter: "// Write your function here\nfunction greet(name) {\n  // return a greeting including name\n}\n\n// Your name as a string:\nconst myName = // ...",
        tests: [
          { label: E("greet(\"Sara\") includes \"Sara\"", "greet(\"Sara\") تحتوي \"Sara\""), fn: (s) => typeof s.greet === "function" && String(s.greet("Sara")).includes("Sara") },
          { label: E("myName is a non-empty string", "myName نص غير فارغ"), fn: (s) => typeof s.myName === "string" && s.myName.length > 0 }
        ],
        hints: [
          E("Inside the function, build the result with `+`: `return \"Hello, \" + name;`", "داخل الدالة ابنِ النتيجة بـ `+`: `return \"مرحبًا، \" + name;`"),
          E("`const myName = \"Ahmed\";` — strings need quotes.", "`const myName = \"أحمد\";` — النصوص تحتاج علامات اقتباس.")
        ],
        solution: "function greet(name) {\n  return \"Hello, \" + name;\n}\nconst myName = \"Developer\";"
      },
      {
        id: "s-js-cond", kind: "js", xp: 20, skill: "JavaScript",
        title: E("Decisions with if", "القرارات بـ if"),
        brief: E(
          "Programs make decisions with `if / else`:\n\n```javascript\nfunction canVote(age) {\n  if (age >= 18) {\n    return true;\n  } else {\n    return false;\n  }\n}\n```\n\nComparison operators: `>` `<` `>=` `<=` `===` (equals) `!==` (not equals). Once a `return` runs, the function exits immediately.",
          "البرامج تتخذ القرارات بـ `if / else`:\n\n```javascript\nfunction canVote(age) {\n  if (age >= 18) {\n    return true;\n  } else {\n    return false;\n  }\n}\n```\n\nمعاملات المقارنة: `>` `<` `>=` `<=` `===` (يساوي) `!==` (لا يساوي). بمجرد أن يعمل `return` تخرج الدالة فورًا."),
        task: E("Write `canVote(age)` returning `true` if age is 18 or more, `false` otherwise.", "اكتب `canVote(age)` تُرجع `true` إذا كان العمر 18 أو أكثر، و `false` غير ذلك."),
        starter: "function canVote(age) {\n  // your decision here\n}",
        tests: [
          { label: E("canVote(20) is true", "canVote(20) تساوي true"), fn: (s) => s.canVote && s.canVote(20) === true },
          { label: E("canVote(16) is false", "canVote(16) تساوي false"), fn: (s) => s.canVote && s.canVote(16) === false },
          { label: E("canVote(18) is true (boundary!)", "canVote(18) تساوي true (الحدود!)"), fn: (s) => s.canVote && s.canVote(18) === true }
        ],
        hints: [
          E("The condition goes in parentheses: `if (age >= 18) { return true; }`", "الشرط يوضع بين قوسين: `if (age >= 18) { return true; }`"),
          E("Careful with the boundary: \"18 or more\" means `>=`, not `>`.", "انتبه للحدود: \"18 أو أكثر\" تعني `>=` وليس `>`.")
        ],
        solution: "function canVote(age) {\n  if (age >= 18) {\n    return true;\n  }\n  return false;\n}"
      },
      {
        id: "s-js-loop", kind: "js", xp: 25, skill: "Loops",
        title: E("Loops: do it 1000 times", "الحلقات: كرر ألف مرة"),
        brief: E(
          "Computers excel at repetition. The `for` loop runs code again and again:\n\n```javascript\nlet total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total = total + i;   // runs for i = 1,2,3,4,5\n}\n// total is 15\n```\n\nThree parts: **start** (`let i = 1`), **keep-going condition** (`i <= 5`), **step** (`i++` adds 1).",
          "الحاسوب بارع في التكرار. حلقة `for` تشغّل الكود مرة تلو الأخرى:\n\n```javascript\nlet total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total = total + i;   // تعمل لـ i = 1,2,3,4,5\n}\n// الناتج 15\n```\n\nثلاثة أجزاء: **البداية** (`let i = 1`)، **شرط الاستمرار** (`i <= 5`)، **الخطوة** (`i++` تضيف 1)."),
        task: E("Write `sumTo(n)` that returns the sum 1 + 2 + … + n. `sumTo(5)` → `15`.", "اكتب `sumTo(n)` التي تُرجع مجموع 1 + 2 + … + n. `sumTo(5)` ← `15`."),
        starter: "function sumTo(n) {\n  // use a for loop\n}",
        tests: [
          { label: E("sumTo(5) is 15", "sumTo(5) تساوي 15"), fn: (s) => s.sumTo && s.sumTo(5) === 15 },
          { label: E("sumTo(1) is 1", "sumTo(1) تساوي 1"), fn: (s) => s.sumTo && s.sumTo(1) === 1 },
          { label: E("sumTo(100) is 5050", "sumTo(100) تساوي 5050"), fn: (s) => s.sumTo && s.sumTo(100) === 5050 }
        ],
        hints: [
          E("Create `let total = 0;` before the loop, add `i` to it inside, return it after.", "أنشئ `let total = 0;` قبل الحلقة، وأضف `i` إليها داخلها، وأرجعها بعدها."),
          E("The loop should count while `i <= n` — including n itself.", "الحلقة تستمر طالما `i <= n` — بما فيه n نفسها.")
        ],
        solution: "function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total = total + i;\n  }\n  return total;\n}"
      },
      {
        id: "s-js-array", kind: "js", xp: 25, skill: "JavaScript",
        title: E("Arrays: many values, one box", "المصفوفات: قيم كثيرة في صندوق واحد"),
        brief: E(
          "An **array** holds an ordered list of values:\n\n```javascript\nconst scores = [90, 72, 88];\nscores.length;      // 3\nscores[0];          // 90  (counting starts at 0!)\n\n// .map transforms every element:\nconst doubled = scores.map(function (s) { return s * 2; });\n// [180, 144, 176]\n```\n\n`.map` hands each element to your function and collects the results into a new array.",
          "**المصفوفة** تحمل قائمة مرتبة من القيم:\n\n```javascript\nconst scores = [90, 72, 88];\nscores.length;      // 3\nscores[0];          // 90  (العد يبدأ من 0!)\n\n// ‏.map تحوّل كل عنصر:\nconst doubled = scores.map(function (s) { return s * 2; });\n// [180, 144, 176]\n```\n\n`.map` تمرر كل عنصر إلى دالتك وتجمع النتائج في مصفوفة جديدة."),
        task: E("Write `doubleAll(numbers)` that returns a new array with every number doubled. Bonus: try it with `.map`.", "اكتب `doubleAll(numbers)` التي تُرجع مصفوفة جديدة كل رقم فيها مضاعف. تحدي إضافي: جرّبها بـ `.map`."),
        starter: "function doubleAll(numbers) {\n  // return a NEW array, don't modify the original\n}",
        tests: [
          { label: E("doubleAll([1,2,3]) → [2,4,6]", "doubleAll([1,2,3]) ← [2,4,6]"), fn: (s) => { if (!s.doubleAll) return false; const r = s.doubleAll([1,2,3]); return JSON.stringify(r) === JSON.stringify([2,4,6]); } },
          { label: E("Empty array → empty array", "مصفوفة فارغة ← مصفوفة فارغة"), fn: (s) => s.doubleAll && JSON.stringify(s.doubleAll([])) === "[]" },
          { label: E("Doesn't modify the original", "لا تعدّل المصفوفة الأصلية"), fn: (s) => { if (!s.doubleAll) return false; const a = [1,2]; s.doubleAll(a); return a[0] === 1 && a[1] === 2; } }
        ],
        hints: [
          E("The `.map` one-liner: `return numbers.map(function (n) { return n * 2; });`", "بسطر واحد مع `.map`: `return numbers.map(function (n) { return n * 2; });`"),
          E("Or build a loop: start `const out = [];` push `n * 2` for each element, return out.", "أو بحلقة: ابدأ بـ `const out = [];` وأضف `n * 2` لكل عنصر ثم أرجع out.")
        ],
        solution: "function doubleAll(numbers) {\n  return numbers.map(function (n) {\n    return n * 2;\n  });\n}"
      }
    ]
  },
  {
    id: "w4", emoji: "🕹️",
    title: E("DOM & Events", "الـ DOM والأحداث"),
    desc: E("This is where HTML and JavaScript shake hands. Clicks, typing, live updates — real interactivity.", "هنا تصافح HTML وجافاسكريبت. نقرات، كتابة، تحديثات حية — تفاعل حقيقي."),
    steps: [
      {
        id: "s-dom-query", kind: "html", xp: 25, skill: "DOM",
        title: E("The DOM: your page as objects", "الـ DOM: صفحتك ككائنات"),
        brief: E(
          "When the browser loads HTML, it builds the **DOM** — a live object version of your page that JavaScript can grab and change.\n\n```javascript\nconst btn = document.getElementById('counter');\nbtn.addEventListener('click', function () { /* runs on every click */ });\n```\n\n**Event** = something that happens (click, keypress, input). `addEventListener` = \"when X happens, run my function\".",
          "عندما يحمّل المتصفح HTML، يبني **الـ DOM** — نسخة كائنية حية من صفحتك يستطيع جافاسكريبت أن يمسكها ويغيرها.\n\n```javascript\nconst btn = document.getElementById('counter');\nbtn.addEventListener('click', function () { /* يعمل مع كل نقرة */ });\n```\n\n**الحدث** = شيء يحدث (نقرة، ضغطة زر، كتابة). `addEventListener` = \"عندما يحدث X، نفّذ دالتي\"."),
        task: E("The starter has a button `#counter` and a `<span id=\"count\">0</span>`. Write the JavaScript so every click increases the number by 1.", "في البداية زر `#counter` و `<span id=\"count\">0</span>`. اكتب جافاسكريبت بحيث كل نقرة تزيد الرقم بمقدار 1."),
        starter: "<button id=\"counter\">Clicked <span id=\"count\">0</span> times</button>\n\n<script>\n  let count = 0;\n  const btn = document.getElementById('counter');\n  const label = document.getElementById('count');\n\n  // your addEventListener here\n</script>",
        tests: [
          { label: E("Clicking once shows 1", "نقرة واحدة تُظهر 1"), fn: (d) => { const b = d.getElementById("counter"); const c = d.getElementById("count"); if (!b || !c) return false; const v0 = parseInt(c.textContent, 10) || 0; b.click(); return (parseInt(c.textContent, 10) || 0) === v0 + 1; } },
          { label: E('Clicking twice shows 2', 'نقرتان تُظهران 2'), fn: (d) => { const b = d.getElementById('counter'); const c = d.getElementById('count'); if (!b || !c) return false; const v0 = parseInt(c.textContent, 10) || 0; b.click(); const v1 = parseInt(c.textContent, 10) || 0; b.click(); const v2 = parseInt(c.textContent, 10) || 0; return v2 === v0 + 2; } },
        ],
        hints: [
          E("Inside the click function: add 1 to `count`, then write it into `label.textContent`.", "دالة النقر: زد `count` بواحد، ثم اكتبها في `label.textContent`."),
          E("`btn.addEventListener('click', function () { count++; label.textContent = count; });`", "`btn.addEventListener('click', function () { count++; label.textContent = count; });`")
        ],
        solution: "<button id=\"counter\">Clicked <span id=\"count\">0</span> times</button>\n<script>\n  let count = 0;\n  const btn = document.getElementById('counter');\n  const label = document.getElementById('count');\n  btn.addEventListener('click', function () {\n    count++;\n    label.textContent = count;\n  });\n</script>"
      },
      {
        id: "s-dom-input", kind: "html", xp: 25, skill: "Events",
        title: E("Listening to typing", "الإصغاء إلى الكتابة"),
        brief: E(
          "Inputs fire an **`input` event** on every keystroke — that's how live search, validation and autocompletion work.\n\n```javascript\ninput.addEventListener('input', function () {\n  output.textContent = input.value;   // .value = what's typed\n});\n```\n\nButtons use `.textContent` for their text, but inputs use **`.value`** — a classic first bug!",
          "حقول الإدخال تطلق حدث **`input`** مع كل حرف — هكذا تعمل البحث الحي والتحقق والإكمال التلقائي.\n\n```javascript\ninput.addEventListener('input', function () {\n  output.textContent = input.value;   // ‏.value = المكتوب\n});\n```\n\nالأزرار تستخدم `.textContent` لنصها، لكن حقول الإدخال تستخدم **`.value`** — خطأ كلاسيكي للمبتدئين!"),
        task: E("Make it live: as the user types in `#who`, the `<p id=\"greet\">` must update to contain their text.", "اجعلها حية: أثناء كتابة المستخدم في `#who` يجب أن يتحدث `<p id=\"greet\">` ليتضمن النص المكتوب."),
        starter: "<input id=\"who\" placeholder=\"Type your name\">\n<p id=\"greet\">Hello, stranger!</p>\n\n<script>\n  const who = document.getElementById('who');\n  const greet = document.getElementById('greet');\n\n  // listen for 'input' on who\n</script>",
        tests: [
          { label: E("Typing \"Sara\" updates the greeting", "كتابة \"Sara\" تحدّث التحية"), fn: (d) => { const i = d.getElementById("who"), g = d.getElementById("greet"); if (!i || !g) return false; i.value = "Sara"; i.dispatchEvent(new Event("input")); return g.textContent.includes("Sara"); } }
        ],
        hints: [
          E("The event name is the string `'input'`, and the typed text is `who.value`.", "اسم الحدث هو النص `'input'`، والنص المكتوب هو `who.value`."),
          E("`who.addEventListener('input', function () { greet.textContent = 'Hello, ' + who.value; });`", "`who.addEventListener('input', function () { greet.textContent = 'مرحبًا، ' + who.value; });`")
        ],
        solution: "<input id=\"who\" placeholder=\"Type your name\">\n<p id=\"greet\">Hello, stranger!</p>\n<script>\n  const who = document.getElementById('who');\n  const greet = document.getElementById('greet');\n  who.addEventListener('input', function () {\n    greet.textContent = 'Hello, ' + who.value;\n  });\n</script>"
      },
      {
        id: "p-web-3", kind: "html", xp: 70, project: true, skill: "DOM",
        title: E("PROJECT: Interactive quiz app", "مشروع: تطبيق اختبار تفاعلي"),
        brief: E(
          "Milestone time — a **mini web app**. Quiz apps combine everything so far: structure, styling, DOM selection, events, and logic.\n\nYour job: wire up the answering logic. The starter has question HTML and the JavaScript skeleton.",
          "حان وقت المحطة — **تطبيق ويب مصغّر**. تطبيقات الاختبار تجمع كل ما سبق: الهيكل والتنسيق والـ DOM والأحداث والمنطق.\n\nمهمتك: توصيل منطق الإجابة. في البداية سؤال جاهز وهيكل جافاسكريبت."),
        task: E("Each `.answer` button has `data-correct=\"true\"` on the right one. When a button is clicked: add class **correct** to it if it's the right answer, otherwise add class **wrong**.", "كل زر `.answer` يحمل `data-correct=\"true\"` على الإجابة الصحيحة. عند النقر على زر: أضف الصنف **correct** له إذا كان صحيحًا، وإلا أضف الصنف **wrong**."),
        starter: "<h2>What does CSS stand for?</h2>\n<button class=\"answer\" data-correct=\"true\">Cascading Style Sheets</button>\n<button class=\"answer\" data-correct=\"false\">Computer Style Sheets</button>\n<button class=\"answer\" data-correct=\"false\">Creative Styling System</button>\n\n<script>\n  const buttons = document.querySelectorAll('.answer');\n\n  buttons.forEach(function (btn) {\n    // 1. add a click listener to btn\n    // 2. check btn.dataset.correct === 'true'\n    // 3. add 'correct' or 'wrong' class: btn.classList.add('...')\n  });\n</script>\n\n<style>\n  .answer { display: block; margin: 8px 0; padding: 10px 16px; }\n  .correct { background: #22c55e; color: white; }\n  .wrong { background: #ef4444; color: white; }\n</style>",
        tests: [
          { label: E("Clicking the right answer adds .correct", "النقر على الإجابة الصحيحة يضيف .correct"), fn: (d) => { const btns = [...d.querySelectorAll(".answer")]; const right = btns.find(b => b.dataset.correct === "true"); if (!right) return false; right.click(); return right.classList.contains("correct"); } },
          { label: E("Clicking a wrong answer adds .wrong", "النقر على إجابة خاطئة يضيف .wrong"), fn: (d) => { const btns = [...d.querySelectorAll(".answer")]; const wrong = btns.find(b => b.dataset.correct === "false"); if (!wrong) return false; wrong.click(); return wrong.classList.contains("wrong") && !wrong.classList.contains("correct"); } }
        ],
        hints: [
          E("`btn.dataset.correct` reads `data-correct` — it's the string `'true'` or `'false'`.", "`btn.dataset.correct` يقرأ `data-correct` — وهي نص `'true'` أو `'false'`."),
          E("`btn.addEventListener('click', function () { if (btn.dataset.correct === 'true') btn.classList.add('correct'); else btn.classList.add('wrong'); });`", "`btn.addEventListener('click', function () { if (btn.dataset.correct === 'true') btn.classList.add('correct'); else btn.classList.add('wrong'); });`")
        ],
        solution: "<h2>What does CSS stand for?</h2>\n<button class=\"answer\" data-correct=\"true\">Cascading Style Sheets</button>\n<button class=\"answer\" data-correct=\"false\">Computer Style Sheets</button>\n<button class=\"answer\" data-correct=\"false\">Creative Styling System</button>\n<style>\n  .answer { display: block; margin: 8px 0; padding: 10px 16px; }\n  .correct { background: #22c55e; color: white; }\n  .wrong { background: #ef4444; color: white; }\n</style>\n<script>\n  const buttons = document.querySelectorAll('.answer');\n  buttons.forEach(function (btn) {\n    btn.addEventListener('click', function () {\n      if (btn.dataset.correct === 'true') {\n        btn.classList.add('correct');\n      } else {\n        btn.classList.add('wrong');\n      }\n    });\n  });\n</script>"
      }
    ]
  },
  {
    id: "w7", emoji: "📝",
    title: E("Forms & Validation", "النماذج والتحقق"),
    desc: E("A page that listens is good. A page that answers back — “that email looks wrong” — is professional. Build forms that guard their own gates.", "الصفحة التي تصغي شيء جيد، لكن الصفحة التي ترد — «هذا البريد يبدو خاطئًا» — هذه احترافية. ابنِ نماذج تحرس بواباتها بنفسها."),
    steps: [
      {
        id: "s-form-basics", kind: "html", xp: 25, skill: "Forms",
        title: E("Forms: structured asking", "النماذج: سؤال منظم"),
        brief: E(
          "The `<form>` tag wraps inputs into one unit that can be *submitted* as a whole — that's how logins and signups work.\n\n`\n<form id=\"signup\">\n  <input id=\"email\" type=\"email\" placeholder=\"you@example.com\">\n  <input id=\"pass\" type=\"password\" placeholder=\"Password\">\n  <button type=\"submit\">Create account</button>\n</form>\n`\n\n- `type=\"email\"` and `type=\"password\"` change *behavior* (validation, hidden characters) — not just looks.\n- A button with `type=\"submit\"` fires the form's **submit event** — the hook where validation lives, next step.",
          "وسم `<form>` يجمع الحقول في وحدة واحدة يمكن *إرسالها* ككل — هكذا تعمل تسجيلات الدخول وإنشاء الحسابات.\n\n`\n<form id=\"signup\">\n  <input id=\"email\" type=\"email\" placeholder=\"you@example.com\">\n  <input id=\"pass\" type=\"password\" placeholder=\"كلمة المرور\">\n  <button type=\"submit\">أنشئ حسابًا</button>\n</form>\n`\n\n- `type=\"email\"` و `type=\"password\"` يغيّران *السلوك* (التحقق، إخفاء الحروف) — لا الشكل فقط.\n- الزر ذو `type=\"submit\"` يطلق حدث **submit** للنموذج — وهناك يسكن التحقق في الخطوة التالية."),
        task: E("Build a `<form id=\"signup\">` containing an email input with id **email** (`type=\"email\"`), a password input with id **pass** (`type=\"password\"`), and a submit button.", "ابنِ `<form id=\"signup\">` يضم حقل بريد بمعرف **email** (`type=\"email\"`)، وحقل كلمة مرور بمعرف **pass** (`type=\"password\"`)، وزر إرسال."),
        starter: "<h2>Create account</h2>\n<!-- build the form here -->",
        tests: [
          { label: E("The email input is inside the form with type=email", "حقل البريد داخل النموذج و type=email"), fn: (d) => { const f = d.getElementById("signup"), e = d.getElementById("email"); return !!f && !!e && f.contains(e) && e.type === "email"; } },
          { label: E("The password input has type=password", "حقل كلمة المرور نوعه password"), fn: (d) => { const p = d.getElementById("pass"); return !!p && p.type === "password"; } },
          { label: E("The form has a submit button", "النموذج فيه زر إرسال"), fn: (d) => { const f = d.getElementById("signup"); return !!f && !!f.querySelector("button[type='submit'], button:not([type='button'], [type='reset'])"); } }
        ],
        hints: [
          E("`type` is just an attribute: `<input id=\"email\" type=\"email\">` — the password input works the same way.", "`type` مجرد خاصية: `<input id=\"email\" type=\"email\">` — وحقل كلمة المرور يُبنى بالطريقة نفسها."),
          E("A plain `<button>` inside a form submits by default — you only need `type=\"submit\"` if you want to be explicit.", "الزر العادي `<button>` داخل النموذج يُرسل افتراضيًا — لست بحاجة إلى `type=\"submit\"` إلا إذا أردت أن تكون صريحًا.")
        ],
        solution: "<h2>Create account</h2>\n<form id=\"signup\">\n  <input id=\"email\" type=\"email\" placeholder=\"you@example.com\">\n  <input id=\"pass\" type=\"password\" placeholder=\"Password\">\n  <button type=\"submit\">Sign up</button>\n</form>"
      },
      {
        id: "s-form-validate", kind: "html", xp: 25, skill: "Validation",
        title: E("Validating like a professional", "التحقق كالمحترفين"),
        brief: E(
          "Submitting a form would normally reload the page. Validation stops that and checks the data first:\n\n`\nform.addEventListener('submit', function (e) {\n  e.preventDefault();                       // stay on the page\n  const v = email.value.trim();             // trim kills stray spaces\n  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/; // something@something.something\n  if (!re.test(v)) {\n    err.textContent = 'Please enter a valid email.';\n    return;\n  }\n  err.textContent = '';\n  email.value = '';\n});\n`\n\nThree habits worth stealing: `preventDefault()` keeps control, `.trim()` forgives accidental spaces, and a **regex** (`re.test(v)`) checks the shape of the value before you trust it.",
          "إرسال النموذج يعيد تحميل الصفحة عادةً. التحقق يمنع ذلك ويفحص البيانات أولًا:\n\n`\nform.addEventListener('submit', function (e) {\n  e.preventDefault();                       // نبقَ في الصفحة\n  const v = email.value.trim();             // trim يمسح الفراغات الزائدة\n  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/; // شيء@شيء.شيء\n  if (!re.test(v)) {\n    err.textContent = 'من فضلك أدخل بريدًا صحيحًا.';\n    return;\n  }\n  err.textContent = '';\n  email.value = '';\n});\n`\n\nثلاث عادات تستحق التقليد: `preventDefault()` تبقيك في السيطرة، و `.trim()` يتسامح مع الفراغات العرضية، و **التعابير النمطية** (`re.test(v)`) تفحص شكل القيمة قبل أن تثق بها."),
        task: E("Wire up the form in the starter: on submit, if the email is valid, clear the message `#err` **and** the input; if not, put a helpful message in `#err` and keep the input unchanged.", "وصّل النموذج الجاهز: عند الإرسال، إذا كان البريد صالحًا امسح رسالة `#err` **و**الحقل نفسه؛ وإلا اكتب رسالة مفيدة في `#err` واترك الحقل كما هو."),
        starter: "<h2>Join the club</h2>\n<form id=\"signup\">\n  <input id=\"email\" type=\"email\" placeholder=\"you@example.com\">\n  <p id=\"err\"></p>\n  <button type=\"submit\">Sign up</button>\n</form>\n\n<script>\n  const form = document.getElementById('signup');\n  const email = document.getElementById('email');\n  const err = document.getElementById('err');\n\n  form.addEventListener('submit', function (e) {\n    // 1. stop the page reload\n    // 2. read email.value.trim()\n    // 3. test it against the email regex\n    // 4. valid? clear err and the input. invalid? explain in err.\n  });\n</script>",
        tests: [
          { label: E("Invalid email shows a message and keeps the input", "البريد غير الصالح يُظهر رسالة ويُبقي الحقل"), fn: (d) => { const f = d.getElementById("signup"), e = d.getElementById("email"), err = d.getElementById("err"); if (!f || !e || !err) return false; e.value = "not-an-email"; err.textContent = ""; f.dispatchEvent(new Event("submit")); return err.textContent.trim().length > 0 && e.value !== ""; } },
          { label: E("Valid email clears the message and the input", "البريد الصالح يمسح الرسالة والحقل"), fn: (d) => { const f = d.getElementById("signup"), e = d.getElementById("email"), err = d.getElementById("err"); if (!f || !e || !err) return false; e.value = "sara@example.com"; err.textContent = "old error"; f.dispatchEvent(new Event("submit")); return err.textContent.trim() === "" && e.value === ""; } }
        ],
        hints: [
          E("Stop the default first: `e.preventDefault()` — then `email.value.trim()` gives you the cleaned text.", "أوقف السلوك الافتراضي أولًا: `e.preventDefault()` — ثم `email.value.trim()` يعطيك النص نظيفًا."),
          E("The regex is: `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/` — test it with `re.test(v)`.", "التعبير النمطي هو: `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/` — واختبره بـ `re.test(v)`.")
        ],
        solution: "<h2>Join the club</h2>\n<form id=\"signup\">\n  <input id=\"email\" type=\"email\" placeholder=\"you@example.com\">\n  <p id=\"err\"></p>\n  <button type=\"submit\">Sign up</button>\n</form>\n<script>\n  const form = document.getElementById('signup');\n  const email = document.getElementById('email');\n  const err = document.getElementById('err');\n\n  form.addEventListener('submit', function (e) {\n    e.preventDefault();\n    const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n    const v = email.value.trim();\n    if (!re.test(v)) {\n      err.textContent = 'Please enter a valid email.';\n      return;\n    }\n    err.textContent = '';\n    email.value = '';\n  });\n</script>"
      },
      {
        id: "p-web-forms", kind: "html", xp: 80, project: true, skill: "Validation",
        title: E("PROJECT: Validated signup form", "مشروع: نموذج تسجيل موثّق"),
        brief: E(
          "Milestone: a **real signup flow** — the pattern behind every account you've ever created.\n\nThe contract: `#msg` gets class **ok** with a welcome message when name (≥ 2 characters) and email (matches `EMAIL_RE`) are both valid, and the inputs clear. Anything invalid → class **err** with a specific message, and the inputs stay untouched so the user can fix them.\n\n(The ok/err classes have no CSS here — they're a *behavior contract*, like a real component's API. Validate the name first, then the email, and return early after each failure.)",
          "محطة جديدة: **تدفق تسجيل حقيقي** — النمط الذي خلف كل حساب أنشأته يومًا.\n\nالعقد: تحصل `#msg` على الصنف **ok** مع رسالة ترحيب عندما يكون الاسم (حرفان فأكثر) والبريد (مطابق لـ `EMAIL_RE`) صحيحين معًا، وتُمسح الحقول. أي إدخال خاطئ ← الصنف **err** مع رسالة محددة، وتبقى الحقول كما هي ليتمكن المستخدم من إصلاحها.\n\n(الصنفان ok وerr بلا CSS هنا — إنهما *عقد سلوك*، مثل واجهة مكوّن حقيقي. تحقق من الاسم أولًا ثم البريد، وارجع مبكرًا بعد كل فشل.)"),
        task: E("Complete the click handler on `#join`: both valid → `#msg` gets class **ok**, text starting with **Welcome** plus the name, and both inputs clear. Otherwise → class **err** with a non-empty message, inputs untouched.", "أكمل معالج النقر على `#join`: كلاهما صالح ← `#msg` تأخذ الصنف **ok** ونصًا يبدأ بـ **Welcome** يليه الاسم، ويُمسح الحقلان. غير ذلك ← الصنف **err** برسالة غير فارغة، والحقول بلا تغيير."),
        starter: "<h2>Create your account</h2>\n<form id=\"signup\">\n  <input id=\"name\" placeholder=\"Your name\">\n  <input id=\"email\" type=\"email\" placeholder=\"you@example.com\">\n  <button id=\"join\" type=\"button\">Join</button>\n</form>\n<p id=\"msg\"></p>\n\n<script>\n  const nameInput = document.getElementById('name');\n  const email = document.getElementById('email');\n  const joinBtn = document.getElementById('join');\n  const msg = document.getElementById('msg');\n\n  const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\n  joinBtn.addEventListener('click', function () {\n    // 1. read both values (trim them)\n    // 2. name needs at least 2 characters; email must match EMAIL_RE\n    // 3. valid for both: msg.className = 'ok', greet with \"Welcome, <name>!\", clear both inputs\n    // 4. otherwise: msg.className = 'err' and explain what's wrong\n  });\n</script>",
        tests: [
          { label: E("Empty form → .err with a message", "نموذج فارغ ← الصنف err مع رسالة"), fn: (d) => { const b = d.getElementById("join"), n = d.getElementById("name"), e = d.getElementById("email"), m = d.getElementById("msg"); if (!b || !n || !e || !m) return false; n.value = ""; e.value = ""; m.className = ""; b.click(); return m.classList.contains("err") && m.textContent.trim().length > 0; } },
          { label: E("Bad email → .err, inputs kept", "بريد خاطئ ← الصنف err وتبقى الحقول"), fn: (d) => { const b = d.getElementById("join"), n = d.getElementById("name"), e = d.getElementById("email"), m = d.getElementById("msg"); if (!b || !n || !e || !m) return false; n.value = "Sara"; e.value = "sara@no"; b.click(); return m.classList.contains("err") && m.textContent.trim().length > 0 && n.value !== "" && e.value !== ""; } },
          { label: E("Valid → .ok welcome and inputs cleared", "إدخال صالح ← الصنف ok مع ترحيب وتُمسح الحقول"), fn: (d) => { const b = d.getElementById("join"), n = d.getElementById("name"), e = d.getElementById("email"), m = d.getElementById("msg"); if (!b || !n || !e || !m) return false; n.value = "Sara"; e.value = "sara@example.com"; b.click(); return m.classList.contains("ok") && /Welcome/.test(m.textContent) && n.value === "" && e.value === ""; } }
        ],
        hints: [
          E("Validate the name first: `if (name.length < 2) { msg.className = 'err'; msg.textContent = '...'; return; }` — then do the same for the email.", "تحقق من الاسم أولًا: `if (name.length < 2) { msg.className = 'err'; msg.textContent = '...'; return; }` — ثم افعل نفس الشيء مع البريد."),
          E("Success path: `msg.className = 'ok'; msg.textContent = 'Welcome, ' + name + '!'; nameInput.value = ''; email.value = '';`", "طريق النجاح: `msg.className = 'ok'; msg.textContent = 'Welcome, ' + name + '!'; nameInput.value = ''; email.value = '';`")
        ],
        solution: "<h2>Create your account</h2>\n<form id=\"signup\">\n  <input id=\"name\" placeholder=\"Your name\">\n  <input id=\"email\" type=\"email\" placeholder=\"you@example.com\">\n  <button id=\"join\" type=\"button\">Join</button>\n</form>\n<p id=\"msg\"></p>\n<script>\n  const nameInput = document.getElementById('name');\n  const email = document.getElementById('email');\n  const joinBtn = document.getElementById('join');\n  const msg = document.getElementById('msg');\n\n  const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\n  joinBtn.addEventListener('click', function () {\n    const name = nameInput.value.trim();\n    const mail = email.value.trim();\n    if (name.length < 2) {\n      msg.className = 'err';\n      msg.textContent = 'Please enter your name (at least 2 characters).';\n      return;\n    }\n    if (!EMAIL_RE.test(mail)) {\n      msg.className = 'err';\n      msg.textContent = 'Please enter a valid email address.';\n      return;\n    }\n    msg.className = 'ok';\n    msg.textContent = 'Welcome, ' + name + '! Your account is ready.';\n    nameInput.value = '';\n    email.value = '';\n  });\n</script>"
      }
    ]
  },
  {
    id: "w8", emoji: "💾",
    title: E("Data That Stays", "بيانات تبقى"),
    desc: E("Real apps remember you. Meet localStorage — the browser's tiny, permanent key-value store — and build a save file that survives refreshes.", "التطبيقات الحقيقية تتذكرك. قابل localStorage — مخزن المتصفح الصغير الدائم للمفاتيح والقيم — وابنِ ملف حفظ ينجو من إعادة التحميل."),
    steps: [
      {
        id: "s-store-basic", kind: "js", xp: 25, skill: "localStorage",
        title: E("localStorage: the browser's memory", "localStorage: ذاكرة المتصفح"),
        brief: E(
          "Every variable you've made died when the page closed. **localStorage** is the browser's built-in key-value store that survives refreshes, restarts — everything.\n\n`\nlocalStorage.setItem('score', '120');      // save (always a string)\nconst s = localStorage.getItem('score');   // '120' — or null if missing\nlocalStorage.removeItem('score');          // delete\n`\n\nThree methods is the entire API. Each site gets its own private storage, and CodeQuest itself saves your progress this way. Values are strings only — objects need packing, which is the next step.",
          "كل متغير كتبته حتى الآن يموت عند إغلاق الصفحة. **localStorage** هو مخزن المتصفح المدمج (مفتاح ← قيمة) الذي ينجو من التحديث وإعادة التشغيل — من كل شيء.\n\n`\nlocalStorage.setItem('score', '120');      // خزّن (نص دائمًا)\nconst s = localStorage.getItem('score');   // '120' — أو null إن غاب\nlocalStorage.removeItem('score');          // احذف\n`\n\nثلاث دوال وهذا كل الـ API. لكل موقع مخزنه الخاص، و CodeQuest نفسه يحفظ تقدمك بهذه الطريقة. القيم نصوص فقط — والكائنات تحتاج تغليفًا، وهو موضوع الخطوة التالية."),
        task: E("Write `saveGreeting(name)` storing the name under the key **cq_greeting**, and `loadGreeting()` returning the stored name — or `null` when nothing is stored.", "اكتب `saveGreeting(name)` التي تخزن الاسم تحت المفتاح **cq_greeting**، و `loadGreeting()` التي تُرجع الاسم المخزّن — أو `null` إذا لم يُخزَّن شيء."),
        starter: "function saveGreeting(name) {\n  // store the name under the key 'cq_greeting'\n}\n\nfunction loadGreeting() {\n  // return the stored name — or null if nothing is stored\n}\n\n// try it out:\nsaveGreeting('Sara');\nconsole.log('read back:', loadGreeting());",
        tests: [
          { label: E("saveGreeting stores and loadGreeting reads it back", "saveGreeting تخزن و loadGreeting تقرأ ما خزّنته"), fn: (s) => { if (!s.saveGreeting || !s.loadGreeting) return false; try { s.saveGreeting("Sara"); return s.loadGreeting() === "Sara"; } catch (e) { return false; } } },
          { label: E("Saving again overwrites the value", "التخزين مجددًا يستبدل القيمة"), fn: (s) => { if (!s.saveGreeting || !s.loadGreeting) return false; try { s.saveGreeting("Omar"); return s.loadGreeting() === "Omar"; } catch (e) { return false; } finally { try { localStorage.removeItem("cq_greeting"); } catch (e2) {} } } },
          { label: E("loadGreeting() is null when nothing is stored", "loadGreeting تُرجع null عند غياب القيمة"), fn: (s) => { if (!s.loadGreeting) return false; try { localStorage.removeItem("cq_greeting"); return s.loadGreeting() === null; } catch (e) { return false; } } }
        ],
        hints: [
          E("`localStorage.setItem('cq_greeting', name)` — then `loadGreeting` can simply `return localStorage.getItem('cq_greeting');`.", "`localStorage.setItem('cq_greeting', name)` — ثم يكفي في `loadGreeting` أن تكتب `return localStorage.getItem('cq_greeting');`."),
          E("getItem already gives `null` for missing keys — don't wrap the result in quotes.", "الدالة getItem تُرجع `null` أصلًا للمفاتيح الغائبة — لا تلُفّ النتيجة بعلامتي تنصيص.")
        ],
        solution: "function saveGreeting(name) {\n  localStorage.setItem('cq_greeting', name);\n}\n\nfunction loadGreeting() {\n  return localStorage.getItem('cq_greeting');\n}\n\nsaveGreeting('Sara');\nconsole.log('read back:', loadGreeting());"
      },
      {
        id: "s-store-json", kind: "js", xp: 30, skill: "JSON",
        title: E("Storing objects: JSON round-trips", "تخزين الكائنات: رحلات JSON"),
        brief: E(
          "localStorage speaks one language: strings. Hand it an object and it stores `\"[object Object]\"` — silently destroying your data. The fix is JSON:\n\n`\nconst player = { name: 'Sara', xp: 120 };\n\nlocalStorage.setItem('player', JSON.stringify(player));   // pack: object → string\nconst again = JSON.parse(localStorage.getItem('player')); // unpack: string → object\n\nagain.xp;  // 120 — a real object again\n`\n\nThis *round-trip* is the standard save-file pattern: stringify on save, parse on load — and always handle the “nothing stored yet” case with null.",
          "localStorage يتحدث لغة واحدة: النصوص. أعطه كائنًا فسيخزن `\"[object Object]\"` — ويدمّر بياناتك بصمت. الحل هو JSON:\n\n`\nconst player = { name: 'Sara', xp: 120 };\n\nlocalStorage.setItem('player', JSON.stringify(player));   // تغليف: كائن ← نص\nconst again = JSON.parse(localStorage.getItem('player')); // فكّ: نص ← كائن\n\nagain.xp;  // 120 — كائن حقيقي من جديد\n`\n\nهذه *الرحلة ذهابًا وإيابًا* هي نمط ملف الحفظ القياسي: stringify عند الحفظ، و parse عند التحميل — مع معالجة حالة «لا شيء مخزّن بعد» دائمًا عبر null."),
        task: E("Write `saveProfile(profile)` that stringifies the profile into key **cq_profile**, and `loadProfile()` that parses it back into a real object — returning `null` when nothing is stored.", "اكتب `saveProfile(profile)` التي تغلّف الملف الشخصي بـ JSON في المفتاح **cq_profile**، و `loadProfile()` التي تفكّه كائنًا حقيقيًا — وتُرجع `null` إذا لم يُخزَّن شيء."),
        starter: "function saveProfile(profile) {\n  // JSON.stringify the profile into 'cq_profile'\n}\n\nfunction loadProfile() {\n  // read 'cq_profile', parse it, return the object — or null if empty\n}\n\nsaveProfile({ name: 'Sara', xp: 120 });\nconsole.log('read back:', loadProfile());",
        tests: [
          { label: E("Round-trip returns the same data", "الرحلة ذهابًا وإيابًا تعيد البيانات نفسها"), fn: (s) => { if (!s.saveProfile || !s.loadProfile) return false; try { s.saveProfile({ name: "Sara", xp: 120 }); const p = s.loadProfile(); return !!p && p.name === "Sara" && p.xp === 120; } catch (e) { return false; } } },
          { label: E("Loading returns an independent copy, not the original", "التحميل يعيد نسخة مستقلة لا الأصل"), fn: (s) => { if (!s.saveProfile || !s.loadProfile) return false; try { const original = { name: "Ali", xp: 5 }; s.saveProfile(original); return s.loadProfile() !== original; } catch (e) { return false; } finally { try { localStorage.removeItem("cq_profile"); } catch (e2) {} } } },
          { label: E("Missing profile loads as null", "الملف الغائب يُحمَّل null"), fn: (s) => { if (!s.loadProfile) return false; try { localStorage.removeItem("cq_profile"); return s.loadProfile() === null; } catch (e) { return false; } } }
        ],
        hints: [
          E("Save: `localStorage.setItem('cq_profile', JSON.stringify(profile));`", "الحفظ: `localStorage.setItem('cq_profile', JSON.stringify(profile));`"),
          E("Load: `const raw = localStorage.getItem('cq_profile'); return raw ? JSON.parse(raw) : null;` — the ternary guards the missing case.", "التحميل: `const raw = localStorage.getItem('cq_profile'); return raw ? JSON.parse(raw) : null;` — الشرط المختصر يحمي حالة الغياب.")
        ],
        solution: "function saveProfile(profile) {\n  localStorage.setItem('cq_profile', JSON.stringify(profile));\n}\n\nfunction loadProfile() {\n  const raw = localStorage.getItem('cq_profile');\n  return raw ? JSON.parse(raw) : null;\n}\n\nsaveProfile({ name: 'Sara', xp: 120 });\nconsole.log('read back:', loadProfile());"
      },
      {
        id: "s-store-concept", kind: "concept", xp: 10, skill: "localStorage",
        title: E("State, tiers & the one rule of persistence", "الحالة والطبقات والقاعدة الذهبية للإبقاء"),
        concept: E(
          "State lives in three tiers, each with a different lifetime:\n\n`\nlet current = 0;             // 1. Variables — instant, die with the page\ncountEl.textContent = 0;     // 2. The screen — rebuilt on every load\nlocalStorage.setItem('k', v) // 3. localStorage — permanent between visits\n`\n\nlocalStorage is a key-value store: like one giant object that never empties, with three methods — `setItem`, `getItem`, `removeItem`. Values are always strings, so objects travel as JSON (stringify out, parse in). Every site gets its own private storage.\n\n**The one rule of persistence:** the UI must always be rebuildable from saved data alone. The test is brutal and simple — reload the page. If anything looks wrong after a reload, your save file is missing information or your render path never reads it.\n\nOne professional habit to copy: saved shapes change over time. Next month you add a `level` field — old saves don't have it. Real apps version their storage keys (this app uses `codequest.v1`) and write load code that tolerates older shapes.",
          "تعيش الحالة في ثلاث طبقات، لكل منها عمر مختلف:\n\n`\nlet current = 0;             // 1. المتغيرات — فورية، تموت مع الصفحة\ncountEl.textContent = 0;     // 2. الشاشة — يُعاد بناؤها مع كل تحميل\nlocalStorage.setItem('k', v) // 3. localStorage — دائمة بين الزيارات\n`\n\nlocalStorage مخزن مفاتيح وقيم: كائن عملاق لا يفرغ أبدًا، له ثلاث دوال — `setItem` و `getItem` و `removeItem`. القيم نصوص دائمًا، لذلك تسافر الكائنات بصيغة JSON (تغليف عند الخروج، فكّ عند العودة). وكل موقع له مخزنه الخاص.\n\n**القاعدة الذهبية للإبقاء:** يجب أن تكون الواجهة قابلة لإعادة البناء من البيانات المحفوظة وحدها، دومًا. الاختبار قاسٍ وبسيط — أعد تحميل الصفحة. إن بدت أي شيء خاطئًا بعد التحميل فملف حفظك ينقصه شيء، أو أن مسار الرسم لا يقرأه أصلًا.\n\nوهناك عادة احترافية تستحق النسخ: أشكال البيانات المحفوظة تتغير مع الوقت. الشهر القادم تضيف حقل `level` — الحفظ القديم لا يملكه. التطبيقات الحقيقية ترقّم مفاتيح تخزينها (هذا التطبيق يستخدم `codequest.v1`) وتكتب كود تحميل يتسامح مع الأشكال الأقدم."),
        quiz: { q: E("Your app saves its data, but after a reload the screen shows stale values. What is the most reliable fix?", "تطبيقك يحفظ بياناته، لكن بعد إعادة التحميل تُظهر الشاشة قيمًا قديمة. ما الإصلاح الأكثر موثوقية؟"), options: E(["Re-render the whole UI from saved data on every load", "Save more often", "Store the HTML of the screen itself", "Ask users not to reload"], ["أعد رسم الواجهة كاملة من البيانات المحفوظة عند كل تحميل", "احفظ كثيرًا", "خزّن HTML الشاشة نفسها", "اطلب من المستخدمين ألا يعيدوا التحميل"]), answer: 0 }
      },
      {
        id: "p-web-store", kind: "html", xp: 90, project: true, skill: "localStorage",
        title: E("PROJECT: The save file for your game", "مشروع: ملف الحفظ للعبتك"),
        brief: E(
          "Your app works beautifully — until the user refreshes and everything resets. Professional apps keep **one source of truth** (the saved object) and every change follows the same loop:\n\n**read → change → save → render**\n\nThe screen is never edited directly — it's always re-rendered from the data. That's why the starter's `render()` is already written: your `gainXp()` and `resetGame()` may only touch state + storage, then call `render()`.\n\nFinish them and you'll have a save file that survives refreshes. Try the **reload test**: win some XP, refresh the page, and your level is still there.",
          "تطبيقك يعمل بإتقان — حتى يعيد المستخدم التحميل فيعود كل شيء إلى الصفر. التطبيقات الاحترافية تحافظ على **مصدر حقيقة واحد** (الكائن المحفوظ) وكل تغيير يمرّ في الحلقة نفسها:\n\n**اقرأ ← غيّر ← احفظ ← ارسم**\n\nلا تُعدَّل الشاشة مباشرة أبدًا — بل يُعاد رسمها من البيانات دومًا. لذلك دالة `render()` في البداية مكتوبة جاهزة: مهمة `gainXp()` و `resetGame()` أن تلمس الحالة والتخزين فقط ثم تستدعي `render()`.\n\nأكملهما وستحصل على ملف حفظ ينجو من التحديث. جرّب **اختبار إعادة التحميل**: اجمع نقاطًا، أعد تحميل الصفحة، مستواك ما زال مكانه."),
        task: E("Implement `gainXp()`: read the save with `loadSave()` (or start fresh `{ level: 1, xp: 0 }`), add 10 XP, level up when XP reaches 100 (level +1, XP −100), then **stringify it back into localStorage under `cq_save`** and call `render()`. Implement `resetGame()`: remove `cq_save` from storage, set `save = null`, and call `render()`.", "نفّذ `gainXp()`: اقرأ الحفظ بـ `loadSave()` (أو ابدأ جديدًا `{ level: 1, xp: 0 }`)، وأضف 10 نقاط، وارفع المستوى عند بلوغ 100 (المستوى +1 والنقاط −100)، ثم **غلّفها بـ JSON واحفظها في localStorage تحت `cq_save`** واستدعِ `render()`. ونفّذ `resetGame()`: احذف `cq_save` من التخزين واجعل `save = null` ثم استدعِ `render()`."),
        starter: "<h2 id=\"title\"></h2>\n<p id=\"level\"></p>\n<button id=\"addXp\">Win 10 XP</button>\n<button id=\"reset\">New game</button>\n\n<script>\n  const KEY = 'cq_save';\n  const titleEl = document.getElementById('title');\n  const levelEl = document.getElementById('level');\n  const addXpBtn = document.getElementById('addXp');\n  const resetBtn = document.getElementById('reset');\n  let save = null;\n\n  // Safe read: parse the saved data, or null if nothing (or garbage) is stored.\n  function loadSave() {\n    try {\n      const raw = localStorage.getItem(KEY);\n      return raw ? JSON.parse(raw) : null;\n    } catch (e) {\n      return null;\n    }\n  }\n\n  function render() {\n    if (!save) {\n      titleEl.textContent = 'Hero';\n      levelEl.textContent = 'Level 1 · XP 0';\n      return;\n    }\n    titleEl.textContent = 'Hero';\n    levelEl.textContent = 'Level ' + save.level + ' · XP ' + save.xp;\n  }\n\n  function gainXp() {\n    // 1. save = loadSave(), or { level: 1, xp: 0 } when it is null\n    // 2. add 10 xp\n    // 3. xp >= 100? level += 1 and xp -= 100\n    // 4. persist save (JSON.stringify) under KEY, then render()\n  }\n\n  function resetGame() {\n    // remove KEY from storage, then save = null; render();\n  }\n\n  addXpBtn.addEventListener('click', gainXp);\n  resetBtn.addEventListener('click', resetGame);\n  render();\n</script>",
        tests: [
          { label: E("First click starts a new save: level 1, 10 XP", "أول نقرة تبدأ حفظًا جديدًا: مستوى 1 و10 نقاط"), fn: (d) => { const b = d.getElementById("addXp"), p = d.getElementById("level"); if (!b || !p) return false; let ok = false; try { localStorage.removeItem("cq_save"); b.click(); ok = p.textContent.includes("1") && p.textContent.includes("10"); } catch (e) { ok = false; } finally { try { localStorage.removeItem("cq_save"); } catch (e2) {} } return ok; } },
          { label: E("Clicking re-renders from the saved data (level-up path)", "النقر يعيد الرسم من البيانات المحفوظة (مسار الترقية)"), fn: (d) => { const b = d.getElementById("addXp"), p = d.getElementById("level"); if (!b || !p) return false; let ok = false; try { localStorage.setItem("cq_save", JSON.stringify({ level: 9, xp: 95 })); b.click(); ok = p.textContent.includes("10") && p.textContent.includes("5"); } catch (e) { ok = false; } finally { try { localStorage.removeItem("cq_save"); } catch (e2) {} } return ok; } },
          { label: E("Clicking persists the new state under cq_save", "النقر يحفظ الحالة الجديدة تحت cq_save"), fn: (d) => { const b = d.getElementById("addXp"); if (!b) return false; let ok = false; try { localStorage.setItem("cq_save", JSON.stringify({ level: 3, xp: 70 })); b.click(); const s = JSON.parse(localStorage.getItem("cq_save")); ok = !!s && s.level === 3 && s.xp === 80; } catch (e) { ok = false; } finally { try { localStorage.removeItem("cq_save"); } catch (e2) {} } return ok; } },
          { label: E("Reset removes the save and redraws the defaults", "إعادة التعيين تمسح الحفظ وترسم الافتراضي"), fn: (d) => { const r = d.getElementById("reset"), p = d.getElementById("level"); if (!r || !p) return false; let ok = false; try { localStorage.setItem("cq_save", JSON.stringify({ level: 7, xp: 40 })); r.click(); const raw = localStorage.getItem("cq_save"); ok = (raw === null || raw === undefined) && !p.textContent.includes("7"); } catch (e) { ok = false; } finally { try { localStorage.removeItem("cq_save"); } catch (e2) {} } return ok; } }
        ],
        hints: [
          E("`gainXp`: `save = loadSave() || { level: 1, xp: 0 };` then `save.xp += 10;` — the `||` covers the first-ever run.", "في `gainXp`: `save = loadSave() || { level: 1, xp: 0 };` ثم `save.xp += 10;` — الرمز `||` يغطي أول تشغيل على الإطلاق."),
          E("Save with `localStorage.setItem(KEY, JSON.stringify(save));` — and reset is just `localStorage.removeItem(KEY); save = null; render();`", "احفظ بـ `localStorage.setItem(KEY, JSON.stringify(save));` — وإعادة التعيين هي ببساطة `localStorage.removeItem(KEY); save = null; render();`")
        ],
        solution: "<h2 id=\"title\"></h2>\n<p id=\"level\"></p>\n<button id=\"addXp\">Win 10 XP</button>\n<button id=\"reset\">New game</button>\n<script>\n  const KEY = 'cq_save';\n  const titleEl = document.getElementById('title');\n  const levelEl = document.getElementById('level');\n  const addXpBtn = document.getElementById('addXp');\n  const resetBtn = document.getElementById('reset');\n  let save = null;\n\n  function loadSave() {\n    try {\n      const raw = localStorage.getItem(KEY);\n      return raw ? JSON.parse(raw) : null;\n    } catch (e) {\n      return null;\n    }\n  }\n\n  function render() {\n    if (!save) {\n      titleEl.textContent = 'Hero';\n      levelEl.textContent = 'Level 1 · XP 0';\n      return;\n    }\n    titleEl.textContent = 'Hero';\n    levelEl.textContent = 'Level ' + save.level + ' · XP ' + save.xp;\n  }\n\n  function gainXp() {\n    save = loadSave() || { level: 1, xp: 0 };\n    save.xp += 10;\n    if (save.xp >= 100) {\n      save.level += 1;\n      save.xp -= 100;\n    }\n    localStorage.setItem(KEY, JSON.stringify(save));\n    render();\n  }\n\n  function resetGame() {\n    localStorage.removeItem(KEY);\n    save = null;\n    render();\n  }\n\n  addXpBtn.addEventListener('click', gainXp);\n  resetBtn.addEventListener('click', resetGame);\n  render();\n</script>"
      }
    ]
  },
  {
    id: "w5", emoji: "🧩",
    title: E("Thinking in Components", "التفكير بالمكونات"),
    desc: E("The idea that powers React, Vue and every modern framework: break UIs into reusable pieces.", "الفكرة التي تحرّك React وVue وكل أطر العمل الحديثة: قسّم الواجهة إلى قطع قابلة لإعادة الاستخدام."),
    steps: [
      {
        id: "s-react-idea", kind: "concept", xp: 10, skill: "Components",
        title: E("Components & state", "المكونات والحالة"),
        concept: E(
          "As apps grow, copy-pasting HTML collapses. Modern frameworks are built on two ideas:\n\n**1. Components** — a piece of UI defined once, reused anywhere. A `TweetCard` component renders one tweet; give it 50 tweets' data, you get 50 cards. Data in → UI out.\n\n**2. State** — data that *changes over time*. When state changes, the UI re-renders from it. You never say \"change the text of that span\"; you say \"the count is now 5\" and the framework updates the screen.\n\nThat's the big mental shift from raw DOM code: instead of *manually patching* the page, you *declare* what the page should look like for the current data.\n\n```javascript\n// pseudo-React\nfunction Counter({ count }) {\n  return <button>Clicked {count} times</button>;\n}\n```\n\nThe same skill you practiced with `.map` over arrays — data becomes UI — is the core of every framework.",
          "مع نمو التطبيقات، ينهار النسخ واللصق في HTML. أطر العمل الحديثة مبنية على فكرتين:\n\n**1. المكونات** — قطعة واجهة تُعرَّف مرة، وتُستخدم في أي مكان. مكوّن `TweetCard` يعرض تغريدة واحدة؛ أعطه بيانات 50 تغريدة فتحصل على 50 بطاقة. بيانات تدخل ← واجهة تخرج.\n\n**2. الحالة** — بيانات *تتغير مع الوقت*. عندما تتغير الحالة تعاد الواجهة رسمًا منها. لا تقول أبدًا \"غيّر نص ذلك الـ span\"؛ بل تقول \"العداد صار 5\" فيحدّث الإطار الشاشة.\n\nهذا هو التحول الذهني الكبير عن كود DOM الخام: بدل أن *ترقّع* الصفحة يدويًا، أنت *تعلن* كيف يجب أن تبدو الصفحة للبيانات الحالية.\n\n```javascript\n// شبه React\nfunction Counter({ count }) {\n  return <button>نقرت {count} مرة</button>;\n}\n```\n\nنفس المهارة التي تدرّبت عليها مع `.map` على المصفوفات — البيانات تتحول إلى واجهة — هي جوهر كل الأطر."),
        quiz: { q: E("In React-style thinking, what happens when state changes?", "في التفكير الأسلوبي لـ React، ماذا يحدث عند تغيّر الحالة؟"), options: E(["The UI re-renders from the new state", "The page reloads completely", "Nothing — you update the DOM manually"], ["يُعاد رسم الواجهة من الحالة الجديدة", "تُعاد تحميل الصفحة كاملة", "لا شيء — تحدّث الـ DOM يدويًا"]), answer: 0 }
      },
      {
        id: "s-render-list", kind: "js", xp: 25, skill: "Components",
        title: E("Render functions: data → HTML", "دوال الرسم: بيانات ← HTML"),
        brief: E(
          "Before frameworks, people wrote *render functions* — plain functions that turn data into HTML strings. Same idea, zero magic:\n\n```javascript\nfunction renderItem(item) {\n  return \"<li>\" + item + \"</li>\";\n}\n\nitems.map(renderItem).join(\"\");  // all items → one string\n```\n\n`.join(\"\")` glues array elements into a single string.",
          "قبل الأطر، كان الناس يكتبون *دوال رسم* — دوال عادية تحوّل البيانات إلى نصوص HTML. نفس الفكرة، بلا سحر:\n\n```javascript\nfunction renderItem(item) {\n  return \"<li>\" + item + \"</li>\";\n}\n\nitems.map(renderItem).join(\"\");  // كل العناصر ← نص واحد\n```\n\n`.join(\"\")` تلصق عناصر المصفوفة في نص واحد."),
        task: E("Write `renderList(items)` that returns a single string of `<li>` elements — one per item.", "اكتب `renderList(items)` التي تُرجع نصًا واحدًا يضم عناصر `<li>` — واحد لكل عنصر."),
        starter: "function renderList(items) {\n  // turn every item into '<li>...</li>' and join them\n}",
        tests: [
          { label: E('renderList("a","b") has two <li>', 'renderList("a","b") فيها عنصرا <li>'), fn: (s) => { if (!s.renderList) return false; const r = String(s.renderList(['a','b'])); return (r.match(/<li>/g) || []).length === 2 && r.includes('a') && r.includes('b'); } },
          { label: E("Empty array gives an empty string", "مصفوفة فارغة تعطي نصًا فارغًا"), fn: (s) => s.renderList && String(s.renderList([])) === "" }
        ],
        hints: [
          E("`return items.map(function (it) { return '<li>' + it + '</li>'; }).join('');`", "`return items.map(function (it) { return '<li>' + it + '</li>'; }).join('');`"),
          E("Make sure you `.join('')` at the end — otherwise you return an array, not a string.", "تأكد من `.join('')` في النهاية — وإلا سترجع مصفوفة وليست نصًا.")
        ],
        solution: "function renderList(items) {\n  return items.map(function (it) {\n    return '<li>' + it + '</li>';\n  }).join('');\n}"
      }
    ]
  },
  {
    id: "w6", emoji: "🛰️",
    title: E("APIs & the Bigger Web", "واجهات API والويب الأوسع"),
    desc: E("No website is an island. Learn how frontends talk to backends, then build a data-driven dashboard.", "لا موقع جزيرة معزولة. تعلّم كيف تتحدث الواجهات مع الخوادم، ثم ابنِ لوحة بيانات."),
    steps: [
      {
        id: "s-api-concept", kind: "concept", xp: 10, skill: "APIs",
        title: E("APIs, backends & full-stack", "واجهات API والخوادم والتطوير المتكامل"),
        concept: E(
          "Everything so far ran in the browser — the **frontend**. But where do posts, scores and products actually *live*? On servers — the **backend**.\n\nThe two talk over HTTP through an **API** (Application Programming Interface): a set of URLs the frontend can call to get or send data.\n\n```\nGET  /api/products      → list of products (JSON)\nGET  /api/products/42   → one product\nPOST /api/orders        → create an order\n```\n\nJSON is the data format:\n```json\n{ \"name\": \"Coffee\", \"price\": 12 }\n```\n\nIn browser JavaScript you call APIs with `fetch()`:\n```javascript\nconst res = await fetch('/api/products');\nconst products = await res.json();\n```\n\nA **full-stack developer** builds both sides. The mental model: frontend = what users see, backend = where truth lives, API = the contract between them. Same picture — whether it's a startup app or a giant platform.",
          "كل ما سبق يعمل في المتصفح — **الواجهة الأمامية**. لكن أين تسكن المنشورات والنتائج والمنتجات فعلًا؟ على الخوادم — **الواجهة الخلفية**.\n\nيتحدث الاثنان عبر HTTP من خلال **API** (واجهة برمجة التطبيقات): مجموعة عناوين يمكن للواجهة استدعاؤها لأخذ أو إرسال بيانات.\n\n```\nGET  /api/products      ← قائمة المنتجات (JSON)\nGET  /api/products/42   ← منتج واحد\nPOST /api/orders        ← إنشاء طلب\n```\n\nJSON هو تنسيق البيانات:\n```json\n{ \"name\": \"قهوة\", \"price\": 12 }\n```\n\nفي جافاسكريبت بالمتصفح تستدعي الـ API بـ `fetch()`:\n```javascript\nconst res = await fetch('/api/products');\nconst products = await res.json();\n```\n\n**المطور المتكامل (Full-stack)** يبني الطرفين. النموذج الذهني: الواجهة = ما يراه المستخدم، الخادم = حيث تعيش الحقيقة، الـ API = العقد بينهما. نفس الصورة — سواء كان تطبيق شركة ناشئة أو منصة عملاقة."),
        quiz: { q: E("What does an API mainly do?", "ما الوظيفة الأساسية للـ API؟"), options: E(["Lets two programs exchange data through defined calls", "Styles the page", "Stores photos on your phone"], ["تتيح لبرنامجين تبادل البيانات عبر استدعاءات محددة", "تنسّق الصفحة", "تخزن الصور في هاتفك"]), answer: 0 }
      },
      {
        id: "p-web-4", kind: "html", xp: 90, project: true, skill: "APIs",
        title: E("PROJECT: Data dashboard (full-stack style)", "مشروع: لوحة بيانات بأسلوب متكامل"),
        brief: E(
          "Final web milestone: a **data-driven dashboard**. A mock API (`getStats()`) returns JSON — exactly like a real backend would. You'll *fetch* it and *render* it.\n\nThis is the full-stack loop: **request → receive JSON → transform → render UI**. Swap the mock for a real server and this code pattern ships to production.",
          "المحطة الأخيرة لمسار الويب: **لوحة بيانات**. دالة وهمية (`getStats()`) تُرجع JSON — تمامًا كما يفعل خادم حقيقي. ستحضر البيانات و*تعرضها*.\n\nهذه حلقة العمل المتكاملة: **طلب ← استلام JSON ← تحويل ← عرض**. استبدل الدالة الوهمية بخادم حقيقي وسيصل هذا النمط إلى الإنتاج."),
        task: E("The page calls `loadDashboard()` on load. Implement it: call `getStats()`, then render **one `<div class=\"stat\">` per item** inside `#stats`, each containing the item's `label` and `value`.", "الصفحة تستدعي `loadDashboard()` عند التحميل. نفّذها: استدعِ `getStats()` ثم اعرض **`<div class=\"stat\">` واحد لكل عنصر** داخل `#stats`، كل واحد يحتوي `label` و `value` للعنصر."),
        starter: "<h1>Live dashboard</h1>\n<div id=\"stats\"></div>\n\n<script>\n  // Mock API — imagine this lives on a server.\n  function getStats() {\n    return [\n      { label: 'Visitors', value: '1,204' },\n      { label: 'Signups',  value: '87' },\n      { label: 'Revenue',  value: '$3,120' }\n    ];\n  }\n\n  function loadDashboard() {\n    const data = getStats();\n    const box = document.getElementById('stats');\n    // 1. build one <div class='stat'> per item\n    // 2. put item.label and item.value inside\n    // 3. append to box\n  }\n\n  loadDashboard();\n</script>",
        tests: [
          { label: E("Three .stat cards are rendered", "ثلاث بطاقات .stat معروضة"), fn: (d) => d.querySelectorAll("#stats .stat").length === 3 },
          { label: E("Cards include labels and values", "البطاقات تتضمن التسميات والقيم"), fn: (d) => { const t = d.getElementById("stats"); return !!t && t.textContent.includes("Visitors") && t.textContent.includes("$3,120"); } }
        ],
        hints: [
          E("Loop over `data`, and for each item: create a div, set its className and textContent, then `box.appendChild(div)`.", "كرر على `data`، ولكل عنصر: أنشئ div واضح className و textContent ثم `box.appendChild(div)`."),
          E("`data.forEach(function (item) { const div = document.createElement('div'); div.className = 'stat'; div.textContent = item.label + ': ' + item.value; box.appendChild(div); });`", "`data.forEach(function (item) { const div = document.createElement('div'); div.className = 'stat'; div.textContent = item.label + ': ' + item.value; box.appendChild(div); });`")
        ],
        solution: "<h1>Live dashboard</h1>\n<div id=\"stats\"></div>\n<script>\n  function getStats() {\n    return [\n      { label: 'Visitors', value: '1,204' },\n      { label: 'Signups',  value: '87' },\n      { label: 'Revenue',  value: '$3,120' }\n    ];\n  }\n  function loadDashboard() {\n    const data = getStats();\n    const box = document.getElementById('stats');\n    data.forEach(function (item) {\n      const div = document.createElement('div');\n      div.className = 'stat';\n      div.textContent = item.label + ': ' + item.value;\n      box.appendChild(div);\n    });\n  }\n  loadDashboard();\n</script>"
      }
    ]
  }
];

/* ---------------- SOFTWARE ENGINEERING PATH ---------------- */
const SE_UNITS = [
  {
    id: "e1", emoji: "🔤",
    title: E("Programming Foundations", "أساسيات البرمجة"),
    desc: E("The raw material of all software: data, decisions, repetition, and functions that earn their name.", "المواد الخام لكل برمجية: البيانات والقرارات والتكرار والدوال التي تستحق اسمها."),
    steps: [
      {
        id: "s-se-first", kind: "js", xp: 20, skill: "Functions",
        title: E("Functions are machines", "الدوال آلات"),
        brief: E(
          "Software engineering starts with one idea: **wrap logic so you can reuse it**.\n\n```javascript\nfunction square(n) {\n  return n * n;\n}\n\nsquare(4);  // 16\n```\n\nInput (parameters) → transformation → output (return). Everything else in this path builds on this shape.",
          "هندسة البرمجيات تبدأ بفكرة واحدة: **لفّ المنطق لتعيد استخدامه**.\n\n```javascript\nfunction square(n) {\n  return n * n;\n}\n\nsquare(4);  // 16\n```\n\nمدخلات (معاملات) ← معالجة ← مخرج (return). كل ما يأتي في هذا المسار يُبنى على هذا الشكل."),
        task: E("Write `square(n)` returning n², and `isEven(n)` returning `true` for even numbers.", "اكتب `square(n)` التي تُرجع n²، و `isEven(n)` التي تُرجع `true` للأعداد الزوجية."),
        starter: "function square(n) {\n}\n\nfunction isEven(n) {\n}",
        tests: [
          { label: E("square(4) is 16", "square(4) تساوي 16"), fn: (s) => s.square && s.square(4) === 16 },
          { label: E("isEven(10) is true, isEven(7) is false", "isEven(10) تساوي true و isEven(7) تساوي false"), fn: (s) => s.isEven && s.isEven(10) === true && s.isEven(7) === false }
        ],
        hints: [
          E("Even numbers divide by 2 with no remainder — the remainder operator is `%`: `n % 2 === 0`.", "الزوجية تعني القسمة على 2 بلا باقٍ — معامل الباقي هو `%`: `n % 2 === 0`."),
          E("`return n * n;` and `return n % 2 === 0;` — comparisons already produce true/false.", "`return n * n;` و `return n % 2 === 0;` — المقارنة تنتج true/false مباشرة.")
        ],
        solution: "function square(n) {\n  return n * n;\n}\nfunction isEven(n) {\n  return n % 2 === 0;\n}"
      },
      {
        id: "s-se-types", kind: "concept", xp: 10, skill: "Data Types",
        title: E("Variables & types", "المتغيرات والأنواع"),
        concept: E(
          "Data comes in **types** — and knowing the type tells you what you can do with it:\n\n- **string** — text: `\"hello\"`\n- **number** — `42`, `3.14`\n- **boolean** — `true` / `false`\n- **array** — ordered list: `[1, 2, 3]`\n- **object** — labeled fields: `{ name: \"Sara\", age: 22 }`\n- **null / undefined** — deliberately empty / not set yet\n\n`typeof` tells you what you're holding. A huge share of real-world bugs are type surprises: `\"5\" + 5` is `\"55\"` (string!) — the `+` glues text. But `\"5\" * 2` is `10`.\n\nEngineering habit: when code misbehaves, *print the type first*: `console.log(typeof value)`.",
          "البيانات تأتي بأنواع — ومعرفة النوع تخبرك ما يمكنك فعله بها:\n\n- **string** — نص: `\"مرحبًا\"`\n- **number** — `42`، `3.14`\n- **boolean** — `true` / `false`\n- **array** — قائمة مرتبة: `[1, 2, 3]`\n- **object** — حقول مسماة: `{ name: \"سارة\", age: 22 }`\n- **null / undefined** — فارغ بقصد / لم يُضبط بعد\n\n`typeof` يخبرك ماذا تحمل بيدك. نصيب كبير من أخطاء العالم الحقيقي مفاجآت أنواع: `\"5\" + 5` تساوي `\"55\"` (نص!) — لأن `+` تلصق النصوص. لكن `\"5\" * 2` تساوي `10`.\n\nعادة هندسية: عندما يسلك الكود سلوكًا غريبًا، *اطبع النوع أولًا*: `console.log(typeof value)`."),
        quiz: { q: E("What is the result of \"5\" + 5 in JavaScript?", "ما ناتج \"5\" + 5 في جافاسكريبت؟"), options: E(["\"55\" (a string)", "10 (a number)", "An error"], ["\"55\" (نص)", "10 (رقم)", "خطأ"]), answer: 0 }
      },
      {
        id: "s-se-cond", kind: "js", xp: 20, skill: "Logic",
        title: E("Branching logic", "منطق التفريع"),
        brief: E(
          "Real programs branch. Combine conditions with `&&` (and), `||` (or), `!` (not):\n\n```javascript\nfunction ticketPrice(age, isStudent) {\n  if (age < 12 || isStudent) return 5;\n  if (age >= 65) return 7;\n  return 12;\n}\n```\n\nOrder matters: check the *most specific* case first.",
          "البرامج الحقيقية تتفرع. ادمج الشروط بـ `&&` (و)، `||` (أو)، `!` (ليس):\n\n```javascript\nfunction ticketPrice(age, isStudent) {\n  if (age < 12 || isStudent) return 5;\n  if (age >= 65) return 7;\n  return 12;\n}\n```\n\nالترتيب مهم: افحص الحالة *الأكثر تحديدًا* أولًا."),
        task: E("Write `max2(a, b)` returning the larger number. Don't use `Math.max` — build the logic yourself.", "اكتب `max2(a, b)` التي تُرجع العدد الأكبر. لا تستخدم `Math.max` — ابنِ المنطق بنفسك."),
        starter: "function max2(a, b) {\n}",
        tests: [
          { label: E("max2(3, 9) is 9", "max2(3, 9) تساوي 9"), fn: (s) => s.max2 && s.max2(3, 9) === 9 },
          { label: E("max2(-5, -2) is -2", "max2(-5, -2) تساوي -2"), fn: (s) => s.max2 && s.max2(-5, -2) === -2 },
          { label: E("max2(7, 7) is 7 (equal case)", "max2(7, 7) تساوي 7 (حالة التساوي)"), fn: (s) => s.max2 && s.max2(7, 7) === 7 }
        ],
        hints: [
          E("`if (a > b) return a;` — then what should happen otherwise?", "`if (a > b) return a;` — وماذا يحدث غير ذلك؟"),
          E("`if (a >= b) { return a; } return b;` — the equal case returns either.", "`if (a >= b) { return a; } return b;` — حالة التساوي ترجع أيًّا منهما.")
        ],
        solution: "function max2(a, b) {\n  if (a >= b) {\n    return a;\n  }\n  return b;\n}"
      },
      {
        id: "s-se-loop", kind: "js", xp: 25, skill: "Loops",
        title: E("Iteration patterns", "أنماط التكرار"),
        brief: E(
          "Two loops cover most engineering work: counting `for` loops and `while` loops (run until a condition breaks).\n\nA classic pattern: **accumulate** while scanning data.\n\n```javascript\nfunction factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result = result * i;\n  }\n  return result;\n}\n// factorial(4) → 24  (1×2×3×4)\n```",
          "حلقتان تغطيان معظم العمل الهندسي: حلقة `for` العدّادية وحلقة `while` (استمر حتى يتحقق شرط التوقف).\n\nنمط كلاسيكي: **تراكم** النتائج أثناء مسح البيانات.\n\n```javascript\nfunction factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result = result * i;\n  }\n  return result;\n}\n// factorial(4) ← 24  (1×2×3×4)\n```"),
        task: E("Write `factorial(n)` (product of 1…n). `factorial(5)` → `120`. `factorial(0)` → `1`.", "اكتب `factorial(n)` (حاصل ضرب 1…n). `factorial(5)` ← `120`. `factorial(0)` ← `1`."),
        starter: "function factorial(n) {\n}",
        tests: [
          { label: E("factorial(5) is 120", "factorial(5) تساوي 120"), fn: (s) => s.factorial && s.factorial(5) === 120 },
          { label: E("factorial(0) is 1 (edge case!)", "factorial(0) تساوي 1 (حالة حدية!)"), fn: (s) => s.factorial && s.factorial(0) === 1 }
        ],
        hints: [
          E("Start `result` at 1 — that's why factorial(0) works automatically.", "ابدأ `result` بقيمة 1 — لهذا تعمل factorial(0) تلقائيًا."),
          E("Multiply result by every `i` from 2 up to n, then return it.", "اضرب result في كل `i` من 2 حتى n ثم أرجعها.")
        ],
        solution: "function factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result = result * i;\n  }\n  return result;\n}"
      },
      {
        id: "p-se-1", kind: "js", xp: 70, project: true, skill: "Functions",
        title: E("PROJECT: Number toolbox", "مشروع: صندوق أدوات الأعداد"),
        brief: E(
          "First engineering project: a small **library** — functions other programmers would use. Libraries live or die by their edge cases: zero, negatives, empty input. Test-minded thinking starts here.",
          "أول مشروع هندسي: **مكتبة** صغيرة — دوال يستخدمها مبرمجون آخرون. المكتبات تُقاس بحالاتها الحدية: الصفر والسالب والمدخل الفارغ. التفكير الاختباري يبدأ هنا."),
        task: E("Write two functions:\n1. `isPrime(n)` — `true` if n is a prime number (primes are ≥ 2; 0 and 1 are not prime).\n2. `countVowels(str)` — how many vowels (a, e, i, o, u) the string contains.", "اكتب دالتين:\n1. `isPrime(n)` — `true` إذا كان n عددًا أوليًا (الأعداد الأولية ≥ 2؛ الصفر والواحد ليسا أوليين).\n2. `countVowels(str)` — كم عدد حروف العلة (a, e, i, o, u) في النص."),
        starter: "function isPrime(n) {\n  // handle n < 2 first, then test divisors\n}\n\nfunction countVowels(str) {\n}",
        tests: [
          { label: E("isPrime: 2,3,5 true — 1,9 false", "isPrime: 2,3,5 صحيح — 1,9 خطأ"), fn: (s) => s.isPrime && s.isPrime(2) && s.isPrime(3) && s.isPrime(5) && !s.isPrime(1) && !s.isPrime(9) },
          { label: E("isPrime(0) and isPrime(1) are false", "isPrime(0) و isPrime(1) تساويان false"), fn: (s) => s.isPrime && !s.isPrime(0) && !s.isPrime(1) },
          { label: E("countVowels(\"hello\") is 2", "countVowels(\"hello\") تساوي 2"), fn: (s) => s.countVowels && s.countVowels("hello") === 2 },
          { label: E("countVowels(\"\") is 0", "countVowels(\"\") تساوي 0"), fn: (s) => s.countVowels && s.countVowels("") === 0 }
        ],
        hints: [
          E("For primes: if n < 2 return false, then loop `i` from 2 to n-1 and return false if any `i` divides n.", "للأولية: إذا كان n أقل من 2 أرجع false، ثم كرر `i` من 2 إلى n-1 وأرجع false إذا قبل n القسمة على أي `i` (أي كان باقي القسمة `n % i` صفرًا)."),
          E("For vowels: `const vowels = 'aeiou';` then loop the string and check `vowels.includes(ch.toLowerCase())`.", "لحروف العلة: `const vowels = 'aeiou';` ثم كرر على النص وافحص `vowels.includes(ch.toLowerCase())`.")
        ],
        solution: "function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i < n; i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}\n\nfunction countVowels(str) {\n  const vowels = 'aeiou';\n  let count = 0;\n  for (const ch of str) {\n    if (vowels.includes(ch.toLowerCase())) count++;\n  }\n  return count;\n}"
      }
    ]
  },
  {
    id: "e2", emoji: "📈",
    title: E("Algorithms", "الخوارزميات"),
    desc: E("The heart of engineering: turning problems into precise, efficient step-by-step solutions.", "قلب الهندسة: تحويل المسائل إلى حلول دقيقة وفعالة خطوة بخطوة."),
    steps: [
      {
        id: "s-se-search", kind: "js", xp: 25, skill: "Searching",
        title: E("Linear search", "البحث الخطي"),
        brief: E(
          "The most fundamental algorithm: walk a list until you find what you want.\n\n```javascript\nfunction linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;  // found: index\n  }\n  return -1;                           // not found convention\n}\n```\n\nReturning `-1` for \"not found\" is a convention used across languages and libraries.",
          "أبسط الخوارزميات وأساسها: امشِ على القائمة حتى تجد ما تريد.\n\n```javascript\nfunction linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;  // وجدته: الفهرس\n  }\n  return -1;                           // اصطلاح \"غير موجود\"\n}\n```\n\nإرجاع `-1` لـ\"غير موجود\" اصطلاح مستخدم في اللغات والمكتبات كلها."),
        task: E("Write `linearSearch(arr, target)` — return the index of target, or `-1`.", "اكتب `linearSearch(arr, target)` — أرجع فهرس target أو `-1`."),
        starter: "function linearSearch(arr, target) {\n}",
        tests: [
          { label: E("Finds 30 at index 2", "يجد 30 في الفهرس 2"), fn: (s) => s.linearSearch && s.linearSearch([10, 20, 30], 30) === 2 },
          { label: E("Returns -1 when missing", "ترجع -1 عند عدم الوجود"), fn: (s) => s.linearSearch && s.linearSearch([10, 20], 99) === -1 },
          { label: E("Finds first match in [5,5,5]", "تجد أول تطابق في [5,5,5]"), fn: (s) => s.linearSearch && s.linearSearch([5, 5, 5], 5) === 0 }
        ],
        hints: [
          E("Loop with index (not for-of) — the index IS the answer.", "استخدم حلقة بفهرس (ليست for-of) — الفهرس نفسه هو الجواب."),
          E("Return immediately on match; return -1 only after the loop finishes.", "أرجع فور التطابق؛ وأرجع -1 فقط بعد انتهاء الحلقة.")
        ],
        solution: "function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}"
      },
      {
        id: "s-se-bigo", kind: "concept", xp: 10, skill: "Big-O",
        title: E("Big-O: measuring growth", "‏Big-O: قياس الكلفة"),
        concept: E(
          "Algorithms that give the same answer can cost wildly different amounts of time as data grows. **Big-O notation** describes how cost *grows*:\n\n- **O(1)** — constant. Array index access. Data ×1000? Same speed.\n- **O(log n)** — halving each step. Binary search. A million items ≈ 20 steps.\n- **O(n)** — linear. One pass over the data. Data ×10 → time ×10.\n- **O(n²)** — every item compared with every item. Data ×10 → time ×100. Fine for 100 items, deadly for a million.\n\n```javascript\narr[5]                 // O(1)\nlinearSearch(arr, x)   // O(n)\nbubbleSort(arr)        // O(n²)\nbinarySearch(arr, x)   // O(log n) — but needs sorted data\n```\n\nEngineering is choosing the right trade-off: simplicity vs scale. Nobody optimizes everything — you optimize what the *data size* demands.",
          "خوارزميات تعطي نفس الإجابة قد تكلّف أزمنة متباينة جدًا مع نمو البيانات. **رموز Big-O** تصف كيف ينمو زمن التنفيذ:\n\n- **O(1)** — ثابت. الوصول لفهرس مصفوفة. البيانات ×1000؟ نفس السرعة.\n- **O(log n)** — نصف البيانات كل خطوة. البحث الثنائي. مليون عنصر ≈ 20 خطوة.\n- **O(n)** — خطي. مسح واحد للبيانات. البيانات ×10 ← الزمن ×10.\n- **O(n²)** — كل عنصر يقارن بكل عنصر. البيانات ×10 ← الزمن ×100. جيد لمئة عنصر، قاتل لمليون.\n\n```javascript\narr[5]                 // O(1)\nlinearSearch(arr, x)   // O(n)\nbubbleSort(arr)        // O(n²)\nbinarySearch(arr, x)   // O(log n) — لكن تتطلب بيانات مرتبة\n```\n\nالهندسة هي اختيار المفاضلة الصحيحة: البساطة مقابل التوسع. لا أحد يحسّن كل شيء — بل تحسّن ما تتطلبه *حجم البيانات*."),
        quiz: { q: E("Binary search on 1,000,000 sorted items takes roughly how many steps?", "البحث الثنائي في مليون عنصر مرتب يأخذ تقريبًا كم خطوة؟"), options: E(["About 20", "About 1,000", "Exactly 1,000,000"], ["نحو 20", "نحو 1,000", "مليون بالضبط"]), answer: 0 }
      },
      {
        id: "s-se-sort", kind: "js", xp: 30, skill: "Sorting",
        title: E("Bubble sort: your first sorter", "ترتيب الفقاعة: أول خوارزمية ترتيب لك"),
        brief: E(
          "Sorting is the classic algorithm exercise. **Bubble sort**: repeatedly walk the list, swap any adjacent pair that's out of order, until a full pass makes no swaps.\n\n```javascript\nfor (let i = 0; i < arr.length - 1; i++) {\n  for (let j = 0; j < arr.length - 1 - i; j++) {\n    if (arr[j] > arr[j + 1]) {\n      const tmp = arr[j];\n      arr[j] = arr[j + 1];\n      arr[j + 1] = tmp;   // swap!\n    }\n  }\n}\n```\n\nIt's O(n²) — too slow for production, perfect for *understanding* sorting.",
          "الترتيب هو تمرين الخوارزميات الكلاسيكي. **ترتيب الفقاعة**: امشِ القائمة مرارًا، بدّل أي زوج متجاور غير مرتب، حتى تمريرة كاملة بلا تبديلات.\n\n```javascript\nfor (let i = 0; i < arr.length - 1; i++) {\n  for (let j = 0; j < arr.length - 1 - i; j++) {\n    if (arr[j] > arr[j + 1]) {\n      const tmp = arr[j];\n      arr[j] = arr[j + 1];\n      arr[j + 1] = tmp;   // تبديل!\n    }\n  }\n}\n```\n\nهي O(n²) — بطيئة للإنتاج، مثالية *لفهم* الترتيب."),
        task: E("Write `bubbleSort(arr)` returning a **new** sorted array (don't modify the input!). Sort ascending.", "اكتب `bubbleSort(arr)` التي تُرجع مصفوفة **جديدة** مرتبة (لا تعدّل المدخل!). بالترتيب التصاعدي."),
        starter: "function bubbleSort(arr) {\n  // copy first: const out = [...arr]\n}",
        tests: [
          { label: E("[3,1,2] → [1,2,3]", "[3,1,2] ← [1,2,3]"), fn: (s) => { if (!s.bubbleSort) return false; return JSON.stringify(s.bubbleSort([3,1,2])) === "[1,2,3]"; } },
          { label: E("Handles duplicates & negatives", "تتعامل مع المكرر والسالب"), fn: (s) => JSON.stringify(s.bubbleSort([5,-1,5,0])) === "[-1,0,5,5]" },
          { label: E("Original array unchanged", "المصفوفة الأصلية لم تتغير"), fn: (s) => { const a = [2,1]; s.bubbleSort(a); return a[0] === 2 && a[1] === 1; } }
        ],
        hints: [
          E("Start with `const out = [...arr];` and sort `out` — that protects the original.", "ابدأ بـ `const out = [...arr];` ورتب `out` — هذا يحمي الأصل."),
          E("The swap is three lines with a temp variable: tmp = a; a = b; b = tmp.", "التبديل ثلاثة أسطر بمتغير مؤقت: tmp = a; a = b; b = tmp.")
        ],
        solution: "function bubbleSort(arr) {\n  const out = [...arr];\n  for (let i = 0; i < out.length - 1; i++) {\n    for (let j = 0; j < out.length - 1 - i; j++) {\n      if (out[j] > out[j + 1]) {\n        const tmp = out[j];\n        out[j] = out[j + 1];\n        out[j + 1] = tmp;\n      }\n    }\n  }\n  return out;\n}"
      },
      {
        id: "s-se-binary", kind: "js", xp: 30, skill: "Searching",
        title: E("Binary search: think in halves", "البحث الثنائي: فكّر بالنصفين"),
        brief: E(
          "Sorted data unlocks speed. Binary search checks the **middle** element, throws away the wrong half, repeats:\n\n```javascript\nlet lo = 0, hi = arr.length - 1;\nwhile (lo <= hi) {\n  const mid = Math.floor((lo + hi) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) lo = mid + 1;  // go right\n  else hi = mid - 1;                    // go left\n}\nreturn -1;\n```\n\n1,000,000 items → about 20 checks. That's the power of O(log n).",
          "البيانات المرتبة تفتح باب السرعة. البحث الثنائي يفحص العنصر **الأوسط** ويرمي النصف الخطأ ويعيد:\n\n```javascript\nlet lo = 0, hi = arr.length - 1;\nwhile (lo <= hi) {\n  const mid = Math.floor((lo + hi) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) lo = mid + 1;  // يمينًا\n  else hi = mid - 1;                    // يسارًا\n}\nreturn -1;\n```\n\nمليون عنصر ← نحو 20 فحصًا. هذه قوة O(log n)."),
        task: E("Write `binarySearch(sortedArr, target)` — index or -1.", "اكتب `binarySearch(sortedArr, target)` — الفهرس أو -1."),
        starter: "function binarySearch(arr, target) {\n  let lo = 0;\n  let hi = arr.length - 1;\n  // while loop here\n}",
        tests: [
          { label: E("Finds 70 at index 3", "يجد 70 في الفهرس 3"), fn: (s) => s.binarySearch && s.binarySearch([10, 40, 60, 70, 90], 70) === 3 },
          { label: E("Returns -1 for missing", "ترجع -1 لغير الموجود"), fn: (s) => s.binarySearch && s.binarySearch([1, 3, 5], 4) === -1 },
          { label: E("Handles single-element arrays", "تتعامل مع مصفوفة عنصر واحد"), fn: (s) => s.binarySearch && s.binarySearch([7], 7) === 0 && s.binarySearch([7], 3) === -1 }
        ],
        hints: [
          E("The loop continues `while (lo <= hi)` — equal is valid (one element left).", "الحلقة تستمر بشرط `while (lo <= hi)` — التساوي صالح (بقي عنصر واحد)."),
          E("Compare `arr[mid]` with target *before* moving lo or hi.", "قارن `arr[mid]` مع الهدف *قبل* تحريك lo أو hi.")
        ],
        solution: "function binarySearch(arr, target) {\n  let lo = 0;\n  let hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}"
      },
      {
        id: "p-se-2", kind: "js", xp: 80, project: true, skill: "Algorithms",
        title: E("PROJECT: Algorithms lab", "مشروع: مختبر الخوارزميات"),
        brief: E(
          "Milestone: two interview-grade classics. These appear in real technical interviews — after this, they're *yours*.",
          "محطة: كلاسيكيتان بمستوى مقابلات العمل. تظهران في المقابلات التقنية الحقيقية — وبعد اليوم ستصبحان *ملكك*."),
        task: E("1. `twoSum(nums, target)` — return the two **indices** whose values add to target. Exactly one solution exists.\n2. `isPalindrome(str)` — `true` if the string reads the same backwards (ignore case).", "1. `twoSum(nums, target)` — أرجع **فهرسي** العددين اللذين مجموعهما target. يوجد حل وحيد.\n2. `isPalindrome(str)` — `true` إذا كان النص يُقرأ من الاتجاهين بشكل متماثل (تجاهل حالة الأحرف)."),
        starter: "function twoSum(nums, target) {\n  // nested loops or a clever object map\n}\n\nfunction isPalindrome(str) {\n}",
        tests: [
          { label: E("twoSum([2,7,11],9) → [0,1]", "twoSum([2,7,11],9) ← [0,1]"), fn: (s) => { if (!s.twoSum) return false; const r = s.twoSum([2,7,11],9); return JSON.stringify([...r].sort()) === JSON.stringify([0,1]); } },
          { label: E("twoSum([3,2,4],6) → [1,2]", "twoSum([3,2,4],6) ← [1,2]"), fn: (s) => { const r = s.twoSum([3,2,4],6); return r && JSON.stringify([...r].sort()) === JSON.stringify([1,2]); } },
          { label: E("isPalindrome(\"Level\") is true", "isPalindrome(\"Level\") تساوي true"), fn: (s) => s.isPalindrome && s.isPalindrome("Level") === true },
          { label: E("isPalindrome(\"hello\") is false", "isPalindrome(\"hello\") تساوي false"), fn: (s) => s.isPalindrome && s.isPalindrome("hello") === false }
        ],
        hints: [
          E("twoSum: for each i, scan j > i and check `nums[i] + nums[j] === target`.", "twoSum: لكل i، امسح j > i وافحص `nums[i] + nums[j] === target`."),
          E("isPalindrome: compare `str.toLowerCase()` with its reverse — split('').reverse().join('').", "isPalindrome: قارن `str.toLowerCase()` مع معكوسها — split('').reverse().join('').")
        ],
        solution: "function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}\n\nfunction isPalindrome(str) {\n  const s = str.toLowerCase();\n  return s === s.split('').reverse().join('');\n}"
      }
    ]
  },
  {
    id: "e3", emoji: "🗂️",
    title: E("Data Structures", "هياكل البيانات"),
    desc: E("How engineers organize data so problems become easy. Stack, queue, and the mighty hash map.", "كيف ينظم المهندسون البيانات بحيث تصبح المسائل سهلة. المكدس والطابور وخريطة التجزئة العظيمة."),
    steps: [
      {
        id: "s-se-stack", kind: "js", xp: 30, skill: "Stack",
        title: E("The Stack: last in, first out", "المكدس: آخر داخل، أول خارج"),
        brief: E(
          "A **stack** is like a pile of plates: you add on top, remove from the top. **LIFO**.\n\n```javascript\nclass Stack {\n  constructor() { this.items = []; }\n  push(x) { this.items.push(x); }\n  pop()   { return this.items.pop(); }\n  peek()  { return this.items[this.items.length - 1]; }\n  size()  { return this.items.length; }\n}\n```\n\nUsed for: undo history, browser back button, call stacks, expression parsing.",
          "**المكدس** مثل كومة الأطباق: تضيف فوقها وتسحب من فوقها. **LIFO**.\n\n```javascript\nclass Stack {\n  constructor() { this.items = []; }\n  push(x) { this.items.push(x); }\n  pop()   { return this.items.pop(); }\n  peek()  { return this.items[this.items.length - 1]; }\n  size()  { return this.items.length; }\n}\n```\n\nتُستخدم في: سجل التراجع، زر الرجوع بالمتصفح، مكدس الاستدعاءات، تحليل التعبيرات."),
        task: E("Implement a `Stack` class with `push`, `pop`, `peek`, `size`.", "نفّذ صنف `Stack` فيه `push` و `pop` و `peek` و `size`."),
        starter: "class Stack {\n  constructor() {\n    this.items = [];\n  }\n  // add your methods\n}",
        tests: [
          { label: E("push(1), push(2) → size() is 2", "push(1), push(2) ← size() تساوي 2"), fn: (s) => { if (!s.Stack) return false; const st = new s.Stack(); st.push(1); st.push(2); return st.size() === 2; } },
          { label: E("pop returns last pushed (LIFO)", "pop تُرجع آخر ما أُضيف (LIFO)"), fn: (s) => { const st = new s.Stack(); st.push('a'); st.push('b'); return st.pop() === 'b'; } },
          { label: E("peek looks without removing", "peek تلقي نظرة دون سحب"), fn: (s) => { const st = new s.Stack(); st.push(9); return st.peek() === 9 && st.size() === 1; } }
        ],
        hints: [
          E("Methods go inside the class body — no `function` keyword: `push(x) { ... }`.", "الدوال توضع داخل جسم الصنف — بلا كلمة `function`: `push(x) { ... }`."),
          E("`pop()` should `return this.items.pop();` — removing AND returning.", "`pop()` يجب أن `return this.items.pop();` — السحب والإرجاع معًا.")
        ],
        solution: "class Stack {\n  constructor() { this.items = []; }\n  push(x) { this.items.push(x); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  size() { return this.items.length; }\n}"
      },
      {
        id: "s-se-queue", kind: "js", xp: 30, skill: "Queue",
        title: E("The Queue: first in, first out", "الطابور: أول داخل، أول خارج"),
        brief: E(
          "A **queue** is a line at a shop: first person in is served first. **FIFO**.\n\n```javascript\nclass Queue {\n  constructor() { this.items = []; }\n  enqueue(x) { this.items.push(x); }     // join the back\n  dequeue()  { return this.items.shift(); } // serve the front\n  size()     { return this.items.length; }\n}\n```\n\nUsed for: print jobs, task scheduling, chat messages, game action buffers.",
          "**الطابور** صف في متجر: أول من يدخل يُخدم أولًا. **FIFO**.\n\n```javascript\nclass Queue {\n  constructor() { this.items = []; }\n  enqueue(x) { this.items.push(x); }     // يلتحق بالخلف\n  dequeue()  { return this.items.shift(); } // يُخدم من الأمام\n  size()     { return this.items.length; }\n}\n```\n\nتُستخدم في: مهام الطباعة، جدولة المهام، رسائل المحادثة، مخازن أحداث الألعاب."),
        task: E("Implement a `Queue` class with `enqueue`, `dequeue`, `size`.", "نفّذ صنف `Queue` فيه `enqueue` و `dequeue` و `size`."),
        starter: "class Queue {\n  constructor() {\n    this.items = [];\n  }\n}",
        tests: [
          { label: E("FIFO order: a then b", "ترتيب FIFO: ‏a ثم b"), fn: (s) => { if (!s.Queue) return false; const q = new s.Queue(); q.enqueue('a'); q.enqueue('b'); return q.dequeue() === 'a' && q.dequeue() === 'b'; } },
          { label: E("size tracks correctly", "size تتتبع بشكل صحيح"), fn: (s) => { const q = new s.Queue(); q.enqueue(1); q.enqueue(2); q.dequeue(); return q.size() === 1; } }
        ],
        hints: [
          E("`.push()` adds at the end, `.shift()` removes from the front — that's the whole trick.", "`.push()` تضيف في النهاية و `.shift()` تسحب من البداية — هذا هو كل السر."),
          E("`dequeue() { return this.items.shift(); }`", "`dequeue() { return this.items.shift(); }`")
        ],
        solution: "class Queue {\n  constructor() { this.items = []; }\n  enqueue(x) { this.items.push(x); }\n  dequeue() { return this.items.shift(); }\n  size() { return this.items.length; }\n}"
      },
      {
        id: "s-se-hash", kind: "concept", xp: 10, skill: "Hash Maps",
        title: E("Hash maps: instant lookup", "خرائط التجزئة: بحث لحظي"),
        concept: E(
          "The most used data structure in real software: the **hash map** (object/Map/dictionary). It maps keys → values with **O(1)** average lookup.\n\n```javascript\nconst ages = { Sara: 22, Omar: 31 };\nages[\"Sara\"];        // 22 — instantly, no scanning\nages[\"Lina\"] = 27;   // insert\n```\n\nHow? The key is run through a **hash function** that computes which 'bucket' stores the value — like a coat-check ticket pointing straight to your shelf. No searching at all.\n\nThe classic engineering move: *when a loop inside a loop is too slow, reach for a hash map.* Counting items, caching results, deduplicating, indexing — all become one pass.",
          "أكثر بنية بيانات استخدامًا في البرمجيات الحقيقية: **خريطة التجزئة** (object/Map/قاموس). تربط مفاتيح بقيم ببحث **O(1)** في المتوسط.\n\n```javascript\nconst ages = { Sara: 22, Omar: 31 };\nages[\"Sara\"];        // 22 — لحظيًا بلا مسح\nages[\"Lina\"] = 27;   // إدخال\n```\n\nكيف؟ يمرّر المفتاح في **دالة تجزئة** تحسب أي 'حاوية' تخزن القيمة — مثل تذكرة حفظ الأمتعة تشير مباشرة إلى رفّك. لا بحث أصلًا.\n\nالحركة الهندسية الكلاسيكية: *عندما تكون حلقة داخل حلقة بطيئة جدًا، مدّ يدك لخريطة تجزئة.* عدّ العناصر، وتخزين النتائج، وإزالة التكرار، والفهرسة — كلها تصبح مسحة واحدة."),
        quiz: { q: E("Average lookup time in a hash map?", "متوسط زمن البحث في خريطة تجزئة؟"), options: E(["O(1)", "O(n)", "O(n²)"], ["O(1)", "O(n)", "O(n²)"]), answer: 0 }
      },
      {
        id: "p-se-3", kind: "js", xp: 80, project: true, skill: "Stack",
        title: E("PROJECT: Bracket validator", "مشروع: مدقق الأقواس"),
        brief: E(
          "Milestone: a real tool. Code editors highlight mismatched brackets instantly — that's this algorithm, powered by a **stack**.\n\nEvery opener must be closed by the matching closer, in the right order. `([)]` is wrong; `([{}])` is right.",
          "محطة: أداة حقيقية. محررات الأكواد تُبرز الأقواس غير المتطابقة فورًا — هذه هي خوارزميتها، وهي مدعومة بـ**مكدس**.\n\nكل قوس فتح يجب أن يُغلق بنظيره وبالترتيب الصحيح. `([)]` خطأ؛ و `([{}])` صحيح."),
        task: E("Write `isBalanced(s)` — `true` if all `()`, `[]`, `{}` in the string are correctly matched and nested.", "اكتب `isBalanced(s)` — `true` إذا كانت كل الأقواس `()`, `[]`, `{}` في النص متطابقة ومتداخلة بشكل صحيح."),
        starter: "function isBalanced(s) {\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  // loop through s...\n}",
        tests: [
          { label: E("\"([{}])\" is balanced", "\"([{}])\" متوازنة"), fn: (s) => s.isBalanced && s.isBalanced("([{}])") === true },
          { label: E("\"([)]\" is NOT balanced", "\"([)]\" غير متوازنة"), fn: (s) => s.isBalanced && s.isBalanced("([)]") === false },
          { label: E("\"((\" is NOT balanced (unclosed)", "\"((\" غير متوازنة (غير مغلقة)"), fn: (s) => s.isBalanced && s.isBalanced("((") === false },
          { label: E("\"\" (empty) is balanced", "\"\" (فارغة) متوازنة"), fn: (s) => s.isBalanced && s.isBalanced("") === true }
        ],
        hints: [
          E("Opener → push onto stack. Closer → pop and check it matches. If stack isn't empty at the end → unbalanced.", "قوس فتح ← ادفعه للمكدس. قوس إغلاق ← اسحب وتأكد أنه يطابقه. إذا لم يكن المكدس فارغًا في النهاية ← غير متوازنة."),
          E("`for (const ch of s) { if (ch === '(' || ch === '[' || ch === '{') stack.push(ch); else { const open = stack.pop(); if (open !== pairs[ch]) return false; } } return stack.length === 0;`", "`for (const ch of s) { if (ch === '(' || ch === '[' || ch === '{') stack.push(ch); else { const open = stack.pop(); if (open !== pairs[ch]) return false; } } return stack.length === 0;`")
        ],
        solution: "function isBalanced(s) {\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (const ch of s) {\n    if (ch === '(' || ch === '[' || ch === '{') {\n      stack.push(ch);\n    } else if (ch === ')' || ch === ']' || ch === '}') {\n      const open = stack.pop();\n      if (open !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}"
      }
    ]
  },
  {
    id: "e3r", emoji: "🔁",
    title: E("Recursion — functions that call themselves", "الاستدعاء الذاتي — دوال تستدعي نفسها"),
    desc: E("Divide a problem into smaller versions of itself until it becomes trivial. The most mind-bending idea in this path — and the most elegant.", "قسّم المسألة إلى نسخ أصغر منها حتى تصبح تافهة. أكثر فكرة تقلب الذهن في هذا المسار — وأكثرها أناقة."),
    steps: [
      {
        id: "s-rec-first", kind: "js", xp: 25, skill: "Recursion",
        title: E("Your first recursive function", "أول دالة استدعاء ذاتي لك"),
        brief: E(
          "A **recursive function** calls itself — but on a *smaller* input, and with a **base case** that stops the calls:\n\n```javascript\nfunction countDown(n) {\n  if (n === 0) return;        // base case: stop\n  countDown(n - 1);           // recursive call: smaller n\n}\n```\n\nEvery call gets its own tiny workspace on the \"call stack\". Forget the base case and the stack fills up → `RangeError: Maximum call stack size exceeded`. Two ingredients, always: a smaller step toward the base case, and the base case itself.",
          "**الدالة العودية** تستدعي نفسها — لكن بمدخل *أصغر*، ومع **حالة أساسية** توقف الاستدعاءات:\n\n```javascript\nfunction countDown(n) {\n  if (n === 0) return;        // الحالة الأساسية: توقف\n  countDown(n - 1);           // الاستدعاء الذاتي: n أصغر\n}\n```\n\nكل استدعاء يحصل على مساحة عمل صغيرة خاصة به في \"مكدس الاستدعاءات\". انسَ الحالة الأساسية فيمتلئ المكدس ← `RangeError: Maximum call stack size exceeded`. مكوّنان دائمًا: خطوة نحو الحالة الأساسية، والحالة الأساسية نفسها."),
        task: E("Write `sumTo(n)` **recursively** (no loops!): the sum 1 + 2 + … + n. `sumTo(5)` → 15, and `sumTo(0)` → 0.", "اكتب `sumTo(n)` **بالاستدعاء الذاتي** (بلا حلقات!): المجموع 1 + 2 + … + n. `sumTo(5)` ← 15، و `sumTo(0)` ← 0."),
        starter: "function sumTo(n) {\n  // base case: n <= 0 → return 0\n  // recursive case: n + sumTo(n - 1)\n}\n\nconsole.log(sumTo(5)); // 15\nconsole.log(sumTo(0)); // 0",
        tests: [
          { label: E("sumTo(5) is 15", "sumTo(5) تساوي 15"), fn: (s) => s.sumTo && s.sumTo(5) === 15 },
          { label: E("sumTo(0) is 0 (base case)", "sumTo(0) تساوي 0 (الحالة الأساسية)"), fn: (s) => s.sumTo && s.sumTo(0) === 0 },
          { label: E("sumTo(100) is 5050", "sumTo(100) تساوي 5050"), fn: (s) => s.sumTo && s.sumTo(100) === 5050 }
        ],
        hints: [
          E("The sum to n is just n plus the sum to n-1.", "المجموع إلى n هو ببساطة n زائد المجموع إلى n-1."),
          E("`if (n <= 0) return 0; return n + sumTo(n - 1);`", "`if (n <= 0) return 0; return n + sumTo(n - 1);`")
        ],
        solution: "function sumTo(n) {\n  if (n <= 0) return 0;\n  return n + sumTo(n - 1);\n}\n\nconsole.log(sumTo(5)); // 15\nconsole.log(sumTo(0)); // 0"
      },
      {
        id: "s-rec-power", kind: "js", xp: 25, skill: "Recursion",
        title: E("Building results on the way back up", "بناء النتيجة أثناء الصعود"),
        brief: E(
          "Recursion has a magic trick: the real work often happens **after** the recursive call returns. Going down: `power(2, 4)` asks `power(2, 3)`… down to the base case. Coming back up, each level multiplies:\n\n```javascript\nfunction power(base, exp) {\n  if (exp === 0) return 1;              // 2^0 = 1\n  return base * power(base, exp - 1);   // 2 × (2 × (2 × (2 × 1)))\n}\n```\n\nThe base case's return value is the seed; each level on the way up adds one piece of work. Draw it as stairs down and back up if it helps — every engineer does this the first week.",
          "للاستدعاء الذاتي حيلة سحرية: العمل الحقيقي يحدث غالبًا **بعد** عودة الاستدعاء الذاتي. في الهبوط: `power(2, 4)` تسأل `power(2, 3)`… حتى الحالة الأساسية. وفي الصعود، يضاعف كل مستوى النتيجة:\n\n```javascript\nfunction power(base, exp) {\n  if (exp === 0) return 1;              // 2^0 = 1\n  return base * power(base, exp - 1);   // 2 × (2 × (2 × (2 × 1)))\n}\n```\n\nالقيمة المرجعة من الحالة الأساسية هي البذرة؛ وكل مستوى في الصعود يضيف عملًا صغيرًا. ارسمها كدرجات هبوط وصعود إن ساعدك ذلك — كل مهندس فعلها في أسبوعه الأول."),
        task: E("Write `power(base, exp)` recursively: base raised to exp (exp ≥ 0). `power(2, 10)` → 1024.", "اكتب `power(base, exp)` بالاستدعاء الذاتي: الأساس مرفوعًا للأس (exp ≥ 0). `power(2, 10)` ← 1024."),
        starter: "function power(base, exp) {\n  // base case: exp === 0 → 1\n  // recursive: base * power(base, exp - 1)\n}\n\nconsole.log(power(2, 10)); // 1024",
        tests: [
          { label: E("power(2, 10) is 1024", "power(2, 10) تساوي 1024"), fn: (s) => s.power && s.power(2, 10) === 1024 },
          { label: E("power(5, 0) is 1 (base case)", "power(5, 0) تساوي 1 (الحالة الأساسية)"), fn: (s) => s.power && s.power(5, 0) === 1 },
          { label: E("power(3, 4) is 81", "power(3, 4) تساوي 81"), fn: (s) => s.power && s.power(3, 4) === 81 }
        ],
        hints: [
          E("Anything to the power 0 is 1 — that's your base case.", "أي عدد مرفوع للأس صفر يساوي 1 — هذه حالتك الأساسية."),
          E("`if (exp === 0) return 1; return base * power(base, exp - 1);`", "`if (exp === 0) return 1; return base * power(base, exp - 1);`")
        ],
        solution: "function power(base, exp) {\n  if (exp === 0) return 1;\n  return base * power(base, exp - 1);\n}\n\nconsole.log(power(2, 10)); // 1024"
      },
      {
        id: "s-rec-concept", kind: "concept", xp: 10, skill: "Recursion",
        title: E("Recursion vs loops: when and why", "الاستدعاء الذاتي مقابل الحلقات: متى ولماذا"),
        concept: E(
          "Anything recursive can be rewritten with a loop — and vice versa. So why learn both?\n\n- **Loops shine** with flat data: \"sum this array\", \"find this item\". Simple, fast, no stack cost.\n- **Recursion shines** with *nested* or *branching* data: folders inside folders, DOM inside DOM, tree decisions, JSON of unknown depth. A loop forces you to manage a stack manually; recursion does it for free.\n\nYou already touched this idea in hash maps (\"the move when loops-in-loops are too slow\") — recursion is the same spirit for *shape*: \"the move when the data nests\".\n\n**The two-question ritual** before writing any recursion:\n1. What's the **base case** — the smallest input where the answer is obvious?\n2. Given the answer for the smaller problem, how do I build the answer for n?\n\nIf you can answer both, the code writes itself in two lines.",
          "أي حل عودي يمكن إعادة كتابته بحلقة — والعكس صحيح. فلماذا تتعلم الاثنين؟\n\n- **الحلقات تتألق** مع البيانات المسطحة: \"اجمع هذه المصفوفة\"، \"ابحث عن هذا العنصر\". بسيطة وسريعة وبلا كلفة على المكدس.\n- **الاستدعاء الذاتي يتألق** مع البيانات *المتداخلة* أو *المتفرعة*: مجلدات داخل مجلدات، وDOM داخل DOM، وشجرة القرارات، وJSON بعمق مجهول. الحلقة تُلزمك بإدارة مكدس يدويًا؛ والاستدعاء الذاتي يفعلها مجانًا.\n\nلمست هذه الفكرة من قبل في خرائط التجزئة (\"الحركة عندما تكون حلقات داخل حلقات بطيئة\") — والاستدعاء الذاتي روحها نفسها لكن مع *الشكل*: \"الحركة عندما تتداخل البيانات\".\n\n**طقس السؤالين** قبل كتابة أي دالة عودية:\n1. ما **الحالة الأساسية** — أصغر مدخل تكون فيه الإجابة واضحة بذاتها؟\n2. بعلمي بالإجابة للمسألة الأصغر، كيف أبني إجابة المسألة الأكبر؟\n\nإن أجبت عن الاثنين، فالكود يُكتب بنفسه في سطرين."),
        quiz: { q: E("For which data shape does recursion beat a plain loop?", "مع أي شكل من البيانات يتفوق الاستدعاء الذاتي على الحلقة العادية؟"), options: E(["Nested or branching data of unknown depth", "A flat array of numbers", "A fixed number of items", "Data that never repeats"], ["بيانات متداخلة أو متفرعة بعمق مجهول", "مصفوفة أرقام مسطحة", "عدد ثابت من العناصر", "بيانات لا تتكرر أبدًا"]), answer: 0 }
      },
      {
        id: "s-rec-flatten", kind: "js", xp: 30, skill: "Recursion",
        title: E("The nested-data superpower", "قوة البيانات المتداخلة"),
        brief: E(
          "Here's where recursion earns its reputation. Suppose you get data like:\n\n```javascript\n[1, [2, 3], [[4], 5]]\n```\n\nA loop can't handle this — the depth is unknown. But recursion barely notices:\n\n```javascript\nfunction flatten(list) {\n  const out = [];\n  for (const item of list) {\n    if (Array.isArray(item)) out.push(...flatten(item)); // nested → recurse\n    else out.push(item);                                  // value → keep\n  }\n  return out;\n}\n```\n\nLook at the two branches: that's the two-question ritual in code. Base case: \"it's not an array → keep it\". Smaller step: \"it is an array → flatten *it* (a smaller problem!) and spread the results\". This exact pattern powers deep-compare, deep-clone, JSON walkers, and folder-size calculators.",
          "هنا يكسب الاستدعاء الذاتي سمعته. تخيل بيانات كهذه:\n\n```javascript\n[1, [2, 3], [[4], 5]]\n```\n\nالحلقة لا تداريها — العمق مجهول. أما الاستدعاء الذاتي فبالكاد يلاحظ الأمر:\n\n```javascript\nfunction flatten(list) {\n  const out = [];\n  for (const item of list) {\n    if (Array.isArray(item)) out.push(...flatten(item)); // متداخل ← استدعِ نفسك\n    else out.push(item);                                  // قيمة ← احفظها\n  }\n  return out;\n}\n```\n\nانظر إلى الفرعين: هذا طقس السؤالين بالكود. الحالة الأساسية: \"ليست مصفوفة ← احفظها\". الخطوة الأصغر: \"مصفوفة ← بسّط *ها* (مسألة أصغر!) وانشر النتائج\". هذا النمط نفسه يشغّل المقارنة العميقة والنسخ العميق والمسّاحات عبر JSON وحاسبات أحجام المجلدات."),
        task: E("Write `countLeaves(tree)` that counts the **numbers** (leaves) in arbitrarily nested arrays. `countLeaves([1, [2, 3], [[4], 5]])` → 5. An empty nested structure like `[[]]` has 0 leaves.", "اكتب `countLeaves(tree)` التي تعدّ **الأرقام** (الأوراق) في مصفوفات متداخلة بعمق أيٍّ كان. `countLeaves([1, [2, 3], [[4], 5]])` ← 5. والبنية الفارغة المتداخلة مثل `[[]]` أوراقها 0."),
        starter: "function countLeaves(tree) {\n  // not an array? → it's a leaf: return 1\n  // an array? → sum countLeaves over every item\n}\n\nconsole.log(countLeaves([1, [2, 3], [[4], 5]])); // 5\nconsole.log(countLeaves([[]])); // 0",
        tests: [
          { label: E("Counts 5 leaves in mixed nesting", "تعدّ 5 أوراق في تداخل مختلط"), fn: (s) => s.countLeaves && s.countLeaves([1, [2, 3], [[4], 5]]) === 5 },
          { label: E("A plain number is 1 leaf", "الرقم المفرد ورقة واحدة"), fn: (s) => s.countLeaves && s.countLeaves(7) === 1 },
          { label: E("Empty nested arrays count 0", "المصفوفات الفارغة المتداخلة تعدّ 0"), fn: (s) => s.countLeaves && s.countLeaves([[], [[]], []]) === 0 },
          { label: E("Deep single chain [[[[1]]]] is 1", "السلسلة العميقة [[[[1]]]] تساوي 1"), fn: (s) => s.countLeaves && s.countLeaves([[[[1]]]]) === 1 }
        ],
        hints: [
          E("Start: `if (!Array.isArray(tree)) return 1;` — a number is a leaf.", "ابدأ بـ `if (!Array.isArray(tree)) return 1;` — الرقم ورقة."),
          E("Then: `let n = 0; for (const item of tree) n += countLeaves(item); return n;`", "ثم: `let n = 0; for (const item of tree) n += countLeaves(item); return n;`")
        ],
        solution: "function countLeaves(tree) {\n  if (!Array.isArray(tree)) return 1;\n  let count = 0;\n  for (const item of tree) {\n    count += countLeaves(item);\n  }\n  return count;\n}\n\nconsole.log(countLeaves([1, [2, 3], [[4], 5]])); // 5\nconsole.log(countLeaves([[]])); // 0"
      }
    ]
  },
  {
    id: "e3h", emoji: "🧬",
    title: E("Higher-order functions — code as material", "الدوال العليا — الكود كمادة بناء"),
    desc: E("Functions that take functions and return functions: map, filter, reduce, and factories. The bridge from writing code to designing it.", "دوال تأخذ دوالًا وتُرجع دوالًا: map و filter و reduce والمصانع. الجسر من كتابة الكود إلى تصميمه."),
    steps: [
      {
        id: "s-hof-reduce", kind: "js", xp: 25, skill: "Higher-order",
        title: E("reduce — the accumulator, upgraded", "reduce — المُراكم الذي تعرفه، مُرقّى"),
        brief: E(
          "You already wrote \"loop over an array, build up a result\" by hand — at least three times. **`.reduce()` is that exact pattern, packaged:**\n\n```javascript\nconst scores = [90, 72, 88];\nconst total = scores.reduce((acc, cur) => acc + cur, 0);\n// acc = accumulator (result so far), 0 = starting value\n```\n\n`reduce` walks the array, feeding each element into your function together with the running result. Sum? Multiply? Count matches? Build an object? — same shape, different seed and combiner:\n\n```javascript\n[1, 2, 3].reduce((acc, n) => acc * n, 1)          // 6\n['a','b','a'].reduce((acc, ch) => { acc[ch] = (acc[ch] || 0) + 1; return acc; }, {})\n// { a: 2, b: 1 }\n```\n\nEvery accumulator loop you've written in this path — sumTo, factorial, countDigits — was a hand-rolled reduce. Now you can see the pattern itself.",
          "كتبت من قبل \"حلقة على مصفوفة تبني نتيجة\" — ثلاث مرات على الأقل. **`.reduce()` هو النمط نفسه معبأً للاستخدام:**\n\n```javascript\nconst scores = [90, 72, 88];\nconst total = scores.reduce((acc, cur) => acc + cur, 0);\n// acc = المُراكم (النتيجة حتى الآن)، و 0 قيمة البداية\n```\n\n`reduce` تمشي على المصفوفة وتُغذّي دالتك بكل عنصر مع النتيجة الجارية. جمع؟ ضرب؟ عدّ التطابقات؟ بناء كائن؟ — الشكل واحد، ويختلف البذرة والدمغة:\n\n```javascript\n[1, 2, 3].reduce((acc, n) => acc * n, 1)          // 6\n['a','b','a'].reduce((acc, ch) => { acc[ch] = (acc[ch] || 0) + 1; return acc; }, {})\n// { a: 2, b: 1 }\n```\n\nكل حلقة تراكم كتبتها في هذا المسار — sumTo و factorial و countDigits — كانت reduce يدوية. الآن ترى النمط نفسه."),
        task: E("Write `countWords(words)` using **`reduce`** (no for-loop!): returns an object mapping each word to how many times it appears. `countWords(['a','b','a'])` → `{ a: 2, b: 1 }`.", "اكتب `countWords(words)` باستخدام **`reduce`** (بلا حلقة for!): تُرجع كائنًا يربط كل كلمة بعدد مرات ظهورها. `countWords(['a','b','a'])` ← `{ a: 2, b: 1 }`."),
        starter: "function countWords(words) {\n  // words.reduce((acc, w) => ..., {})\n}\n\nconsole.log(countWords(['a','b','a'])); // { a: 2, b: 1 }",
        tests: [
          { label: E("countWords(['a','b','a']) → { a: 2, b: 1 }", "countWords(['a','b','a']) ← { a: 2, b: 1 }"), fn: (s) => { if (!s.countWords) return false; const r = s.countWords(['a', 'b', 'a']); return r.a === 2 && r.b === 1; } },
          { label: E("Single word → { x: 1 }", "كلمة واحدة ← { x: 1 }"), fn: (s) => { if (!s.countWords) return false; const r = s.countWords(['x']); return r.x === 1; } },
          { label: E("Empty array → empty object", "مصفوفة فارغة ← كائن فارغ"), fn: (s) => { const r = s.countWords && s.countWords([]); return !!r && Object.keys(r).length === 0; } }
        ],
        hints: [
          E("Seed with `{}`. For each word: `acc[w] = (acc[w] || 0) + 1` — then return `acc`.", "ابدأ بـ `{}`. لكل كلمة: `acc[w] = (acc[w] || 0) + 1` — ثم أرجِع `acc`."),
          E("`return words.reduce((acc, w) => { acc[w] = (acc[w] || 0) + 1; return acc; }, {});`", "`return words.reduce((acc, w) => { acc[w] = (acc[w] || 0) + 1; return acc; }, {});`")
        ],
        solution: "function countWords(words) {\n  return words.reduce((acc, w) => {\n    acc[w] = (acc[w] || 0) + 1;\n    return acc;\n  }, {});\n}\n\nconsole.log(countWords(['a','b','a'])); // { a: 2, b: 1 }"
      },
      {
        id: "s-hof-chain", kind: "js", xp: 25, skill: "Higher-order",
        title: E("Pipelines: map → filter → reduce", "خطوط المعالجة: map ثم filter ثم reduce"),
        brief: E(
          "The real payoff: these three compose into **data pipelines** that read like the problem statement:\n\n```javascript\nconst users = [\n  { name: 'Sara',  age: 22, active: true },\n  { name: 'Omar',  age: 31, active: false },\n  { name: 'Lina',  age: 27, active: true }\n];\n\nconst activeAges = users\n  .filter(u => u.active)          // keep active users\n  .map(u => u.age);               // pull out their ages\n```\n\nNo index bookkeeping, no `push` into temp arrays — each stage transforms the data and hands it to the next. This is declarative style: you say *what*, not *how*. It's the same idea you met in the Components unit (\"declare the UI from state\") — now applied to data processing.",
          "الثمرة الحقيقية: هذه الثلاثة تتكامل لتصنع **خطوط معالجة بيانات** تُقرأ مثل نص المسألة:\n\n```javascript\nconst users = [\n  { name: 'Sara',  age: 22, active: true },\n  { name: 'Omar',  age: 31, active: false },\n  { name: 'Lina',  age: 27, active: true }\n];\n\nconst activeAges = users\n  .filter(u => u.active)          // أبقِ النشطين\n  .map(u => u.age);               // اسحب أعمارهم\n```\n\nلا إدارة فهارس ولا `push` في مصفوفات مؤقتة — كل مرحلة تحوّل البيانات وتناولها المرحلة التالية. هذا الأسلوب \"التصريحي\": تقول *ماذا*، لا *كيف*. وهو الفكرة نفسها التي قابلتها في وحدة المكونات (\"صرّح بالواجهة من الحالة\") — لكنها الآن تطبق على معالجة البيانات."),
        task: E("Write `topScores(scores)` — a **pipeline** (`filter` + `reduce`, no for-loops) returning the sum of all scores of 50 or above. `topScores([90, 40, 72, 30, 50])` → 212.", "اكتب `topScores(scores)` — **خط معالجة** (`filter` ثم `reduce`، بلا حلقات for) يُرجع مجموع الدرجات التي تساوي 50 فأكثر. `topScores([90, 40, 72, 30, 50])` ← 212."),
        starter: "function topScores(scores) {\n  // .filter(...) then .reduce(...)\n}\n\nconsole.log(topScores([90, 40, 72, 30, 50])); // 212",
        tests: [
          { label: E("Mixed scores sum to 212", "مجموع الدرجات المختلطة 212"), fn: (s) => s.topScores && s.topScores([90, 40, 72, 30, 50]) === 212 },
          { label: E("All below 50 → 0", "كلها تحت 50 ← 0"), fn: (s) => s.topScores && s.topScores([10, 20]) === 0 },
          { label: E("Empty array → 0", "مصفوفة فارغة ← 0"), fn: (s) => s.topScores && s.topScores([]) === 0 }
        ],
        hints: [
          E("You don't even need `map` here: `filter` then `reduce((a, n) => a + n, 0)`.", "لست بحاجة إلى `map` هنا: `filter` ثم `reduce((a, n) => a + n, 0)`."),
          E("`return scores.filter(n => n >= 50).reduce((a, n) => a + n, 0);`", "`return scores.filter(n => n >= 50).reduce((a, n) => a + n, 0);`")
        ],
        solution: "function topScores(scores) {\n  return scores.filter(n => n >= 50).reduce((a, n) => a + n, 0);\n}\n\nconsole.log(topScores([90, 40, 72, 30, 50])); // 212"
      },
      {
        id: "s-hof-concept", kind: "concept", xp: 10, skill: "Higher-order",
        title: E("Functions are values", "الدوال قيم"),
        concept: E(
          "The unlock behind everything in this unit: in JavaScript, **a function is a value** — you can store it in a variable, put it in an array, pass it to another function, and return one.\n\n```javascript\nconst ops = {\n  add: (a, b) => a + b,\n  mul: (a, b) => a * b\n};\nops.add(2, 3);        // 5\n\nfunction apply(fn, a, b) { return fn(a, b); }\napply(ops.mul, 4, 5); // 20\n```\n\nThat's all `map`, `filter`, `reduce` and event listeners have ever been: functions that receive *your* function and call it at the right moment. When you wrote `addEventListener('click', function () {...})` you passed a function as a value — you were doing higher-order programming all along.\n\nWhy engineers love this: behavior becomes **data you can compose**. Pass a `sortFn` as a parameter and one generic function sorts anything, any way.",
          "المفتاح خلف كل ما في هذه الوحدة: في جافاسكريبت **الدالة قيمة** — تخزّنها في متغير، وتضعها في مصفوفة، وتمررها إلى دالة أخرى، وتُرجعها من دالة.\n\n```javascript\nconst ops = {\n  add: (a, b) => a + b,\n  mul: (a, b) => a * b\n};\nops.add(2, 3);        // 5\n\nfunction apply(fn, a, b) { return fn(a, b); }\napply(ops.mul, 4, 5); // 20\n```\n\nهذا كل سر `map` و `filter` و `reduce` ومستمعي الأحداث: دوال تستقبل دالتك *أنت* وتستدعيها في اللحظة المناسبة. حين كتبت `addEventListener('click', function () {...})` مررت دالة كقيمة — كنت تمارس البرمجة العليا طوال الوقت.\n\nولهذا يحبها المهندسون: السلوك يصبح **بيانات قابلة للتركيب**. مرّر دالة ترتيب كمعامل فترى دالة واحدة عامة ترتب أي شيء بأي طريقة."),
        quiz: { q: E("What does it mean that functions are \"first-class values\" in JavaScript?", "ماذا يعني أن الدوال \"قيم من الدرجة الأولى\" في جافاسكريبت؟"), options: E(["They can be stored, passed and returned like any value", "They always run first in the program", "They are declared only at the top of files", "They cannot be deleted from memory"], ["يمكن تخزينها وتمريرها وإرجاعها كأي قيمة", "تعمل دائمًا أولًا في البرنامج", "تُعرَّف أعلى الملفات فقط", "لا يمكن حذفها من الذاكرة"]), answer: 0 }
      },
      {
        id: "s-hof-factory", kind: "js", xp: 30, skill: "Higher-order",
        title: E("Functions that make functions", "دوال تصنع دوالًا"),
        brief: E(
          "The final flip: a function can **return** a new function, tuned by its inputs. This is a *function factory*:\n\n```javascript\nfunction multiplier(factor) {\n  return n => n * factor;      // returns a function!\n}\n\nconst double = multiplier(2);\nconst triple = multiplier(3);\ndouble(5);   // 10\ntriple(5);   // 15\n```\n\nThe returned function \"remembers\" its `factor` — that's a **closure**, the same mechanism that keeps `count` alive in your counter app. Factories turn configuration into functions: `makeGreeter('مرحبًا')` returns an Arabic greeter, `makeGreeter('Hello')` an English one — one piece of logic, many behaviors.\n\nYou'll meet this shape everywhere: React hooks, middleware chains, test builders — even this platform's `E(en, ar)` helper is a tiny factory that returns a bilingual value.",
          "القلبة الأخيرة: الدالة تستطيع **إرجاع** دالة جديدة مضبوطة بمدخلاتها. هذه *مصنع دوال*:\n\n```javascript\nfunction multiplier(factor) {\n  return n => n * factor;      // تُرجع دالة!\n}\n\nconst double = multiplier(2);\nconst triple = multiplier(3);\ndouble(5);   // 10\ntriple(5);   // 15\n```\n\nالدالة المرجعة \"تتذكر\" `factor` الخاص بها — هذه **الإغلاقة (closure)**، والآلية نفسها التي تُبقي `count` حيًا في تطبيق العدّاد لديك. المصانع تحوّل الإعدادات إلى دوال: `makeGreeter('مرحبًا')` تُرجع مُحييًا بالعربية، و `makeGreeter('Hello')` بالإنجليزية — منطق واحد وسلوكيات كثيرة.\n\nستقابل هذا الشكل في كل مكان: خطافات React وسلاسل الـ middleware ومنشئات الاختبارات — بل ومساعد `E(en, ar)` في هذه المنصة نفسه مصنع صغير يُرجع قيمة ثنائية اللغة."),
        task: E("Write `makeValidator(min, max)` — a factory that returns a function taking a number and returning `true` if it's within [min, max] inclusive. `const ok = makeValidator(1, 10); ok(5)` → true; `ok(20)` → false.", "اكتب `makeValidator(min, max)` — مصنعًا يُرجع دالة تأخذ رقمًا وتُرجع `true` إذا كان ضمن المجال [min, max] شاملًا. `const ok = makeValidator(1, 10); ok(5)` ← true؛ و `ok(20)` ← false."),
        starter: "function makeValidator(min, max) {\n  // return a function: n => ...\n}\n\nconst ok = makeValidator(1, 10);\nconsole.log(ok(5));  // true\nconsole.log(ok(20)); // false",
        tests: [
          { label: E("ok(5) is true inside [1, 10]", "ok(5) تساوي true داخل [1, 10]"), fn: (s) => s.makeValidator && s.makeValidator(1, 10)(5) === true },
          { label: E("ok(20) is false outside", "ok(20) تساوي false خارجه"), fn: (s) => s.makeValidator && s.makeValidator(1, 10)(20) === false },
          { label: E("Boundary 1 and 10 are true", "الحدّان 1 و 10 يساويان true"), fn: (s) => s.makeValidator && s.makeValidator(1, 10)(1) === true && s.makeValidator(1, 10)(10) === true },
          { label: E("A different range behaves independently", "مجال آخر يتصرف باستقلالية"), fn: (s) => s.makeValidator && s.makeValidator(100, 200)(150) === true && s.makeValidator(100, 200)(20) === false }
        ],
        hints: [
          E("The body is one comparison: `n >= min && n <= max` — wrapped in a returned arrow function.", "الجسم مقارنة واحدة: `n >= min && n <= max` — داخل دالة سهمية مُرجعة."),
          E("`return n => n >= min && n <= max;`", "`return n => n >= min && n <= max;`")
        ],
        solution: "function makeValidator(min, max) {\n  return n => n >= min && n <= max;\n}\n\nconst ok = makeValidator(1, 10);\nconsole.log(ok(5));  // true\nconsole.log(ok(20)); // false"
      }
    ]
  },
  {
    id: "e3p", emoji: "🎓",
    title: E("PROJECT: Functional toolbox", "مشروع: صندوق أدوات دالي"),
    desc: E("Capstone of this expansion: build a tiny data-processing library the way real libraries do — one clean function composed from the unit's ideas.", "خاتمة هذه التوسعة: ابنِ مكتبة صغيرة لمعالجة البيانات كما تُبنى المكتبات الحقيقية — دالة نظيفة واحدة مؤلفة من أفكار الوحدة."),
    steps: [
      {
        id: "s-hof-proj", kind: "js", xp: 100, project: true, skill: "Higher-order",
        title: E("PROJECT: build processData", "مشروع: ابنِ processData"),
        brief: E(
          "Your capstone for this expansion: a **mini processing library** — the shape behind lodash, RxJS, and every data-pipeline tool.\n\nYou'll implement `processData(items, opts)`: one function that composes this unit's ideas — filter, reduce, and an options contract — behind a clean interface:\n\n```javascript\nprocessData(\n  [{ name: 'Sara', score: 90, active: true }],\n  { minScore: 50, onlyActive: true }\n);\n```\n\nDesign it like the TaskManager capstone: the tests are the contract, each option has one job, and everything flows through `reduce` at the end.",
          "خاتمة هذه التوسعة: **مكتبة معالجة مصغّرة** — الشكل الذي تقف خلفه lodash و RxJS وكل أدوات خطوط البيانات.\n\nستنفّذ `processData(items, opts)`: دالة واحدة تجمع أفكار الوحدة — filter و reduce وعقد الخيارات — خلف واجهة نظيفة:\n\n```javascript\nprocessData(\n  [{ name: 'Sara', score: 90, active: true }],\n  { minScore: 50, onlyActive: true }\n);\n```\n\nصممها كما صممت خاتمة TaskManager: الاختبارات هي العقد، وكل خيار له مهمة واحدة، وكل شيء يتدفق عبر `reduce` في النهاية."),
        task: E("Implement `processData(items, opts)` returning a **single number**:\n- keep items with `item.score >= opts.minScore` (when `opts.minScore` is given)\n- keep only active items if `opts.onlyActive` is true\n- sum the `score` of what remains (0 for an empty result)\nExample: `processData([{name:'Sara',score:90,active:true},{name:'Omar',score:80,active:false}], {minScore:50, onlyActive:true})` → 90.", "نفّذ `processData(items, opts)` مُرجعةً **رقمًا واحدًا**:\n- أبقِ العناصر التي `item.score >= opts.minScore` (عند وجود `opts.minScore`)\n- أبقِ العناصر النشطة فقط إذا كان `opts.onlyActive` صحيحًا\n- اجمع `score` للباقي (0 إن لم يبقَ شيء)\nمثال: `processData([{name:'Sara',score:90,active:true},{name:'Omar',score:80,active:false}], {minScore:50, onlyActive:true})` ← 90."),
        starter: "function processData(items, opts) {\n  opts = opts || {};\n  // filter by minScore → filter by onlyActive → reduce to sum\n}\n\nconst data = [\n  { name: 'Sara', score: 90, active: true },\n  { name: 'Omar', score: 80, active: false },\n  { name: 'Lina', score: 70, active: true }\n];\nconsole.log(processData(data, { minScore: 50, onlyActive: true })); // 160",
        tests: [
          { label: E("Filters by minScore and sums", "يرشّح حسب minScore ويجمع"), fn: (s) => s.processData && s.processData([{ name: 'Sara', score: 90, active: true }, { name: 'Lina', score: 70, active: true }], { minScore: 80 }) === 90 },
          { label: E("onlyActive excludes inactive items", "onlyActive يستبعد غير النشطين"), fn: (s) => { if (!s.processData) return false; const r = s.processData([{ name: 'Sara', score: 90, active: true }, { name: 'Omar', score: 80, active: false }], { onlyActive: true }); return r === 90; } },
          { label: E("Both options combine", "الخياران يتعاونان"), fn: (s) => s.processData && s.processData([{ name: 'Sara', score: 90, active: true }, { name: 'Omar', score: 80, active: false }, { name: 'Lina', score: 70, active: true }], { minScore: 50, onlyActive: true }) === 160 },
          { label: E("No options → sum everything", "بلا خيارات ← اجمع كل شيء"), fn: (s) => s.processData && s.processData([{ score: 10 }, { score: 20 }], {}) === 30 },
          { label: E("Empty or all-filtered → 0", "فارغة أو مُرشَّحة كلها ← 0"), fn: (s) => s.processData && s.processData([], { minScore: 5 }) === 0 && s.processData([{ score: 10 }], { minScore: 50 }) === 0 }
        ],
        hints: [
          E("Chain guards then sum: `items.filter(i => !opts.minScore || i.score >= opts.minScore).filter(i => !opts.onlyActive || i.active).reduce((a, i) => a + i.score, 0)`.", "سلسِل الرشّحات ثم اجمع: `items.filter(i => !opts.minScore || i.score >= opts.minScore).filter(i => !opts.onlyActive || i.active).reduce((a, i) => a + i.score, 0)`."),
          E("Write it as two filter guards and one `reduce` — no loops needed anywhere.", "اكتبها برشّحتين و `reduce` واحدة — بلا أي حلقة.")
        ],
        solution: "function processData(items, opts) {\n  opts = opts || {};\n  return items\n    .filter(i => opts.minScore === undefined || i.score >= opts.minScore)\n    .filter(i => !opts.onlyActive || i.active)\n    .reduce((acc, i) => acc + i.score, 0);\n}\n\nconst data = [\n  { name: 'Sara', score: 90, active: true },\n  { name: 'Omar', score: 80, active: false },\n  { name: 'Lina', score: 70, active: true }\n];\nconsole.log(processData(data, { minScore: 50, onlyActive: true })); // 160"
      }
    ]
  },
  {
    id: "e3c", emoji: "⚙️",
    title: E("Meet C — close to the metal", "تعرّف على لغة C — قريبًا من العتاد"),
    desc: E("The language your operating system is written in. Same logic you already know — but now you control the memory.", "اللغة التي كُتب بها نظام التشغيل لديك. نفس المنطق الذي تعرفه — لكن الآن أنت تتحكم في الذاكرة."),
    steps: [
      {
        id: "s-c-first", kind: "c", xp: 20, skill: "C",
        title: E("Your first C program", "أول برنامج C لك"),
        brief: E(
          "**C** is compiled straight to machine code — nothing stands between you and the CPU.\n\n```c\n#include <stdio.h>\n\nint square(int x) {\n  return x * x;\n}\n\nint main() {\n  printf(\"%d\\n\", square(5));\n  return 0;\n}\n```\n\nYou already know this logic from JavaScript! Differences: every variable and function declares its **type** (`int` = whole number), statements end with `;`, and `printf` prints ( `%d` is a placeholder for a number). Press Run — the output appears in the console.",
          "**C** تُترجم مباشرة إلى لغة الآلة — لا شيء يقف بينك وبين المعالج.\n\n```c\n#include <stdio.h>\n\nint square(int x) {\n  return x * x;\n}\n\nint main() {\n  printf(\"%d\\n\", square(5));\n  return 0;\n}\n```\n\nأنت تعرف هذا المنطق من جافاسكريبت! الفرق: كل متغير ودالة يعلن **نوعه** (`int` = رقم صحيح)، والجمل تنتهي بـ `;`، و `printf` تطبع (`%d` موضع يُستبدل برقم). اضغط تشغيل — الناتج يظهر في وحدة التحكم."),
        task: E("Write `square(int x)` that returns x squared. The `main` below already prints your result.", "اكتب `square(int x)` التي تُرجع x مربعًا. الدالة `main` أدناه تطبع نتيجتك بالفعل."),
        starter: "#include <stdio.h>\n\nint square(int x) {\n  // return x * x\n}\n\nint main() {\n  printf(\"square(5) = %d\\n\", square(5));\n  return 0;\n}",
        tests: [
          { label: E("square(5) is 25", "square(5) تساوي 25"), fn: (s) => s.square && s.square(5) === 25 },
          { label: E("square(7) is 49", "square(7) تساوي 49"), fn: (s) => s.square && s.square(7) === 49 },
          { label: E("square(0) is 0", "square(0) تساوي 0"), fn: (s) => s.square && s.square(0) === 0 }
        ],
        hints: [
          E("C functions declare the return type first: `int square(int x) { ... }`", "دوال C تعلن نوع الإرجاع أولًا: `int square(int x) { ... }`"),
          E("The body is identical to JavaScript: `return x * x;`", "الجسم مطابق لجافاسكريبت: `return x * x;`")
        ],
        solution: "#include <stdio.h>\n\nint square(int x) {\n  return x * x;\n}\n\nint main() {\n  printf(\"square(5) = %d\\n\", square(5));\n  return 0;\n}"
      },
      {
        id: "s-c-types", kind: "c", xp: 20, skill: "C",
        title: E("Types & real numbers", "الأنواع والأعداد الحقيقية"),
        brief: E(
          "In C, the type decides the math:\n\n```c\nint a = 7 / 2;        // 3   — int division DROPS the remainder!\ndouble d = 7 / 2.0;   // 3.5 — one real operand makes it real\n```\n\n`int` stores whole numbers, `double` stores decimals. This is a famous C trap: `1/2` is `0`! Write `2.0` (or cast with `(double) x`) when you want the decimal part.",
          "في لغة C، النوع يحدد طريقة الحساب:\n\n```c\nint a = 7 / 2;        // 3   — قسمة الأعداد الصحيحة تُسقط الباقي!\ndouble d = 7 / 2.0;   // 3.5 — عامل حقيقي واحد يجعل النتيجة حقيقية\n```\n\n`int` يخزن الأعداد الصحيحة و `double` يخزن العشرية. هذا أشهر فخ في C: `1/2` تساوي `0`! اكتب `2.0` (أو حوّل بـ `(double) x`) عندما تريد الجزء العشري."),
        task: E("Write `celsiusToF(int c)` returning the Fahrenheit value as a double: `c * 9.0 / 5.0 + 32`. Note the `.0` — it matters!", "اكتب `celsiusToF(int c)` تُرجع قيمة فهرنهايت كـ double: `c * 9.0 / 5.0 + 32`. لاحظ الـ `.0` — إنها مهمة!"),
        starter: "#include <stdio.h>\n\ndouble celsiusToF(int c) {\n  // c * 9.0 / 5.0 + 32\n}\n\nint main() {\n  printf(\"100C = %.1fF\\n\", celsiusToF(100));\n  return 0;\n}",
        tests: [
          { label: E("celsiusToF(100) is 212", "celsiusToF(100) تساوي 212"), fn: (s) => s.celsiusToF && s.celsiusToF(100) === 212 },
          { label: E("celsiusToF(0) is 32", "celsiusToF(0) تساوي 32"), fn: (s) => s.celsiusToF && s.celsiusToF(0) === 32 },
          { label: E("celsiusToF(37) is 98.6 (needs 9.0, not 9)", "celsiusToF(37) تساوي 98.6 (تحتاج 9.0 لا 9)"), fn: (s) => s.celsiusToF && Math.abs(s.celsiusToF(37) - 98.6) < 0.001 }
        ],
        hints: [
          E("`9.0 / 5.0` is real division = 1.8. But `9 / 5` is 1 — the decimal part vanishes.", "`9.0 / 5.0` قسمة حقيقية = 1.8. لكن `9 / 5` تساوي 1 — الجزء العشري يتلاشى."),
          E("Return type is `double`, so the function can return decimals.", "نوع الإرجاع `double`، فالدالة تستطيع إرجاع أعداد عشرية.")
        ],
        solution: "#include <stdio.h>\n\ndouble celsiusToF(int c) {\n  return c * 9.0 / 5.0 + 32;\n}\n\nint main() {\n  printf(\"100C = %.1fF\\n\", celsiusToF(100));\n  return 0;\n}"
      },
      {
        id: "s-c-mental", kind: "concept", xp: 10, skill: "C",
        title: E("Why C feels different", "لماذا تختلف لغة C"),
        concept: E(
          "JavaScript hides the machine from you. **C puts you in charge of it.**\n\n- **Compiled, not interpreted**: your code becomes native machine code before it runs — that's why operating systems, databases and game engines are written in C/C++.\n- **Manual memory**: JS creates and discards values for you. In C you ask for memory (`malloc`) and give it back (`free`). Power and responsibility.\n- **Types are strict**: `int`, `double`, `char`, `bool` — each with a fixed size in bytes.\n- **Zero safety net**: no `NaN` excuses — accessing memory you shouldn't crashes the program.\n\nWhy learn it? Because after C, every other language feels like it's holding your hand — and you finally understand what `x += 1` *really* does to the hardware.",
          "جافاسكريبت تُخفي عنك الآلة. **C تضعك مسؤولًا عنها.**\n\n- **مُترجمة لا مُفسَّرة**: كودك يصبح لغة آلة أصلية قبل التشغيل — لذلك أنظمة التشغيل وقواعد البيانات ومحركات الألعاب مكتوبة بـ C/C++.\n- **ذاكرة يدوية**: جافاسكريبت تنشئ القيم وتتخلص منها عنك. في C أنت تطلب الذاكرة (`malloc`) وتعيدها (`free`). قوة ومسؤولية.\n- **أنواع صارمة**: `int` و `double` و `char` و `bool` — لكل منها حجم ثابت بالبايتات.\n- **بلا شبكة أمان**: لا أعذار `NaN` — الوصول لذاكرة لا تملكها يُسقط البرنامج.\n\nلماذا تتعلمها؟ لأنك بعد C ستبدو كل اللغات الأخرى كأنها تمسك بيدك — وأخيرًا ستفهم ماذا يفعل `x += 1` *فعليًا* في العتاد."),
        quiz: { q: E("Why are operating systems written in C?", "لماذا تُكتب أنظمة التشغيل بلغة C؟"), options: E(["It compiles to fast native machine code and gives direct hardware control", "It is the easiest language to read", "It has no types so it runs faster", "It runs in the browser"], ["لأنها تُترجم إلى لغة آلة أصلية سريعة وتمنح تحكمًا مباشرًا في العتاد", "لأنها أسهل لغة في القراءة", "لأنها بلا أنواع فتشتغ أسرع", "لأنها تعمل في المتصفح"]), answer: 0 }
      },
      {
        id: "s-c-loop", kind: "c", xp: 25, skill: "C",
        title: E("Loops in C — same idea, stricter rules", "الحلقات في C — نفس الفكرة بقواعد أشد"),
        brief: E(
          "The C `for` loop is the ancestor of the JavaScript one — identical shape:\n\n```c\nint factorial(int n) {\n  int result = 1;\n  for (int i = 2; i <= n; i++) {\n    result = result * i;\n  }\n  return result;\n}\n```\n\nDeclarations must name a type (`int i = 2`), and the loop variable only exists inside the loop.",
          "حلقة `for` في C هي جدة حلقة جافاسكريبت — نفس الشكل تمامًا:\n\n```c\nint factorial(int n) {\n  int result = 1;\n  for (int i = 2; i <= n; i++) {\n    result = result * i;\n  }\n  return result;\n}\n```\n\nالتصريحات يجب أن تُسمّي نوعها (`int i = 2`)، ومتغير الحلقة لا يوجد إلا داخلها."),
        task: E("Write `factorial(int n)` with a `for` loop. `factorial(5)` is 120, and `factorial(0)` must return 1.", "اكتب `factorial(int n)` بحلقة `for`. الـ `factorial(5)` يساوي 120، و `factorial(0)` يجب أن تُرجع 1."),
        starter: "#include <stdio.h>\n\nint factorial(int n) {\n  int result = 1;\n  // loop from 2 to n\n  return result;\n}\n\nint main() {\n  printf(\"5! = %d\\n\", factorial(5));\n  return 0;\n}",
        tests: [
          { label: E("factorial(5) is 120", "factorial(5) تساوي 120"), fn: (s) => s.factorial && s.factorial(5) === 120 },
          { label: E("factorial(0) is 1", "factorial(0) تساوي 1"), fn: (s) => s.factorial && s.factorial(0) === 1 },
          { label: E("factorial(10) is 3628800", "factorial(10) تساوي 3628800"), fn: (s) => s.factorial && s.factorial(10) === 3628800 }
        ],
        hints: [
          E("If the loop never runs (n = 0 or 1), `result` stays 1 — exactly what we want.", "إذا لم تعمل الحلقة (n = 0 أو 1) يبقى `result` = 1 — وهذا ما نريد بالضبط."),
          E("`for (int i = 2; i <= n; i++) { result = result * i; }`", "`for (int i = 2; i <= n; i++) { result = result * i; }`")
        ],
        solution: "#include <stdio.h>\n\nint factorial(int n) {\n  int result = 1;\n  for (int i = 2; i <= n; i++) {\n    result = result * i;\n  }\n  return result;\n}\n\nint main() {\n  printf(\"5! = %d\\n\", factorial(5));\n  return 0;\n}"
      },
      {
        id: "s-c-digits", kind: "c", xp: 25, skill: "C",
        title: E("int division is a tool", "قسمة int أداة لا خطأ"),
        brief: E(
          "That \"annoying\" int division is actually a superpower — chopping off digits:\n\n```c\nint countDigits(int n) {\n  int count = 0;\n  while (n > 0) {\n    n = n / 10;   // 8457 → 845 → 84 → 8 → 0\n    count++;\n  }\n  return count;\n}\n```\n\nEach `n / 10` throws away the last digit (8457 / 10 = 845, remainder 7 discarded). Count how many times until nothing's left = number of digits. Same trick extracts digits with `n % 10`.",
          "قسمة الأعداد الصحيحة التي بدت \"مزعجة\" هي قوة خارقة — تقطع الأرقام:\n\n```c\nint countDigits(int n) {\n  int count = 0;\n  while (n > 0) {\n    n = n / 10;   // 8457 ← 845 ← 84 ← 8 ← 0\n    count++;\n  }\n  return count;\n}\n```\n\nكل `n / 10` ترمي آخر رقم (8457 / 10 = 845 والباقي 7 يُهمل). عد المرات حتى لا يبقى شيء = عدد الأرقام. ونفس الحيلة تستخرج الأرقام بـ `n % 10`."),
        task: E("Write `countDigits(int n)` using a `while` loop and `n / 10`. What is it for n = 0? Return 1 — zero has one digit.", "اكتب `countDigits(int n)` بحلقة `while` و `n / 10`. ماذا تعيد لـ n = 0؟ أرجع 1 — الصفر له رقم واحد."),
        starter: "#include <stdio.h>\n\nint countDigits(int n) {\n  int count = 0;\n  // while n > 0, chop a digit\n  return count;\n}\n\nint main() {\n  printf(\"digits(8457) = %d\\n\", countDigits(8457));\n  return 0;\n}",
        tests: [
          { label: E("countDigits(8457) is 4", "countDigits(8457) تساوي 4"), fn: (s) => s.countDigits && s.countDigits(8457) === 4 },
          { label: E("countDigits(7) is 1", "countDigits(7) تساوي 1"), fn: (s) => s.countDigits && s.countDigits(7) === 1 },
          { label: E("countDigits(0) is 1 (zero has one digit)", "countDigits(0) تساوي 1 (الصفر له رقم واحد)"), fn: (s) => s.countDigits && s.countDigits(0) === 1 },
          { label: E("countDigits(1000000) is 7", "countDigits(1000000) تساوي 7"), fn: (s) => s.countDigits && s.countDigits(1000000) === 7 }
        ],
        hints: [
          E("Handle 0 first: `if (n == 0) return 1;` then run the loop.", "عالج الصفر أولًا: `if (n == 0) return 1;` ثم شغّل الحلقة."),
          E("The loop: `while (n > 0) { n = n / 10; count++; }`", "الحلقة: `while (n > 0) { n = n / 10; count++; }`")
        ],
        solution: "#include <stdio.h>\n\nint countDigits(int n) {\n  if (n == 0) return 1;\n  int count = 0;\n  while (n > 0) {\n    n = n / 10;\n    count++;\n  }\n  return count;\n}\n\nint main() {\n  printf(\"digits(8457) = %d\\n\", countDigits(8457));\n  return 0;\n}"
      }
    ]
  },
  {
    id: "e4", emoji: "🧪",
    title: E("Engineering Craft", "حِرفة الهندسة"),
    desc: E("The tools and habits that separate scripts from software: Git, debugging, and clean design.", "الأدوات والعادات التي تفصل السكربتات عن البرمجيات: Git وتصحيح الأخطاء والتصميم النظيف."),
    steps: [
      {
        id: "s-se-git", kind: "concept", xp: 10, skill: "Git",
        title: E("Git & version control", "الـ Git وإدارة الإصدارات"),
        concept: E(
          "**Git** is a time machine for code. Every **commit** is a named snapshot you can return to, compare, or branch from.\n\n```bash\ngit init            # start tracking a project\ngit add .           # stage changes\ngit commit -m \"Add login form\"\ngit push            # upload commits to GitHub\ngit checkout -b fix-typo   # create a branch\n```\n\nWhy engineers can't live without it:\n- **History** — what changed, when, by whom, and why (the commit message).\n- **Branches** — experiment in a parallel universe; merge when it works.\n- **Collaboration** — thousands of people editing the same codebase without stepping on each other.\n- **Safety** — broken code? Roll back in seconds.\n\nGitHub adds the sharing layer on top. Professional rule: small commits, honest messages, branch per feature.",
          "**الـ Git** آلة زمنية للكود. كل **commit** لقطة مسماة يمكنك العودة إليها أو مقارنتها أو التفرع منها.\n\n```bash\ngit init            # ابدأ تتبع المشروع\ngit add .           # جهّز التغييرات\ngit commit -m \"أضف نموذج الدخول\"\ngit push            # ارفع الالتزامات إلى GitHub\ngit checkout -b fix-typo   # أنشئ فرعًا\n```\n\nلماذا لا يستطيع المهندسون الاستغناء عنه:\n- **التاريخ** — ماذا تغيّر، متى، من، ولماذا (رسالة الالتزام).\n- **الفروع** — جرّب في كون موازٍ؛ وادمج عند النجاح.\n- **التعاون** — آلاف الأشخاص يعدلون نفس الكود دون أن يتعارضوا.\n- **الأمان** — كود معطوب؟ ارجع للخلف في ثوانٍ.\n\nيضيف GitHub طبقة المشاركة فوق ذلك. القاعدة الاحترافية: التزامات صغيرة، رسائل صادقة، فرع لكل ميزة."),
        quiz: { q: E("What does a Git commit contain?", "ماذا يحتوي الـ commit في Git؟"), options: E(["A named snapshot of changes you can return to", "Only the newest file", "A complete copy of your computer"], ["لقطة مسماة من التغييرات يمكنك العودة إليها", "أحدث ملف فقط", "نسخة كاملة من حاسوبك"]), answer: 0 }
      },
      {
        id: "s-se-debug", kind: "js", xp: 30, skill: "Debugging",
        title: E("Debugging: fix the broken code", "تصحيح الأخطاء: أصلح الكود المعطوب"),
        brief: E(
          "Real engineering = finding needles in haystacks. This function **looks** correct but has a bug:\n\n```javascript\nfunction sumArray(arr) {\n  let total = 0;\n  for (let i = 1; i < arr.length; i++) {  // 👀 suspect everything\n    total += arr[i];\n  }\n  return total;\n}\n```\n\nDebugging ritual: **reproduce → read carefully → form a hypothesis → test it → fix → verify.** `console.log` is your flashlight: print the values at each step and find where expectation meets reality.",
          "الهندسة الحقيقية = إيجاد إبر في أكوام قش. هذه الدالة **تبدو** صحيحة لكن بها خطأ:\n\n```javascript\nfunction sumArray(arr) {\n  let total = 0;\n  for (let i = 1; i < arr.length; i++) {  // 👀 اشتبه بكل شيء\n    total += arr[i];\n  }\n  return total;\n}\n```\n\nطقوس التصحيح: **أعد الإنتاج ← اقرأ بعناية ← كوّن فرضية ← اختبرها ← أصلح ← تحقق.** `console.log` هو مصباحك: اطبع القيم في كل خطوة واعثر على المكان الذي يلتقي فيه التوقع بالواقع."),
        task: E("`sumArray` is buggy: `sumArray([5, 2, 3])` should be `10` but returns `5`. Fix it (the starter contains the buggy version).", "‏`sumArray` فيها خطأ: `sumArray([5, 2, 3])` يجب أن تساوي `10` لكنها ترجع `5`. أصلحها (البداية تحتوي النسخة المعطوبة)."),
        starter: "// Buggy version — find the bug and fix it.\n// Expected: sumArray([5, 2, 3]) === 10\nfunction sumArray(arr) {\n  let total = 0;\n  for (let i = 1; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}",
        tests: [
          { label: E("sumArray([5,2,3]) is 10", "sumArray([5,2,3]) تساوي 10"), fn: (s) => s.sumArray && s.sumArray([5,2,3]) === 10 },
          { label: E("sumArray([4]) is 4 (single item)", "sumArray([4]) تساوي 4 (عنصر واحد)"), fn: (s) => s.sumArray && s.sumArray([4]) === 4 },
          { label: E("sumArray([]) is 0", "sumArray([]) تساوي 0"), fn: (s) => s.sumArray && s.sumArray([]) === 0 }
        ],
        hints: [
          E("Trace by hand: which values does the loop actually add for [5,2,3]?", "تتبع يدويًا: ما القيم التي تضيفها الحلقة فعلًا لـ [5,2,3]؟"),
          E("Arrays start at index 0. The loop starts at `i = 1` — which element never gets counted?", "المصفوفات تبدأ من الفهرس 0. الحلقة تبدأ من `i = 1` — أي عنصر لا يُحتسب أبدًا؟")
        ],
        solution: "function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}"
      },
      {
        id: "s-se-design", kind: "concept", xp: 10, skill: "Architecture",
        title: E("Clean code & design", "الكود النظيف والتصميم"),
        concept: E(
          "Code is read far more often than written — by teammates, and by *you in three months*. Clean code is an engineering superpower:\n\n- **Names that tell the truth**: `daysUntilDeadline`, not `d` or `x2`.\n- **Small functions**: one function, one job. If you need \"and\" to describe it, split it.\n- **DRY** — Don't Repeat Yourself: copy-pasted logic becomes two places to fix one bug.\n- **Separation of concerns**: data handling, business rules, and UI each live in their own layer.\n- **Test-minded design**: code that's easy to call from a test is usually well-designed code.\n\n```javascript\n// ❌ what does this even do?\nfunction p(u, a) { return u.filter(x => x[1] > a).map(x => x[0]); }\n\n// ✅ self-explanatory\nfunction usernamesOlderThan(users, minAge) {\n  return users\n    .filter(user => user.age > minAge)\n    .map(user => user.name);\n}\n```",
          "يُقرأ الكود أضعاف ما يُكتب — بواسطة الزملاء، وبواسطة *أنت بعد ثلاثة أشهر*. الكود النظيف قوة خارقة هندسية:\n\n- **أسماء تقول الحقيقة**: `daysUntilDeadline` لا `d` ولا `x2`.\n- **دوال صغيرة**: دالة واحدة، مهمة واحدة. إذا احتجت \"و\" لوصفها فقسّمها.\n- **DRY** — لا تكرر نفسك: المنطق المنسوخ يصبح مكانين لإصلاح خطأ واحد.\n- **فصل الاهتمامات**: معالجة البيانات وقواعد العمل والواجهة، كلٌّ في طبقته.\n- **تصميم صديق للاختبار**: الكود السهل استدعاؤه من اختبار هو عادة كود مصمم جيدًا.\n\n```javascript\n// ❌ ماذا تفعل هذه الدالة أصلًا؟\nfunction p(u, a) { return u.filter(x => x[1] > a).map(x => x[0]); }\n\n// ✅ تشرح نفسها\nfunction usernamesOlderThan(users, minAge) {\n  return users\n    .filter(user => user.age > minAge)\n    .map(user => user.name);\n}\n```"),
        quiz: { q: E("Which function name follows clean-code principles?", "أي اسم دالة يتبع مبادئ الكود النظيف؟"), options: E(["daysUntilDeadline", "dud", "process(x)"], ["daysUntilDeadline", "dud", "process(x)"]), answer: 0 }
      }
    ]
  },
  {
    id: "e5", emoji: "🏗️",
    title: E("Capstone: Build an App", "المشروع الختامي: ابنِ تطبيقًا"),
    desc: E("Put every skill together into a small but complete application engine.", "اجمع كل مهاراتك في محرك تطبيق صغير لكن مكتمل."),
    steps: [
      {
        id: "p-se-4", kind: "js", xp: 100, project: true, skill: "Architecture",
        title: E("PROJECT: Task manager engine", "مشروع: محرك مدير المهام"),
        brief: E(
          "Your capstone: the **core engine of a task manager** — the same data layer a real app would build its UI on. This is object-oriented design in action: state lives inside a class, the outside world talks to it through clean methods.\n\nDesign it like an engineer: every method has one job, and the tests define the contract.",
          "مشروعك الختامي: **محرك مدير المهام** — نفس طبقة البيانات التي ستبني عليها التطبيقات الحقيقية واجهاتها. هذا تصميم كائني التوجه في وضع العملي: الحالة تعيش داخل صنف، والعالم الخارجي يتحدث معه عبر دوال نظيفة.\n\nصممه كمهندس: كل دالة لها مهمة واحدة، والاختبارات تحدد العقد."),
        task: E("Implement class `TaskManager`:\n- `add(title)` → stores a task, returns its id (1, 2, 3…)\n- `complete(id)` → marks it done\n- `pending()` → array of *unfinished* task titles\n- `all()` → array of all task titles", "نفّذ صنف `TaskManager`:\n- `add(title)` ← يخزن مهمة ويرجع معرفها (1، 2، 3…)\n- `complete(id)` ← يعلّمها منجزة\n- `pending()` ← مصفوفة عناوين المهام *غير المنجزة*\n- `all()` ← مصفوفة كل العناوين"),
        starter: "class TaskManager {\n  constructor() {\n    this.tasks = [];\n    this.nextId = 1;\n  }\n  // add, complete, pending, all\n}",
        tests: [
          { label: E("add returns increasing ids (1, 2…)", "add تُرجع معرفات متزايدة (1، 2…)"), fn: (s) => { if (!s.TaskManager) return false; const m = new s.TaskManager(); return m.add("a") === 1 && m.add("b") === 2; } },
          { label: E("complete removes from pending", "complete تُخرج المهمة من pending"), fn: (s) => { const m = new s.TaskManager(); const id = m.add("write tests"); m.complete(id); return JSON.stringify(m.pending()) === "[]"; } },
          { label: E("all() keeps completed tasks", "all() تحتفظ بالمهام المنجزة"), fn: (s) => { const m = new s.TaskManager(); const id = m.add("x"); m.complete(id); m.add("y"); return m.all().length === 2; } },
          { label: E("pending lists unfinished titles", "pending تعرض العناوين غير المنجزة"), fn: (s) => { const m = new s.TaskManager(); const id = m.add("done thing"); m.complete(id); m.add("open thing"); return JSON.stringify(m.pending()) === JSON.stringify(["open thing"]); } }
        ],
        hints: [
          E("Store tasks as objects: `{ id, title, done }` — then pending filters `!t.done`.", "خزّن المهام ككائنات: `{ id, title, done }` — ثم pending تُرشّح `!t.done`."),
          E("`add(title) { const id = this.nextId++; this.tasks.push({ id, title, done: false }); return id; }`", "`add(title) { const id = this.nextId++; this.tasks.push({ id, title, done: false }); return id; }`")
        ],
        solution: "class TaskManager {\n  constructor() { this.tasks = []; this.nextId = 1; }\n  add(title) {\n    const id = this.nextId++;\n    this.tasks.push({ id, title, done: false });\n    return id;\n  }\n  complete(id) {\n    const task = this.tasks.find(t => t.id === id);\n    if (task) task.done = true;\n  }\n  pending() { return this.tasks.filter(t => !t.done).map(t => t.title); }\n  all() { return this.tasks.map(t => t.title); }\n}"
      }
    ]
  },
  {
    id: "e6", emoji: "🔬",
    title: E("Testing: prove your code works", "الاختبارات: أثبت أن كودك يعمل"),
    desc: E("Guessing is not verification. Build the machinery behind every check you've ever passed here — assertions, suites, and the red-green rhythm that catches bugs before users do.", "التخمين ليس تحققًا. ابنِ الآلية خلف كل تحقق مررت به هنا — تأكيدات، حزم اختبار، وإيقاع أحمر-أخضر يلتقط الأخطاء قبل المستخدمين."),
    steps: [
      {
        id: "s-test-concept", kind: "concept", xp: 10, skill: "Testing",
        title: E("Tests: promises, written down", "الاختبارات: وعود تُكتب نصًا"),
        concept: E(
          "A **test** is a tiny program that checks one behavior:\n\n```javascript\ntest('sum of an empty list is 0', function () {\n  assert(sum([]) === 0);   // ← the assertion: a promise, stated\n});\n```\n\nOne behavior, one name that reads like a spec, one pass/fail. Repeat, and you have a **suite** — the safety net professionals live inside. The cycle is called **TDD**:\n\n1. 🔴 **Red** — write a failing test (the feature doesn't exist yet).\n2. 🟢 **Green** — write the *minimum* code that makes it pass.\n3. 🔵 **Refactor** — clean up while the tests keep guarding you.\n\nWhy it matters: the suite turns *\"I think it works\"* into *\"I know it works — here's the proof, runnable in one click.\"* Every check you've passed on this platform is exactly this pattern. In this unit you build the machinery itself.",
          "**الاختبار** برنامج صغير يتحقق من سلوك واحد:\n\n```javascript\ntest('مجموع القائمة الفارغة هو 0', function () {\n  assert(sum([]) === 0);   // ← التأكيد: وعد مكتوب\n});\n```\n\nسلوك واحد، اسم يُقرأ كمواصفة، نجاح أو فشل. كرر ذلك وحصلت على **حزمة** — شبكة الأمان التي يعمل داخلها المحترفون. والدورة اسمها **TDD**:\n\n1. 🔴 **أحمر** — اكتب اختبارًا فاشلًا (الميزة غير موجودة بعد).\n2. 🟢 **أخضر** — اكتب *الحد الأدنى* من الكود الذي يجعله ينجح.\n3. 🔵 **إعادة صياغة** — نظّف الكود والاختبارات تحرسك.\n\nلماذا يهم: الحزمة تحوّل *\"أظن أنه يعمل\"* إلى *\"أعلم أنه يعمل — والدليل هنا، يُنفَّذ بنقرة\"*. كل تحقق مررت به على هذه المنصة هو نفس النمط. وفي هذه الوحدة تبني الآلية نفسها."),
        quiz: { q: E("What is the TDD cycle, in order?", "ما دورة TDD بالترتيب؟"), options: E(["Red (failing test) → Green (make it pass) → Refactor", "Write everything → deploy → hope", "Refactor → Red → Green"], ["الأحمر (اختبار فاشل) ← الأخضر (اجعله ينجح) ← إعادة الصياغة", "اكتب كل شيء ← انشر ← تمنَّّ", "إعادة الصياغة ← الأحمر ← الأخضر"]), answer: 0 }
      },
      {
        id: "s-test-assert", kind: "js", xp: 25, skill: "Testing",
        title: E("The assertion: where tests begin", "التأكيد: من تبدأ الاختبارات"),
        brief: E(
          "Under every test framework sits **one** function:\n\n```javascript\nfunction assertEqual(actual, expected) {\n  if (actual !== expected) {\n    throw new Error('Expected ' + expected + ' but got ' + actual);\n  }\n  return true;\n}\n```\n\n`throw` stops execution instantly — that's how a test *fails*. Wrapped in try/catch, the same function becomes a pass/fail detector. Jest, Mocha and Chai are this function, called thousands of times.\n\nNote the `!==` (strict): `'5'` is not `5`, and silently accepting that is how real bugs ship.",
          "تحت كل إطار اختبارات توجد **دالة** واحدة:\n\n```javascript\nfunction assertEqual(actual, expected) {\n  if (actual !== expected) {\n    throw new Error('Expected ' + expected + ' but got ' + actual);\n  }\n  return true;\n}\n```\n\n`throw` يوقف التنفيذ فورًا — هكذا *يفشل* الاختبار. وحين تلفّها try/catch تصبح نفس الدالة كاشف نجاح/فشل. ‏Jest وMocha وChai هي هذه الدالة تُستدعى آلاف المرات.\n\nانتبه لـ `!==` (الصارم): ‏`'5'` ليست `5`، وقبول ذلك بصمت هو الطريق الذي تخرج به الأخطاء الحقيقية إلى الإنتاج."),
        task: E("Write `assertEqual(actual, expected)`: returns **true** when `actual === expected`, otherwise **throws** an `Error` whose message contains `Expected` and the expected value.", "اكتب `assertEqual(actual, expected)`: تُرجع **true** عندما `actual === expected`، وإلا **ترمي** `Error` رسالتها تحتوي `Expected` والقيمة المتوقعة."),
        starter: "function assertEqual(actual, expected) {\n  // compare with !==, throw an Error when they differ\n}\n\n// must NOT throw:\nassertEqual(2 + 2, 4);\n\n// must throw:\n// assertEqual(5, 10);",
        tests: [
          { label: E("assertEqual(2, 2) returns true", "assertEqual(2, 2) تُرجع true"), fn: (s) => s.assertEqual && s.assertEqual(2, 2) === true },
          { label: E("Different values throw", "القيم المختلفة ترمي خطأ"), fn: (s) => { if (!s.assertEqual) return false; try { s.assertEqual(5, 10); return false; } catch (e) { return true; } } },
          { label: E("The message shows the expected value", "الرسالة تعرض القيمة المتوقعة"), fn: (s) => { if (!s.assertEqual) return false; try { s.assertEqual(5, 10); return false; } catch (e) { return String((e && e.message) || e).indexOf('10') !== -1; } } },
          { label: E("Strict equality: '5' does not equal 5", "يساوي صارم: '5' لا تساوي 5"), fn: (s) => { if (!s.assertEqual) return false; try { s.assertEqual('5', 5); return false; } catch (e) { return true; } } }
        ],
        hints: [
          E("`if (actual !== expected) throw new Error('Expected ' + expected + ' but got ' + actual);`", "`if (actual !== expected) throw new Error('Expected ' + expected + ' but got ' + actual);`"),
          E("After the if, `return true;` — that's the passing path.", "بعد الـ if ضع `return true;` — هذه هي مسار النجاح.")
        ],
        solution: "function assertEqual(actual, expected) {\n  if (actual !== expected) {\n    throw new Error('Expected ' + expected + ' but got ' + actual);\n  }\n  return true;\n}"
      },
      {
        id: "s-test-suite", kind: "js", xp: 30, skill: "Testing",
        title: E("Suites: one red test never hides the rest", "الحزم: اختبار أحمر لا يخفي البقية"),
        brief: E(
          "One test proves nothing. A **suite** runs many, reports each — and crucially, *keeps going* after a failure:\n\n```javascript\nfunction runSuite(tests) {\n  const results = [];\n  for (const t of tests) {\n    try {\n      t.fn();\n      results.push({ name: t.name, pass: true });\n    } catch (e) {\n      results.push({ name: t.name, pass: false });\n    }\n  }\n  return results;\n}\n```\n\nThe `try/catch` **around each test** is the trick: a crash inside one test is caught and recorded instead of killing the run. That's how this platform shows you every failing check at once — and it's exactly what you've been reading after each Run.",
          "اختبار واحد لا يثبت شيئًا. **الحزمة** تشغّل عدة اختبارات وتقرّ بكل منها — والأهم أنها *تستمر* بعد الفشل:\n\n```javascript\nfunction runSuite(tests) {\n  const results = [];\n  for (const t of tests) {\n    try {\n      t.fn();\n      results.push({ name: t.name, pass: true });\n    } catch (e) {\n      results.push({ name: t.name, pass: false });\n    }\n  }\n  return results;\n}\n```\n\nالـ `try/catch` **حول كل اختبار** هي الحيلة: تعطل اختبار واحد يُلتقط ويُسجَّل بدل أن يوقف التشغيل. هكذا تعرض لك هذه المنصة كل الفشل دفعة واحدة — ولهذا تقرأ النتائج بعد كل تشغيل."),
        task: E("Implement `runSuite(tests)` — for each `{ name, fn }` return `{ name, pass }`, where `pass` is true if `fn()` runs without throwing and false if it throws. Results must include **every** test, even after a failure.", "نفّذ `runSuite(tests)` — لكل `{ name, fn }` أعد `{ name, pass }`، حيث `pass` تساوي true إذا نفّذ `fn()` دون خطأ و false إذا رمت خطأ. يجب أن تشمل النتائج **كل** الاختبارات حتى بعد الفشل."),
        starter: "function runSuite(tests) {\n  // loop + try/catch each test, collect { name, pass }\n}\n\nconst suite = [\n  { name: '2 + 2 is 4', fn: function () { if (2 + 2 !== 4) throw new Error('math broke'); } },\n  { name: 'this one fails', fn: function () { throw new Error('boom'); } },\n  { name: 'empty sum is 0', fn: function () { if ([].reduce(function (a, b) { return a + b; }, 0) !== 0) throw new Error('bad'); } }\n];\n\nconsole.log(runSuite(suite));",
        tests: [
          { label: E("Returns one result per test", "تعيد نتيجة لكل اختبار"), fn: (s) => { if (!s.runSuite) return false; const out = s.runSuite([{ name: 'a', fn: function () {} }, { name: 'b', fn: function () {} }]); return out.length === 2; } },
          { label: E("A passing test reports pass: true", "الاختبار الناجح يعطي pass: true"), fn: (s) => { if (!s.runSuite) return false; const out = s.runSuite([{ name: 'ok', fn: function () { return 1; } }]); return out.length === 1 && out[0].pass === true && out[0].name === 'ok'; } },
          { label: E("A throwing test reports pass: false", "الاختبار المعطّل يعطي pass: false"), fn: (s) => { if (!s.runSuite) return false; const out = s.runSuite([{ name: 'bad', fn: function () { throw new Error('boom'); } }]); return out.length === 1 && out[0].pass === false; } },
          { label: E("One failure does not stop the suite", "عطل واحد لا يوقف الحزمة"), fn: (s) => { if (!s.runSuite) return false; const out = s.runSuite([{ name: 'x', fn: function () { throw new Error('x'); } }, { name: 'y', fn: function () {} }]); return out.length === 2 && out[0].pass === false && out[1].pass === true; } }
        ],
        hints: [
          E("Wrap each call: `try { t.fn(); results.push({ name: t.name, pass: true }); } catch (e) { results.push({ name: t.name, pass: false }); }`", "الف كل استدعاء: `try { t.fn(); results.push({ name: t.name, pass: true }); } catch (e) { results.push({ name: t.name, pass: false }); }`"),
          E("Start with `const results = [];` before the loop and `return results;` after it — the catch must not exit the loop.", "ابدأ بـ `const results = [];` قبل الحلقة و `return results;` بعدها — الـ catch يجب ألا يُنهي الحلقة.")
        ],
        solution: "function runSuite(tests) {\n  const results = [];\n  for (const t of tests) {\n    try {\n      t.fn();\n      results.push({ name: t.name, pass: true });\n    } catch (e) {\n      results.push({ name: t.name, pass: false });\n    }\n  }\n  return results;\n}"
      },
      {
        id: "p-se-test", kind: "js", xp: 90, project: true, skill: "Testing",
        title: E("PROJECT: build expect()", "مشروع: ابنِ expect()"),
        brief: E(
          "Your capstone: the `expect()` API from every modern testing tutorial — the shape behind Jest and Chai. You've *called* it a thousand times; now you're the one who implements it.\n\n```javascript\nexpect(5).toBe(5);              // passes\nexpect('hello').toContain('ell'); // passes\nexpect(5).toBe(6);              // throws\n```\n\nA method that **throws on failure and returns true on success** — that's the whole contract. Chain two of them behind one object and you have a framework.",
          "خاتمتك: واجهة `expect()` من كل دورة اختبارات حديثة — الشكل الذي قامت عليه Jest وChai. استدمنتها ألف مرة؛ والآن أنت من ينفذها.\n\n```javascript\nexpect(5).toBe(5);              // ينجح\nexpect('hello').toContain('ell'); // ينجح\nexpect(5).toBe(6);              // يرمي خطأ\n```\n\nدالة **ترمي عند الفشل وتعيد true عند النجاح** — هذا هو العقد كله. اربط اثنتين منهما خلف كائن واحد وحصلت على إطار عمل."),
        task: E("Implement `expect(value)` returning an object with two methods:\n- `toBe(x)` → throws if `value !== x`, otherwise returns true\n- `toContain(x)` → throws if the array or string `value` doesn't contain `x`, otherwise returns true", "نفّذ `expect(value)` تُرجع كائنًا فيه دالتان:\n- `toBe(x)` → ترمي إذا `value !== x`، وإلا تُرجع true\n- `toContain(x)` → ترمي إذا كانت المصفوفة أو النص `value` لا يحتوي `x`، وإلا تُرجع true"),
        starter: "function expect(value) {\n  // return { toBe, toContain }\n}\n\n// must NOT throw:\nconsole.log(expect(5).toBe(5));\nconsole.log(expect('hello').toContain('ell'));\n\n// must throw:\n// expect(5).toBe(6);\n// expect([1, 2]).toContain(9);",
        tests: [
          { label: E("expect(5).toBe(5) passes", "expect(5).toBe(5) ينجح"), fn: (s) => s.expect && s.expect(5).toBe(5) === true },
          { label: E("expect(5).toBe(6) throws", "expect(5).toBe(6) يرمي خطأ"), fn: (s) => { if (!s.expect) return false; try { s.expect(5).toBe(6); return false; } catch (e) { return true; } } },
          { label: E("toContain finds items in an array", "toContain تجد العناصر في المصفوفة"), fn: (s) => s.expect && s.expect([1, 2, 3]).toContain(2) === true },
          { label: E("toContain finds substrings in text", "toContain تجد النصوص الفرعية"), fn: (s) => s.expect && s.expect('hello').toContain('ell') === true },
          { label: E("toContain throws for a missing item", "toContain ترمي عند فقد العنصر"), fn: (s) => { if (!s.expect) return false; try { s.expect([1, 2]).toContain(9); return false; } catch (e) { return true; } } },
          { label: E("toContain throws for a missing substring", "toContain ترمي عند فقد النص"), fn: (s) => { if (!s.expect) return false; try { s.expect('hi').toContain('bye'); return false; } catch (e) { return true; } } }
        ],
        hints: [
          E("Return an object literal: `return { toBe: function (x) { ... }, toContain: function (x) { ... } };` — both methods close over `value`.", "أعد كائنًا: `return { toBe: function (x) { ... }, toContain: function (x) { ... } };` — الدالتان تلتقطان `value`."),
          E("`value.indexOf(x) === -1` means 'not found' — it works for both arrays and strings.", "`value.indexOf(x) === -1` تعني 'غير موجود' — وتعمل مع المصفوفات والنصوص معًا.")
        ],
        solution: "function expect(value) {\n  return {\n    toBe: function (expected) {\n      if (value !== expected) {\n        throw new Error('Expected ' + expected + ' but got ' + value);\n      }\n      return true;\n    },\n    toContain: function (item) {\n      if (value.indexOf(item) === -1) {\n        throw new Error('Expected to contain ' + item);\n      }\n      return true;\n    }\n  };\n}"
      }
    ]
  }
];

/* ---------------- GAME DEVELOPMENT PATH ---------------- */
const GAME_UNITS = [
  {
    id: "g1", emoji: "🎡",
    title: E("The Game Loop", "حلقة اللعبة"),
    desc: E("Every game ever made is one heartbeat repeated. Learn it, draw on canvas, make things move.", "كل لعبة صنعتها البشرية هي نبضة واحدة تتكرر. تعلّمها، وارسم على canvas، وحرّك الأشياء."),
    steps: [
      {
        id: "s-game-loop", kind: "concept", xp: 10, skill: "Game Loop",
        title: E("What is a game loop?", "ما هي حلقة اللعبة؟"),
        concept: E(
          "Underneath every game — Pong, Minecraft, GTA — is the same heartbeat:\n\n```\nwhile (playing) {\n  readInput();    // what did the player do?\n  update();       // move everything a tiny bit\n  render();       // draw the new world\n}\n```\n\nThe loop runs **60 times per second**. Each run, everything moves just a little — and that illusion of motion becomes gameplay. `update` is pure simulation (positions, physics, rules); `render` just *paints* the current state. Keeping them separate is what makes game code manageable.\n\nIn browsers, `requestAnimationFrame(update)` asks the browser to call your update before each screen refresh — the professional way to run the loop.",
          "تحت كل لعبة — بونغ، ماينكرافت، GTA — توجد نفس النبضة:\n\n```\nwhile (playing) {\n  readInput();    // ماذا فعل اللاعب؟\n  update();       // حرّك كل شيء قليلًا\n  render();       // ارسم العالم الجديد\n}\n```\n\nالحلقة تعمل **60 مرة في الثانية**. في كل مرة يتقدم كل شيء خطوة صغيرة — ويتحول ذلك الوهم إلى لعبة. دالة `update` محاكاة صافية (مواقع وفيزياء وقواعد)؛ و `render` فقط *ترسم* الحالة الحالية. فصلهما هو ما يجعل كود الألعاب قابلًا للإدارة.\n\nفي المتصفح، `requestAnimationFrame(update)` تطلب من المتصفح استدعاء التحديث قبل كل تحديث للشاشة — وهي الطريقة الاحترافية لتشغيل الحلقة."),
        quiz: { q: E("What are the three phases of a game loop, in order?", "ما المراحل الثلاث لحلقة اللعبة بالترتيب؟"), options: E(["Input → Update → Render", "Render → Input → Update", "Update → Input → Render"], ["إدخال ← تحديث ← رسم", "رسم ← إدخال ← تحديث", "تحديث ← إدخال ← رسم"]), answer: 0 }
      },
      {
        id: "s-game-canvas", kind: "canvas", xp: 25, skill: "Canvas",
        title: E("Drawing on canvas", "الرسم على canvas"),
        brief: E(
          "The **canvas** is a blank pixel grid you paint with JavaScript:\n\n```javascript\nconst canvas = document.getElementById('game');\nconst ctx = canvas.getContext('2d');   // the paintbrush\n\nctx.fillStyle = 'skyblue';             // pick a color\nctx.fillRect(40, 40, 50, 50);          // x, y, width, height\n```\n\nEverything is drawn from the **top-left corner** (0,0). `fillRect` paints rectangles; that's genuinely enough to build entire games (early classics were literally rectangles).",
          "**الـ canvas** شبكة بكسلات فارغة ترسم عليها بجافاسكريبت:\n\n```javascript\nconst canvas = document.getElementById('game');\nconst ctx = canvas.getContext('2d');   // الفرشاة\n\nctx.fillStyle = 'skyblue';             // اختر لونًا\nctx.fillRect(40, 40, 50, 50);          // س، ص، العرض، الارتفاع\n```\n\nكل شيء يُرسم من **الزاوية العلوية اليسرى** (0,0). ‏`fillRect` ترسم مستطيلات؛ وهذا فعلًا يكفي لبناء ألعاب كاملة (الكلاسيكيات الأولى كانت حرفيًا مستطيلات)."),
        task: E("Paint anything you like — but it must be a `fillRect` **at position x=40, y=40** (any size/color).", "ارسم ما تحب — لكن يجب أن يكون `fillRect` **في الموضع x=40, y=40** (بأي حجم ولون)."),
        starter: "<canvas id=\"game\" width=\"300\" height=\"200\"></canvas>\n<script>\n  const canvas = document.getElementById('game');\n  const ctx = canvas.getContext('2d');\n\n  // paint something at (40, 40)\n</script>",
        tests: [
          { label: E("Pixel at (45,45) has paint on it", "البكسل عند (45,45) عليه لون"), fn: (d) => { const c = d.getElementById("game"); if (!c) return false; try { const p = c.getContext("2d").getImageData(45, 45, 1, 1).data; return p[3] > 0; } catch (e) { return false; } } },
          { label: E("Corner (5,5) can stay empty — you drew at 40,40", "الزاوية (5,5) تبقى فارغة — رسمت عند 40,40"), fn: (d) => { const c = d.getElementById("game"); if (!c) return false; try { const p = c.getContext("2d").getImageData(5, 5, 1, 1).data; return p[3] === 0; } catch (e) { return false; } } }
        ],
        hints: [
          E("`ctx.fillStyle = 'crimson'; ctx.fillRect(40, 40, 60, 60);`", "`ctx.fillStyle = 'crimson'; ctx.fillRect(40, 40, 60, 60);`"),
          E("The four numbers are: x (from left), y (from top), width, height.", "الأربعة أرقام هي: x (من اليسار)، y (من الأعلى)، العرض، الارتفاع.")
        ],
        solution: "<canvas id=\"game\" width=\"300\" height=\"200\"></canvas>\n<script>\n  const canvas = document.getElementById('game');\n  const ctx = canvas.getContext('2d');\n  ctx.fillStyle = 'crimson';\n  ctx.fillRect(40, 40, 60, 60);\n</script>"
      },
      {
        id: "s-game-move", kind: "js", xp: 25, skill: "Physics",
        title: E("Movement = tiny steps", "الحركة = خطوات صغيرة"),
        brief: E(
          "Game motion is never teleportation — it's position updated slightly, every frame:\n\n```javascript\nfunction update(pos, speed) {\n  return pos + speed;   // moved 5px this frame\n}\n```\n\nSpeed in pixels-per-frame, direction in the sign. Negative speed = moving left/up. That's already physics — velocity.",
          "حركة اللعبة ليست انتقالًا آنيًا أبدًا — بل موقع يتحدث قليلًا في كل إطار:\n\n```javascript\nfunction update(pos, speed) {\n  return pos + speed;   // تحرك 5 بكسل هذا الإطار\n}\n```\n\nالسرعة ببكسل/إطار، والاتجاه بالإشارة. السرعة السالبة = حركة لليسار/الأعلى. هذا فيزياء فعلًا — سرعة متجهة."),
        task: E("Write `update(pos, speed)` returning the new position. Then write `flipDirection(speed)` returning the opposite speed.", "اكتب `update(pos, speed)` التي تُرجع الموضع الجديد. ثم اكتب `flipDirection(speed)` التي تُرجع السرعة المعاكسة."),
        starter: "function update(pos, speed) {\n}\n\nfunction flipDirection(speed) {\n}",
        tests: [
          { label: E("update(10, 5) is 15", "update(10, 5) تساوي 15"), fn: (s) => s.update && s.update(10, 5) === 15 },
          { label: E("Negative speed moves back", "السرعة السالبة تحرك للخلف"), fn: (s) => s.update && s.update(100, -5) === 95 },
          { label: E("flipDirection(5) is -5", "flipDirection(5) تساوي -5"), fn: (s) => s.flipDirection && s.flipDirection(5) === -5 && s.flipDirection(-3) === 3 }
        ],
        hints: [
          E("`return pos + speed;` — addition handles negative speeds automatically.", "`return pos + speed;` — الجمع يتعامل مع السرعات السالبة تلقائيًا."),
          E("`return -speed;` — negation flips direction.", "`return -speed;` — النفي يعكس الاتجاه.")
        ],
        solution: "function update(pos, speed) {\n  return pos + speed;\n}\nfunction flipDirection(speed) {\n  return -speed;\n}"
      },
      {
        id: "p-game-1", kind: "canvas", xp: 70, project: true, skill: "Game Loop",
        title: E("PROJECT: Moving world", "مشروع: عالم متحرك"),
        brief: E(
          "First game-dev project: a **living animation** — a shape bouncing inside a box. It's Pong's ancestor and every platformer's DNA.\n\nThe starter gives you the full game loop; your job is the physics of the bounce: when the square reaches an edge, **flip its direction**.",
          "أول مشروع تطوير ألعاب: **حركة حية** — شكل يرتد داخل صندوق. إنه جدّ بونغ والبنية الأساسية لكل لعبة منصات.\n\nالبداية تعطيك حلقة اللعبة كاملة؛ ومهمتك فيزياء الارتداد: عند وصول المربع إلى الحافة **اعكس اتجاهه**."),
        task: E("Make the square bounce off the walls: inside the update function, when `x + size >= 300` or `x <= 0`, flip the direction (multiply `dir` by `-1`). Run it and watch it move!", "اجعل المربع يرتد من الجدران: داخل دالة التحديث، عندما `x + size >= 300` أو `x <= 0` اعكس الاتجاه (اضرب `dir` في `-1`). شغّلها وشاهدها تتحرك!"),
        starter: "<canvas id=\"game\" width=\"300\" height=\"150\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  let x = 10, dir = 3;          // position & speed\n  const size = 30;\n\n  function update() {\n    x = x + dir;\n\n    // 👇 YOUR BOUNCE LOGIC: if x hits an edge, reverse dir\n\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 150);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(x, 60, size, size);\n  }\n\n  function loop() {\n    update();\n    render();\n    requestAnimationFrame(loop);\n  }\n  loop();\n</script>",
        tests: [
          { label: E("The canvas has animation on it", "الكانفس عليه حركة"), fn: (d) => { const c = d.getElementById("game"); if (!c) return false; try { const ctx2 = c.getContext("2d"); const p1 = ctx2.getImageData(0, 0, 300, 150).data; let painted = 0; for (let i = 3; i < p1.length; i += 40) if (p1[i] > 0) painted++; return painted > 3; } catch (e) { return false; } } },
          { label: E("Your code reverses direction at the edge", "كودك يعكس الاتجاه عند الحافة"), fn: (d) => { const s = (d.getElementById("game") && d.querySelector("script")) ? d.querySelector("script").textContent : ""; return s.includes("-1") || s.includes("=-dir") || s.includes("= -dir") || s.includes("* -1") || s.includes("*-1"); } }
        ],
        hints: [
          E("Right edge: `if (x + size >= 300) dir = -dir;` — mirror it for the left edge.", "الحافة اليمنى: `if (x + size >= 300) dir = -dir;` — وكرر مثلها للحافة اليسرى."),
          E("Both edges: `if (x + size >= 300 || x <= 0) dir = dir * -1;`", "الحافتان: `if (x + size >= 300 || x <= 0) dir = dir * -1;`")
        ],
        solution: "<canvas id=\"game\" width=\"300\" height=\"150\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  let x = 10, dir = 3;\n  const size = 30;\n  function update() {\n    x = x + dir;\n    if (x + size >= 300 || x <= 0) dir = dir * -1;\n  }\n  function render() {\n    ctx.clearRect(0, 0, 300, 150);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(x, 60, size, size);\n  }\n  function loop() {\n    update();\n    render();\n    requestAnimationFrame(loop);\n  }\n  loop();\n</script>"
      }
    ]
  },
  {
    id: "g2", emoji: "🎯",
    title: E("Interaction & Collisions", "التفاعل والتصادمات"),
    desc: E("Games respond to you. Keyboards, collisions, scores — the feedback loop that makes games fun.", "الألعاب تستجيب لك. لوحات المفاتيح والتصادمات والنتائج — حلقة التغذية التي تجعل الألعاب ممتعة."),
    steps: [
      {
        id: "s-game-input", kind: "js", xp: 25, skill: "Input",
        title: E("Reading input", "قراءة المدخلات"),
        brief: E(
          "Input handling = mapping keys to actions:\n\n```javascript\nfunction handleKey(key, x) {\n  if (key === 'ArrowLeft')  return x - 10;\n  if (key === 'ArrowRight') return x + 10;\n  return x;                     // other keys: no movement\n}\n```\n\nIn a real game this runs inside the update loop, reading the current key state each frame.",
          "معالجة المدخلات = ربط المفاتيح بالأفعال:\n\n```javascript\nfunction handleKey(key, x) {\n  if (key === 'ArrowLeft')  return x - 10;\n  if (key === 'ArrowRight') return x + 10;\n  return x;                     // مفاتيح أخرى: بلا حركة\n}\n```\n\nفي اللعبة الحقيقية تعمل هذه داخل حلقة التحديث، وتقرأ حالة المفاتيح كل إطار."),
        task: E("Write `handleKey(key, x)` — ArrowLeft moves 10 left, ArrowRight moves 10 right, anything else returns x unchanged.", "اكتب `handleKey(key, x)` — ‏ArrowLeft تحرك 10 يسارًا، و ArrowRight تحرك 10 يمينًا، وأي شيء آخر يرجع x كما هو."),
        starter: "function handleKey(key, x) {\n}",
        tests: [
          { label: E("ArrowRight: 50 → 60", "‏ArrowRight: ‏50 ← 60"), fn: (s) => s.handleKey && s.handleKey('ArrowRight', 50) === 60 },
          { label: E("ArrowLeft: 50 → 40", "‏ArrowLeft: ‏50 ← 40"), fn: (s) => s.handleKey && s.handleKey('ArrowLeft', 50) === 40 },
          { label: E("Other keys don't move", "المفاتيح الأخرى لا تحرك"), fn: (s) => s.handleKey && s.handleKey('Space', 50) === 50 }
        ],
        hints: [
          E("Two ifs with exact string comparison: `key === 'ArrowRight'`.", "اثنتا if بمقارنة نصية دقيقة: `key === 'ArrowRight'`."),
          E("End with `return x;` so unknown keys are harmless.", "أنهِ بـ `return x;` حتى تكون المفاتيح المجهولة غير مؤذية.")
        ],
        solution: "function handleKey(key, x) {\n  if (key === 'ArrowLeft') return x - 10;\n  if (key === 'ArrowRight') return x + 10;\n  return x;\n}"
      },
      {
        id: "s-game-collide", kind: "js", xp: 30, skill: "Collision",
        title: E("Collision detection", "كشف التصادم"),
        brief: E(
          "How does a game know two things hit? **Axis-Aligned Bounding Boxes** — two rectangles overlap when their ranges overlap on *both* axes:\n\n```javascript\nfunction rectsOverlap(a, b) {\n  return a.x < b.x + b.w &&\n         a.x + a.w > b.x &&\n         a.y < b.y + b.h &&\n         a.y + a.h > b.y;\n}\n```\n\nRead it as four questions: is a's left before b's right? Is a's right after b's left? Same for vertical. All four true = overlap.",
          "كيف تعرف اللعبة أن شيئين اصطدما؟ **المستطيلات المحيطة** — يتقاطع مستطيلان إذا تداخلا محوراهما *كلاهما*:\n\n```javascript\nfunction rectsOverlap(a, b) {\n  return a.x < b.x + b.w &&\n         a.x + a.w > b.x &&\n         a.y < b.y + b.h &&\n         a.y + a.h > b.y;\n}\n```\n\nاقرأها كأربعة أسئلة: هل يسار a قبل يمين b؟ هل يمين a بعد يسار b؟ ونفس الأمر رأسيًا. الأربعة صحيحة = تداخل."),
        task: E("Write `rectsOverlap(a, b)` where each rect is `{x, y, w, h}`.", "اكتب `rectsOverlap(a, b)` حيث كل مستطيل `{x, y, w, h}`."),
        starter: "function rectsOverlap(a, b) {\n}",
        tests: [
          { label: E("Overlapping boxes → true", "صندوقان متداخلان ← true"), fn: (s) => s.rectsOverlap && s.rectsOverlap({x:0,y:0,w:10,h:10}, {x:5,y:5,w:10,h:10}) === true },
          { label: E("Separated boxes → false", "صندوقان متباعدان ← false"), fn: (s) => s.rectsOverlap && s.rectsOverlap({x:0,y:0,w:10,h:10}, {x:50,y:50,w:10,h:10}) === false },
          { label: E("Touching edges → false (no overlap)", "حواف متلامسة ← false (لا تداخل)"), fn: (s) => s.rectsOverlap && s.rectsOverlap({x:0,y:0,w:10,h:10}, {x:10,y:0,w:10,h:10}) === false }
        ],
        hints: [
          E("Start with just the x-axis: `a.x < b.x + b.w && a.x + a.w > b.x` — then add the y version.", "ابدأ بالمحور x فقط: `a.x < b.x + b.w && a.x + a.w > b.x` — ثم أضف نسخة y."),
          E("All four conditions joined with `&&`, inside one return.", "الشروط الأربعة مجتمعة بـ `&&` داخل return واحد.")
        ],
        solution: "function rectsOverlap(a, b) {\n  return a.x < b.x + b.w &&\n         a.x + a.w > b.x &&\n         a.y < b.y + b.h &&\n         a.y + a.h > b.y;\n}"
      },
      {
        id: "s-game-score", kind: "js", xp: 25, skill: "Game Logic",
        title: E("Score & rules", "النتيجة والقواعد"),
        brief: E(
          "Game rules are pure logic — perfect for functions:\n\n```javascript\nfunction addScore(score, points) {\n  return score + points;\n}\n\nfunction shouldLevelUp(score) {\n  return score >= 100;   // rules as data, tweakable\n}\n```\n\nNotice how *tweakable* rules-as-functions are: change a threshold, the whole game rebalances.",
          "قواعد اللعبة منطق صافٍ — مثالي للدوال:\n\n```javascript\nfunction addScore(score, points) {\n  return score + points;\n}\n\nfunction shouldLevelUp(score) {\n  return score >= 100;   // قواعد كبيانات، قابلة للتعديل\n}\n```\n\nلاحظ كم من السهل تعديل القواعد بهذا الشكل: غيّر عتبة واحدة فتتغير موازينة اللعبة كلها."),
        task: E("Write `addScore(score, points)` and `shouldLevelUp(score)` (levels up at 100 or more).", "اكتب `addScore(score, points)` و `shouldLevelUp(score)` (يصعد مستوى عند 100 أو أكثر)."),
        starter: "function addScore(score, points) {\n}\n\nfunction shouldLevelUp(score) {\n}",
        tests: [
          { label: E("addScore(50, 10) is 60", "addScore(50, 10) تساوي 60"), fn: (s) => s.addScore && s.addScore(50, 10) === 60 },
          { label: E("shouldLevelUp(100) is true (boundary)", "shouldLevelUp(100) تساوي true (الحدود)"), fn: (s) => s.shouldLevelUp && s.shouldLevelUp(100) === true && s.shouldLevelUp(99) === false }
        ],
        hints: [
          E("One returns a sum, one returns a comparison — both are single-line returns.", "إحداهما ترجع مجموعًا والأخرى مقارنة — كلتاهما return بسطر واحد."),
          E("`return score >= 100;` — don't write `if (…) return true; else return false;`, the comparison already IS a boolean.", "`return score >= 100;` — لا تكتب `if (…) return true; else return false;`، المقارنة نفسها قيمة منطقية.")
        ],
        solution: "function addScore(score, points) {\n  return score + points;\n}\nfunction shouldLevelUp(score) {\n  return score >= 100;\n}"
      },
      {
        id: "p-game-2", kind: "canvas", xp: 80, project: true, skill: "Collision",
        title: E("PROJECT: Dodge game", "مشروع: لعبة المراوغة"),
        brief: E(
          "Milestone: **your first playable game**. Move a player with arrow keys; falling blocks rain down; survive.\n\nThe starter gives you the full skeleton — loop, player, falling enemies, and even the collision call. Your job: wire input to movement and detect the deadly collisions.",
          "محطة: **أول لعبة قابلة للعب لك**. حرّك لاعبًا بمفاتيح الأسهم؛ المكعبات تتساقط؛ وانجُ.\n\nالبداية تعطيك الهيكل كاملًا — الحلقة واللاعب والأعداء الساقطين وحتى استدعاء التصادم. مهمتك: توصيل المدخلات بالحركة وكشف التصادمات القاتلة."),
        task: E("In the starter: 1) inside `update()`, apply `handleKey(currentKey, player.x)` back into `player.x`; 2) mark game over when any enemy overlaps the player (`rectsOverlap`).", "في البداية: 1) داخل `update()` طبّق ناتج `handleKey(currentKey, player.x)` على `player.x`؛ 2) أعلن انتهاء اللعبة عندما يتقاطع أي عدو مع اللاعب (`rectsOverlap`)."),
        starter: "<canvas id=\"game\" width=\"300\" height=\"250\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  const player = { x: 135, y: 210, w: 30, h: 30 };\n  let enemies = [{ x: 40, y: 0, w: 25, h: 25 }];\n  let currentKey = null;\n  let gameOver = false;\n\n  document.addEventListener('keydown', e => { currentKey = e.key; });\n\n  function handleKey(key, x) {\n    if (key === 'ArrowLeft') return x - 8;\n    if (key === 'ArrowRight') return x + 8;\n    return x;\n  }\n  function rectsOverlap(a, b) {\n    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;\n  }\n\n  function update() {\n    // 1. move the player using handleKey\n\n    // 2. move each enemy down 3px: enemy.y += 3\n    for (const en of enemies) { en.y += 3; }\n\n    // 3. if any enemy overlaps the player → gameOver = true\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 250);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(player.x, player.y, player.w, player.h);\n    ctx.fillStyle = '#f87171';\n    for (const en of enemies) ctx.fillRect(en.x, en.y, en.w, en.h);\n    if (gameOver) {\n      ctx.fillStyle = '#fff';\n      ctx.font = '20px sans-serif';\n      ctx.fillText('Game Over', 95, 120);\n    }\n  }\n\n  function loop() { if (!gameOver) { update(); render(); requestAnimationFrame(loop); } else { render(); } }\n  loop();\n</script>",
        tests: [
          { label: E("Game is animating (player painted)", "اللعبة متحركة (اللاعب مرسوم)"), fn: (d) => { const c = d.getElementById("game"); if (!c) return false; try { const p = c.getContext("2d").getImageData(0, 0, 300, 250).data; let painted = 0; for (let i = 3; i < p.length; i += 40) if (p[i] > 0) painted++; return painted > 2; } catch (e) { return false; } } },
          { label: E("Player x changes via handleKey in update", "يتغير x اللاعب عبر handleKey في update"), fn: (d) => { const sc = [...d.querySelectorAll("script")].map(s => s.textContent).join("\\n"); return /handleKey\(/.test(sc) && /player\.x\s*=/.test(sc); } },
          { label: E("Collision sets gameOver", "التصادم يضبط gameOver"), fn: (d) => { const sc = [...d.querySelectorAll("script")].map(s => s.textContent).join("\\n"); return /rectsOverlap\(/.test(sc) && /gameOver\s*=\s*true/.test(sc); } }
        ],
        hints: [
          E("Player movement: `player.x = handleKey(currentKey, player.x);` — put it at the top of update.", "حركة اللاعب: `player.x = handleKey(currentKey, player.x);` — ضعها في أعلى update."),
          E("Game over check: `for (const en of enemies) { if (rectsOverlap(player, en)) gameOver = true; }`", "فحص النهاية: `for (const en of enemies) { if (rectsOverlap(player, en)) gameOver = true; }`")
        ],
        solution: "<canvas id=\"game\" width=\"300\" height=\"250\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  const player = { x: 135, y: 210, w: 30, h: 30 };\n  let enemies = [{ x: 40, y: 0, w: 25, h: 25 }];\n  let currentKey = null;\n  let gameOver = false;\n\n  document.addEventListener('keydown', e => { currentKey = e.key; });\n\n  function handleKey(key, x) {\n    if (key === 'ArrowLeft') return x - 8;\n    if (key === 'ArrowRight') return x + 8;\n    return x;\n  }\n  function rectsOverlap(a, b) {\n    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;\n  }\n\n  function update() {\n    player.x = handleKey(currentKey, player.x);\n    for (const en of enemies) { en.y += 3; }\n    for (const en of enemies) {\n      if (rectsOverlap(player, en)) gameOver = true;\n    }\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 250);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(player.x, player.y, player.w, player.h);\n    ctx.fillStyle = '#f87171';\n    for (const en of enemies) ctx.fillRect(en.x, en.y, en.w, en.h);\n    if (gameOver) {\n      ctx.fillStyle = '#fff';\n      ctx.font = '20px sans-serif';\n      ctx.fillText('Game Over', 95, 120);\n    }\n  }\n\n  function loop() { if (!gameOver) { update(); render(); requestAnimationFrame(loop); } else { render(); } }\n  loop();\n</script>"
      }
    ]
  },
  {
    id: "g3", emoji: "🧠",
    title: E("Game Systems", "أنظمة اللعبة"),
    desc: E("Enemies that think, states that flow, levels that scale — the systems that make games feel alive.", "أعداء يفكرون، حالات تتنقل، مستويات تتدرج — الأنظمة التي تجعل الألعاب حية."),
    steps: [
      {
        id: "s-game-ai", kind: "js", xp: 30, skill: "AI",
        title: E("Enemy AI: the chase", "ذكاء العدو: المطاردة"),
        brief: E(
          "Game AI is often just *smart movement*. A chaser moves toward the player each frame, one step at a time:\n\n```javascript\nfunction chase(enemy, player, speed) {\n  const dx = player.x - enemy.x;\n  const dy = player.y - enemy.y;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n  if (dist === 0) return enemy;\n  return {\n    x: enemy.x + (dx / dist) * speed,\n    y: enemy.y + (dy / dist) * speed\n  };\n}\n```\n\n`(dx, dy) / dist` is a **unit vector** — pure direction. Multiply by speed = move that way, no matter the distance.",
          "ذكاء الأعداء غالبًا *حركة ذكية*. المطارد يتقدم نحو اللاعب كل إطار خطوة واحدة:\n\n```javascript\nfunction chase(enemy, player, speed) {\n  const dx = player.x - enemy.x;\n  const dy = player.y - enemy.y;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n  if (dist === 0) return enemy;\n  return {\n    x: enemy.x + (dx / dist) * speed,\n    y: enemy.y + (dy / dist) * speed\n  };\n}\n```\n\n‏`(dx, dy) / dist` هو **متجه وحدة** — اتجاه صافٍ. اضربه في السرعة = تحرك بذلك الاتجاه مهما بلغت المسافة."),
        task: E("Write `chase(enemy, player, speed)` returning the enemy's next position as `{x, y}`.", "اكتب `chase(enemy, player, speed)` التي تُرجع الموضع التالي للعدو كـ `{x, y}`."),
        starter: "function chase(enemy, player, speed) {\n  // direction toward player, normalized, times speed\n}",
        tests: [
          { label: E("Moves right toward player", "يتحرك يمينًا نحو اللاعب"), fn: (s) => { if (!s.chase) return false; const r = s.chase({x:0,y:0}, {x:10,y:0}, 2); return r.x > 0 && r.y === 0; } },
          { label: E("Moves up when player is above", "يتحرك أعلى عندما يكون اللاعب فوقه"), fn: (s) => { const r = s.chase({x:5,y:5}, {x:5,y:0}, 2); return r.y < 5; } },
          { label: E("Doesn't overshoot: dist < speed lands on player", "لا يتجاوز: مسافة أقل من السرعة تصل للاعب"), fn: (s) => { const r = s.chase({x:0,y:0}, {x:1,y:0}, 5); return r.x === 1; } }
        ],
        hints: [
          E("`dx = player.x - enemy.x` and same for y — then divide by `Math.sqrt(dx*dx + dy*dy)`.", "`dx = player.x - enemy.x` ومثلها لـ y — ثم اقسم على `Math.sqrt(dx*dx + dy*dy)`."),
          E("Guard the zero case: if distance is 0, return the enemy unchanged.", "احمِ حالة الصفر: إذا كانت المسافة 0 أرجع العدو كما هو.")
        ],
        solution: "function chase(enemy, player, speed) {\n  const dx = player.x - enemy.x;\n  const dy = player.y - enemy.y;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n  if (dist === 0) return { x: enemy.x, y: enemy.y };\n  const step = Math.min(speed, dist);\n  return {\n    x: enemy.x + (dx / dist) * step,\n    y: enemy.y + (dy / dist) * step\n  };\n}"
      },
      {
        id: "s-game-states", kind: "concept", xp: 10, skill: "Game States",
        title: E("Game states: menu, play, over", "حالات اللعبة: قائمة، لعب، نهاية"),
        concept: E(
          "Games are state machines. The same loop behaves differently depending on the current **state**:\n\n```\nMENU  ──press start──▶  PLAYING  ──die──▶  GAME_OVER\n  ▲                                              │\n  └──────────────── press restart ───────────────┘\n```\n\nImplementation: a `state` variable plus a branch in the loop:\n\n```javascript\nfunction update() {\n  if (state === 'menu')  { /* wait for start */ }\n  if (state === 'play')  { movePlayer(); moveEnemies(); }\n  if (state === 'over')  { /* wait for restart */ }\n}\n```\n\nThis tiny pattern scales to pause screens, cutscenes, shops — any flow. It's why games feel *coherent*: rules are scoped to states.",
          "الألعاب آلات حالة. نفس الحلقة تتصرف باختلاف **الحالة** الحالية:\n\n```\nالقائمة ──ابدأ──▶ قيد اللعب ──موت──▶ انتهت\n  ▲                                    │\n  └──────────── أعد اللعب ─────────────┘\n```\n\nالتنفيذ: متغير `state` وتفريع داخل الحلقة:\n\n```javascript\nfunction update() {\n  if (state === 'menu')  { /* انتظر البدء */ }\n  if (state === 'play')  { حرّك اللاعب(); حرّك الأعداء(); }\n  if (state === 'over')  { /* انتظر الإعادة */ }\n}\n```\n\nهذا النمط الصغير يتوسع لشاشات الإيقاف والمشاهد والمتاجر — أي تدفق. لهذا تبدو الألعاب *مترابطة*: القواعد محصورة بالحالات."),
        quiz: { q: E("In state 'menu', what should the update() do with enemies?", "في حالة القائمة، ماذا يجب أن تفعل update() بالأعداء؟"), options: E(["Nothing — game logic runs only in 'play'", "Move them faster", "Delete them from memory"], ["لا شيء — منطق اللعبة يعمل في 'play' فقط", "تحركهم أسرع", "تحذفهم من الذاكرة"]), answer: 0 }
      },
      {
        id: "s-game-levels", kind: "js", xp: 25, skill: "Levels",
        title: E("Difficulty curves", "منحنى الصعوبة"),
        brief: E(
          "Good games get harder *gradually*. Difficulty is often just data:\n\n```javascript\nfunction levelFor(score) {\n  if (score >= 200) return 3;\n  if (score >= 100) return 2;\n  if (score >= 50)  return 1;\n  return 0;\n}\n```\n\nThen parameters hang off the level: `speed = 2 + level`, `enemyCount = 3 + level * 2`. One curve, whole game tuned.",
          "الألعاب الجيدة تصعب *تدريجيًا*. الصعوبة غالبًا بيانات فقط:\n\n```javascript\nfunction levelFor(score) {\n  if (score >= 200) return 3;\n  if (score >= 100) return 2;\n  if (score >= 50)  return 1;\n  return 0;\n}\n```\n\nثم تُشتق معاملات اللعبة من المستوى: `speed = 2 + level` و `enemyCount = 3 + level * 2`. منحنى واحد، وكل اللعبة مضبوطة."),
        task: E("Write `levelFor(score)` — level 3 at 200+, level 2 at 100+, level 1 at 50+, else 0.", "اكتب `levelFor(score)` — المستوى 3 عند 200+، والمستوى 2 عند 100+، والمستوى 1 عند 50+، وإلا 0."),
        starter: "function levelFor(score) {\n}",
        tests: [
          { label: E("levelFor(250) is 3", "levelFor(250) تساوي 3"), fn: (s) => s.levelFor && s.levelFor(250) === 3 },
          { label: E("levelFor(100) is 2 (boundary)", "levelFor(100) تساوي 2 (الحدود)"), fn: (s) => s.levelFor && s.levelFor(100) === 2 },
          { label: E("levelFor(10) is 0", "levelFor(10) تساوي 0"), fn: (s) => s.levelFor && s.levelFor(10) === 0 }
        ],
        hints: [
          E("Check the highest threshold *first* — order matters.", "افحص أعلى عتبة *أولًا* — الترتيب مهم."),
          E("Use `>=` so the boundary scores (100, 200) land on the higher level.", "استخدم `>=` حتى تقع النتائج الحدية (100، 200) في المستوى الأعلى.")
        ],
        solution: "function levelFor(score) {\n  if (score >= 200) return 3;\n  if (score >= 100) return 2;\n  if (score >= 50) return 1;\n  return 0;\n}"
      },
      {
        id: "p-game-3", kind: "canvas", xp: 90, project: true, skill: "Game Systems",
        title: E("PROJECT: Breakout clone", "مشروع: نسخة Breakout"),
        brief: E(
          "The legendary milestone: **Breakout** — paddle, ball, brick wall. It taught a generation of developers game physics, and now it's yours.\n\nThe starter has the full structure: ball, paddle, bricks array, and render. You implement the two signature mechanics: **ball bounces off walls**, and **ball bounces off the paddle**.",
          "المحطة الأسطورية: **Breakout** — مضرب، كرة، جدار طوب. علّمت جيلًا كاملًا فيزياء الألعاب، والآن صارت لك.\n\nالبداية فيها الهيكل كامل: الكرة والمضرب ومصفوفة الطوب والرسم. أنت تنفذ الميكانيكيتين المميزتين: **ارتداد الكرة عن الجدران** و **ارتدادها عن المضرب**."),
        task: E("In `update()`: 1) when the ball hits the left/right wall (x <= 0 or x + size >= 300), flip `vx`; 2) when it reaches the paddle row (y + size >= paddle.y), flip `vy` so it bounces up.", "في `update()`: 1) عندما تلمس الكرة الجدار الأيمن/الأيسر (x <= 0 أو x + size >= 300) اعكس `vx`؛ 2) عندما تصل لصف المضرب (y + size >= paddle.y) اعكس `vy` لترتد لأعلى."),
        starter: "<canvas id=\"game\" width=\"300\" height=\"250\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  const ball = { x: 150, y: 100 };\n  const paddle = { x: 125, y: 230, w: 50, h: 10 };\n  let vx = 2, vy = 2;\n  const size = 12;\n  const bricks = [];\n  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) bricks.push({ x: 20 + c * 44, y: 30 + r * 20, w: 40, h: 14 });\n\n  function update() {\n    ball.x += vx;\n    ball.y += vy;\n\n    // 1. bounce off left/right walls → vx = -vx\n\n    // 2. bounce off top wall → vy = -vy\n\n    // 3. bounce off the paddle row → vy = -vy\n\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 250);\n    ctx.fillStyle = '#a78bfa';\n    for (const b of bricks) ctx.fillRect(b.x, b.y, b.w, b.h);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);\n    ctx.fillStyle = '#fff';\n    ctx.fillRect(ball.x, ball.y, size, size);\n  }\n\n  function loop() { update(); render(); requestAnimationFrame(loop); }\n  loop();\n</script>",
        tests: [
          { label: E("Game renders (bricks painted)", "اللعبة ترسم (الطوب مرسوم)"), fn: (d) => { const c = d.getElementById("game"); if (!c) return false; try { const p = c.getContext("2d").getImageData(0, 0, 300, 250).data; let painted = 0; for (let i = 3; i < p.length; i += 40) if (p[i] > 0) painted++; return painted > 3; } catch (e) { return false; } } },
          { label: E("Wall bounce flips vx", "ارتداد الجدار يعكس vx"), fn: (d) => { const sc = [...d.querySelectorAll("script")].map(s => s.textContent).join("\\n"); return /vx\s*=\s*-\s*vx/.test(sc); } },
          { label: E("Paddle bounce flips vy", "ارتداد المضرب يعكس vy"), fn: (d) => { const sc = [...d.querySelectorAll("script")].map(s => s.textContent).join("\\n"); return /vy\s*=\s*-\s*vy/.test(sc); } }
        ],
        hints: [
          E("Side walls: `if (ball.x <= 0 || ball.x + size >= 300) vx = -vx;`", "الجداران الجانبيان: `if (ball.x <= 0 || ball.x + size >= 300) vx = -vx;`"),
          E("Paddle: `if (ball.y + size >= paddle.y) vy = -vy;` — one condition flips the vertical direction.", "المضرب: `if (ball.y + size >= paddle.y) vy = -vy;` — شرط واحد يعكس الاتجاه الرأسي.")
        ],
        solution: "<canvas id=\"game\" width=\"300\" height=\"250\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  const ball = { x: 150, y: 100 };\n  const paddle = { x: 125, y: 230, w: 50, h: 10 };\n  let vx = 2, vy = 2;\n  const size = 12;\n  const bricks = [];\n  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) bricks.push({ x: 20 + c * 44, y: 30 + r * 20, w: 40, h: 14 });\n\n  function update() {\n    ball.x += vx;\n    ball.y += vy;\n    if (ball.x <= 0 || ball.x + size >= 300) vx = -vx;\n    if (ball.y <= 0) vy = -vy;\n    if (ball.y + size >= paddle.y) vy = -vy;\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 250);\n    ctx.fillStyle = '#a78bfa';\n    for (const b of bricks) ctx.fillRect(b.x, b.y, b.w, b.h);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);\n    ctx.fillStyle = '#fff';\n    ctx.fillRect(ball.x, ball.y, size, size);\n  }\n\n  function loop() { update(); render(); requestAnimationFrame(loop); }\n  loop();\n</script>"
      }
    ]
  },
  {
    id: "g4", emoji: "🚢",
    title: E("Ship Your Game", "أطلق لعبتك"),
    desc: E("Polish, menus, game over screens — turning a demo into a complete, playable experience.", "صقل، قوائم، شاشات نهاية — تحويل عرض تجريبي إلى تجربة لعب مكتملة."),
    steps: [
      {
        id: "s-game-polish", kind: "concept", xp: 10, skill: "Game Design",
        title: E("What makes games feel good?", "ما يجعل الألعاب ممتعة؟"),
        concept: E(
          "Between \"works\" and \"fun\" lies game *feel* — a craft of details:\n\n- **Juice**: screen shake on hits, particles on explosions, squash-and-stretch on jumps. Feedback for everything.\n- **Instant restart**: death → back in the game in under a second. Respect the player's time.\n- **Fair difficulty**: the player should blame themselves, not the game. Telegraph dangers; keep hitboxes honest.\n- **Sound**: even simple beeps transform feel.\n- **The 3-second rule**: a new player should understand what to do within 3 seconds of looking.\n\nNotice: none of these are *graphics quality*. Feel is logic + feedback — exactly what you've been building.",
          "بين \"تعمل\" و\"ممتعة\" يقع *إحساس* اللعبة — حرفة تفاصيل:\n\n- **العصارة**: اهتزاز الشاشة عند الضربات، جزيئات عند الانفجارات، تمدد عند القفز. تغذية راجعة لكل شيء.\n- **إعادة فورية**: موت ← عودة للعب في أقل من ثانية. احترم وقت اللاعب.\n- **صعوبة عادلة**: يجب أن يلوم اللاعب نفسه لا اللعبة. نبّه للمخاطر، واجعل صناديق التصادم صادقة.\n- **الصوت**: حتى الصفير البسيط يحول الإحساس.\n- **قاعدة الثلاث ثوان**: يفهم اللاعب الجديد ما عليه خلال 3 ثوان من النظر.\n\nلاحظ: لا شيء من هذه *جودة رسومات*. الإحساس منطق + تغذية راجعة — بالضبط ما كنت تبنيه."),
        quiz: { q: E("A player dies. What's the best restart experience?", "لاعب يموت. ما أفضل تجربة إعادة؟"), options: E(["Back in the game almost instantly", "Long dramatic cutscene first", "Close the browser tab"], ["عودة فورية للعب تقريبًا", "مشهد درامي طويل أولًا", "إغلاق تبويب المتصفح"]), answer: 0 }
      },
      {
        id: "p-game-4", kind: "canvas", xp: 100, project: true, skill: "Game States",
        title: E("PROJECT: Complete game", "مشروع: لعبة مكتملة"),
        brief: E(
          "The final boss of this path: a **complete game** with a start menu, gameplay, and a game-over screen with restart. The full state machine from your concept lesson, live on screen.\n\nThis is the moment you stop writing demos and start *shipping games*. 🏁",
          "الزعيم النهائي لهذا المسار: **لعبة كاملة** بقائمة بداية ولعب وشاشة نهاية مع إعادة. آلة الحالات الكاملة من درسك المفاهيمي، حية على الشاشة.\n\nهذه لحظة توقف فيها عن بناء النماذج التجريبية وتبدأ *إطلاق الألعاب*. 🏁"),
        task: E("Build a game page with: a `<canvas id=\"game\">` that's actively drawing (a loop), a `<button id=\"startBtn\">` that starts/restarts the game (its handler resets something and relaunches the loop), and game-over text drawn on the canvas when hit.", "ابنِ صفحة لعبة فيها: `<canvas id=\"game\">` يرسم بنشاط (بحلقة)، و `<button id=\"startBtn\">` يبدأ/يعيد اللعبة (معالجه يعيد ضبط شيء ويعيد تشغيل الحلقة)، ونص نهاية اللعبة يُرسم على الكانفس عند الإصابة."),
        starter: "<canvas id=\"game\" width=\"300\" height=\"220\" style=\"background:#0b1120\"></canvas>\n<button id=\"startBtn\">Start / Restart</button>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  let player = { x: 140, y: 180, w: 20, h: 20 };\n  let enemies = [];\n  let running = false;\n  let gameOver = false;\n  let frame = 0;\n\n  document.getElementById('startBtn').addEventListener('click', function () {\n    // reset state and start the game\n    player.x = 140;\n    enemies = [];\n    gameOver = false;\n    running = true;\n    if (frame === 0) loop();   // start the loop only once\n  });\n\n  function update() {\n    if (!running || gameOver) return;\n    frame++;\n    if (frame % 40 === 0) enemies.push({ x: Math.random() * 280, y: 0, w: 20, h: 20 });\n    for (const en of enemies) en.y += 3;\n    for (const en of enemies) {\n      if (player.x < en.x + en.w && player.x + player.w > en.x &&\n          player.y < en.y + en.h && player.y + player.h > en.y) {\n        gameOver = true;\n      }\n    }\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 220);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(player.x, player.y, player.w, player.h);\n    ctx.fillStyle = '#f87171';\n    for (const en of enemies) ctx.fillRect(en.x, en.y, en.w, en.h);\n    if (gameOver) {\n      ctx.fillStyle = '#fff';\n      ctx.font = '20px sans-serif';\n      ctx.fillText('Game Over — press restart', 45, 110);\n    }\n  }\n\n  function loop() { update(); render(); requestAnimationFrame(loop); }\n  loop();\n</script>",
        tests: [
          { label: E("Canvas + start button exist", "الكانفس وزر البدء موجودان"), fn: (d) => !!d.getElementById("game") && !!d.getElementById("startBtn") },
          { label: E("The canvas is drawing (loop runs)", "الكانفس يرسم (الحلقة تعمل)"), fn: (d) => { const c = d.getElementById("game"); if (!c) return false; try { const p = c.getContext("2d").getImageData(0, 0, 300, 220).data; let painted = 0; for (let i = 3; i < p.length; i += 40) if (p[i] > 0) painted++; return painted > 0; } catch (e) { return false; } } },
          { label: E("Restart handler resets the game state", "معالج الإعادة يهيّأ حالة اللعبة"), fn: (d) => { const b = d.getElementById("startBtn"); if (!b) return false; b.click(); return true; } }
        ],
        hints: [
          E("The starter is a complete game already — press Run and play it! Your task is to make it *yours*: tweak speeds, colors, add your own touch.", "البداية لعبة كاملة أصلًا — اضغط تشغيل والعبها! مهمتك أن تجعلها *ملكك*: عدّل السرعات والألوان وأضف لمستك."),
          E("Try: make enemies faster over time (`en.y += 3 + frame/600`), add a score counter, or move the player with arrow keys like in the Dodge game.", "جرّب: اجعل الأعداء أسرع مع الوقت (`en.y += 3 + frame/600`)، أو أضف عداد نتيجة، أو حرك اللاعب بالأسهم كما في لعبة المراوغة.")
        ],
        solution: "<canvas id=\"game\" width=\"300\" height=\"220\" style=\"background:#0b1120\"></canvas>\n<button id=\"startBtn\">Start / Restart</button>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  let player = { x: 140, y: 180, w: 20, h: 20 };\n  let enemies = [];\n  let running = false;\n  let gameOver = false;\n  let frame = 0;\n  let score = 0;\n\n  document.getElementById('startBtn').addEventListener('click', function () {\n    player.x = 140;\n    enemies = [];\n    score = 0;\n    gameOver = false;\n    running = true;\n  });\n\n  function update() {\n    if (!running || gameOver) return;\n    frame++;\n    if (frame % 40 === 0) { enemies.push({ x: Math.random() * 280, y: 0, w: 20, h: 20 }); score += 10; }\n    for (const en of enemies) en.y += 3 + frame / 600;   // speeds up over time\n    for (const en of enemies) {\n      if (player.x < en.x + en.w && player.x + player.w > en.x &&\n          player.y < en.y + en.h && player.y + player.h > en.y) {\n        gameOver = true;\n      }\n    }\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 220);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(player.x, player.y, player.w, player.h);\n    ctx.fillStyle = '#f87171';\n    for (const en of enemies) ctx.fillRect(en.x, en.y, en.w, en.h);\n    ctx.fillStyle = '#fff';\n    ctx.font = '14px sans-serif';\n    ctx.fillText('Score: ' + score, 10, 20);\n    if (gameOver) {\n      ctx.font = '20px sans-serif';\n      ctx.fillText('Game Over — press restart', 45, 110);\n    }\n  }\n\n  function loop() { update(); render(); requestAnimationFrame(loop); }\n  loop();\n</script>"
      }
    ]
  },
  {
    id: "g5", emoji: "⚙️",
    title: E("Meet C++ — the language of game engines", "تعرّف على C++ — لغة محركات الألعاب"),
    desc: E("The language behind Unreal and high-performance engines. Take your game math into compiled territory.", "اللغة التي يقف وراء Unreal والمحركات فائقة الأداء. انتقل برياضيات ألعابك من المتصفح إلى عالم المُترجمات."),
    steps: [
      {
        id: "s-cpp-first", kind: "cpp", xp: 20, skill: "C++",
        title: E("Your first C++ power-up", "أول ترقية C++ لك"),
        brief: E(
          "**C++** = the speed of C + bigger superpowers (that's the `++`!). Unreal Engine, Unity's core and most AAA games speak C++.\n\n```cpp\n#include <iostream>\nusing namespace std;\n\nint doubleScore(int base) {\n  return base * 2;\n}\n\nint main() {\n  cout << doubleScore(21) << endl;   // prints 42\n  return 0;\n}\n```\n\n`cout` is C++'s printer — chain values with `<<`, end the line with `endl`. Notice how familiar this all is: same loops, same logic, stricter types.",
          "**C++** = سرعة C + قوى أكبر (من هنا الـ `++`!). محرك Unreal وجوهر Unity ومعظم ألعاب AAA يتحدثون C++.\n\n```cpp\n#include <iostream>\nusing namespace std;\n\nint doubleScore(int base) {\n  return base * 2;\n}\n\nint main() {\n  cout << doubleScore(21) << endl;   // تطبع 42\n  return 0;\n}\n```\n\n`cout` هي طابعة C++ — اربط القيم بـ `<<` وأنهِ السطر بـ `endl`. لاحظ كم كل هذا مألوف: نفس الحلقات، نفس المنطق، أنواع أشد."),
        task: E("Write `doubleScore(int base)` returning base × 2. main already prints it.", "اكتب `doubleScore(int base)` التي تُرجع base × 2. الدالة main تطبع الناتج بالفعل."),
        starter: "#include <iostream>\nusing namespace std;\n\nint doubleScore(int base) {\n  // return base * 2\n}\n\nint main() {\n  cout << \"Score: \" << doubleScore(21) << endl;\n  return 0;\n}",
        tests: [
          { label: E("doubleScore(21) is 42", "doubleScore(21) تساوي 42"), fn: (s) => s.doubleScore && s.doubleScore(21) === 42 },
          { label: E("doubleScore(0) is 0", "doubleScore(0) تساوي 0"), fn: (s) => s.doubleScore && s.doubleScore(0) === 0 },
          { label: E("doubleScore(-5) is -10", "doubleScore(-5) تساوي -10"), fn: (s) => s.doubleScore && s.doubleScore(-5) === -10 }
        ],
        hints: [
          E("Identical to the JavaScript version — just declare the type: `int doubleScore(int base) { return base * 2; }`", "مطابقة لنسخة جافاسكريبت — فقط صرّح بالنوع: `int doubleScore(int base) { return base * 2; }`"),
          E("`cout << x << endl;` prints x on its own line.", "`cout << x << endl;` تطبع x في سطر مستقل.")
        ],
        solution: "#include <iostream>\nusing namespace std;\n\nint doubleScore(int base) {\n  return base * 2;\n}\n\nint main() {\n  cout << \"Score: \" << doubleScore(21) << endl;\n  return 0;\n}"
      },
      {
        id: "s-cpp-power", kind: "cpp", xp: 25, skill: "C++",
        title: E("Damage formulas with pow", "معادلات الضرر بـ pow"),
        brief: E(
          "Game math loves exponents: damage falloff, splash radius, upgrade curves.\n\n```cpp\n#include <iostream>\n#include <cmath>\nusing namespace std;\n\ndouble damage(double base, int level) {\n  return base * pow(1.5, level);\n}\n\nint main() {\n  cout << damage(10.0, 3) << endl;   // 10 × 1.5³ = 33.75\n  return 0;\n}\n```\n\n`pow(base, exp)` raises base to a power. Note the return type is `double` — decimals are essential for smooth game scaling. `%.2f` inside printf (or a fixed cout trick) prints 2 decimals; here we keep the full value.",
          "رياضيات الألعاب تعشق الأسس: تلاشي الضرر، نصف قطر الانفجار، منحنيات الترقية.\n\n```cpp\n#include <iostream>\n#include <cmath>\nusing namespace std;\n\ndouble damage(double base, int level) {\n  return base * pow(1.5, level);\n}\n\nint main() {\n  cout << damage(10.0, 3) << endl;   // 10 × 1.5³ = 33.75\n  return 0;\n}\n```\n\n`pow(base, exp)` ترفع الأساس إلى قوة الأس. لاحظ نوع الإرجاع `double` — الكسور أساسية لتنعّم التصعيد في الألعاب."),
        task: E("Write `damage(double base, int level)` returning `base * pow(1.5, level)`.", "اكتب `damage(double base, int level)` التي تُرجع `base * pow(1.5, level)`."),
        starter: "#include <iostream>\n#include <cmath>\nusing namespace std;\n\ndouble damage(double base, int level) {\n  // base * pow(1.5, level)\n}\n\nint main() {\n  cout << \"hit: \" << damage(10.0, 3) << endl;\n  return 0;\n}",
        tests: [
          { label: E("damage(10, 0) is 10", "damage(10, 0) تساوي 10"), fn: (s) => s.damage && s.damage(10, 0) === 10 },
          { label: E("damage(10, 3) is 33.75", "damage(10, 3) تساوي 33.75"), fn: (s) => s.damage && Math.abs(s.damage(10, 3) - 33.75) < 0.0001 },
          { label: E("damage(4, 2) is 9", "damage(4, 2) تساوي 9"), fn: (s) => s.damage && Math.abs(s.damage(4, 2) - 9) < 0.0001 }
        ],
        hints: [
          E("`pow` lives in `<cmath>` — the include is already in the starter.", "`pow` تسكن في `<cmath>` — الـ include موجودة في البداية."),
          E("`return base * pow(1.5, level);` — the double return type keeps it precise.", "`return base * pow(1.5, level);` — نوع الإرجاع double يبقيها دقيقة.")
        ],
        solution: "#include <iostream>\n#include <cmath>\nusing namespace std;\n\ndouble damage(double base, int level) {\n  return base * pow(1.5, level);\n}\n\nint main() {\n  cout << \"hit: \" << damage(10.0, 3) << endl;\n  return 0;\n}"
      },
      {
        id: "s-cpp-classes", kind: "concept", xp: 10, skill: "C++",
        title: E("Classes: C++'s big upgrade", "الأصناف: الترقية الكبرى في C++"),
        concept: E(
          "C gave you functions and types. **C++ adds classes** — blueprints that bundle data + the functions that operate on it.\n\n```cpp\nclass Player {\npublic:\n  int hp;\n  void hit(int dmg) { hp = hp - dmg; }\n};\n\nint main() {\n  Player hero;\n  hero.hp = 100;\n  hero.hit(30);\n  cout << hero.hp << endl;   // 70\n}\n```\n\nSound familiar? The JavaScript `class Stack` you built works the same way — C++ classes are where your JS knowledge transfers almost 1:1. Engines use classes everywhere: `Enemy`, `Bullet`, `Level`, `Camera` — each a blueprint stamped out into objects.",
          "أعطتك C الدوال والأنواع. **C++ تضيف الأصناف (classes)** — مخططات تجمع البيانات والدوال التي تعمل عليها معًا.\n\n```cpp\nclass Player {\npublic:\n  int hp;\n  void hit(int dmg) { hp = hp - dmg; }\n};\n\nint main() {\n  Player hero;\n  hero.hp = 100;\n  hero.hit(30);\n  cout << hero.hp << endl;   // 70\n}\n```\n\nيبدو مألوفًا؟ صنف `Stack` الذي بنته بجافاسكريبت يعمل بنفس الطريقة — أصناف C++ هي المكان الذي تنقل فيه معرفتك من جافاسكريبت شبه حرفيًا. المحركات تستخدمها في كل مكان: `Enemy` و `Bullet` و `Level` و `Camera` — كل واحد مخطط يُنسخ منه كائنات."),
        quiz: { q: E("What does a C++ class bundle together?", "ماذا يجمع صنف C++ معًا؟"), options: E(["Data and the functions that operate on it", "Only numbers", "Compiled and interpreted code", "Pointers and memory"], ["البيانات والدوال التي تعمل عليها", "الأرقام فقط", "كودًا مترجمًا ومُفسَّرًا", "المؤشرات والذاكرة"]), answer: 0 }
      },
      {
        id: "s-cpp-combo", kind: "cpp", xp: 30, skill: "C++",
        title: E("PROJECT: Combo scoring system", "مشروع: نظام نقاط الكومبو"),
        brief: E(
          "Every action game rewards chains: combo multipliers. Build the scoring heart of a fighter game.\n\nRules: each hit adds base points × current combo multiplier. The multiplier grows by 0.5 per hit, capped at ×4.",
          "كل لعبة قتال تكافئ المتسلسلات: مضاعفات الكومبو. ابنِ قلب نظام النقاط للعبة قتال.\n\nالقواعد: كل ضربة تضيف النقاط الأساس × مضاعف الكومبو الحالي. المضاعف يزيد 0.5 لكل ضربة بحد أقصى ×4."),
        task: E("Write `comboScore(int hits, int basePts)` — total points after `hits` consecutive hits, each worth `basePts × multiplier`, where the multiplier starts at 1.0 and grows 0.5 per hit (max 4.0). `comboScore(3, 100)` = 100×1.0 + 100×1.5 + 100×2.0 = 450.", "اكتب `comboScore(int hits, int basePts)` — مجموع النقاط بعد `hits` ضربة متتالية، كل ضربة تساوي `basePts × المضاعف`، حيث يبدأ المضاعف 1.0 ويزيد 0.5 لكل ضربة (بحد أقصى 4.0). `comboScore(3, 100)` = 100×1.0 + 100×1.5 + 100×2.0 = 450."),
        starter: "#include <iostream>\n#include <cmath>\nusing namespace std;\n\ndouble comboScore(int hits, int basePts) {\n  // loop hits times, grow the multiplier 0.5 each hit, cap at 4.0\n}\n\nint main() {\n  cout << \"combo: \" << comboScore(3, 100) << endl;\n  return 0;\n}",
        tests: [
          { label: E("comboScore(3, 100) is 450", "comboScore(3, 100) تساوي 450"), fn: (s) => s.comboScore && Math.abs(s.comboScore(3, 100) - 450) < 0.0001 },
          { label: E("comboScore(1, 50) is 50 (first hit ×1.0)", "comboScore(1, 50) تساوي 50 (أول ضربة ×1.0)"), fn: (s) => s.comboScore && Math.abs(s.comboScore(1, 50) - 50) < 0.0001 },
          { label: E("comboScore(10, 100) respects the ×4 cap (2950)", "comboScore(10, 100) تحترم سقف ×4 (2950)"), fn: (s) => s.comboScore && Math.abs(s.comboScore(10, 100) - 2950) < 0.0001 },
          { label: E("comboScore(0, 100) is 0", "comboScore(0, 100) تساوي 0"), fn: (s) => s.comboScore && s.comboScore(0, 100) === 0 }
        ],
        hints: [
          E("Start `double total = 0; double mult = 1.0;` then loop `hits` times adding `basePts * mult`.", "ابدأ `double total = 0; double mult = 1.0;` ثم حلق `hits` مرة مضيفًا `basePts * mult`."),
          E("After adding: `mult += 0.5; if (mult > 4.0) mult = 4.0;`", "بعد الإضافة: `mult += 0.5; if (mult > 4.0) mult = 4.0;`")
        ],
        solution: "#include <iostream>\n#include <cmath>\nusing namespace std;\n\ndouble comboScore(int hits, int basePts) {\n  double total = 0;\n  double mult = 1.0;\n  for (int i = 0; i < hits; i++) {\n    total = total + basePts * mult;\n    mult = mult + 0.5;\n    if (mult > 4.0) {\n      mult = 4.0;\n    }\n  }\n  return total;\n}\n\nint main() {\n  cout << \"combo: \" << comboScore(3, 100) << endl;\n  return 0;\n}"
      }
    ]
  },
  {
    id: "g6", emoji: "🤖",
    title: E("Smarter Enemies", "أعداء أذكى"),
    desc: E("A chaser that always chases is a robot. Give your enemies senses — awareness range, aim, and a state that decides when to hunt and when to hold.", "الطارد الذي يطارد دائمًا آلة فقط. أعطِ أعداءك حوسًا — مدى إدراك، وتسديد، وحالة تقرر متى يطاردون ومتى يثبتون."),
    steps: [
      {
        id: "s-ai-aware", kind: "concept", xp: 10, skill: "AI",
        title: E("Senses & states: when enemies notice you", "حواس وحالات: متى يلاحظك الأعداء"),
        concept: E(
          "A chaser that always chases is predictable — and unfair. Real enemies have **senses** and **states**:\n\n```\n          dist < 200         dist < 30\n [idle] ─────────────▶ [chase] ──────▶ [attack]\n   ▲                       │                │\n   └── player escapes ─────┴──── timer ──────┘\n```\n\n- **Awareness range** — the enemy reacts only inside a radius (say 200px). Outside it: idle, patrol, rest.\n- **States** — each state runs its own behavior; a tiny state machine picks one per frame.\n- **Attack range** — closer than 30px it stops walking *through* the player and strikes.\n\nWhy it feels better: players read behavior. *\"It saw me — now it's coming\"* feels fair and tense; an enemy that tunnels across the map from spawn does not. The chase code is unchanged — it's now **gated** by distance, and that's where the intelligence appears.",
          "الطارد الذي يطارد دائمًا متوقع — وغير عادل. الأعداء الحقيقيون لهم **حواس** و**حالات**:\n\n```\n          المسافة < 200       المسافة < 30\n [خامل] ─────────────▶ [يطارد] ──────▶ [يهاجم]\n   ▲                      │                │\n   └─ هروب اللاعب ────────┴──── مؤقّت ──────┘\n```\n\n- **مدى الإدراك** — يستجيب العدو داخل دائرة فقط (مثلاً 200 بكسل). وخارجها: خامل أو دورية أو راحة.\n- **الحالات** — كل حالة تنفّذ سلوكها؛ وآلة حالة صغيرة تختار واحدة لكل إطار.\n- **مدى الهجوم** — أقرب من 30 بكسل يتوقف عن المشي *عبر* اللاعب ويضرب.\n\nلماذا يبدو أفضل: اللاعبون يقرؤون السلوك. *\"لاحظني — وهو قادم الآن\"* يبدو عادلًا ومتوترًا؛ أما العدو الذي يخترق الخريطة من نقطة الولادة فلا. كود المطاردة نفسه لم يتغير — صار **مقيّدًا** بالمسافة، وهنا يظهر الذكاء."),
        quiz: { q: E("What decides whether an enemy is idle or chasing this frame?", "ما الذي يقرر إن كان العدو خاملًا أم طاردًا في هذا الإطار؟"), options: E(["The distance to the player compared with its awareness range", "The order the enemies were created in", "How many pixels the canvas is"], ["المسافة إلى اللاعب مقارنة بمدى إدراكه", "ترتيب إنشاء الأعداء", "عدد بكسلات الكانفس"]), answer: 0 }
      },
      {
        id: "s-ai-hunt", kind: "js", xp: 30, skill: "AI",
        title: E("Hunt: chase only inside awareness range", "الاصطاد: لا تطارد إلا داخل مدى الإدراك"),
        brief: E(
          "The same unit-vector chase, now with a **gate** at the top:\n\n```javascript\nfunction hunt(enemy, player, speed) {\n  const dx = player.x - enemy.x;\n  const dy = player.y - enemy.y;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n\n  if (dist > 200) {                       // too far:\n    return { x: enemy.x, y: enemy.y, mode: 'idle' };\n  }\n  if (dist === 0) {                       // on top of the player:\n    return { x: enemy.x, y: enemy.y, mode: 'attack' };\n  }\n  const step = Math.min(speed, dist);     // never overshoot\n  return {\n    x: enemy.x + (dx / dist) * step,\n    y: enemy.y + (dy / dist) * step,\n    mode: 'chase'\n  };\n}\n```\n\nThree outcomes, one function — the `mode` it returns tells the rest of the game *which behavior to animate*. Notice `Math.min(speed, dist)`: it stops exactly on the player instead of stepping past and oscillating back.",
          "مطاردة المتجه الوحدة نفسها، الآن بـ**بوابة** في رأسها:\n\n```javascript\nfunction hunt(enemy, player, speed) {\n  const dx = player.x - enemy.x;\n  const dy = player.y - enemy.y;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n\n  if (dist > 200) {                       // أبعد من ذلك:\n    return { x: enemy.x, y: enemy.y, mode: 'idle' };\n  }\n  if (dist === 0) {                       // فوق اللاعب:\n    return { x: enemy.x, y: enemy.y, mode: 'attack' };\n  }\n  const step = Math.min(speed, dist);     // لا تتجاوز أبدًا\n  return {\n    x: enemy.x + (dx / dist) * step,\n    y: enemy.y + (dy / dist) * step,\n    mode: 'chase'\n  };\n}\n```\n\nثلاثة مخرجات، دالة واحدة — والـ `mode` التي تُرجعها تخبر بقية اللعبة *بأي سلوك تُحرِّك*. انتبه لـ `Math.min(speed, dist)`: توقف تمامًا عند اللاعب بدل أن تتجاوزه وتهبط راجعة."),
        task: E("Write `hunt(enemy, player, speed)` returning `{ x, y, mode }`:\n- more than **200px** apart → the enemy's current position, mode `idle`\n- exactly on the player → position unchanged, mode `attack`\n- otherwise → move `speed` toward the player without overshooting, mode `chase`", "اكتب `hunt(enemy, player, speed)` تُرجع `{ x, y, mode }`:\n- المسافة أكثر من **200 بكسل** → موضع العدو الحالي وmode `idle`\n- فوق اللاعب تمامًا → الموضع دون تغيير وmode `attack`\n- وإلا → تحرّك بمقدار `speed` نحو اللاعب دون تجاوز، وmode `chase`"),
        starter: "function hunt(enemy, player, speed) {\n  const dx = player.x - enemy.x;\n  const dy = player.y - enemy.y;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n\n  // 1. too far? → return idle (stay put)\n  // 2. on top of the player? → return attack (stay put)\n  // 3. otherwise → move (dx / dist) * step, mode chase\n}",
        tests: [
          { label: E("Outside awareness it stays idle", "خارج مدى الإدراك يبقى خاملًا"), fn: (s) => { if (!s.hunt) return false; const r = s.hunt({ x: 0, y: 0 }, { x: 500, y: 0 }, 5); return r.mode === 'idle' && r.x === 0 && r.y === 0; } },
          { label: E("Inside range it chases and closes in", "داخل المدى يطارد ويتقرب"), fn: (s) => { if (!s.hunt) return false; const r = s.hunt({ x: 0, y: 0 }, { x: 100, y: 0 }, 5); return r.mode === 'chase' && r.x > 0 && r.x < 100; } },
          { label: E("Exactly 200px still counts as chasing", "200 بكسل بالضبط تُحتسب مطاردة"), fn: (s) => s.hunt && s.hunt({ x: 0, y: 0 }, { x: 200, y: 0 }, 5).mode === 'chase' },
          { label: E("Never overshoots the player", "لا يتجاوز اللاعب أبدًا"), fn: (s) => { if (!s.hunt) return false; const r = s.hunt({ x: 0, y: 0 }, { x: 3, y: 0 }, 10); return r.x === 3 && r.y === 0 && r.mode === 'chase'; } },
          { label: E("On the player it switches to attack", "فوق اللاعب يتحول إلى هجوم"), fn: (s) => { if (!s.hunt) return false; const r = s.hunt({ x: 5, y: 5 }, { x: 5, y: 5 }, 2); return r.mode === 'attack' && r.x === 5 && r.y === 5; } }
        ],
        hints: [
          E("Check the distance *before* moving: `if (dist > 200) return { x: enemy.x, y: enemy.y, mode: 'idle' };`", "افحص المسافة *قبل* التحرك: `if (dist > 200) return { x: enemy.x, y: enemy.y, mode: 'idle' };`"),
          E("`const step = Math.min(speed, dist);` guarantees you land exactly on the player instead of flying past.", "`const step = Math.min(speed, dist);` يضمن أن تهبط تمامًا على اللاعب بدل أن تطير متجاوزًا.")
        ],
        solution: "function hunt(enemy, player, speed) {\n  const dx = player.x - enemy.x;\n  const dy = player.y - enemy.y;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n  if (dist > 200) {\n    return { x: enemy.x, y: enemy.y, mode: 'idle' };\n  }\n  if (dist === 0) {\n    return { x: enemy.x, y: enemy.y, mode: 'attack' };\n  }\n  const step = Math.min(speed, dist);\n  return {\n    x: enemy.x + (dx / dist) * step,\n    y: enemy.y + (dy / dist) * step,\n    mode: 'chase'\n  };\n}"
      },
      {
        id: "s-ai-aim", kind: "js", xp: 30, skill: "AI",
        title: E("Aim & fire: projectiles that find their target", "التسديد: قذائف تجد هدفها"),
        brief: E(
          "Ranged enemies need **velocity**, not position — you compute it once and the bullet flies forever (until it hits something):\n\n```javascript\nfunction aim(fx, fy, tx, ty, speed) {\n  const dx = tx - fx, dy = ty - fy;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n  if (dist === 0) return { vx: 0, vy: 0 };   // guard!\n  return {\n    vx: (dx / dist) * speed,   // direction × speed\n    vy: (dy / dist) * speed\n  };\n}\n```\n\nSame recipe as `chase`, different output: a **velocity** the bullet adds to its position every frame: `bullet.x += bullet.vx`. The `dist === 0` guard matters — dividing by zero gives `NaN`, and one `NaN` spreads through every position it touches.",
          "الأعداء بمسافات بعيدة يحتاجون **سرعة متجهة** لا موقعًا — تحسبها مرة واحدة فتطير القذيفة إلى الأبد (حتى تصطدم):\n\n```javascript\nfunction aim(fx, fy, tx, ty, speed) {\n  const dx = tx - fx, dy = ty - fy;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n  if (dist === 0) return { vx: 0, vy: 0 };   // حارس!\n  return {\n    vx: (dx / dist) * speed,   // اتجاه × سرعة\n    vy: (dy / dist) * speed\n  };\n}\n```\n\nنفس وصفة `chase` بمخرج مختلف: **سرعة** تضيفها القذيفة إلى موقعها كل إطار: `bullet.x += bullet.vx`. وحارس `dist === 0` مهم — القسمة على صفر تُنتج `NaN`، و`NaN` واحد يسري في كل موقع تلمسه."),
        task: E("Write `aim(fx, fy, tx, ty, speed)` returning the bullet's velocity `{ vx, vy }` — direction from the shooter to the target scaled exactly to `speed`. If both points are identical, return `{ vx: 0, vy: 0 }` (no NaN!).", "اكتب `aim(fx, fy, tx, ty, speed)` تُرجع سرعة القذيفة `{ vx, vy }` — اتجاه من الرامي إلى الهدف مضروبًا تمامًا في `speed`. وإذا كان النقطتان متطابقتين أعد `{ vx: 0, vy: 0 }` (بلا NaN!)."),
        starter: "function aim(fx, fy, tx, ty, speed) {\n  const dx = tx - fx;\n  const dy = ty - fy;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n\n  // guard against dist === 0, then normalize and scale by speed\n}",
        tests: [
          { label: E("Aiming right gives +vx only", "التسديد يمينًا يعطي +vx فقط"), fn: (s) => { if (!s.aim) return false; const v = s.aim(0, 0, 10, 0, 5); return v.vx === 5 && v.vy === 0; } },
          { label: E("Speed is preserved exactly (3-4-5 triangle)", "السرعة محفوظة تمامًا (مثلث 3-4-5)"), fn: (s) => { if (!s.aim) return false; const v = s.aim(0, 0, 3, 4, 10); return Math.abs(Math.sqrt(v.vx * v.vx + v.vy * v.vy) - 10) < 1e-9; } },
          { label: E("Aiming left gives -vx", "التسديد يسارًا يعطي -vx"), fn: (s) => { if (!s.aim) return false; const v = s.aim(50, 50, 0, 50, 4); return v.vx === -4 && v.vy === 0; } },
          { label: E("Diagonals aim in both axes", "القطر يمسك المحورين معًا"), fn: (s) => { if (!s.aim) return false; const v = s.aim(0, 0, 10, 10, 2); return v.vx > 0 && v.vy > 0; } },
          { label: E("Same point → zero velocity, not NaN", "النقطة نفسها → سرعة صفر لا NaN"), fn: (s) => { if (!s.aim) return false; const v = s.aim(7, 7, 7, 7, 3); return v.vx === 0 && v.vy === 0 && !isNaN(v.vx) && !isNaN(v.vy); } }
        ],
        hints: [
          E("Same recipe as chase: divide the direction by `Math.sqrt(dx * dx + dy * dy)`, then multiply by `speed`.", "نفس وصفة chase: اقسم الاتجاه على `Math.sqrt(dx * dx + dy * dy)` ثم اضرب في `speed`."),
          E("Handle `dist === 0` first — dividing by zero gives NaN, which poisons every position it touches.", "عالج `dist === 0` أولًا — القسمة على صفر تُنتج NaN يلوث كل موقع يلمسه.")
        ],
        solution: "function aim(fx, fy, tx, ty, speed) {\n  const dx = tx - fx;\n  const dy = ty - fy;\n  const dist = Math.sqrt(dx * dx + dy * dy);\n  if (dist === 0) {\n    return { vx: 0, vy: 0 };\n  }\n  return {\n    vx: (dx / dist) * speed,\n    vy: (dy / dist) * speed\n  };\n}"
      },
      {
        id: "p-game-ai", kind: "canvas", xp: 90, project: true, skill: "AI",
        title: E("PROJECT: the swarm hunts you", "مشروع: السرب يصطادك"),
        brief: E(
          "Three enemies, three speeds, one target — you. The arena and renderer are ready; you implement the **brain**: every frame, each enemy closes the distance to the player, then holds once it's close enough to strike.\n\nThis is `hunt` without the awareness gate: pure closing-in, gated by `attackRange` instead. Done right, the swarm tightens around you like a fist — the moment every AI tutorial secretly aims for.",
          "ثلاثة أعداء، ثلاث سرعات، هدف واحد — أنت. الميدان والرسم جاهزان؛ وأنت تنفّذ **الدماغ**: كل إطار، يقلّ كل عدو المسافة إلى اللاعب، ثم يثبت عندما يصبح قريبًا بما يكفي للضرب.\n\nهذا `hunt` بلا بوابة الإدراك: تقارب خالص، مقيّد بـ `attackRange` بدلاً منها. وإن أتقنته، ينطبق السرب حولك كالقبضة — اللحظة التي تستهدفها كل دورة ذكاء اصطناعي في السر."),
        task: E("In `update()`, for every enemy:\n1. compute `dx`, `dy` and `dist` toward the player\n2. if `dist > attackRange` → move it by `(dx / dist) * e.speed`\n3. otherwise leave it still — it's already in attack range", "في `update()`، لكل عدو:\n1. احسب `dx` و`dy` و`dist` نحو اللاعب\n2. إذا `dist > attackRange` → حرّكه بمقدار `(dx / dist) * e.speed`\n3. وإلا اتركه ساكنًا — فهو في مدى الهجوم أصلًا"),
        starter: "<canvas id=\"game\" width=\"300\" height=\"250\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  const player = { x: 150, y: 125 };\n  const enemies = [\n    { x: 40, y: 40, speed: 1.2, color: '#fb7185' },\n    { x: 260, y: 60, speed: 1.0, color: '#fbbf24' },\n    { x: 60, y: 210, speed: 1.4, color: '#a78bfa' }\n  ];\n  const attackRange = 30;\n\n  function update() {\n    enemies.forEach(function (e) {\n      // 1. dx, dy, dist toward the player\n      // 2. if dist > attackRange → e.x += (dx / dist) * e.speed (and y)\n      // 3. else → stay still\n    });\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 250);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(player.x - 8, player.y - 8, 16, 16);\n    enemies.forEach(function (e) {\n      ctx.fillStyle = e.color;\n      ctx.fillRect(e.x - 9, e.y - 9, 18, 18);\n    });\n  }\n\n  function loop() { update(); render(); requestAnimationFrame(loop); }\n  loop();\n</script>",
        tests: [
          { label: E("The arena renders (player + enemies painted)", "الميدان يُرسم (اللاعب والأعداء مرسومون)"), fn: (d) => { const c = d.getElementById('game'); if (!c) return false; try { const p = c.getContext('2d').getImageData(0, 0, 300, 250).data; let painted = 0; for (let i = 3; i < p.length; i += 40) if (p[i] > 0) painted++; return painted > 3; } catch (e) { return false; } } },
          { label: E("Movement is normalized (dx / dist)", "الحركة مُوحدة (dx / dist)"), fn: (d) => { const sc = [...d.querySelectorAll('script')].map(s => s.textContent).join('\n'); return /dx\s*\/\s*dist/.test(sc); } },
          { label: E("Enemies hold once inside attackRange", "الأعداء يثبتون داخل attackRange"), fn: (d) => { const sc = [...d.querySelectorAll('script')].map(s => s.textContent).join('\n'); return /dist\s*>\s*(attackRange|30)/.test(sc); } }
        ],
        hints: [
          E("Inside the forEach: `const dx = player.x - e.x; const dy = player.y - e.y; const dist = Math.sqrt(dx * dx + dy * dy);`", "داخل forEach: `const dx = player.x - e.x; const dy = player.y - e.y; const dist = Math.sqrt(dx * dx + dy * dy);`"),
          E("`if (dist > attackRange && dist > 0) { e.x += (dx / dist) * e.speed; e.y += (dy / dist) * e.speed; }` — the guard keeps the swarm from jittering on top of you.", "`if (dist > attackRange && dist > 0) { e.x += (dx / dist) * e.speed; e.y += (dy / dist) * e.speed; }` — الحارس يمنع السرب من الاهتزاز فوقك.")
        ],
        solution: "<canvas id=\"game\" width=\"300\" height=\"250\" style=\"background:#0b1120\"></canvas>\n<script>\n  const ctx = document.getElementById('game').getContext('2d');\n  const player = { x: 150, y: 125 };\n  const enemies = [\n    { x: 40, y: 40, speed: 1.2, color: '#fb7185' },\n    { x: 260, y: 60, speed: 1.0, color: '#fbbf24' },\n    { x: 60, y: 210, speed: 1.4, color: '#a78bfa' }\n  ];\n  const attackRange = 30;\n\n  function update() {\n    enemies.forEach(function (e) {\n      const dx = player.x - e.x;\n      const dy = player.y - e.y;\n      const dist = Math.sqrt(dx * dx + dy * dy);\n      if (dist > attackRange && dist > 0) {\n        e.x += (dx / dist) * e.speed;\n        e.y += (dy / dist) * e.speed;\n      }\n    });\n  }\n\n  function render() {\n    ctx.clearRect(0, 0, 300, 250);\n    ctx.fillStyle = '#5eead4';\n    ctx.fillRect(player.x - 8, player.y - 8, 16, 16);\n    enemies.forEach(function (e) {\n      ctx.fillStyle = e.color;\n      ctx.fillRect(e.x - 9, e.y - 9, 18, 18);\n    });\n  }\n\n  function loop() { update(); render(); requestAnimationFrame(loop); }\n  loop();\n</script>"
      }
    ]
  }
];

/* ---------------- ROADMAP (languages & technologies per path) ----------------
   One stage per unit, in learning order. "tools" = the languages and
   technologies that stage teaches. "youBuild" = what you can build after it. */
const ROADMAP_DATA = {
  web: [
    {
      id: "w1", emoji: "🧱", color: "#38bdf8",
      title: E("HTML — the skeleton of the web", "HTML — هيكل الويب"),
      tools: ["HTML"],
      youBuild: E("Real multi-page sites: headings, lists, links, images and forms.", "مواقع حقيقية متعددة الصفحات: عناوين وقوائم وروابط وصور ونماذج.")
    },
    {
      id: "w2", emoji: "🎨", color: "#f472b6",
      title: E("CSS — design & layout", "CSS — التصميم والتخطيط"),
      tools: ["CSS", "Flexbox", "Responsive design"],
      youBuild: E("Beautiful pages that adapt to phones, tablets and desktops.", "صفحات جميلة تتكيف مع الهواتف والأجهزة اللوحية والحواسيب.")
    },
    {
      id: "w9", emoji: "📐", color: "#c084fc",
      title: E("CSS Grid — ruling rows and columns", "شبكة CSS — حكم الصفوف والأعمدة"),
      tools: ["CSS Grid", "grid-template", "Named areas", "auto-fit"],
      youBuild: E("Galleries, dashboards and page shells where every cell lines up — on any screen.", "عارضات صور ولوحات تحكم وهيكل صفحات كل خلية فيها تنتظم — على أي شاشة.")
    },
    {
      id: "w3", emoji: "⚡", color: "#fbbf24",
      title: E("JavaScript — the programming language of the web", "JavaScript — لغة برمجة الويب"),
      tools: ["JavaScript", "Variables & types", "Loops", "Functions"],
      youBuild: E("Programs that think: calculators, quizzes and logic that reacts.", "برامج تُفكّر: حاسبات واختبارات ومنطق يتفاعل.")
    },
    {
      id: "w4", emoji: "🕹️", color: "#4ade80",
      title: E("DOM & Events — wiring pages to code", "DOM والأحداث — ربط الصفحات بالكود"),
      tools: ["DOM", "Events", "Forms"],
      youBuild: E("Interactive apps: to-do lists, galleries, live-validated forms.", "تطبيقات تفاعلية: قوائم مهام ومعارض ونماذج تتحقق مباشرة.")
    },
    {
      id: "w7", emoji: "📝", color: "#fb7185",
      title: E("Forms & validation — pages that talk back", "النماذج والتحقق — صفحات تناقشك"),
      tools: ["Forms", "Input types", "Validation", "Regex"],
      youBuild: E("Signup flows that catch mistakes before the server ever sees them.", "تدفقات تسجيل تكتشف الأخطاء قبل أن يراها الخادم أصلًا.")
    },
    {
      id: "w8", emoji: "💾", color: "#34d399",
      title: E("Persistence — data that survives reloads", "الإبقاء على البيانات — معلومات تنجو من إعادة التحميل"),
      tools: ["localStorage", "JSON", "Save files"],
      youBuild: E("Apps with memory: settings, progress and drafts that survive refreshes.", "تطبيقات بذاكرة: إعدادات وتقدّم ومسودات تنجو من التحديث.")
    },
    {
      id: "w5", emoji: "🧩", color: "#a78bfa",
      title: E("Components — thinking like a framework", "المكونات — التفكير كأطر العمل"),
      tools: ["Components", "State", "Templates"],
      youBuild: E("Reusable UI building blocks — the idea behind React and Vue.", "لبنات واجهة قابلة لإعادة الاستخدام — الفكرة التي قامت عليها React وVue.")
    },
    {
      id: "w6", emoji: "🛰️", color: "#38bdf8",
      title: E("APIs & the bigger web", "APIs والويب الأوسع"),
      tools: ["APIs", "JSON", "Fetch"],
      youBuild: E("Apps that talk to the internet: dashboards fed by live data.", "تطبيقات تتحدث مع الإنترنت: لوحات تُغذّى ببيانات حية.")
    }
  ],
  se: [
    {
      id: "e1", emoji: "🔤", color: "#a78bfa",
      title: E("Programming foundations (JavaScript)", "أساسيات البرمجة (جافاسكريبت)"),
      tools: ["JavaScript", "Variables & types", "Logic", "Loops", "Functions"],
      youBuild: E("Clean programs from scratch — the grammar every language shares.", "برامج نظيفة من الصفر — القواعد المشتركة بين كل اللغات.")
    },
    {
      id: "e2", emoji: "📈", color: "#fbbf24",
      title: E("Algorithms — solving problems efficiently", "الخوارزميات — حل المسائل بكفاءة"),
      tools: ["Algorithms", "Searching", "Sorting", "Big-O"],
      youBuild: E("Code that scales: you'll know why one solution beats another.", "كود يتوسع: ستعرف لماذا يتفوق حل على آخر.")
    },
    {
      id: "e3", emoji: "🗂️", color: "#4ade80",
      title: E("Data structures — organizing information", "هياكل البيانات — تنظيم المعلومات"),
      tools: ["Stack", "Queue", "Hash Maps"],
      youBuild: E("The right container for every job — fast lookups, ordered flows.", "الحاوية المناسبة لكل مهمة — بحث سريع وتدفق مرتب.")
    },
    {
      id: "e3r", emoji: "🔁", color: "#fbbf24",
      title: E("Recursion — think in smaller problems", "الاستدعاء الذاتي — فكّر بمسائل أصغر"),
      tools: ["Recursion", "Base cases", "The call stack"],
      youBuild: E("Self-similar solutions: sums, powers and functions that walk nested data of any depth.", "حلول تشبه نفسها: مجاميع وأسس ودوال تمشي على بيانات متداخلة بأي عمق.")
    },
    {
      id: "e3h", emoji: "🧬", color: "#a78bfa",
      title: E("Higher-order functions — code as material", "الدوال العليا — الكود كمادة بناء"),
      tools: ["reduce", "Pipelines", "Closures", "Function factories"],
      youBuild: E("Composable data pipelines and functions that build functions — the style behind modern libraries.", "خطوط معالجة بيانات قابلة للتركيب ودوال تصنع دوالًا — الأسلوب الذي تقف خلفه المكتبات الحديثة.")
    },
    {
      id: "e3p", emoji: "🎓", color: "#34d399",
      title: E("PROJECT — Functional toolbox", "مشروع — صندوق أدوات دالي"),
      tools: ["filter", "reduce", "Options contracts"],
      youBuild: E("A mini data-processing library with a clean options contract — the shape behind real-world toolkits.", "مكتبة معالجة بيانات مصغّرة بعقد خيارات نظيف — شكل أدوات العالم الحقيقي.")
    },
    {
      id: "e3c", emoji: "⚙️", color: "#fb923c",
      title: E("C — close to the metal", "لغة C — قريبًا من العتاد"),
      tools: ["C", "int / double types", "printf", "Compiled thinking"],
      youBuild: E("Compiled programs with strict types and real control of the machine — the language behind operating systems.", "برامج مُترجمة بأنواع صارمة وتحكم حقيقي في الآلة — اللغة التي تقف خلف أنظمة التشغيل.")
    },
    {
      id: "e4", emoji: "🧪", color: "#38bdf8",
      title: E("Engineering craft — working like a pro", "حِرفة الهندسة — العمل كمحترف"),
      tools: ["Git", "Debugging", "Architecture", "Testing"],
      youBuild: E("Code that survives the real world: versioned, tested, structured.", "كود يصمد في العالم الحقيقي: موثّق ومختبر ومنظم.")
    },
    {
      id: "e5", emoji: "🏗️", color: "#a78bfa",
      title: E("Capstone — build a complete app", "المشروع الختامي — ابنِ تطبيقًا كاملًا"),
      tools: ["Architecture", "JavaScript", "Git"],
      youBuild: E("A full application, planned and built like a professional project.", "تطبيق كامل مخطط ومبني كمشروع احترافي.")
    },
    {
      id: "e6", emoji: "🔬", color: "#34d399",
      title: E("Testing — proving your code works", "الاختبارات — إثبات أن كودك يعمل"),
      tools: ["Assertions", "Test suites", "TDD", "expect()"],
      youBuild: E("Self-checking code: a suite that catches your bugs before your users do.", "كود يتحقق من نفسه: حزمة تلتقط أخطاءك قبل أن يلتقطها مستخدموك.")
    }
  ],
  game: [
    {
      id: "g1", emoji: "🎡", color: "#f472b6",
      title: E("The game loop & Canvas", "حلقة اللعبة والكانفس"),
      tools: ["JavaScript", "Canvas", "Animation", "Physics"],
      youBuild: E("Things that move: bouncing worlds drawn 60 times a second.", "أشياء تتحرك: عوالم ترتد تُرسم ٦٠ مرة في الثانية.")
    },
    {
      id: "g2", emoji: "🎯", color: "#fbbf24",
      title: E("Interaction & collisions", "التفاعل والتصادم"),
      tools: ["Input handling", "Collision detection", "Game logic"],
      youBuild: E("Playable action: control a hero, catch, dodge and collide.", "حركة قابلة للعب: تحكم ببطل واقطع وتجنّب واصطدم.")
    },
    {
      id: "g3", emoji: "🧠", color: "#a78bfa",
      title: E("Game systems — AI, states & levels", "أنظمة الألعاب — الذكاء والحالات والمستويات"),
      tools: ["Game AI", "State machines", "Level design", "Game Systems"],
      youBuild: E("Enemies that chase you, win/lose screens, levels that progress.", "أعداء يطاردونك وشاشات فوز وخسارة ومستويات تتقدم.")
    },
    {
      id: "g4", emoji: "🚢", color: "#4ade80",
      title: E("Ship your game", "أطلق لعبتك"),
      tools: ["Game design", "Polish", "Canvas"],
      youBuild: E("A complete, polished game you can share with the world.", "لعبة كاملة مصقولة يمكنك مشاركتها مع العالم.")
    },
    {
      id: "g5", emoji: "⚙️", color: "#fb923c",
      title: E("C++ — the industry's game language", "C++ — لغة صناعة الألعاب"),
      tools: ["C++", "cout", "Classes & objects", "OOP"],
      youBuild: E("The engine mindset: classes, power functions and combo scoring — the language behind Unreal and AAA engines.", "عقلية المحركات: أصناف ودوال الأس ونظام نقاط الكومبو — اللغة التي تقف خلف Unreal والمحركات الكبرى.")
    },
    {
      id: "g6", emoji: "🤖", color: "#f472b6",
      title: E("Smarter enemies — senses & aim", "أعداء أذكى — حواس وتسديد"),
      tools: ["Awareness range", "Enemy states", "Aiming", "Projectiles"],
      youBuild: E("Enemies that notice you, hunt you and shoot at you — combat that feels fair and alive.", "أعداء يلاحظونك ويطاردونك ويطلقون عليك — قتال يبدو عادلًا وحيًا.")
    }
  ]
};

/* ---------------- EXPLORE TOPICS (per path) ---------------- */
const EXPLORE_TOPICS = {
  web: [
    { id: "x-web-resp", emoji: "📱", xp: 5, skill: "Responsive", title: E("Responsive design deep-dive", "تجربة معمقة في التصميم المتجاوب"), body: E("Mobile devices are most of the web. Responsive design = fluid grids (percentages), flexible images, and **media queries** that apply styles by screen width. Mobile-first means: write phone styles as default, then add `@media (min-width: 700px)` upgrades. Test by resizing the browser constantly.", "الأجهزة المحمولة هي معظم الويب. التصميم المتجاوب = شبكات سائلة (نِسَب مئوية) وصور مرنة و **media queries** تطبق الأنماط حسب عرض الشاشة. الجوال أولًا يعني: اكتب أنماط الهاتف كافتراضي ثم أضف ترقيات `@media (min-width: 700px)`. اختبر بتقليص المتصفح باستمرار.") },
    { id: "x-web-a11y", emoji: "♿", xp: 5, skill: "Accessibility", title: E("Accessibility (a11y)", "إتاحة الوصول"), body: E("Great web is for *everyone*: screen-reader users, keyboard-only users, color-blind users. Core habits: semantic tags (`button` not clickable div), `alt` text on images, visible focus states, sufficient color contrast, labels on inputs. Accessible sites are also better SEO'd — it's engineering quality, not charity.", "الويب العظيم *للجميع*: مستخدمو قارئات الشاشة، ومن يتصفح بلوحة المفاتيح، وذوو عمى الألوان. عادات أساسية: وسوم دلالية (`button` لا div قابل للنقر)، نص `alt` للصور، حالات تركيز واضحة، تباين ألوان كافٍ، وتسميات للحقول. المواقع المتاحة أفضل أيضًا في محركات البحث — إنها جودة هندسية لا عمل خيري.") },
    { id: "x-web-deploy", emoji: "🚀", xp: 5, skill: "Deployment", title: E("How websites go live", "كيف تُنشر المواقع"), body: E("Your HTML/CSS/JS files are *static* — upload them to any static host (GitHub Pages, Netlify, Vercel) and you're live worldwide with HTTPS, free. Dynamic sites need a server (Node.js, Python…) plus a database. Deployment used to be scary; today it's often 'drag a folder'. Your projects from this path are deployable right now.", "ملفات HTML/CSS/JS الخاصة بك *ثابتة* — ارفعها لأي استضافة ثابتة (GitHub Pages أو Netlify أو Vercel) وستكون مباشرة عالميًا مع HTTPS مجانًا. المواقع الديناميكية تحتاج خادمًا (Node.js أو Python…) وقاعدة بيانات. النشر كان مخيفًا؛ اليوم غالبًا 'اسحب مجلدًا'. مشاريعك من هذا المسار قابلة للنشر الآن.") },
    { id: "x-web-db", emoji: "🗄️", xp: 5, skill: "Databases", title: E("Databases for web devs", "قواعد البيانات لمطوري الويب"), body: E("A **database** stores data so it survives restarts and serves many users. Two families: **SQL** (tables with rows — PostgreSQL, MySQL; great for structured, related data) and **NoSQL** (documents/JSON — MongoDB; flexible schemas). Backend code queries the DB, wraps results in JSON, and your frontend renders them — the full loop from your dashboard project.", "**قاعدة البيانات** تخزن البيانات لتبقى بعد إعادة التشغيل وتخدم مستخدمين كثيرين. عائلتان: **SQL** (جداول بصفوف — PostgreSQL وMySQL؛ ممتازة للبيانات المنظمة المترابطة) و **NoSQL** (مستندات JSON — MongoDB؛ مخططات مرنة). كود الخادم يستعلم من القاعدة، يلف النتائج في JSON، وواجهتك تعرضها — الحلقة الكاملة من مشروع لوحة البيانات.") }
  ],
  se: [
    { id: "x-se-recursion", emoji: "🌀", xp: 5, skill: "Recursion", title: E("Recursion", "الاستدعاء الذاتي"), body: E("A function that calls itself, on a *smaller* problem, with a **base case** to stop. `factorial(n) = n × factorial(n-1)`, stopping at 0. Recursion shines on trees and nested structures — folders inside folders, DOM inside DOM. Rule: every recursive call must move toward the base case, or it never ends.", "دالة تستدعي نفسها على مسألة *أصغر* مع **حالة أساسية** توقفها. `factorial(n) = n × factorial(n-1)` وتتوقف عند 0. تتألق الاستدعاءات الذاتية مع الأشجار والبنى المتداخلة — مجلدات داخل مجلدات، وDOM داخل DOM. القاعدة: كل استدعاء يجب أن يقترب من الحالة الأساسية وإلا فلن ينتهي أبدًا.") },
    { id: "x-se-testing", emoji: "🧪", xp: 5, skill: "Testing", title: E("Testing your code", "اختبار الكود"), body: E("Professionals verify code with **automated tests** — small programs that call functions with known inputs and assert expected outputs. A failing test pinpoints the bug before users do. Test names read like specs: `sumArray returns 0 for empty array`. The tests you've been passing in this path are exactly this — now imagine writing them first (that's TDD).", "المحترفون يتحققون من الكود **اختبارات آلية** — برامج صغيرة تستدعي الدوال بمدخلات معروفة وتتحقق من المخارج المتوقعة. الاختبار الفاشل يحدد الخطأ قبل المستخدمين. أسماء الاختبارات تُقرأ كمواصفات: `sumArray تُرجع 0 للمصفوفة الفارغة`. الاختبارات التي تجتازها في هذا المسار هي هذا بالضبط — الآن تخيّل أن تكتبها أولًا (هذا TDD).") },
    { id: "x-se-patterns", emoji: "🧩", xp: 5, skill: "Design Patterns", title: E("Design patterns", "أنماط التصميم"), body: E("Patterns are named, reusable solutions to recurring design problems — shared vocabulary for engineers. Examples: **Singleton** (one instance: app config), **Observer** (notify subscribers: chat events), **Factory** (centralize object creation), **Strategy** (swap algorithms at runtime). Don't memorize all 23 — learn them when a problem appears; they're descriptions of good design, not ingredients to sprinkle.", "الأنماط حلول مسماة وقابلة لإعادة الاستخدام لمشاكل تصميم متكررة — مفردات مشتركة بين المهندسين. أمثلة: **Singleton** (نسخة واحدة: إعدادات التطبيق)، **Observer** (إشعار المشتركين: أحداث المحادثة)، **Factory** (توحيد إنشاء الكائنات)، **Strategy** (تبديل الخوارزميات وقت التشغيل). لا تحفظ الثلاثة والعشرين — تعلمها عندما تظهر مسألة؛ فهي وصف لتصميم جيد لا توابل تُرش.") },
    { id: "x-se-api", emoji: "🔌", xp: 5, skill: "APIs", title: E("REST APIs & JSON", "واجهات REST وJSON"), body: E("A **REST API** exposes resources as URLs: `GET /users/7` reads, `POST /users` creates, `PUT/PATCH` updates, `DELETE` removes. Status codes tell the story: 200 OK, 404 not found, 401 unauthorized, 500 server broke. Responses are JSON — objects your frontend immediately understands. Exploring public APIs (weather, movies, space!) is the fastest way to make your projects feel real.", "**واجهة REST** تعرض الموارد كعناوين: `GET /users/7` قراءة، `POST /users` إنشاء، `PUT/PATCH` تحديث، `DELETE` حذف. رموز الحالة تحكي القصة: 200 نجاح، 404 غير موجود، 401 غير مصرح، 500 الخادم تعطل. الردود JSON — كائنات تفهمها واجهتك فورًا. استكشاف الـ APIs العامة (طقس، أفلام، فضاء!) أسرع طريقة لجعل مشاريعك حقيقية.") }
  ],
  game: [
    { id: "x-game-sprites", emoji: "🖼️", xp: 5, skill: "Sprites", title: E("Sprites & spritesheets", "السبرايتات وأوراقها"), body: E("Rectangles are honest but boring. **Sprites** are images drawn to canvas with `ctx.drawImage(img, x, y)`. A **spritesheet** packs all animation frames into one image; each frame you draw a different slice: `drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)`. Changing the slice index every few frames = walking animation. That's how every 2D game characters move.", "المستطيلات صادقة لكنها مملة. **السبرايتات** صور تُرسم على الكانفس بـ `ctx.drawImage(img, x, y)`. و**ورقة السبرايت** تجمع كل إطارات الحركة في صورة واحدة؛ في كل إطار ترسم شريحة مختلفة: `drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)`. تغيير رقم الشريحة كل بضع إطارات = حركة مشي. هكذا تتحرك شخصيات كل الألعاب ثنائية الأبعاد.") },
    { id: "x-game-sound", emoji: "🔊", xp: 5, skill: "Sound", title: E("Sound in games", "الصوت في الألعاب"), body: E("Sound is half the feel. The Web Audio API generates effects with zero files: create an oscillator, set its frequency, play it — instant retro jump/blip/explosion. Layer: music (long loop), effects (short bursts), UI ticks. Even one 'coin' blip at the right moment makes a prototype feel 10× more alive.", "الصوت نصف الإحساس. واجهة Web Audio تولّد المؤثرات بلا أي ملفات صوتية: أنشئ مذبذبًا (`oscillator`) واضبط تردده وشغّله — قفزة أو وميض أو انفجار ريترو فوري. رتّب الطبقات: موسيقى (حلقة طويلة)، مؤثرات (نبضات قصيرة)، نقرات واجهة. حتى صفيرة 'عملة' واحدة في اللحظة الصحيحة تجعل النموذج الأولي أكثر حياة بعشر مرات.") },
    { id: "x-game-particles", emoji: "✨", xp: 5, skill: "Particles", title: E("Particle systems", "أنظمة الجزيئات"), body: E("The cheapest 'wow' in 2D games: spawn 20 small squares/circles at an event point, give each a random velocity, fade them out over 0.5s. Explosions, sparks, rain, smoke, confetti — one array of particles + your existing loop. Pros call it 'juice'; players call it 'this feels great'.", "أرخص \"واو\" في ألعاب ثنائية الأبعاد: أنشئ 20 مربعًا أو دائرة صغيرة عند نقطة الحدث، امنح كل واحدة سرعة عشوائية، ودعها تتلاشى خلال نصف ثانية. انفجارات وشرر ومطر ودخان وقصاصات — مصفوفة جزيئات واحدة + حلقتك الموجودة. المحترفون يسمونها 'العصارة'؛ واللاعبون يقولون 'هذا رائع'.") },
    { id: "x-game-engines", emoji: "🕹️", xp: 5, skill: "Engines", title: E("Game engines & next steps", "محركات الألعاب والخطوة التالية"), body: E("You built the core of an engine yourself: loop, input, collision, states. Full engines wrap these in tools: **Phaser** (JavaScript — your natural next step), **Godot** (free, friendly, 2D/3D), **Unity** (C#, industry standard), **Unreal** (C++, AAA 3D). The concepts transfer 1:1 — a game loop in Godot is the same loop you wrote, with better tooling around it.", "لقد بنيت جوهر محرك بنفسك: حلقة، مدخلات، تصادم، حالات. المحركات الكاملة تلف هذه بأدوات: **Phaser** (جافاسكريبت — خطوتك الطبيعية التالية)، **Godot** (مجاني وودود، ثنائي وثلاثي الأبعاد)، **Unity** (C#، معيار الصناعة)، **Unreal** (C++، ثلاثي الأبعاد الفاخر). المفاهيم تنتقل 1:1 — حلقة اللعبة في Godot هي نفس حلقتك التي كتبتها، بأدوات أفضل حولها.") },
    { id: "x-game-unity", emoji: "🎮", xp: 5, skill: "Unity", title: E("Unity: where most indies start", "Unity: حيث يبدأ أغلب المستقلين"), body: E("**Unity** runs everything from game-jam prototypes to *Among Us* and *Genshin Impact* — the friendliest of the big engines. You write **C#**: every scene object is a component, and Unity calls its `Update()` for you about 60 times a second — the game loop you already built on canvas, plumbing included. Collision, sprites, input, scenes and states: you know *what* to build; Unity hands you tools instead of `ctx.fillRect`. Huge Asset Store, solid 2D, one-click builds to desktop, mobile, web and consoles — free while you earn under $200k a year.", "يشغّل **Unity** كل شيء من نماذج *الـ game jams* إلى *Among Us* و*Genshin Impact* — وأسهل المحركات الكبيرة للانطلاق. تكتب **C#**: كل عنصر في المشهد *مكوّن* (component)، وUnity تستدعي `Update()` نيابة عنك نحو 60 مرة في الثانية — حلقة اللعبة التي بنيتها على الكانفس من قبل، بكل الخدمات جاهزة. التصادم وحركة السبرايتات والإدخال والمشاهد والحالات: أنت تعرف *ماذا* تريد بناءه؛ Unity تعطيك أدوات بدل `ctx.fillRect`. متجر أصول ضخم، ودعم صلب للـ2D، وبناء بنقرة واحدة للحواسيب والجوال والويب والأجهزة — مجانًا حتى دخولك أقل من 200 ألف دولار سنويًا.") },
    { id: "x-game-unreal", emoji: "🎬", xp: 5, skill: "Unreal", title: E("Unreal Engine: where AAA games are made", "Unreal Engine: حيث تُصنع ألعاب AAA"), body: E("**Unreal Engine** (from Epic) is the AAA standard — *Fortnite*, *Hellblade* and *Final Fantasy VII Remake* all ship in it. Its core is **C++** — the very language from this path's C++ unit — plus **Blueprints**: visual scripting where you wire nodes instead of typing, so a playable prototype needs no code at all. Its superpower is graphics: **Lumen** real-time global illumination and **Nanite** cinematic-detail geometry, technology that used to demand a render farm. Free until you earn $1M. Heavier than Unity — bigger projects, hungrier machines, steeper start — the price of console-class visuals.", "**Unreal Engine** (من Epic) هو معيار عالم AAA — ألعاب مثل *Fortnite* و*Hellblade* و*Final Fantasy VII Remake* صُنعت به. جوهره **C++** — نفس اللغة التي مررت بها في وحدة C++ من هذا المسار — إضافة إلى **Blueprints**: برمجة بصرية توصّل فيها العقد بدلًا من كتابة الكود، فتبني نموذجًا قابلًا للعب دون سطر برمجي أصلًا. قوته الخفية هي الرسوميات: **Lumen** (إضاءة عالمية فورية) و**Nanite** (هندسة بتفاصيل سينمائية) — تقنيات كانت في يوم من الأيام تحتاج مزرعة رسم. مجانًا حتى تكسب مليون دولار. أثقل من Unity — مشاريع أكبر، وأجهزة أشدّ اشتغالًا، وبداية أقسى — مقابل رؤيات بجودة الكونسول.") }
  ]
};

/* ---------------- gather helpers ---------------- */
function allUnits(pathId) {
  if (pathId === "web") return WEB_UNITS;
  if (pathId === "se") return SE_UNITS;
  if (pathId === "game") return GAME_UNITS;
  return [];
}
function allSteps(pathId) {
  return allUnits(pathId).flatMap(u => u.steps);
}
function findStep(stepId) {
  for (const p of PATHS) {
    for (const u of allUnits(p)) {
      const s = u.steps.find(s => s.id === stepId);
      if (s) return { step: s, unit: u, path: p };
    }
  }
  return null;
}
function stepTitle(step) { return step.title[State.data.language === "ar" ? "ar" : "en"] || step.title.en; }
function L(obj) { // localized getter for {en,ar} or {en:[],ar:[]}
  const lang = State.data.language === "ar" ? "ar" : "en";
  const v = obj && obj[lang] !== undefined ? obj[lang] : (obj && obj.en);
  return v;
}
function pathName(pathId) { return I18N[State.data.language === "ar" ? "ar" : "en"].paths[pathId].name; }
