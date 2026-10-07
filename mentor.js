/* ============================================================
   CodeQuest — mentor.js
   The Socratic AI mentor: analyzes intent, asks questions first,
   gives staged hints, never dumps answers immediately,
   and knows the user's current position on their path.
   ============================================================ */

const Mentor = {
  _counts: {},   // repeat-tracking per chat + topic

  lang() {
    return State.data.language === "ar" ? "ar" : "en";
  },

  /* ---------- intent detection ---------- */
  detectIntent(text) {
    const q = (text || "").toLowerCase();
    const has = (arr) => arr.some(w => q.includes(w));

    if (has(["give me the answer", "give me the solution", "give me the code", "write the code", "just tell me", "الجواب", "الإجابة", "أعطني الحل", "اكتب لي الكود", "حل التمرين"])) return "solution-please";
    if (has(["not working", "doesn't work", "doesn t work", "error", "undefined", "null", "nan", "crash", "stuck", "failed", "فشل", "فشلت", "لا يعمل", "لا تعمل", "خطأ", "مشكلة", "عالق", "علقت", "تعطل"])) return "stuck";
    if (has(["what is", "what are", "explain", "why", "how does", "how do", "difference", "vs", "compare",
             "ما هو", "ما هي", "اشرح", "لماذا", "كيف", "الفرق", "شو الفرق", "ماهو", "ماهي"])) return "explain";
    return "open";
  },

  /* ---------- repeat counting (for escalating hints) ---------- */
  keyFor(chatKind, text) {
    return chatKind + ":" + (text || "").toLowerCase().replace(/\s+/g, " ").trim().slice(0, 40);
  },
  bump(chatKind, text) {
    const k = this.keyFor(chatKind, text);
    this._counts[k] = (this._counts[k] || 0) + 1;
    return this._counts[k];
  },
  count(chatKind, text) {
    return this._counts[this.keyFor(chatKind, text)] || 0;
  },

  /* ---------- main entry ---------- */
  reply(chatKind, userText) {
    const lang = this.lang();
    const S = SOCRATIC[lang] || SOCRATIC.en;
    const ctx = buildContext();
    const topic = findTopic(userText);
    const n = this.bump(chatKind, userText);
    const wantsDirect = n >= 3 || /(give me the answer|just tell me|الجواب جاهز|أعطني الإجابة|أعطني الحل)/.test((userText || "").toLowerCase());

    /* 1. Knowledge-base topic match (strongest signal) */
    if (topic) {
      return wantsDirect ? topic.answer(lang, ctx) : topic.socratic(lang, ctx);
    }

    /* 2. Socratic ladder inside the dedicated Mentor chat */
    if (chatKind === "mentor") {
      const intent = this.detectIntent(userText);

      if (intent === "solution-please") {
        return (lang === "ar")
          ? "أفهم الاستعجال! لكن الحل الجاهز يعلّم أقل من نصف محاولة فاشلة. دعنا نخطط الحل معًا: ما الخطوة الأولى التي يمكنك تجربتها الآن؟ وإذا أردت، اقلب الأدوار — صف لي ما جربته وأنا أعطيك تلميحًا."
          : "I get the urgency! But a ready answer teaches less than half of one failed attempt. Let's plan the solution together: what's the first step you could try right now? And flip the roles — describe what you've tried, and I'll give *you* a hint.";
      }

      if (intent === "stuck") {
        if (n <= 1) return (lang === "ar")
          ? "لنكن محققين 🕵️ صف لي أولًا بالضبط ما يحدث: ماذا توقعت؟ وماذا حصلت فعلًا؟ (رسالة خطأ؟ سلوك غريب؟ لا شيء؟) من هذا سنبني الفرضية الأولى."
          : "Let's be detectives 🕵️ First describe exactly what's happening: what did you expect, and what did you actually get? (An error message? Odd behavior? Nothing?) From that we'll build the first hypothesis.";
        if (n === 2) return (lang === "ar")
          ? "تلميح أقوى: افحص الأنواع والحدود. هل تتعامل مع نص تعتقد أنه رقم؟ فهرس يبدأ من 1 بدل 0؟ شرط `>=` صار `>`؟ هذه أشهر ثلاثة مخابئ للأخطاء — وأي واحدة منها تفسّر أعراضك؟"
          : "Stronger hint: check types and boundaries. A string you think is a number? An index starting at 1 instead of 0? A `>=` that became `>`? Those are the three most popular bug hideouts — which one matches your symptoms?";
        if (n === 3) return (lang === "ar")
          ? "آخر جسر قبل الكشف: ضع `console.log('قيمة x هي', x)` قبل السطر المشتبه به مباشرة وقارن ما *تتوقع*ه مع ما *ترى*ه. الفرق بينهما هو موقع الخطأ بالضبط. قل لي ما وجدت — أو اطلب مني الكشف صراحة وسأعطيك الحل الكامل."
          : "Last bridge before full reveal: put `console.log('x is', x)` right above the suspect line and compare what you *expect* with what you *see*. The difference is the exact location of the bug. Tell me what you find — or explicitly ask for the reveal and I'll give you the full solution.";
        return (lang === "ar")
          ? "حسنًا — كشف الحل. لكن قبل أن تقرأه: أعده بنفسك من الذاكرة بعد دقيقتين، وإلا لن يبقى أثر. جرّب أيضًا كسر شيء صغير في الحل وشاهد رسالة الخطأ التي ينتجها — هذا تمرين المتعلّم: تفهم الحل عندما تفهم كيف ينكسر 🔧"
          : "Okay — solution reveal. But before you read it: rebuild it from memory two minutes later, otherwise nothing sticks. Also try breaking something small in the solution and watch the error it produces — the apprentice's exercise: you understand a solution when you understand how it breaks 🔧";
      }

      if (intent === "explain") {
        return (lang === "ar")
          ? pick([
              "قبل أن أشرح — ماذا *تظن* أن يعني هذا؟ خمّن! التخمين (الصحيح أو الخاطئ) يثبّت المعلومة في الذاكرة أفضل من الشرح الجاهز.",
              "سؤال قبل الشرح: أين صادفت هذا المصطلح — في أي تحدٍّ أو مشروع من مسارك؟ السياق يساعدني أن أشرح لك بالصورة المناسبة تمامًا.",
              "لنفعلها بأسلوب فيمنوس: صف لي ماذا يحدث خطوة بخطوة، وسأسألك في كل خطوة: ماذا توقع أن يحدث هنا؟"
            ])
          : pick([
              "Before I explain — what do you *think* it means? Guess! A guess (right or wrong) anchors the idea in memory better than a ready explanation.",
              "One question first: where did you meet this term — which challenge or project on your path? Context lets me tailor the explanation precisely to you.",
              "Let's do it Socratic style: describe what happens step by step, and at each step I'll ask: what did you expect to happen here?"
            ]);
      }

      return this.socraticOpen(lang, S, ctx);
    }

    /* 3. General chat: helpful direct answers with a learning hook */
    if (chatKind === "general") {
      return this.generalFallback(lang, userText, ctx);
    }

    /* 4. Path chat: context-aware guidance */
    return this.pathFallback(lang, ctx, userText);
  },

  /* open-ended: guide toward exploration */
  socraticOpen(lang, S, ctx) {
    if (lang === "ar") {
      return pick([
        "سؤال مفتوح جميل. لنكسره معًا: ما الجزء الذي تفهمه من سؤالك، وما الجزء الغامض؟ ابدأ بالجزء الواضح وسأتدخل حيث يلزم.",
        (ctx.path
          ? "دعني أساعدك بوصف موقعك: أنت الآن في «" + ctx.unitTitle + "» بتقدم " + ctx.progressPct + "%. أقرب مكان لهذا السؤال في خطتك: «" + ctx.nextStepTitle + "». هل علاقته به؟"
          : "أقترح أن نربطه بشيء عملي: اختر مسارًا (ويب، هندسة، ألعاب) وسترى هذا المفهوم يتحول إلى شيء تبنيه بأيدك."),
        "أستطيع الإجابة مباشرة، لكن جرب أنت أولًا: لو اضطررت للتخمين، ماذا ستقول؟ وسأصحح الاتجاه — تخمينك يعلمني أين فكرتك تلتقي بالحقيقة."
      ]);
    }
    return pick([
      "A nice open question. Let's break it down together: which part of your question is clear to you, and which is foggy? Start with the clear part and I'll jump in where needed.",
      (ctx.path
        ? "Let me anchor it in your position: you're in \"" + ctx.unitTitle + "\" at " + ctx.progressPct + "% progress. The closest place this fits in your plan: \"" + ctx.nextStepTitle + "\". Is it related?"
        : "I suggest tying this to something practical: pick a path (web, engineering, games) and you'll watch this concept turn into something you build with your own hands."),
      "I could answer directly — but try first: if you had to guess, what would you say? I'll correct course. Your guess teaches me exactly where your model meets reality."
    ]);
  },

  /* general chat fallback */
  generalFallback(lang, userText, ctx) {
    if (lang === "ar") {
      return pick([
        "سؤال في صلب البرمجة 👌 إليك الفكرة الأساسية، ثم تفصيل أكبر إذا أردت: " + "كل شيء في البرمجة يدور حول (بيانات ← معالجة ← نتيجة). حدد لي: ما البيانات في سؤالك؟ وما النتيجة المرجوة؟ وسنملأ خانة \"المعالجة\" معًا خطوة بخطوة.",
        "أستطيع الإجابة، لكن الأفضل: أخبرني ما الذي تبنيه أو تتعلمه الآن بالضبط — سأجيب بمثال من عالمك أنت. وإذا كنت واقفًا عند مفهوم معين، سمِّه وسأكسره بمثال عملي.",
        "إليك خريطة: أسئلة «ما هو X؟» أجيب عنها بتعريف + مثال من مسارك الحالي. أسئلة «كيف أفعل X؟» نحولها لخطة من 3 خطوات تجربها فورًا. أي نوع سؤالك؟"
      ]);
    }
    return pick([
      "A core question 👌 Here's the fundamental frame, then go deeper if you like: everything in programming is (data → processing → result). Tell me: what's the data in your question, and the desired result? We'll fill in the \"processing\" together, step by step.",
      "I can answer, but better: tell me exactly what you're building or learning right now — I'll answer with an example from *your* world. And if you're stuck on a specific concept, name it and I'll break it down hands-on.",
      "Here's my map: \"what is X?\" questions get a definition + an example from your current path. \"How do I do X?\" questions become a 3-step plan you can try immediately. Which one is yours?"
    ]);
  },

  /* path chat fallback: uses the learner's position */
  pathFallback(lang, ctx, userText) {
    const pathEmoji = { web: "🌐", se: "💻", game: "🎮" }[ctx.path] || "🧭";
    if (lang === "ar") {
      return pick([
        pathEmoji + " أنا خبير مسارك، وأعرف أنك الآن في «" + ctx.unitTitle + "» (" + ctx.progressPct + "% من المسار). اسألني عن أي شيء في الوحدة الحالية أو مشروعها القادم: «" + ctx.nextStepTitle + "» — أو اطلب تلميحًا لتحدي معين.",
        pathEmoji + " لنجعل السؤال عمليًا: كيف أخدمك الآن؟ (١) أشرح مفهومًا من وحدتك الحالية بمثال من مشاريعها، (٢) أعطيك تلميحًا متدرجًا لتحدٍّ عالقت فيه، (٣) أراجع معك خطة خطوتك القادمة.",
        pathEmoji + " ملاحظة من خبير المسار: أفضل وقت لتسأل هو عندما تجرب فعلًا. جرّب كتابة شيء في التحدي الحالي — حتى لو خاطئ — وسأبني شرحي على محاولتك بالضبط."
      ]);
    }
    return pick([
      pathEmoji + " I'm your path specialist, and I know you're in \"" + ctx.unitTitle + "\" (" + ctx.progressPct + "% of the path). Ask me anything about the current unit or its next project: \"" + ctx.nextStepTitle + "\" — or ask for a graduated hint on a specific challenge.",
      pathEmoji + " Let's make this practical. How can I serve you now? (1) Explain a concept from your current unit with an example from its projects, (2) give you a graduated hint on a challenge you're stuck on, (3) review the plan for your next step.",
      pathEmoji + " A path-specialist's note: the best time to ask is *after trying*. Write something in the current challenge — even if wrong — and I'll build my explanation on exactly what you attempted."
    ]);
  }
};
