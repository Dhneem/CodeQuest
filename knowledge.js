/* ============================================================
   CodeQuest — knowledge.js
   Bilingual Q&A knowledge base powering General Chat,
   Path Chats, and the Socratic AI Mentor.
   Each topic: matchers (en+ar), Socratic reply builder, direct answer.
   ============================================================ */

/* ---------- Socratic flow helpers ---------- */

const SOCRATIC = {
  en: {
    opening: [
      "Good question — let's figure it out together instead of me just handing you the answer.",
      "Let's build this up step by step — you'll remember it far better that way.",
      "I could just tell you… but you'd grow more by discovering it. Let's dig in."
    ],
    askWhatHappens: "First, tell me what's actually happening: what did you expect, and what did you get instead?",
    askWhy: "Why do you think it's happening? Look at the failing part and describe it in one sentence.",
    askInvestigate: "What could you check to narrow it down? (A `console.log` right before the problem is a great start.)",
    askIdentify: "Can you now point at the exact line or value that's wrong?",
    hintOffer: "Want a hint, or do you want to try your idea first?",
    directAsk: "Or if you'd rather, ask me to explain the concept and I'll walk you through it."
  },
  ar: {
    opening: [
      "سؤال جميل — لنكتشف الجواب معًا بدلًا من أن أعطيك إياه جاهزًا.",
      "لنبنِ الفكرة خطوة بخطوة — ستبقى في ذاكرتك أفضل بكثير هكذا.",
      "أستطيع أن أخبرك مباشرة… لكنك ستتطور أكثر إذا اكتشفتها بنفسك. لنبدأ."
    ],
    askWhatHappens: "أولًا، صف لي ما يحدث فعلًا: ماذا توقعت، وماذا حصلت بدلًا منه؟",
    askWhy: "لماذا تظن أنه يحدث؟ انظر إلى الجزء الذي يفشل ووصفه في جملة واحدة.",
    askInvestigate: "ماذا يمكنك أن تفحص لتضيّق الاحتمالات؟ (طباعة `console.log` قبل المشكلة مباشرة بداية ممتازة.)",
    askIdentify: "هل تستطيع الآن تحديد السطر أو القيمة المخطئة بالضبط؟",
    hintOffer: "أتريد تلميحًا، أم تجرّب فكرتك أولًا؟",
    directAsk: "أو إن أحببت، اطلب مني شرح المفهوم وسأمشي معك فيه خطوة بخطوة."
  }
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ============================================================
   TOPIC LIBRARY
   match: array of lowercase substrings (en + ar)
   socratic: function(lang, ctx) -> string  (mentoring reply)
   answer:   function(lang, ctx) -> string  (direct explanation)
   ctx = { path, progressPct, unitTitle, nextStepTitle }
   ============================================================ */

const TOPICS = [

  /* ---------- GENERAL ---------- */
  {
    id: "what-is-programming",
    match: ["what is programming", "ما هي البرمجة", "معنى البرمجة", "what programming means", "what does programming"],
    socratic: (lang) => lang === "ar"
      ? "سؤال التأسيس الأول 👌 قبل أن أعطيك تعريفي، جرّب أنت: عندما تضغط زر \"إعجاب\" في تطبيق، ماذا يجب أن يحدث في الخلفية؟ اكتب لي قائمة من 3 خطوات."
      : "The founding question 👌 Before I give you my definition, try this: when you tap a \"like\" button in an app, what must happen behind the scenes? Write me a list of 3 steps.",
    answer: (lang) => lang === "ar"
      ? "البرمجة هي فن تحويل الأفكار إلى تعليمات يفهمها الحاسوب وينفذها بدقة.\n\nالفكرة الجوهرية: الحاسوب أسرع منك مليون مرة لكنه أغبى منك مليون مرة — ينفذ بالضبط ما تقوله، لا ما تقصده.\n\nلذلك البرمجة مهارتان في واحدة:\n١. التفكير المنطقي: تفكيك المشكلة الكبيرة إلى خطوات صغيرة دقيقة.\n٢. لغة التعبير: كتابة هذه الخطوات بلغة يفهمها الحاسوب (جافاسكريبت، بايثون…).\n\nكل تطبيق تستخدمه — من آلة حاسبة إلى يوتيوب — في النهاية قائمة تعليمات كتبها بشر مثلك. في كودكويست ستتعلم هذا بالممارسة: لا تقرأ عن البرمجة، بل اكتبها من أول دقيقة. 🚀"
      : "Programming is the craft of turning ideas into instructions a computer can execute precisely.\n\nThe core insight: a computer is a million times faster than you and a million times more literal — it does exactly what you *say*, not what you *mean*.\n\nSo programming is two skills in one:\n1. Logical thinking: break a big problem into small, precise steps.\n2. Expression: write those steps in a language the computer understands (JavaScript, Python…).\n\nEvery app you use — from a calculator to YouTube — is ultimately a list of instructions written by humans like you. In CodeQuest you learn this by doing: you don't read about programming, you write it from minute one. 🚀"
  },
  {
    id: "first-language",
    match: ["which language", "which programming language", "best language", "أفضل لغة", "ما اللغة", "أبدأ بأي لغة", "first programming language", "لغة أبدأ"],
    socratic: (lang) => lang === "ar"
      ? "قبل أن أرشّح لك لغة: ماذا تريد أن *تبني*؟ موقعًا؟ لعبة؟ تطبيقًا يظهر على الهاتف؟ أخبرني بهدفك، وسنشتق منه اللغة — هذا عقلية المهندس: من الهدف إلى الأداة."
      : "Before I recommend a language: what do you want to *build*? A website? A game? An app on your phone? Tell me the goal and we'll derive the language from it — that's engineer thinking: from goal to tool.",
    answer: (lang) => lang === "ar"
      ? "الحقيقة المريحة: لغتك **الأولى** أهمية أقل من أن تبدأ أصلًا. لكن إليك الإجابة العملية:\n\n🌐 تريد بناء مواقع وتطبيقات ويب؟ ← **جافاسكريبت** بلا تردد. تعمل في المتصفح فورًا، وتنقلب واجهة وخلفية، وتستخدمها كل شركات الويب.\n\n📊 تحب التحليل والذكاء الاصطناعي والأتمتة؟ ← **بايثون**. أقرب لغة للإنجليزية/العربية، وأشهر لغة تعليمية في العالم.\n\n🎮 الألعاب تخطفك؟ ← ابدأ بجافاسكريبت على المتصفح (كما في مسار الألعاب هنا)، ثم انقل لمحركات مثل Godot أو Unity.\n\nالسر الذي لا يخبرك به أحد: بعد إتقان لغتك الأولى، تتعلم الثانية في جزء من الوقت — لأن المفاهيم (المتغيرات، الحلقات، الدوال) مشتركة، وما تتعلمه فعليًا هو الصياغة.\n\nتوصيتي: جافاسكريبت إن كنت من المسار العملي «ابني وارى النتيجة». وبما أنك هنا… مسار الويب يبدأ بها مباشرة 😉"
      : "The comforting truth: your *first* language matters less than simply starting. But here's the practical answer:\n\n🌐 Want to build websites and web apps? → **JavaScript**, no contest. It runs in the browser instantly, doubles as frontend AND backend, and powers the entire web industry.\n\n📊 Into data, AI, or automation? → **Python**. Closest language to plain English, and the world's most popular teaching language.\n\n🎮 Games pull at you? → Start with JavaScript in the browser (exactly what the Game path here does), then move to engines like Godot or Unity.\n\nThe secret nobody tells you: after your first language, the second takes a fraction of the time — because the concepts (variables, loops, functions) are shared. You're really just learning new spelling.\n\nMy advice: JavaScript if you're the hands-on \"build and see\" type. And since you're here… the Web path starts with exactly that 😉"
  },
  {
    id: "how-db",
    match: ["database", "قواعد البيانات", "قاعدة البيانات", "how do databases", "sql", "مونغو", "mongo"],
    socratic: (lang) => lang === "ar"
      ? "لنفكر فيها من الصفر: افتح تطبيق ملاحظاتك وأطفئ الهاتف وافتحه من جديد — لماذا بقيت الملاحظات؟ أين تظن أنها مخزنة؟"
      : "Let's reason from zero: open your notes app, turn the phone off, open it again — why are the notes still there? Where do you think they're stored?",
    answer: (lang) => lang === "ar"
      ? "قاعدة البيانات هي مخزن منظم للبيانات يبقى بعد إغلاق البرنامج ويخدم آلاف المستخدمين معًا.\n\nتخيل ملف إكسل عملاق وفائق السرعة ومحمي:\n\n🗂 **العائلة الأولى — SQL** (PostgreSQL، MySQL): بيانات في **جداول** — صفوف وأعمدة. مثالية عندما تكون بياناتك منظمة ومترابطة: `users` جدول و`orders` جدول وكل طلب مرتبط بمستخدم. تستعلم بلغة SQL: `SELECT * FROM users WHERE age > 18;`\n\n📄 **العائلة الثانية — NoSQL** (MongoDB): بيانات في **مستندات** JSON مرنة. ممتازة عندما يتغير شكل البيانات كثيرًا أو تتوسع أفقيًا.\n\nكيف تتكامل مع ما تتعلمه؟ خادمك يستقبل طلب الواجهة، يستعلم من القاعدة، يلف النتيجة JSON ويرسلها — وواجهتك تعرضها. هذه بالضبط دورة «الطلب ← البيانات ← العرض» التي مارستها في مشروع لوحة البيانات بمسار الويب."
      : "A database is an organized data store that survives restarts and serves thousands of users at once.\n\nPicture a giant, extremely fast, protected spreadsheet:\n\n🗂 **Family 1 — SQL** (PostgreSQL, MySQL): data in **tables** — rows and columns. Perfect for structured, related data: a `users` table, an `orders` table, every order linked to a user. You query with SQL: `SELECT * FROM users WHERE age > 18;`\n\n📄 **Family 2 — NoSQL** (MongoDB): data in flexible **JSON documents**. Excellent when your data shape changes often or you need to scale horizontally.\n\nHow it connects to what you're learning: your server receives a request, queries the database, wraps the result in JSON and sends it — and your frontend renders it. That's exactly the \"request → data → render\" loop you practiced in the Web path's dashboard project."
  },
  {
    id: "what-is-api",
    match: ["api", "واجهات api", "واجهة برمجة", "ما هي ال api", "ما هي api", "rest"],
    socratic: (lang) => lang === "ar"
      ? "إليك صورة ذهنية أولًا: في مطعم، أنت لا تدخل المطبخ. ماذا تفعل لتأكل؟ وبعد أن تجيب، اربطها: من هو \"الجرسون\" في تطبيق الطقس على هاتفك؟"
      : "Here's a mental picture first: at a restaurant, you never enter the kitchen. What do you do to get food? Once you've answered — who is the \"waiter\" in your phone's weather app?",
    answer: (lang) => lang === "ar"
      ? "**API = واجهة برمجة التطبيقات**: عقد يسمح لبرنامجين بالتحدث دون أن يعرف أحدهما تفاصيل الآخر الداخلية.\n\nمثال المطعم كامل: أنت (تطبيقك) تنظر إلى **قائمة الطعام** (توثيق الـ API)، تطلب عبر **الجرسون** (طلب HTTP)، والمطبخ (الخادم) يعد ويُرجع الطبق (استجابة JSON). أنت لا تحتاج معرفة كيف يعمل المطبخ — فقط كيف تطلب.\n\nفي الويب:\n```\nGET  /api/weather?city=Riyadh   ← اقرأ البيانات\nPOST /api/orders                ← أنشئ طلبًا\n```\n\nوبجافاسكريبت:\n```javascript\nconst res = await fetch('/api/weather?city=Riyadh');\nconst data = await res.json();\n```\n\nلماذا هذا مهم لمسارك؟ لأن كل تطبيق حقيقي = واجهة أمامية + خادم + API يربطهما. مشروع لوحة البيانات في مسار الويب يحاكي هذا النمط ببيانات وهمية — ونمط الكود نفسه هو الذي سيصل للإنتاج."
      : "**API = Application Programming Interface**: a contract that lets two programs talk without either knowing the other's internals.\n\nThe restaurant example, complete: you (your app) read the **menu** (API docs), order through the **waiter** (HTTP request), and the kitchen (server) prepares and returns the dish (JSON response). You never need to know how the kitchen works — only how to order.\n\nOn the web:\n```\nGET  /api/weather?city=Riyadh   ← read data\nPOST /api/orders                ← create an order\n```\n\nIn JavaScript:\n```javascript\nconst res = await fetch('/api/weather?city=Riyadh');\nconst data = await res.json();\n```\n\nWhy this matters for your path: every real app = frontend + server + an API connecting them. The dashboard project in the Web path simulates this with mock data — and the exact code pattern is what ships to production."
  },
  {
    id: "after-js",
    match: ["after javascript", "after js", "ماذا بعد جافاسكريبت", "ماذا أتعلم بعد", "next after javascript", "بعد الجافاسكريبت"],
    socratic: (lang) => lang === "ar"
      ? "سؤال جيد — لكن اقلبه أولًا: ما الذي بنيت *فعليًا* بجافاسكريبت حتى الآن؟ وما الشيء الذي حاولت بناءه ووجدت أنه صعب؟ الجواب غالبًا هو \"التالي\" الصحيح."
      : "Good question — but flip it first: what have you *actually built* with JavaScript so far? And what did you try to build that felt hard? That answer is usually the right \"next\".",
    answer: (lang) => lang === "ar"
      ? "بعد أساسيات جافاسكريبت، المسارات الطبيعية حسب هدفك:\n\n1️⃣ **تعمّق في المتصفح**: DOM المتقدم، الأحداث، `fetch` والـ APIs، التخزين المحلي — هذا ما يحول السكربتات لتطبيقات حقيقية (موجود في وحدات مسار الويب المتقدمة هنا).\n\n2️⃣ **إطار عمل**: **React** هو الأشهر عالميًا — فكرته الجوهرية «المكونات + الحالة» شرحناها في مسار الويب، وفهمك لها بلا إطار يجعلك تتعلمه أسرع من 90% من المبتدئين.\n\n3️⃣ **الواجهة الخلفية**: **Node.js** — نفس لغتك على الخادم! قواعد بيانات، REST APIs، مصادقة. هذا يفتح باب \"المطور المتكامل\".\n\n4️⃣ **لغة ثانية**: بايثون إن أردت الذكاء الاصطناعي/البيانات، أو TypeScript لتحويل جافاسكريبت لنسخة مؤسسية آمنة.\n\nنصيحتي الصادقة: لا تجمع كلها. اختر مشروعًا تريد بناءه، وتعلم ما يخدمه — الحاجة هي أفضل مناهج التعلم."
      : "After JavaScript fundamentals, the natural roads depend on your goal:\n\n1️⃣ **Go deeper in the browser**: advanced DOM, events, `fetch` & APIs, local storage — this turns scripts into real apps (covered in the later units of the Web path here).\n\n2️⃣ **A framework**: **React** is the world's most popular — its core idea \"components + state\" is explained in the Web path, and understanding it framework-free puts you ahead of 90% of beginners.\n\n3️⃣ **The backend**: **Node.js** — your same language on the server! Databases, REST APIs, authentication. This opens the \"full-stack developer\" door.\n\n4️⃣ **A second language**: Python for AI/data, or TypeScript to make JavaScript enterprise-safe.\n\nMy honest advice: don't collect them all. Pick a project you want to build and learn what serves it — need is the best curriculum."
  },
  {
    id: "python-vs-cpp",
    match: ["python vs", "python or c++", "difference between python", "بايثون أم", "الفرق بين بايثون", "c++ أم بايثون", "python مقابل"],
    socratic: (lang) => lang === "ar"
      ? "خمن أولًا: أيهما يقترب أكثر من لغة البشر، وأيهما يقترب من لغة الآلة؟ ولماذا تظن أن هذا يهم للأداء؟"
      : "Guess first: which one is closer to human language, and which is closer to the machine? And why do you think that matters for performance?",
    answer: (lang) => lang === "ar"
      ? "الفرق الجوهري في مستوى التحكم مقابل مستوى الراحة:\n\n🐍 **بايثون** — قريبة من الإنجليزية: `print(\"مرحبًا\")` وهذا كل شيء. مفسَّرة: تكتب سطرًا وترى النتيجة. تتألق في: الذكاء الاصطناعي، تحليل البيانات، الأتمتة، تعليم البرمجة. أبطأ وقت تشغيل، لكن أسرع *تطويرًا*.\n\n⚙️ **C++** — قريبة من العتاد: تدير الذاكرة بنفسك، وتتحكم بكل بايت. مُترجمة مباشرة لغة الآلة — أسرع من الصاروخ. تتألق في: محركات الألعاب، أنظمة التشغيل، المتصفحات، أي شيء يصرخ \"أريد سرعة\". أصعب في التعلم، وأي خطأ صغير = عواقب.\n\nتشبيه: بايثون سيارة أوتوماتيك مريحة، وC++ ناقل توقيت يدوي بقدرة خارقة — كل شيء بين يديك.\n\nالنصيحة: ابدأ ببايثون إن كان هدفك البيانات/الذكاء الاصطناعي، أو بجافاسكريبت إن كان الويب. وC++ تأتي لاحقًا عندما تحتاج سرعتها فعلًا — والمفاهيم التي ستتعلمها هنا ستنتقل إليها مباشرة."
      : "The essential difference is control vs comfort:\n\n🐍 **Python** — near-English: `print(\"hello\")` and you're done. Interpreted: write a line, see the result. Queen of: AI, data analysis, automation, teaching. Slower at runtime, but faster to *develop*.\n\n⚙️ **C++** — near-the-metal: you manage memory, control every byte. Compiled straight to machine code — rocket fast. Queen of: game engines, operating systems, browsers, anything that screams \"I need speed\". Harder to learn, and small mistakes have consequences.\n\nAnalogy: Python is a comfortable automatic car; C++ is a manual racing gearbox with insane power — everything in your hands.\n\nAdvice: start with Python if your goal is data/AI, or JavaScript if it's the web. C++ comes later, when you actually need its speed — and the concepts you learn here transfer to it directly."
  },
  {
    id: "what-is-cpp",
    match: ["c++", "cpp", "cout", "سي بلس", "سي++", "سي بلوس"],
    socratic: (lang) => lang === "ar"
      ? "محرك Unreal ومعظم محركات الألعاب الكبرى مكتوبة بلغة C++. قبل أن أخبرك لماذا: ماذا تحتاج اللعبة من لغتها، شيء لا تحتاجه صفحة الويب تقريبًا؟"
      : "Unreal Engine and most AAA game engines are written in C++. Before I tell you why: what does a game need from its language that a website almost never does?",
    answer: (lang) => lang === "ar"
      ? "**C++ = C + القدرة على تنظيم الكود في أصناف (Classes).**\n\n- لغة **C** أعطتك التحكم الكامل بالآلة (تتعلمها في مسار الهندسة هنا).\n- **C++** بنى عليها Bjarne Stroustrup نفس القوة، لكن أضاف **البرمجة الكائنية OOP**: تصف «صنفًا» مثل `Player` له بيانات (صحة، سرعة) وسلوك (هجوم، قفز)، ثم تنشئ منه كائنات.\n\nلماذا تعشقها الألعاب؟ كل إطار (60 في الثانية) يجب أن يُحدّث آلاف الكائنات وتُرسم خلال 16 مللي ثانية. لا مجال للبطء — والاصناف تجعل تنظيم آلاف الكائنات ممكنًا.\n\nفي مسار الألعاب هنا وحدة كاملة تتعلم فيها C++ عمليًا: أول برنامج `cout`، دوال القوى، فكرة الأصناف، ثم مشروع نظام نقاط الكومبو."
      : "**C++ = C + the power to organize code into classes.**\n\n- **C** gave you total control of the machine (you learn it in the Software Engineering path here).\n- **C++** kept all of that, and Bjarne Stroustrup added **object-oriented programming (OOP)**: you describe a \"class\" like `Player` with data (health, speed) and behavior (attack, jump), then create objects from it.\n\nWhy games love it: every frame (60 per second) must update and draw thousands of objects within 16 milliseconds. There's no room for slowness — and classes make organizing thousands of objects possible.\n\nThe Game path here has a full unit where you learn C++ hands-on: your first `cout` program, power functions, the idea of classes, then a combo-scoring project."
  },
  {
    id: "what-is-c",
    match: ["what is c ", "what is c?", "learn c ", "why c ", "why c?", "c language", "لغة سي", "ما هي لغة c", "لماذا لغة c", "تعلم لغة c", "لغة c"],
    socratic: (lang) => lang === "ar"
      ? "أنت تكتب جافاسكريبت الآن. تخيل لغة لا تخفي الآلة عنك: من يحدد نوع كل متغير؟ ومن يحدد متى تُحرَّر الذاكرة؟ وماذا يترتب على ذلك من قوة ومسؤولية؟"
      : "You're writing JavaScript right now. Imagine a language that doesn't hide the machine from you: who decides every variable's type? Who decides when memory is freed? And what power — and responsibility — does that create?",
    answer: (lang) => lang === "ar"
      ? "**C هي الأم التي ورثتها معظم اللغات** — وقد كُتبت بها أنظمة التشغيل (Linux، نواة Windows) وقواعد البيانات والأجهزة المدمجة في سيارتك وغسّالتك.\n\nما يجعلها مختلفة:\n- **مُترجمة لا مفسَّرة**: كودك يتحول إلى لغة الآلة قبل التشغيل — سرعة هائلة.\n- **أنواع صارمة**: تقول `int x` أو `double y` مسبقًا، ولا تتغير أبدًا.\n- **ذاكرة يدوية**: أنت تطلب الذاكرة (`malloc`) وتعيدها (`free`) — ولا يوجد جامع نفايات يتخلص من القيم عنك.\n\nمن يتعلمها يحصل على شيء لا يعطيه أي موقع تعليمي آخر: فهم لماذا تعمل الحواسيب كما تعمل. في مسار الهندسة هنا وحدة «C — قريبًا من العتاد» تبدأ بأول برنامج `printf` وتنتهي بخدعة قسمة الأعداد الصحيحة لاستخراج الأرقام."
      : "**C is the mother tongue most languages inherited** — operating systems (Linux, the Windows kernel), databases, and the embedded computers in your car and washing machine are written in it.\n\nWhat makes it different:\n- **Compiled, not interpreted**: your code becomes machine language before it runs — enormous speed.\n- **Strict types**: you declare `int x` or `double y` up front, and it never changes.\n- **Manual memory**: you request memory (`malloc`) and return it (`free`) — no garbage collector sweeping behind you.\n\nLearning it gives you something no other tutorial gives: an understanding of *why* computers work the way they do. The Software Engineering path here has a \"C — close to the metal\" unit that starts at your first `printf` and ends with the int-division trick for extracting digits."
  },

  /* ---------- WEB PATH ---------- */
  {
    id: "how-html-works",
    match: ["html", "how does html", "كيف تعمل html", "ما هي html", "وسوم"],
    socratic: (lang, ctx) => lang === "ar"
      ? "دعنا نجرب: افتح أي صفحة ويب الآن واضغط Ctrl+U (عرض المصدر) — ماذا ترى؟ نصوص كثيرة بين علامات `<>`. توقع: ما وظيفة هذه العلامات؟"
      : "Try this: open any webpage right now and press Ctrl+U (view source) — what do you see? Lots of text between `<>` marks. Predict: what is the job of those marks?",
    answer: (lang, ctx) => (lang === "ar"
      ? "HTML هي **لغة الوصف الهيكلي** للمتصفح: أنت لا \"تبرمج\" منطقًا، بل تصف *ما هي* كل قطعة في الصفحة.\n\n```html\n<h1>عنواني</h1>      ← علامة «هذا عنوان رئيسي»\n<p>فقرة نصية</p>     ← علامة «هذه فقرة»\n<img src=\"cat.jpg\"> ← «صورة من هنا»\n```\n\nالمتصفح يقرأ ملفك من الأعلى للأسفل ويبني من كل وسم **عقدة** في شجرة تسمى DOM — ثم يرسم الشجرة على الشاشة.\n\nالقاعدة الذهبية: الوسم يفتح `<h1>` ومحتوى بداخله ثم يغلق `</h1>`. ما تفتحه آخرًا تُغلقه أولًا — صناديق متداخلة.\n\nهل تعلم؟ كل صفحة زرتها في حياتك — يوتيوب، ويكيبيديا، البنك — مبنية بنفس هذه الوسوم البسيطة. في أول وحدة من مسار الويب هنا ستبني صفحتك بنفسك خلال دقائق."
      : "HTML is the browser's **structure-description language**: you don't program logic, you describe *what each piece of the page is*.\n\n```html\n<h1>My title</h1>      ← marks \"this is a main heading\"\n<p>A text paragraph</p> ← marks \"this is a paragraph\"\n<img src=\"cat.jpg\">    ← \"an image from here\"\n```\n\nThe browser reads your file top to bottom and turns every tag into a **node** in a tree called the DOM — then paints that tree to the screen.\n\nGolden rule: a tag opens `<h1>`, content lives inside, then it closes `</h1>`. Last opened, first closed — nested boxes.\n\nFun fact: every page you've ever visited — YouTube, Wikipedia, your bank — is built from these same simple tags. In the first unit of the Web path here, you'll build one yourself within minutes.")
    + (ctx && ctx.path === "web" ? (lang === "ar" ? "\n\n📍 أنت الآن في مسار الويب — الوحدة الحالية: " + ctx.unitTitle + ". الخطوة القادمة في خطتك: " + ctx.nextStepTitle + "." : "\n\n📍 You're on the Web path — current unit: " + ctx.unitTitle + ". Next up in your plan: " + ctx.nextStepTitle + ".") : "")
  },
  {
    id: "center-div",
    match: ["center a div", "center div", "أوسط div", "توسيط", "أوسط عنصر", "وسّط", "align center"],
    socratic: (lang) => lang === "ar"
      ? "سؤال أسطوري 😄 قبل الحل: توسيط *أفقي* أم *رأسي* أم الاثنان؟ وماذا تتوقع أن يعني `display: flex` للحاوية الأم؟"
      : "The legendary question 😄 Before the answer: centering *horizontally*, *vertically*, or both? And what do you expect `display: flex` on the *parent* to do?",
    answer: (lang) => lang === "ar"
      ? "الحل الحديث (والجميل في أنه 3 أسطر):\n\n```css\n.parent {\n  display: flex;\n  justify-content: center;  /* أفقي */\n  align-items: center;      /* رأسي */\n}\n```\n\nالشرط الوحيد: هذه الخصائص توضع على **الأب**، وهي تحكم أبناءه. `display: flex` تحول الأب إلى حاوية مرنة، والعنصران يوازنان أبناءها على المحورين.\n\nبديل أنيق لعنصر واحد غير متوقع الحجم:\n\n```css\n.child {\n  display: grid;\n  place-items: center;\n}\n```\n\nوللتوسيط الأفقي فقط لنص أو عنصر بعرض محدد: `margin-inline: auto;` — وهي الأفضل في صفحات RTL لأنها تحترم الاتجاه تلقائيًا. جرب الثلاثة في أي تحدي CSS في مسارك!"
      : "The modern answer (beautifully, it's 3 lines):\n\n```css\n.parent {\n  display: flex;\n  justify-content: center;  /* horizontal */\n  align-items: center;      /* vertical */\n}\n```\n\nOne requirement: these properties go on the **parent** — they control its children. `display: flex` turns the parent into a flex container that centers its children on both axes.\n\nA slick alternative for one unknown-size element:\n\n```css\n.child {\n  display: grid;\n  place-items: center;\n}\n```\n\nFor horizontal-only centering of text or a fixed-width element: `margin-inline: auto;` — best in RTL pages because it respects direction automatically. Try all three in any CSS challenge on your path!"
  },
  {
    id: "js-not-working",
    match: ["not working", "لا يعمل", "لا تعمل", "doesn't work", "doesn t work", "خطأ", "error", "خطا", "bug", "مشكلة في الكود", "broken"],
    socratic: (lang) => lang === "ar"
      ? "لنكن محققين 🕵️ ثلاثة أسئلة:\n١. ما الذي *يتوقع* أن يحدث بالضبط؟\n٢. ما الذي يحدث *فعليًا*؟ (لا شيء؟ رسالة خطأ حمراء؟ نتيجة خاطئة؟)\n٣. هل جربت `console.log` فوق السطر المشتبه به لترى القيمة؟\n\nأجبني عن الثلاثة وسنضيّق الدائرة معًا."
      : "Let's be detectives 🕵️ Three questions:\n1. What is *supposed* to happen, exactly?\n2. What actually happens? (Nothing? A red error? Wrong result?)\n3. Have you tried a `console.log` right above the suspect line to inspect the value?\n\nAnswer all three and we'll narrow it down together.",
    answer: (lang) => lang === "ar"
      ? "إليك خارطة أخطاء جافاسكريبت الأكثر شيوعًا للمبتدئين — 90% من الحالات تقع هنا:\n\n🔴 **`xxx is not defined`** ← كتبت الاسم بشكل خاطئ، أو استخدمته قبل تعريفه. جافاسكريبت حساسة لحالة الأحرف: `myName ≠ myname`.\n\n🔴 **`is not a function`** ← تستدعي دالة على شيء ليس منها. اطبع `console.log(typeof x)` وارى.\n\n🔴 **`Cannot read properties of null`** ← العنصر غير موجود وقت البحث: إما معرف خاطئ في `getElementById` أو السكربت يعمل قبل وجود الوسم. الحل: ضع السكربت في آخر `body` أو استخدم `defer`.\n\n🔴 **لا شيء يحدث إطلاقًا** ← افحص Console بمفتاح F12 أولًا — الخطأ الأحمر يقول لك السطر والسبب. ثم تأكد أن اسم الحدث نص صحيح: `'click'` وليس `onClick`.\n\n🔴 **نتيجة غريبة** ← مشكلة أنواع غالبًا: `\"5\" + 5` تساوي `\"55\"`! حوّل بالأرقام: `Number(x)`.\n\nوالعادة الذهبية: غيّر شيئًا واحدًا فقط، ثم أعد التشغيل. من يغير خمسة أشياء معًا لا يعرف أيها كان السبب 🎯"
      : "Here's the beginner's map of the most common JavaScript errors — 90% of cases live here:\n\n🔴 **`xxx is not defined`** → misspelled name, or used before it's defined. JS is case-sensitive: `myName ≠ myname`.\n\n🔴 **`is not a function`** → calling a method on something that doesn't have it. Print `console.log(typeof x)` and look.\n\n🔴 **`Cannot read properties of null`** → the element didn't exist when you searched: either a wrong id in `getElementById`, or the script runs before the tag exists. Fix: put the script at the end of `body`, or use `defer`.\n\n🔴 **Nothing happens at all** → open the Console with F12 first — the red error tells you the line and reason. Then check the event name is the exact string: `'click'`, not `onClick`.\n\n🔴 **Weird result** → usually a type surprise: `\"5\" + 5` is `\"55\"`! Convert with `Number(x)`.\n\nAnd the golden habit: change exactly ONE thing, then re-run. Whoever changes five things at once never learns which one was the culprit 🎯"
  },
  {
    id: "when-react",
    match: ["react", "ريأكت", "رياكت", "vue", "angular", "framework", "إطار عمل", "فريم ورك"],
    socratic: (lang, ctx) => lang === "ar"
      ? "قبل الإجابة: تخيل أنك تبني قائمة مهام فيها 100 عنصر، والمستخدم يضيف عنصرًا. بالـ DOM الخام، كم سطرًا \"تحديث يدوي\" تحتاج؟ وماذا لو كانت 10 أماكن في الصفحة تعرض نفس البيانات؟"
      : "Before the answer: imagine building a to-do list with 100 items and the user adds one. With raw DOM code, how many lines of \"manual updating\" do you need? And what if 10 places on the page show the same data?",
    answer: (lang, ctx) => (lang === "ar"
      ? "React ليست \"الخطوة التالية الإلزامية\" — إنها حل لمشكلة معينة. افهم المشكلة تفهم متى تحتاج الحل:\n\n**المشكلة**: كلما كبر التطبيق، أصبح التحديث اليدوي للـ DOM جحيمًا — عشرة أماكن تعرض نفس البيانات، وكل حدث يعدّل خمسة عناصر…\n\n**حل React**: أنت لا تقول \"غيّر هذا الـ span\"، بل تحدد **الحالة** (البيانات) وتصف كيف تبدو الواجهة *بدلالتها*، وReact يعيد الرسم عند كل تغيير. + تقسيم الواجهة إلى **مكونات** قابلة لإعادة الاستخدام (زر، بطاقة، قائمة كاملة).\n\n**متى تبدأ؟** عندما: (1) تطبيقك يعرض بيانات كثيرة تتغير كثيرًا، (2) تشعر أنك تكرر نفس كود التحديث، (3) تريد العمل في فرق — فReact هي لغة التواصل في سوق العمل.\n\n**متى لا تحتاجها؟** صفحة ثابتة أو تحدي صغير — جافاسكريبت العادية أسرع وأنسب.\n\nفكرة \"المكونات والحالة\" نفسها — التي شرحناها في وحدة «التفكير بالمكونات» بمسار الويب — هي الكنز الحقيقي، وReact مجرد أداة تنفذها بأفضل شكل."
      : "React isn't a mandatory next step — it's a solution to a specific problem. Understand the problem and you'll know when you need the solution:\n\n**The problem**: as apps grow, manual DOM updating becomes hell — ten places display the same data, every event patches five elements…\n\n**React's answer**: you stop saying \"change that span\". You define **state** (the data) and describe how the UI looks *given* that state; React re-renders on every change. Plus you split the UI into reusable **components** (a button, a card, a whole list).\n\n**When to start?** When: (1) your app shows lots of changing data, (2) you feel yourself repeating the same update code, (3) you want to work in teams — React is the job market's shared language.\n\n**When don't you need it?** A static page or a small challenge — vanilla is faster and more appropriate.\n\nThe real treasure is the \"components + state\" idea itself — taught in the Web path's \"Thinking in Components\" unit — and React is just the tool that implements it best.")
    + (ctx && ctx.path === "web" ? (lang === "ar" ? "\n\n📍 خطتك الحالية: " + ctx.unitTitle + "." : "\n\n📍 Your current plan: " + ctx.unitTitle + ".") : "")
  },

  {
    id: "forms-and-validation",
    match: ["form validation", "validate", "validation", "regex", "regular expression", "form submit", "html form", "signup", "preventdefault", "نموذج", "النماذج", "التحقق", "تحقق من", "تعبير نمطي", "التعابير النمطية"],
    socratic: (lang) => lang === "ar"
      ? "لنلعب دور حارس البوابة 🚪 وصل بريد مثل \" sara @example.com \" فيه مسافات زائدة. قبل أن أشرح التحقق: ما الخطأان فيه؟ وكيف تكشف كلًا منهما بكود تعرفه أصلًا؟ (تلميح: دالة تزيل الفراغات، وأخرى تفحص الشكل.)"
      : "Let's play club bouncer 🚪 An email like \" sara @example.com \" just arrived, with stray spaces. Before I explain validation: what are the two things wrong with it? And how would you catch each one with code you already know? (Hint: one function removes spaces, another tests the shape.)",
    answer: (lang) => lang === "ar"
      ? "إرسال النموذج يعيد تحميل الصفحة افتراضيًا — التحقق هو كيف تمنع ذلك وتفحص البيانات أولًا:\n\n```javascript\nform.addEventListener('submit', function (e) {\n  e.preventDefault();            // نبقَ في الصفحة\n  const v = email.value.trim();  // تسامح مع الفراغات\n  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  if (!re.test(v)) {\n    err.textContent = 'من فضلك أدخل بريدًا صحيحًا.';\n    return;                      // خروج مبكر عند الفشل\n  }\n  err.textContent = '';\n  email.value = '';\n});\n```\n\nثلاث عادات تستحق التقليد: **preventDefault()** تبقيك في السيطرة، و**trim()** يتسامح مع الفراغات العرضية، و**التعبير النمطي** (`re.test(v)`) يفحص *شكل* القيمة قبل أن تثق بها.\n\nتمييز احترافي مهم: التحقق في الواجهة هو *تجربة مستخدم* — رد فعل فوري بلا رحلة ذهاب وإياب للخادم. لكنه ليس أمنًا: أي شخص يتجاوز المتصفح، لذلك يجب أن يتحقق الخادم مرة أخرى. فحص الواجهة للراحة، وفحص الخادم للحقيقة.\n\n📍 في مسار الويب هنا، وحدة «النماذج والتحقق» تجعلك تبني هذا بالضبط، وتنتهي بمشروع نموذج تسجيل موثّق كامل."
      : "Submitting a form would reload the page — validation is how you stop that and check the data first:\n\n```javascript\nform.addEventListener('submit', function (e) {\n  e.preventDefault();            // stay on the page\n  const v = email.value.trim();  // forgive stray spaces\n  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  if (!re.test(v)) {\n    err.textContent = 'Please enter a valid email.';\n    return;                      // early exit on failure\n  }\n  err.textContent = '';\n  email.value = '';\n});\n```\n\nThree habits worth stealing: **preventDefault()** keeps you in control, **trim()** forgives accidental spaces, and a **regex** (`re.test(v)`) checks the *shape* of the value before you trust it.\n\nOne professional distinction: client-side validation is *user experience* — instant feedback with no round-trip to the server. It is NOT security: anyone can bypass the browser, so the server must validate again. Frontend checks for convenience, backend checks for truth.\n\n📍 In the Web path here, the Forms & Validation unit has you build exactly this, ending with a full validated signup project."
  },
  {
    id: "local-storage",
    match: ["localstorage", "local storage", "setitem", "getitem", "removeitem", "json.stringify", "json.parse", "persist data", "save data", "save file", "تخزين محلي", "التخزين المحلي", "حفظ البيانات", "ملف الحفظ", "ملف حفظ", "تخزين البيانات"],
    socratic: (lang) => lang === "ar"
      ? "تجربة سريعة قبل الشرح: افتح أي موقع مسجّل فيه وأعد تحميل الصفحة — لماذا بقيت مسجلاً؟ أين تظن أن هذه المعلومة تسكن؟ والآن تخيل لعبتك فيها زر \"حفظ\" — ما الأشياء الثلاثة التي ستحفظها؟"
      : "Quick experiment first: open any site you're logged into and reload the page — why are you still logged in? Where do you think that fact lives? Now imagine your game has a save button — what three things would you save?",
    answer: (lang) => lang === "ar"
      ? "**localStorage** هو مخزن المتصفح الدائم (مفتاح ← قيمة): ينجو من التحديث وإغلاق التبويب وإعادة التشغيل. ثلاث دوال وهذا كل شيء:\n\n```javascript\nlocalStorage.setItem('score', '120');   // خزّن (نص دائمًا)\nlocalStorage.getItem('score');          // '120' أو null إن غاب\nlocalStorage.removeItem('score');       // احذف\n```\n\nلكن القيم نصوص فقط — الكائنات تسافر بصيغة JSON:\n\n```javascript\n// نمط ملف الحفظ القياسي\nconst raw = localStorage.getItem('save');\nconst save = raw ? JSON.parse(raw) : null;  // تحميل آمن\nsave.xp += 10;\nlocalStorage.setItem('save', JSON.stringify(save));\n```\n\nوالقاعدة الذهبية للإبقاء: **يجب أن تكون الواجهة قابلة لإعادة البناء من البيانات المحفوظة وحدها**. الاختبار قاسٍ وبسيط — أعد تحميل الصفحة: إن بد شيء خاطئًا فملف حفظك ناقص أو مسار الرسم لا يقرؤه.\n\nلكل موقع مخزنه الخاص المعزول، وتطبيق CodeQuest نفسك يحفظ تقدمك هكذا (بمفتاح `codequest.v1`). 📍 في مسار الويب هنا وحدة «بيانات تبقى» تنتهي بمشروع ملف حفظ ينجو من إعادة التحميل."
      : "**localStorage** is the browser's permanent key-value store: it survives reloads, tab closes and full restarts. Three methods and that's the whole API:\n\n```javascript\nlocalStorage.setItem('score', '120');   // save (always a string)\nlocalStorage.getItem('score');          // '120' — or null if missing\nlocalStorage.removeItem('score');       // delete\n```\n\nBut values are strings only — objects travel as JSON:\n\n```javascript\n// the standard save-file pattern\nconst raw = localStorage.getItem('save');\nconst save = raw ? JSON.parse(raw) : null;  // null-safe load\nsave.xp += 10;\nlocalStorage.setItem('save', JSON.stringify(save));\n```\n\nAnd the one rule of persistence: **the UI must always be rebuildable from saved data alone**. The test is brutal and simple — reload the page: if anything looks wrong, your save file is missing information or your render path never reads it.\n\nEvery site gets its own private storage — and CodeQuest itself saves your progress this way (under the key `codequest.v1`). 📍 In the Web path here, the Data That Stays unit ends with a save-file project that survives reloads."
  },

  /* ---------- SE PATH ---------- */
  {
    id: "better-at-algorithms",
    match: ["algorithm", "algorithms", "خوارزمية", "الخوارزميات", "get better at", "interview", "مقابلة", "leetcode"],
    socratic: (lang) => lang === "ar"
      ? "توقع أولًا: كم خطوة تحتاج للبحث في قائمة فيها مليون عنصر **مرتبة** بطريقة ذكية؟ خمسمئة ألف؟ أقل بكثير؟ خمّن ثم قل لي رقمك."
      : "Predict first: how many steps do you need to search a **sorted** list of a million items, smartly? Half a million? Far less? Guess, then tell me your number.",
    answer: (lang) => lang === "ar"
      ? "الحقيقة المُحرِّرة: إتقان الخوارزميات مهارة تدريب وليست موهبة. النظام الذي يعمل فعليًا:\n\n١. **افهم المشكلة بأمثلة يدوية**: قبل كتابة أي كود، حلها على ورق بأرقام صغيرة. تتبع يدوي واحد يكشف أكثر من ساعة تحسين أعمى.\n\n٢. **تحدث بالنمو**: اسأل دائمًا \"ماذا يحدث إذا تضاعفت البيانات؟\" — هذا جوهر مفهوم Big-O الذي درسناه: O(n) يتضاعف، وO(log n) يزيد خطوة واحدة فقط. البحث الثنائي في مليون عنصر؟ نحو 20 خطوة.\n\n٣. **احفظ الأنماط لا المسائل**: البحث الخطي والثنائي، التراكم في حلقة، مؤشران، خريطة تجزئة للعدّ، المكدس للأقواس… مئة سؤال مقابلة تُبنى على هذه الأنماط الخمسة فعلًا.\n\n٤. **اكتب ثم اختبر بالحالات الحدية**: مصفوفة فارغة، عنصر واحد، تكرارات، قيم سالبة. هنا تولد الأخطاء دائمًا.\n\n٥. **راجع بعد أسبوع**: حل المسألة مرة ثم أعد حلها بعد أسبوع — هذا ما يحولها من \"حليتها مرة\" إلى \"أملكها\".\n\nوفي مسار الهندسة هنا مارست كل هذه الأنماط بنفسك — راجع وحدة الخوارزميات وسترى المفاهيم نفسها."
      : "The liberating truth: algorithm mastery is a trainable skill, not a talent. The system that actually works:\n\n1. **Understand with hand examples**: before writing code, solve it on paper with small numbers. One manual trace beats an hour of blind optimizing.\n\n2. **Think in growth**: always ask \"what happens if the data doubles?\" — that's the Big-O we studied: O(n) doubles, O(log n) adds one step. Binary search on a million items? About 20 steps.\n\n3. **Memorize patterns, not problems**: linear & binary search, accumulation loops, two pointers, hash-map counting, stacks for brackets… a hundred interview questions are actually built on these five patterns.\n\n4. **Test edge cases**: empty array, single item, duplicates, negatives. That's where bugs are always born.\n\n5. **Revisit after a week**: solve it once, re-solve a week later — that turns \"I solved it once\" into \"I own it\".\n\nIn the SE path here you've practiced every one of these patterns with your own hands — revisit the Algorithms unit and you'll see the same ideas."
  },
  {
    id: "what-is-git",
    match: ["git", "github", "جيت", "جيتهاب", "version control", "commit"],
    socratic: (lang) => lang === "ar"
      ? "جرّب أن تتذكر: هل سبق أن كان لديك ملف اسمه `essay-final.docx` ثم `essay-final-FINAL-v2.docx`؟ ما المشكلة في هذا النظام؟"
      : "Try to remember: have you ever had a file called `essay-final.docx` and then `essay-final-FINAL-v2.docx`? What's wrong with that system?",
    answer: (lang) => lang === "ar"
      ? "Git هو **آلة زمنية للكود** — نظام يخزن لقطات (commits) لمشروعك في كل مرحلة مهمة.\n\nما يمنحك إياه:\n• **تاريخ كامل**: ماذا تغير، متى، من، ولماذا (رسالة الالتزام).\n• **فروع (branches)**: كون موازٍ تجربه فيه ميزة جديدة دون كسر النسخة الرئيسية، ثم **دمج (merge)** عند النجاح.\n• **تعاون آمن**: آلاف المطورين على نفس المشروع دون أن يطأ أحدٌ تعديلات الآخر.\n• **تراجع لحظي**: كود جديد كسر كل شيء؟ عُد للقطة سليمة في ثوانٍ.\n\nأوامره الأساسية:\n```bash\ngit init          # ابدأ التتبع\ngit add .         # جهّز التغييرات\ngit commit -m \"وصف واضح\"\ngit push          # ارفعها لـ GitHub\ngit checkout -b feature-x   # فرع جديد\n```\n\nوGitHub يضيف فوق Git طبقة \"السحابة + المشاركة + العمل الجماعي\". في مسار الهندسة هنا توجد وحدة كاملة تشرح كل هذا — والأهم: **اجعلها عادة يومية من اليوم**، فهي الفرق الحقيقي بين هاوٍ ومهندس."
      : "Git is a **time machine for code** — a system that stores snapshots (commits) of your project at every important stage.\n\nWhat it gives you:\n• **Complete history**: what changed, when, by whom, and why (the commit message).\n• **Branches**: a parallel universe where you try a new feature without breaking the main version, then **merge** when it works.\n• **Safe collaboration**: thousands of developers on the same codebase without stomping on each other.\n• **Instant rollback**: new code broke everything? Return to a healthy snapshot in seconds.\n\nThe essential commands:\n```bash\ngit init          # start tracking\ngit add .         # stage changes\ngit commit -m \"clear description\"\ngit push          # upload to GitHub\ngit checkout -b feature-x   # new branch\n```\n\nGitHub adds the \"cloud + sharing + teamwork\" layer on top of Git. The SE path here has a full unit on this — and the real advice: **make it a daily habit from today**. It's the true divide between hobbyist and engineer."
  },
  {
    id: "how-to-debug",
    match: ["debug", "تصحيح", "أصحح", "how do i debug", "console.log", "find the bug", "أخطاء الكود"],
    socratic: (lang) => lang === "ar"
      ? "قبل أدوات التصحيح، عقلية التصحيح: عندما يخذلك الكود، من الذي يكذب عليك — عيناك التي ترى ما *تتوقع*ه، أم الحاسوب الذي يرى ما *كتبت*ه فعلًا؟ وما الأداة التي تجعلهما يتفقا؟"
      : "Before debugging tools, the debugging mindset: when code misbehaves, who's lying to you — your eyes that see what you *expect*, or the computer that sees what you *actually wrote*? And what tool would make them agree?",
    answer: (lang) => lang === "ar"
      ? "طقوس التصحيح التي يستخدمها المحترفون — بالترتيب:\n\n١. **أعد الإنتاج باستمرار**: خطأ يظهر أحيانًا فقط هو أصعب ما يُصحح. ثبّت الخطوات التي تنتجه دائمًا.\n\n٢. **اقرأ رسالة الخطأ فعليًا**: السطر الأول يقول النوع، والرقم يقول المكان. `Cannot read properties of undefined (reading 'name') at line 42` = اذهب للسطر 42 وابحث عن شيء غير موجود.\n\n٣. **افترض شيئًا واحدًا**: \"أظن أن المتغير فارغ هنا\". ثم **اختبر الفرضية**: `console.log('x =', x)` قبل السطر المشبوه.\n\n٤. **قلّص المنطقة**: علّق نصف الكود — هل ما زال الخطأ؟ نصفان إلى أن تعزل السطر المذنب. هذا \"البحث الثنائي\" الذي تعلمته — لكن على الكود نفسه!\n\n٥. **غيّر شيءًا واحدًا** ثم أعد التشغيل. دائمًا.\n\n٦. **اشرح بصوت عالٍ** (أو لبطك أو دبدوبك 🧸): 50% من الأخطاء تُكتشف أثناء الشرح قبل أن تنتهي الجملة — اسمه الرسمي \"تقنية الدبدوب\".\n\nوتذكر: كل مطور يعمل في Google/Apple يبدأ يومه برسالة خطأ حمراء. التصحيح ليس علامة ضعف — إنه *جوهر* العمل."
      : "The professionals' debugging ritual — in order:\n\n1. **Reproduce it consistently**: an error that appears only sometimes is the hardest to fix. Nail down steps that trigger it every time.\n\n2. **Actually read the error message**: the first line says the type, the number says the place. `Cannot read properties of undefined (reading 'name') at line 42` = go to line 42 and find what's missing.\n\n3. **Form ONE hypothesis**: \"I think this variable is empty here\". Then **test it**: `console.log('x =', x)` above the suspect line.\n\n4. **Shrink the zone**: comment out half the code — is the error still there? Halve again until you isolate the guilty line. That's the binary search you learned — applied to code itself!\n\n5. **Change one thing**, re-run. Always.\n\n6. **Explain out loud** (to a rubber duck 🧸): 50% of bugs are found mid-sentence — officially called \"rubber duck debugging\".\n\nAnd remember: every dev at Google/Apple starts their morning with a red error message. Debugging isn't a sign of weakness — it *is* the job."
  },

  {
    id: "recursion-explained",
    match: ["recursion", "recursive", "base case", "call stack", "استدعاء ذاتي", "الاستدعاء الذاتي", "دالة تستدعي نفسها", "حالة أساس"],
    socratic: (lang) => lang === "ar"
      ? "تخيل أنك واقف بين صف طويل من الناس، وتريد معرفة كم شخصًا أمامك. لا يمكنك رؤية نهاية الصف… لكن يمكنك سؤال الشخص الذي أمامك. ماذا يجب أن يسأله؟ وماذا يحدث عندما يصل السؤال إلى أول شخص في الصف؟"
      : "Imagine standing in a long queue and you want to know how many people are in front of you. You can't see the end of the line… but you can ask the person in front of you. What should you ask them? And what happens when the question reaches the very first person?",
    answer: (lang) => lang === "ar"
      ? "الاستدعاء الذاتي = دالة تحل مشكلة كبيرة بحل **نسخة أصغر من نفسها**. كل حل متكرر يحتاج جزأين:\n\n```javascript\nfunction sum(arr) {\n  if (arr.length === 0) return 0;      // الحالة الأساس: أصغر مشكلة أعرف جوابها فورًا\n  return arr[0] + sum(arr.slice(1));   // أول عنصر + حل الباقي (أصغر!)\n}\n```\n\n- **الحالة الأساس**: النسخة الصغيرة التي تُحل بلا استدعاء — بدونها تستدعي الدالة نفسها إلى الأبد حتى ينفجر مكدس الاستدعاء (`Maximum call stack size exceeded` — إذا رأيت هذا الخطأ فالغالب حالة أساس ناقصة!).\n- **الخطوة التقدّمية**: كل استدعاء يقترب من الحالة الأساس (هنا: `slice(1)` يقصّر المصفوفة).\n\nأين يتفوق على الحلقات؟ عندما تتشعّب البيانات: مجلد يحوي مجلدات، شجرة تعليقات فيها ردود على ردود، JSON متداخل بأي عمق. الحلقة تحتاج تتبع مستويات يدوي؛ الاستدعاء الذاتي \"ينزل\" بشكل طبيعي.\n\nقاعدة ذهبية: إذا كانت المسألة خطية (مجموع قائمة) فالحلقة أبسط وأسرع. استخدم الاستدعاء الذاتي عندما تكون بنية المسألة نفسها متداخلة. 📍 وحدة الاستدعاء الذاتي في مسار الهندسة هنا تبني هذا من صفر: الجمع، الأسّ، ثم تسطيح بيانات متداخلة بأي عمق."
      : "Recursion = a function that solves a big problem by solving **a smaller copy of itself**. Every recursive solution needs two parts:\n\n```javascript\nfunction sum(arr) {\n  if (arr.length === 0) return 0;      // base case: the smallest problem, answered instantly\n  return arr[0] + sum(arr.slice(1));   // first item + solve the rest (smaller!)\n}\n```\n\n- **Base case**: the tiny version solvable without recursing — without it the function calls itself forever until the call stack overflows (`Maximum call stack size exceeded` — if you ever see that error, a missing base case is the usual suspect!).\n- **Progress step**: every call gets closer to the base case (here `slice(1)` shrinks the array).\n\nWhere it beats loops: **branching or nested data**. A folder containing folders, a comment tree with replies to replies, JSON nested to any depth. A loop needs manual level-tracking; recursion \"descends\" naturally.\n\nRule of thumb: for flat, linear problems (summing a list) a loop is simpler and faster. Reach for recursion when the *structure of the problem itself* is nested. 📍 The Recursion unit in the SE path here builds this from zero: sums, powers, then flattening data nested to any depth."
  },
  {
    id: "higher-order-functions",
    match: ["higher-order", "higher order", "map filter reduce", "reduce", "callback", "closure", "function factory", "دالة عليا", "الدوال العليا", "دالة أعلى رتبة", "مصفوفة", "إغلاق"],
    socratic: (lang) => lang === "ar"
      ? "سؤال يقلب الفكرة: في جافاسكريبت، ما الفرق بين تمرير *رقم* إلى دالة وتمرير *دالة* إلى دالة؟ ولماذا تظن أن اللغة تسمح بالاثنين؟"
      : "A question that flips the idea: in JavaScript, what's the difference between passing a *number* to a function and passing a *function* to a function? And why do you think the language allows both?",
    answer: (lang) => lang === "ar"
      ? "الدالة العليا = دالة تستقبل دوال أو تُرجع دوال. لماذا؟ لأن الدوال في جافاسكريبت قيم عادية — يمكن تخزينها وتمريرها مثل أي رقم.\n\n```javascript\n// الخط الثلاثي الشهير — كل واحد يستقبل دالة:\nconst adults = people.filter(p => p.age >= 18);   // اختر\nconst names  = adults.map(p => p.name);           // حوّل\nconst total  = numbers.reduce((acc, n) => acc + n, 0); // لخّص\n```\n\n- **filter**: يحتفظ بما يحقق الشرط. **map**: يحوّل كل عنصر. **reduce**: يطوي المصفوفة كلها إلى قيمة واحدة (المجمّع `acc` يحمل الناتج حتى الآن).\n\nوللصانعات — دوال تصنع دوال:\n\n```javascript\nconst multiply = (a) => (b) => a * b;\nconst double = multiply(2);\ndouble(5); // 10\n```\n\nالقوة الحقيقية: **التركيب**. نفس أدواتك الصغيرة (filter/map/reduce) تُركّب في خطوط معالجة — بيانات تدخل، سلسلة تحويلات، نتيجة تخرج. هذا هو الأسلوب الذي تقف خلفه المكتبات الحديثة والأطر كلها.\n\nخريطة ذهنية سريعة: عايز نسخة معدلة من كل عنصر؟ map. عايز بعض العناصر فقط؟ filter. عايز رقمًا/نصًا/كائنًا واحدًا خلاصة؟ reduce. 📍 وحدة الدوال العليا بمسار الهندسة هنا تنتهي بمشروع صندوق أدوات دالي كامل."
      : "A higher-order function = a function that receives functions or returns functions. Why? Because in JavaScript functions are ordinary values — storable and passable like any number.\n\n```javascript\n// The famous trio — each receives a function:\nconst adults = people.filter(p => p.age >= 18);   // select\nconst names  = adults.map(p => p.name);           // transform\nconst total  = numbers.reduce((acc, n) => acc + n, 0); // fold\n```\n\n- **filter**: keep what passes the test. **map**: transform every item. **reduce**: fold the whole array into one value (the accumulator `acc` carries the result so far).\n\nAnd factories — functions that build functions:\n\n```javascript\nconst multiply = (a) => (b) => a * b;\nconst double = multiply(2);\ndouble(5); // 10\n```\n\nThe real power is **composition**: your small tools (filter/map/reduce) combine into pipelines — data goes in, a chain of transformations happens, a result comes out. This is the style behind modern libraries and every framework.\n\nQuick mental map: want a transformed copy of every item? map. Want only some items? filter. Want one summary value (number/string/object)? reduce. 📍 The Higher-order Functions unit in the SE path here ends with a complete functional toolbox project."
  },

  /* ---------- GAME PATH ---------- */
  {
    id: "game-engines",
    match: ["game engine", "محرك ألعاب", "unity", "unreal", "godot", "phaser", "يويتي"],
    socratic: (lang) => lang === "ar"
      ? "قبل أسماء المحركات: ما الأشياء التي تحتاجها *أي* لعبة مهما كان محركها؟ (تلميح: ثلاثة أشياء تتكرر كل إطار…) قل لي تخمينك ثم قارن بما تتعلمه في مسار الألعاب هنا."
      : "Before engine names: what does *any* game need regardless of its engine? (Hint: three things that repeat every frame…) Tell me your guess, then compare with what the Game path here teaches.",
    answer: (lang) => lang === "ar"
      ? "المحرك = حزمة أدوات تلتف حول الأشياء التي تحتاجها كل لعبة أصلًا. وأنت تعرفها جيدًا الآن:\n\n🔄 **حلقة اللعبة** (تحديث ← رسم، 60 مرة/ثانية) — بنيتها بنفسك في أول وحدة.\n🎯 **كشف التصادم** — مارست مستطيلاته في تحدّي `rectsOverlap`.\n🎮 **المدخلات والحالات** (قائمة/لعب/نهاية) — صنعتها في مشروع المراوغة.\n\nالمحركات الكاملة تغلف هذا بأدوات ومحررات مرئية:\n\n• **Phaser** — مكتبة جافاسكريبت. **خطوتك الطبيعية التالية**: كل ما تعلمته هنا ينطبق عليها حرفيًا.\n• **Godot** — مجاني مفتوح المصدر، لغته GDScript قريبة من بايثون، ممتاز لثنائي وثلاثي الأبعاد. الأنسب للمبتدئين الجادين.\n• **Unity** — معيار الصناعة، بلغة C#، سوق عمل ضخم في الألعاب المحمولة.\n• **Unreal** — بلغة C++، ملك الجرافيك ثلاثي الأبعاد السينمائي.\n\nالحقيقة المهمة: المفاهيم تنتقل 1:1 بينهم جميعًا. من يفهم حلقة اللعبة ونظام الحالات بعمق — كما أنت الآن — يتعلم أي محرك في أسابيع، بينما يتعثر من حفظ أزرار المحرك دون فهم."
      : "An engine = a toolset wrapped around the things every game needs anyway. And you already know them:\n\n🔄 **The game loop** (update → render, 60×/second) — you built it yourself in the first unit.\n🎯 **Collision detection** — you practiced AABB rectangles in the rectsOverlap challenge.\n🎮 **Input & states** (menu/play/over) — you created it in the Dodge game project.\n\nFull engines wrap this in tools and visual editors:\n\n• **Phaser** — a JavaScript library. **Your natural next step**: everything you learned here applies literally.\n• **Godot** — free & open source, GDScript is Python-like, great for 2D and 3D. Best for serious beginners.\n• **Unity** — industry standard, C#, a huge job market in mobile games.\n• **Unreal** — C++, king of cinematic 3D graphics.\n\nThe important truth: concepts transfer 1:1 between all of them. Someone who deeply understands the loop and state systems — like you do now — learns any engine in weeks, while engine-button-memorizers stall."
  },
  {
    id: "game-movement",
    match: ["make things move", "how do i make", "movement", "حركة", "أحرك", "تحريك الشخصية", "physics", "الفيزياء", "gravity", "الجاذبية"],
    socratic: (lang) => lang === "ar"
      ? "افتح أي فيديو للعبة وأوقفه مؤقتًا: هل الصورة \"تتحرك\" فعليًا أم أن هناك شيئًا آخر يحدث؟ (تلميح: ماذا يفعل السينما بمئة صورة في الثانية؟)"
      : "Pause any gameplay video: is the image *actually* moving, or is something else happening? (Hint: what does cinema do with a hundred still frames per second?)",
    answer: (lang) => lang === "ar"
      ? "الحقيقة الجميلة: لا شيء \"يتحرك\" على شاشتك أصلًا — ما يحدث هو رسم من جديد 60 مرة في الثانية، وفي كل مرة بموقع مختلف قليلًا. وهم الحركة، تمامًا كالسينما.\n\nالفيزياء الأساسية التي تحتاجها لأي حركة:\n\n```javascript\nx += vx;        // الموقع يتحرك بالسرعة كل إطار\ny += vy;\nvy += gravity;  // الجاذبية: تسارع نحو الأسفل كل إطار\n```\n\nهذا كل شيء! قفزة = عكس الجاذبية لحظة (`vy = -8`)، ثم الجاذبية تسحبك لأسفل تدريجيًا فتشكل قوسًا جميلًا. ارتداد = عكس الإشارة عند لمس حافة: `if (x <= 0 || x + w >= 300) vx = -vx;`\n\nوالارتداد الأنيق مع السرعة: اجعل السرعة تخسر 5% كل إطار (`vx *= 0.95`) فيتباطأ الارتداد طبيعيًا.\n\nكل هذا — وتراكمته بنفسك في مسار الألعاب هنا: من \"العالم المتحرك\" إلى \"المراوغة\" إلى \"Breakout\". افتح أي مشروع وأعد ضبط الأرقام وارقب ما يحدث — هذه أفضل طريقة لفهم الفيزياء."
      : "The beautiful truth: nothing actually \"moves\" on your screen — the scene is redrawn 60 times a second, each time at a slightly different position. An illusion of motion, exactly like cinema.\n\nThe core physics for any movement:\n\n```javascript\nx += vx;        // position advances by velocity each frame\ny += vy;\nvy += gravity;  // gravity: downward acceleration each frame\n```\n\nThat's all! A jump = briefly reversing gravity (`vy = -8`), then gravity pulls you down gradually, forming a beautiful arc. A bounce = flipping the sign at an edge: `if (x <= 0 || x + w >= 300) vx = -vx;`\n\nAnd its elegant cousin: make velocity lose 5% per frame (`vx *= 0.95`) so bounces decay naturally.\n\nYou built all of this yourself in the Game path here — from \"Moving world\" to \"Dodge\" to \"Breakout\". Open any project, tweak the numbers, and watch what happens — the best way to feel physics."
  },
  {
    id: "game-loop-q",
    match: ["game loop", "حلقة اللعبة", "requestanimationframe", "update and render", "ما هي حلقة"],
    socratic: (lang) => lang === "ar"
      ? "تخيل لعبة بدون حلقة: ماذا يحدث بعد رسم الإطار الأول؟ وماذا يجب أن يحدث بعد أن يتحرك اللاعب خطوة؟"
      : "Imagine a game without a loop: what happens after the first frame is drawn? And what *should* happen after the player moves one step?",
    answer: (lang) => lang === "ar"
      ? "حلقة اللعبة هي **نبض كل لعبة**: دورة تتكرر 60 مرة في الثانية:\n\n```\nاقرأ المدخلات ← حدّث العالم ← ارسم الإطار ← كرر\n```\n\n```javascript\nfunction loop() {\n  update();   // منطق: مواقع، فيزياء، ذكاء أعداء\n  render();   // رسم الحالة الحالية على الشاشة\n  requestAnimationFrame(loop);  // الموعد التالي قبل الشاشة القادمة\n}\nloop();\n```\n\nلماذا `requestAnimationFrame` وليس `setInterval`؟ لأنها تزامن مع تحديث شاشتك الفعلي (غالبًا 60Hz)، فتحصل على سلاسة كاملة ولا تحرق معالج في التبويبات الخلفية.\n\nوالقاعدة الذهبية: **افصل update عن render**. التحديث محاكاة صافية بالأرقام؛ الرسم لا يقرأ إلا الحالة ويرسمها. من يخلطهما ينتهي بكود لا يمكن اختباره ولا تعديله. في مسار الألعاب هنا بنينا كل مشاريعنا على هذا الفصل بالضبط."
      : "The game loop is the **heartbeat of every game**: a cycle repeating 60 times per second:\n\n```\nread input → update world → render frame → repeat\n```\n\n```javascript\nfunction loop() {\n  update();   // logic: positions, physics, enemy AI\n  render();   // paint the current state to the screen\n  requestAnimationFrame(loop);  // book next tick before the next screen refresh\n}\nloop();\n```\n\nWhy `requestAnimationFrame` instead of `setInterval`? It syncs with your screen's actual refresh (usually 60Hz) — full smoothness, and no wasted CPU in background tabs.\n\nGolden rule: **keep update and render separate**. Update is pure simulation with numbers; render only reads state and paints it. Mixing them produces code that can't be tested or tweaked. Every project in the Game path here is built on exactly this separation."
  }
];

/* ============================================================
   Lookup helpers
   ============================================================ */

function findTopic(text) {
  const q = (text || "").toLowerCase();
  let best = null, bestLen = 0;
  for (const topic of TOPICS) {
    for (const m of topic.match) {
      if (q.includes(m.toLowerCase()) && m.length > bestLen) {
        best = topic; bestLen = m.length;
      }
    }
  }
  return best;
}

function buildContext() {
  const path = State.data.path;
  const ctx = { path, progressPct: path ? pathProgress(path) : 0, unitTitle: "", nextStepTitle: "" };
  if (path) {
    const units = allUnits(path);
    const current = units.find(u => u.steps.some(s => !State.data.completed[s.id]));
    ctx.unitTitle = current ? stepTitle(current) || "" : "";
    ctx.unitTitle = current ? L(current.title) : (units.length ? L(units[units.length - 1].title) : "");
    const ns = nextStepInfo(path);
    ctx.nextStepTitle = ns ? stepTitle(ns) || "" : "";
    ctx.nextStepTitle = ns ? L(ns.title) : "";
  }
  return ctx;
}

/* First incomplete step, or null */
function nextStepInfo(pathId) {
  const steps = allSteps(pathId);
  for (let i = 0; i < steps.length; i++) {
    if (!State.data.completed[steps[i].id]) return steps[i];
  }
  return null;
}

function pathProgress(pathId) {
  const steps = allSteps(pathId);
  if (!steps.length) return 0;
  const done = steps.filter(s => State.data.completed[s.id]).length;
  return Math.round(done / steps.length * 100);
}
