/* ============================================================
   CodeQuest — app.js (part 1)
   Core utilities, topbar, router, welcome & path picker, map.
   ============================================================ */

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function mdLite(s) {
  // minimal formatting: ``` blocks -> <pre>, **bold**, `code`, newlines
  let out = esc(s);
  out = out.replace(/```[\s\S]*?```/g, m => "<pre>" + m.replace(/```/g, "") + "</pre>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\n/g, "<br>");
  return out;
}
function uid() { return Math.random().toString(36).slice(2, 9); }

/* ---------- toasts ---------- */
function toast(text, emoji, cls) {
  const el = document.createElement("div");
  el.className = "toast " + (cls || "");
  el.innerHTML = (emoji ? "<span>" + emoji + "</span>" : "") + "<span>" + esc(text) + "</span>";
  $("#toasts").appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 3400);
}

/* ---------- notifications ---------- */
function notify(text, emoji) {
  State.data.notifications.unshift({ id: ++State.data.lastNotifId, text, emoji: emoji || "🔔", time: Date.now() });
  State.data.notifications = State.data.notifications.slice(0, 30);
  State.save();
  updateNotifDot();
}
function updateNotifDot() {
  const dot = $("#notifBtn .dot");
  if (dot) dot.style.display = State.data.notifications.length ? "block" : "none";
}

/* ---------- XP / level ---------- */
function levelFromXp(xp) { return Math.floor(Math.sqrt(xp / 40)) + 1; }
function xpForLevel(level) { return Math.pow(level - 1, 2) * 40; }
function addXp(amount) {
  const before = levelFromXp(State.data.xp);
  State.data.xp += amount;
  const after = levelFromXp(State.data.xp);
  if (after > before) {
    State.data.leveled = { from: before, to: after, at: Date.now() };   /* consumed by completeStep */
    showLevelBanner(after);
    toast(t("level") + " " + after + "! ✨", "🌟");
    notify(t("level") + " " + after, "🌟");
    Celebrate.burst({ gold: true, big: true });
  }
}

/* ---------- animated level banner ---------- */
function showLevelBanner(level) {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const old = document.querySelector(".level-banner");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "level-banner";
  el.innerHTML = `
    <div class="lb-card">
      <div class="lb-spark">🌟</div>
      <div class="lb-title">${t("level")} ${level}!</div>
      <div class="lb-sub">${t("levelUpSub")}</div>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("out"), 2100);
  setTimeout(() => el.remove(), 2700);
}

/* ---------- streak ---------- */
function todayKey() { return new Date().toISOString().slice(0, 10); }
function touchDay() {
  const k = todayKey();
  State.data.dayLog[k] = (State.data.dayLog[k] || 0) + 1;
}
function currentStreak() {
  let n = 0;
  const d = new Date();
  for (;;) {
    const k = d.toISOString().slice(0, 10);
    if (State.data.dayLog[k]) { n++; d.setDate(d.getDate() - 1); }
    else if (n === 0 && k === todayKey()) { d.setDate(d.getDate() - 1); } // today not started yet
    else break;
  }
  return n;
}

/* ---------- daily streak celebration: first completed step of the day ---------- */
function checkStreakCelebration(justLeveled) {
  /* dayLog[today] was already bumped by touchDay() — a count of 1 means this was the first today */
  if ((State.data.dayLog[todayKey()] || 0) !== 1) return;
  const streak = currentStreak();
  if (streak < 2) return;                       /* a lone day isn't a streak yet */
  if (justLeveled) return;                      /* a level-up owns this moment */
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  showStreakBanner(streak);
  const chip = document.querySelector(".topbar .chip");
  Celebrate.burst({ ember: true, small: true, originEl: chip });
}

/* ---------- animated streak banner (small, ember-toned) ---------- */
function showStreakBanner(streak) {
  const old = document.querySelector(".streak-banner");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "streak-banner";
  el.innerHTML = `
    <div class="sb-card">
      <span class="sb-emoji">🔥</span>
      <span class="sb-txt"><b>${t("streakDay")} ${streak}</b><span>${t("streakSub")}</span></span>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("out"), 2300);
  setTimeout(() => el.remove(), 2900);
}

/* ============================================================
   ROUTER
   ============================================================ */
const Router = {
  routes: ["home", "pathpick", "map", "step", "dashboard", "achievements", "certificates", "certificate", "verify", "explore", "roadmap", "settings", "auth", "admin"],
  go(route, param) {
    location.hash = "#/" + route + (param ? "/" + encodeURIComponent(param) : "");
  },
  parse() {
    const h = location.hash.replace(/^#\/?/, "");
    const [route, param] = h.split("/");
    return { route: route || "", param: param ? decodeURIComponent(param) : null };
  },
  lastKey: null,          // "route/param" of the current view
  seq: 0,                 // strictly increasing render generation
  motionOK() { return !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); },
  paint(route, param) {
    const app = $("#app");

    // Language gate
    if (!State.data.language) { app.innerHTML = Views.welcome(); bindWelcome(); return; }
    if (!State.data.path && !["pathpick", "settings", "roadmap"].includes(route)) { app.innerHTML = Views.pathpick(); bindPathpick(); return; }

    applyLanguage(); applyTheme(); updateNotifDot();

    switch (route) {
      case "pathpick": app.innerHTML = Views.pathpick(); bindPathpick(); break;
      case "map": app.innerHTML = Views.map(param); bindMap(param); break;
      case "step": app.innerHTML = Views.step(param); bindStep(param); break;
      case "dashboard": app.innerHTML = Views.dashboard(); bindDashboard(); break;
      case "achievements": app.innerHTML = Views.achievements(); bindSimple(); break;
      case "certificates": app.innerHTML = Views.certificates(); bindCertificates(); break;
      case "certificate": app.innerHTML = Views.certificate(param); bindCertificate(param); break;
      case "verify": app.innerHTML = Views.verify(param); bindVerify(); break;
      case "explore": app.innerHTML = Views.explore(); bindExplore(); break;
      case "roadmap": app.innerHTML = Views.roadmap(); bindRoadmap(); break;
      case "settings": app.innerHTML = Views.settings(); bindSettings(); break;
      case "auth": app.innerHTML = Views.auth(param); bindAuthView(param); break;
      case "admin":
        if (!Auth.isAdmin()) { app.innerHTML = Views.auth("login"); bindAuthView("login"); toast(t("errForbidden"), "⛔", "bad"); break; }
        app.innerHTML = Views.admin(); bindAdminView(); break;
      default: app.innerHTML = Views.home(); bindHome();
    }
  },
  render() {
    const { route, param } = this.parse();
    const app = $("#app");
    const key = route + "/" + (param || "");
    const sameView = key === this.lastKey && app.innerHTML.trim() !== "";
    this.lastKey = key;

    if (sameView) { this.paint(route, param); return; }               // language/theme tweaks: no fade, no jump
    if (!this.motionOK()) {                                           // reduced motion: swap instantly, still reset scroll
      this.paint(route, param);
      window.scrollTo(0, 0);
      return;
    }

    const mySeq = ++this.seq;
    if (app.innerHTML.trim() !== "") {                                // fade the old view out (180ms)
      app.classList.add("route-fade");
      setTimeout(() => {
        if (mySeq !== this.seq) return;                               // a newer render superseded us
        this.paint(route, param);
        window.scrollTo({ top: 0, behavior: "instant" });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (mySeq === this.seq) app.classList.remove("route-fade");
        }));
      }, 180);
    } else {                                                          // first paint: nothing to fade out
      this.paint(route, param);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }
};
window.addEventListener("hashchange", () => Router.render());

/* ============================================================
   TOPBAR
   ============================================================ */
function topbarHtml(active) {
  const lang = State.data.language === "ar" ? "ar" : "en";
  const other = lang === "ar" ? "EN" : "ع";
  const navItems = [
    ["home", t("navHome")], ["dashboard", t("navDashboard")], ["achievements", t("navAchievements")],
    ["certificates", t("navCertificates")], ["roadmap", t("navRoadmap")], ["explore", t("navExplore")]
  ];
  if (Auth.user && Auth.user.role === "admin") navItems.push(["admin", t("navAdmin")]);
  return `
  <header class="topbar">
    <div class="brand" data-nav="home"><span class="logo">🚀</span><span><b>Code</b>Quest</span></div>
    <nav class="topnav">
      ${navItems.map(([r, lbl]) => `<button data-nav="${r}" class="${active === r ? "active" : ""}">${lbl}</button>`).join("")}
    </nav>
    <div class="top-spacer"></div>
    <span class="chip lvl">⚡ ${State.data.xp} ${t("xp")}</span>
    <span class="chip">🔥 ${currentStreak()}</span>
    <button class="iconbtn" id="langBtn" title="${t("languageLabel")}">${other}</button>
    <button class="iconbtn" id="themeBtn" title="${t("themeToggle")}">${State.data.theme === "light" ? "☀️" : "🌙"}</button>
    <button class="iconbtn" id="notifBtn" title="${t("notifTitle")}">🔔<span class="dot" style="display:none"></span></button>
    <button class="iconbtn" id="chatMentorBtn" title="${t("chatMentor")}">🤖</button>
    <button class="iconbtn" data-nav="settings" title="${t("settings")}">⚙️</button>
    <div class="avatar" data-nav="auth" title="${t("authAccountTitle")}">${esc((Auth.user ? (Auth.user.name || Auth.user.username) : "★")[0].toUpperCase())}</div>
  </header>`;
}

function bindTopbar() {
  $$("[data-nav]").forEach(el => el.onclick = () => Router.go(el.dataset.nav));
  const lb = $("#langBtn");
  if (lb) lb.onclick = () => switchLanguage();
  const tb = $("#themeBtn");
  if (tb) tb.onclick = () => {
    State.data.theme = State.data.theme === "light" ? "dark" : "light";
    State.save(); applyTheme(); Router.render();
  };
  const nb = $("#notifBtn");
  if (nb) nb.onclick = () => showNotificationsModal();
  const mb = $("#chatMentorBtn");
  if (mb) mb.onclick = () => Chat.open("mentor");
}

function bindSimple() { bindTopbar(); }

function switchLanguage() {
  State.data.language = State.data.language === "ar" ? "en" : "ar";
  State.save();
  applyLanguage();
  toast(State.data.language === "ar" ? "تم تحديث اللغة!" : "Language updated!", "🌐");
  Router.render();
}

function showNotificationsModal() {
  const items = State.data.notifications;
  modal(t("notifTitle"), items.length
    ? `<div style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow:auto">` +
      items.map(n => `<div class="hint-item">${n.emoji} ${esc(n.text)} <span class="dim small">· ${formatDate(n.time)}</span></div>`).join("") + `</div>`
    : `<p class="muted">${t("notifEmpty")}</p>`,
    [{ label: t("confirm"), primary: true, fn: () => {} }]);
}

/* ---------- modal ---------- */
function modal(title, bodyHtml, actions) {
  const ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.innerHTML = `<div class="modal"><h3>${title}</h3>${bodyHtml}<div class="m-actions"></div></div>`;
  const acts = $(".m-actions", ov);
  (actions || []).forEach(a => {
    const b = document.createElement("button");
    b.className = "btn " + (a.primary ? "btn-primary" : "");
    b.textContent = a.label;
    b.onclick = () => { ov.remove(); if (a.fn) a.fn(); };
    acts.appendChild(b);
  });
  ov.addEventListener("click", e => { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
}

/* ============================================================
   VIEW: welcome (language gate)
   ============================================================ */
const Views = {
  welcome() {
    return `
    <div class="welcome">
      <div class="big-logo">🚀</div>
      <h1 class="grad-text">${t("welcomeEmojiTitle")}</h1>
      <p class="lede">${t("welcomeLede")}</p>

      <div style="margin-bottom:14px;font-weight:700">${t("chooseLanguage")}</div>
      <div class="small dim" style="margin-bottom:18px">${t("chooseLanguageSub")}</div>

      <div class="lang-grid">
        <div class="lang-card" data-lang="ar">
          <span class="flag">🇸🇦</span><b>${t("arName")}</b><span>${t("arSub")}</span>
        </div>
        <div class="lang-card" data-lang="en">
          <span class="flag">🇬🇧</span><b>${t("enName")}</b><span>${t("enSub")}</span>
        </div>
      </div>

      <div class="name-row">
        <input id="welcomeName" type="text" placeholder="${t("namePlaceholder")}">
      </div>
      <div style="margin-top:18px">
        <button class="btn btn-primary btn-lg" id="welcomeGo">${t("continueBtn")}</button>
      </div>

      <div class="welcome-foot">🧱 ${t("brandSub")} — Learn by doing · تعلّم بالممارسة</div>
    </div>`;
  }
};

function bindWelcome() {
  let chosen = null;
  $$(".lang-card").forEach(card => {
    card.onclick = () => {
      chosen = card.dataset.lang;
      $$(".lang-card").forEach(c => c.style.borderColor = "");
      card.style.borderColor = "var(--accent)";
    };
  });
  $("#welcomeGo").onclick = () => {
    if (chosen) State.data.language = chosen;
    const name = $("#welcomeName").value.trim();
    if (name) State.data.name = name;
    State.save();
    if (!State.data.language) { toast(State.data.language === null ? "Choose a language 🌐" : "اختر لغة 🌐", "🌐"); return; }
    Router.go("pathpick");
  };
}

/* ============================================================
   VIEW: path picker
   ============================================================ */
Views.pathpick = function () {
  const cards = PATHS.map(id => {
    const p = I18N[State.data.language === "ar" ? "ar" : "en"].paths[id];
    const done = State.data.certificates[id];
    return `
    <div class="path-card" data-path="${id}" style="--pc:${PATH_INFO[id].color}">
      <span class="p-emoji">${p.emoji}</span>
      <h3>${p.name}</h3>
      <p class="p-desc">${p.desc}</p>
      <div class="p-meta">${p.meta.map(m => `<span class="chip">${m}</span>`).join("")}</div>
      ${done ? `<span class="chip" style="color:var(--warn)">🏆 ${t("completed")}</span>` : ""}
      <span class="p-cta">${t("startJourney")}</span>
    </div>`;
  }).join("");
  return topbarHtml("pathpick") + `
  <div class="page">
    <div class="paths-head">
      <div class="crumb">${t("choosePathCrumb")}</div>
      <h1 class="grad-text">${t("choosePath")}</h1>
      <p>${t("choosePathSub")}</p>
    </div>
    <div class="path-grid">${cards}</div>
  </div>`;
};

function bindPathpick() {
  bindTopbar();
  $$(".path-card").forEach(card => {
    card.onclick = () => {
      const id = card.dataset.path;
      if (State.data.path !== id) {
        if (State.data.path && State.data.path !== id && !confirm(t("choosePathSub"))) { /* still allow switch */ }
      }
      if (!State.data.startedAt) State.data.startedAt = Date.now();
      State.data.path = id;
      State.save();
      Router.go("map", id);
    };
  });
}

/* ============================================================
   VIEW: home (path overview → alias to map)
   ============================================================ */
Views.home = function () { return Views.map(State.data.path); };
function bindHome() { bindMap(State.data.path); }

/* ============================================================
   VIEW: learning map
   ============================================================ */
Views.map = function (pathId) {
  pathId = pathId || State.data.path;
  const units = allUnits(pathId);
  const pct = pathProgress(pathId);
  const info = I18N[State.data.language === "ar" ? "ar" : "en"].paths[pathId];

  let prevDone = true;
  const unitsHtml = units.map((u, ui) => {
    const total = u.steps.length;
    const done = u.steps.filter(s => State.data.completed[s.id]).length;
    const unitDone = done === total;
    /* Never re-lock a unit where the learner already has progress (or progress
       beyond it): inserting a new unit mid-path must not trap saved progress. */
    const hasProgress = units.slice(ui).some(x => x.steps.some(s => State.data.completed[s.id]));
    const locked = !prevDone && !hasProgress;
    prevDone = unitDone;

    const stepsHtml = u.steps.map(s => {
      const isDone = !!State.data.completed[s.id];
      const kindLabel = s.kind === "concept" ? t("concept") : (s.project ? t("project") : t("challenge"));
      const icon = s.kind === "concept" ? "📖" : (s.project ? "🏗️" : "⚡");
      const clickable = isDone || !locked;
      return `
      <button class="step ${isDone ? "done" : ""} ${locked ? "locked" : ""}" data-step="${s.id}" ${clickable ? "" : "disabled"}>
        <span class="s-ico">${locked ? "🔒" : (isDone ? "✓" : icon)}</span>
        <span class="s-main">
          <span class="s-title">${stepTitle(s)}</span>
          <span class="s-sub">${kindLabel} · +${s.xp} XP · ${s.skill}</span>
        </span>
        <span class="s-tag">${s.project ? "★" : ""}</span>
        <span class="s-check">${isDone ? "✅" : ""}</span>
      </button>`;
    }).join("");

    return `
    <div class="unit ${unitDone ? "done" : ""}">
      <div class="unit-head">
        <span class="u-badge">${u.emoji}</span>
        <h3>${L(u.title)}</h3>
        <span class="u-count">${done}/${total} ${t("steps")}</span>
      </div>
      <div class="unit-desc">${L(u.desc)}</div>
      <div class="steps">${stepsHtml}</div>
    </div>`;
  }).join("");

  const next = nextStepInfo(pathId);
  const cert = State.data.certificates[pathId];

  return topbarHtml("home") + `
  <div class="page">
    <div class="map-head">
      <span class="mh-icon">${info.emoji}</span>
      <div>
        <h1 class="grad-text">${info.name}</h1>
        <div class="mh-sub">${info.desc}</div>
      </div>
    </div>

    <div class="progress-line">
      <div class="pl-top">
        <span>${t("progress")}</span>
        <b>${pct}% ${t("pathProgress")}</b>
      </div>
      <div class="bar"><i style="width:${pct}%"></i></div>
    </div>

    ${next ? `<div style="margin:18px 0">
      <button class="btn btn-primary btn-lg" id="continueBtn">▶ ${t("continueUnit")}: ${stepTitle(next)}</button>
    </div>` : (cert ? `<div style="margin:18px 0"><button class="btn btn-primary btn-lg" id="seeCertBtn">🏆 ${t("openCerts")}</button></div>` : "")}

    <div class="small dim" style="margin:8px 0 18px">${t("mapTip")}</div>
    <div class="units">${unitsHtml}</div>
  </div>`;
};

function bindMap(pathId) {
  bindTopbar();
  pathId = pathId || State.data.path;
  $$(".step[data-step]").forEach(el => {
    el.onclick = () => { if (!el.disabled) Router.go("step", el.dataset.step); };
  });
  const cb = $("#continueBtn");
  if (cb) cb.onclick = () => Router.go("step", nextStepInfo(pathId).id);
  const sc = $("#seeCertBtn");
  if (sc) sc.onclick = () => Router.go("certificate", pathId);
}

/* ============================================================
   VIEW: dashboard
   ============================================================ */
Views.dashboard = function () {
  const path = State.data.path;
  const pct = path ? pathProgress(path) : 0;
  const stepsDone = path ? allSteps(path).filter(s => State.data.completed[s.id]).length : 0;
  const projectsDone = path ? allSteps(path).filter(s => s.project && State.data.completed[s.id]).length : 0;
  const concepts = Object.keys(State.data.seenConcepts).length;
  const certs = Object.keys(State.data.certificates).length;
  const level = levelFromXp(State.data.xp);
  const curXp = State.data.xp - xpForLevel(level);
  const nextXp = xpForLevel(level + 1) - xpForLevel(level);
  const info = path ? I18N[State.data.language === "ar" ? "ar" : "en"].paths[path] : null;
  const growth = path ? PATH_INFO[path].growth : null;
  const skills = path ? PATH_INFO[path].skills : [];

  const skillsHtml = skills.map((sk, i) => {
    const earned = i < Math.round(skills.length * pct / 100);
    return `<span class="skill-chip ${earned ? "on" : ""}">${earned ? "✓ " : ""}${sk}</span>`;
  }).join("");

  /* journey timeline */
  const j = [];
  if (State.data.startedAt) j.push({ emoji: "🚀", title: t("startedAt"), sub: formatDate(State.data.startedAt), done: true });
  if (path) j.push({ emoji: info.emoji, title: t("choosePath") + ": " + info.name, sub: "", done: true });
  if (concepts > 0) j.push({ emoji: "📖", title: concepts + " " + t("conceptsLearned"), sub: "", done: true });
  if (projectsDone > 0) j.push({ emoji: "🏗️", title: projectsDone + " " + t("projectsBuilt"), sub: "", done: true });
  if (certs > 0) j.push({ emoji: "🏆", title: certs + " " + t("certificatesEarned"), sub: "", done: true });
  const next = path ? nextStepInfo(path) : null;
  if (next) j.push({ emoji: "🎯", title: t("nextStep").replace(" →", ""), sub: stepTitle(next), done: false, active: true });

  return topbarHtml("dashboard") + `
  <div class="page">
    <h1 class="grad-text" style="margin-bottom:20px">👋 ${esc(State.data.name || t("defaultUserName"))}</h1>

    <div class="stats-grid">
      <div class="stat"><div class="st-num">${State.data.xp}</div><div class="st-lbl">⚡ ${t("xp")}</div></div>
      <div class="stat"><div class="st-num">${level}</div><div class="st-lbl">🌟 ${t("level")}</div></div>
      <div class="stat"><div class="st-num">${stepsDone}</div><div class="st-lbl">✅ ${t("steps")}</div></div>
      <div class="stat"><div class="st-num">${currentStreak()}</div><div class="st-lbl">🔥 ${t("streak")}</div></div>
      <div class="stat"><div class="st-num">${certs}</div><div class="st-lbl">🏆 ${t("certificatesEarned")}</div></div>
    </div>

    ${path ? `
    <div class="card">
      <h3>${info.emoji} ${info.name} — ${pct}%</h3>
      <div class="bar" style="margin-bottom:8px"><i style="width:${pct}%"></i></div>
      <div class="small dim">${t("level")} ${level}: ${curXp}/${nextXp} XP</div>
    </div>

    <div class="card">
      <h3>${t("journeyGrowth")} 🌱</h3>
      <div class="growth">
        <div class="g-col before">
          <div class="g-head">${t("startedHere")}</div>
          <blockquote>${L(growth.before)}</blockquote>
        </div>
        <div class="g-col now">
          <div class="g-head">${t("nowYouCan")}</div>
          <blockquote>${pct >= 100 ? L(growth.now) : L(growth.before)}</blockquote>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>🛠️ ${t("skillsGained")}</h3>
      <div class="skills">${skillsHtml}</div>
    </div>` : ``}

    <div class="dash-cols">
      <div class="card">
        <h3>🧭 ${t("yourJourney")}</h3>
        <div class="journey-list">
          ${j.map(it => `
          <div class="j-item ${it.done ? "done" : ""} ${it.active ? "active" : ""}">
            <div class="j-dot">${it.emoji}</div>
            <div class="j-body"><b>${it.title}</b><span>${it.sub}</span></div>
          </div>`).join("")}
        </div>
      </div>
      <div class="card">
        <h3>⚡ ${t("quickActions")}</h3>
        <div style="display:flex;flex-direction:column;gap:9px">
          <button class="btn" data-nav="map">🗺️ ${t("navHome")}</button>
          <button class="btn" data-act="mentor">🤖 ${t("chatMentor")}</button>
          <button class="btn" data-act="general">💬 ${t("chatGeneral")}</button>
          <button class="btn" data-act="pathchat">🧑‍🏫 ${t("chatPath")}</button>
          <button class="btn" data-nav="explore">🧭 ${t("navExplore")}</button>
        </div>
      </div>
    </div>
  </div>`;
};

function bindDashboard() {
  bindTopbar();
  $$("[data-nav]").forEach(el => el.onclick = () => Router.go(el.dataset.nav));
  const act = (k) => Chat.open(k);
  $$('[data-act="mentor"]').forEach(b => b.onclick = () => act("mentor"));
  $$('[data-act="general"]').forEach(b => b.onclick = () => act("general"));
  $$('[data-act="pathchat"]').forEach(b => b.onclick = () => act("path"));
}

/* ============================================================
   VIEW: achievements
   ============================================================ */
function unitDone(s, unitId) {
  if (!s || !s.path) return false;
  const u = allUnits(s.path).find(u => u.id === unitId);
  return !!u && u.steps.every(x => s.completed[x.id]);
}

const ACH_DEFS = [
  { id: "achFirstSteps", emoji: "👟", test: s => Object.keys(s.completed).length >= 1 },
  { id: "achConcept", emoji: "📖", test: s => Object.keys(s.seenConcepts).length >= 1 },
  { id: "achBuilder", emoji: "🏗️", test: s => allSteps(s.path).filter(x => x.project && s.completed[x.id]).length >= 1 },
  { id: "achFiveChallenges", emoji: "🔥", test: s => Object.keys(s.completed).length >= 5 },
  { id: "achFifteenChallenges", emoji: "⚒️", test: s => Object.keys(s.completed).length >= 15 },
  { id: "achThirty", emoji: "🌟", test: s => Object.keys(s.completed).length >= 30 },
  { id: "achStreak3", emoji: "🔥", test: s => currentStreak() >= 3 },
  { id: "achStreak7", emoji: "🌋", test: s => currentStreak() >= 7 },
  { id: "achUnit", emoji: "🏅", test: s => s.path && allUnits(s.path).some(u => u.steps.every(x => s.completed[x.id])) },
  { id: "achHalfway", emoji: "🏔️", test: s => s.path && pathProgress(s.path) >= 50 },
  { id: "achRecursion", emoji: "🌀", test: s => unitDone(s, "e3r") },
  { id: "achComposer", emoji: "🧬", test: s => unitDone(s, "e3h") },
  { id: "achToolbox", emoji: "🧰", test: s => !!s.completed["s-hof-proj"] },
  { id: "achGrid", emoji: "📐", test: s => unitDone(s, "w9") },
  { id: "achTesting", emoji: "🔬", test: s => unitDone(s, "e6") },
  { id: "achEnemyAi", emoji: "🤖", test: s => unitDone(s, "g6") },
  { id: "achWebCert", emoji: "🌐", test: s => !!s.certificates.web },
  { id: "achSeCert", emoji: "💻", test: s => !!s.certificates.se },
  { id: "achGameCert", emoji: "🎮", test: s => !!s.certificates.game },
  { id: "achPolyglot", emoji: "🌍", test: s => Object.keys(s.certificates).length >= 2 },
  { id: "achMaster", emoji: "👑", test: s => Object.keys(s.certificates).length >= 3 },
  { id: "achXp1k", emoji: "⚡", test: s => s.xp >= 1000 },
  { id: "achXp5k", emoji: "🏆", test: s => s.xp >= 5000 }
];

function checkAchievements() {
  const s = State.data;
  for (const def of ACH_DEFS) {
    let pass = false;
    try { pass = !!def.test(s); } catch (e) { pass = false; }
    if (pass && !s.achievements[def.id]) {
      s.achievements[def.id] = Date.now();
      toast(t("toastAch") + " " + t(def.id), def.emoji, "gold");
      notify(t("toastAch") + " " + t(def.id), def.emoji);
    }
  }
}

Views.achievements = function () {
  const cards = ACH_DEFS.map(def => {
    const earned = State.data.achievements[def.id];
    return `
    <div class="ach ${earned ? "earned" : ""}">
      <div class="a-emoji">${def.emoji}</div>
      <b>${t(def.id)}</b>
      <span>${t(def.id + "D")}</span>
      ${earned ? `<span class="a-date">${t("earnedOn")} ${formatDate(earned)}</span>` : `<span class="a-date dim">${t("notYetEarned")}</span>`}
    </div>`;
  }).join("");
  const earnedCount = ACH_DEFS.filter(d => State.data.achievements[d.id]).length;
  return topbarHtml("achievements") + `
  <div class="page">
    <div class="paths-head">
      <h1 class="grad-text">${t("achievements")}</h1>
      <p>${t("achievementsSub")}</p>
      <div class="chip lvl" style="margin-top:10px">${earnedCount}/${ACH_DEFS.length}</div>
    </div>
    <div class="ach-grid">${cards}</div>
  </div>`;
};

/* ============================================================
   VIEW: certificates (collection + single + verify)
   ============================================================ */
Views.certificates = function () {
  const ids = Object.keys(State.data.certificates);
  const cards = PATHS.map(pid => {
    const cert = State.data.certificates[pid];
    const info = I18N[State.data.language === "ar" ? "ar" : "en"].paths[pid];
    if (!cert) {
      const pct = pathProgress(pid === State.data.path ? State.data.path : pid);
      return `
      <div class="cert-card" style="opacity:.55">
        <span class="c-emoji">🔒</span>
        <h4>${info.name}</h4>
        <span class="small muted">${pct}% ${t("pathProgress")}</span>
      </div>`;
    }
    return `
    <div class="cert-card">
      <span class="c-emoji">🏆</span>
      <h4>${info.name}</h4>
      <span class="c-id">${cert.id}</span>
      <button class="btn btn-primary btn-sm" data-cert="${pid}">${t("viewCert")}</button>
    </div>`;
  }).join("") + (function () {
    /* Grand Master certificate — one for getting everything */
    const lang = State.data.language === "ar" ? "ar" : "en";
    const info = I18N[lang].paths.master;
    const cert = State.data.certificates.master;
    if (cert) return `
    <div class="cert-card">
      <span class="c-emoji">${info.emoji}</span>
      <h4>${info.name}</h4>
      <span class="c-id">${cert.id}</span>
      <button class="btn btn-primary btn-sm" data-cert="master">${t("viewCert")}</button>
    </div>`;
    const pct = Math.round(PATHS.reduce((sum, p) => sum + pathProgress(p), 0) / PATHS.length);
    return `
    <div class="cert-card" style="opacity:.55">
      <span class="c-emoji">🔒</span>
      <h4>${info.name}</h4>
      <span class="small muted">${pct}% ${t("masterCertLocked")}</span>
    </div>`;
  })();
  return topbarHtml("certificates") + `
  <div class="page">
    <div class="paths-head">
      <h1 class="grad-text">🏆 ${t("certificates")}</h1>
      <p>${t("certificatesSub")}</p>
    </div>
    ${ids.length === 0 ? `<div class="cert-empty"><span class="ce-emoji">🎓</span>${t("noCerts")}</div>` : ""}
    <div class="certs-grid">${cards}</div>
  </div>`;
};

function bindCertificates() {
  bindTopbar();
  $$("[data-cert]").forEach(b => b.onclick = () => Router.go("certificate", b.dataset.cert));
}

/* ---------- single certificate ---------- */
function certSheetHtml(pid) {
  const cert = State.data.certificates[pid];
  if (!cert) return `<div class="cert-empty">${t("noCerts")}</div>`;
  const lang = State.data.language === "ar" ? "ar" : "en";
  const info = I18N[lang].paths[pid];
  const name = State.data.name || cert.name || t("defaultUserName");
  return `
  <div class="cert-sheet ${lang === "ar" ? "rtl" : ""}" id="certSheet">
    <div class="cs-border"></div>
    <div class="cs-logo">🚀</div>
    <h1>${t("certTitle")}</h1>
    <div>${t("certPresented")}</div>
    <div class="cs-name">${esc(name)}</div>
    <div class="cs-line"></div>
    <div>${t("certForCompleting")}</div>
    <div class="cs-path">${info.name}</div>
    <div class="cs-date">${t("certDate")}: ${formatDate(cert.date)}</div>
    <div class="cs-id">${t("certId")}: ${cert.id}</div>
    <div class="cs-skills">${(cert.skills || []).map(s => `<span>${s}</span>`).join("")}</div>
    <div class="cs-quote">${lang === "ar"
      ? "«لم أكتفِ بإكمال دورة — بل بنيت أشياء، وحللت مسائل، وطورّت مهارات حقيقية.»"
      : "“I didn't just finish a course. I built things, solved problems, and developed real skills.”"}</div>
    <div class="cs-sig">
      <div class="sig">CodeQuest — ${t("brandSub")}</div>
      <div class="sig">${t("certVerifyNote")}: #/verify/${cert.id}</div>
    </div>
  </div>`;
}

Views.certificate = function (pid) {
  const cert = State.data.certificates[pid];
  if (!cert) return topbarHtml("certificates") + `<div class="page"><div class="cert-empty">${t("noCerts")}</div></div>`;
  const tabIds = PATHS.filter(p => State.data.certificates[p]);
  if (State.data.certificates.master) tabIds.push("master");
  const tabs = tabIds.map(p => `
    <button class="btn btn-sm ${p === pid ? "active" : ""}" data-cert-tab="${p}">${I18N[State.data.language === "ar" ? "ar" : "en"].paths[p].emoji} ${I18N[State.data.language === "ar" ? "ar" : "en"].paths[p].name}</button>`).join("");
  return topbarHtml("certificates") + `
  <div class="page">
    <div class="cert-nav">${tabs}</div>
    ${certSheetHtml(pid)}
    <div class="cert-actions">
      <button class="btn" id="printCertBtn">${t("printCert")}</button>
      <button class="btn" id="pdfCertBtn">${t("pdfCert")}</button>
      <button class="btn" id="shareCertBtn">${t("shareCert")}</button>
      <button class="btn" id="copyIdBtn">${t("copyId")}</button>
    </div>
    <div style="text-align:center"><button class="btn btn-ghost btn-sm" data-nav="certificates">${t("backToCerts")}</button></div>
  </div>`;
};

function bindCertificate(pid) {
  bindTopbar();
  $$('[data-cert-tab]').forEach(b => b.onclick = () => Router.go("certificate", b.dataset.certTab));
  $$('[data-nav]').forEach(el => el.onclick = () => Router.go(el.dataset.nav));
  const cert = State.data.certificates[pid];
  if (!cert) return;
  const shareUrl = location.origin + location.pathname + "#/verify/" + cert.id;
  $("#printCertBtn").onclick = () => window.print();
  $("#pdfCertBtn").onclick = () => { toast(State.data.language === "ar" ? "اختر «حفظ كـ PDF» في نافذة الطباعة" : "Choose \"Save as PDF\" in the print dialog", "📄"); setTimeout(() => window.print(), 400); };
  $("#shareCertBtn").onclick = () => copyText(shareUrl);
  $("#copyIdBtn").onclick = () => copyText(cert.id);
}

function copyText(text) {
  const done = () => toast(t("copied"), "📋");
  const fail = () => toast(t("shareFailed"), "⚠️");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => { legacyCopy(text) ? done() : fail(); });
  } else {
    legacyCopy(text) ? done() : fail();
  }
}
function legacyCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove();
    return ok;
  } catch (e) { return false; }
}

/* ---------- verification ---------- */
Views.verify = function (queryId) {
  const cert = queryId ? findCertById(queryId) : null;
  return topbarHtml() + `
  <div class="page verify-wrap">
    <h1 class="grad-text">🛡️ ${t("verifyTitle")}</h1>
    <p class="muted" style="margin:8px 0 18px">${t("verifySub")}</p>
    <form id="verifyForm" style="display:flex;gap:9px">
      <input id="verifyInput" type="text" placeholder="${t("verifyPlaceholder")}" value="${esc(queryId || "")}" style="direction:ltr;text-align:start">
      <button class="btn btn-primary" type="submit">${t("verifyBtn")}</button>
    </form>
    <div id="verifyResult">${cert ? verifyResultHtml(cert, queryId) : (queryId ? verifyInvalidHtml() : "")}</div>
  </div>`;
};

function findCertById(id) {
  for (const pid of Object.keys(State.data.certificates)) {
    if (State.data.certificates[pid].id === id) return { cert: State.data.certificates[pid], pathId: pid };
  }
  return null;
}

function verifyResultHtml(found, id) {
  const { cert, pathId } = found;
  const info = I18N[State.data.language === "ar" ? "ar" : "en"].paths[pathId];
  return `
  <div class="verify-badge">✅</div>
  <div class="chip" style="color:var(--ok);font-size:14px">${t("verifyValid")}</div>
  <div class="verify-table">
    <div class="v-row"><b>${t("verifyHolder")}</b><span>${esc(cert.name || State.data.name || t("defaultUserName"))}</span></div>
    <div class="v-row"><b>${t("verifyPath")}</b><span>${info.name}</span></div>
    <div class="v-row"><b>${t("verifyIssued")}</b><span>${formatDate(cert.date)}</span></div>
    <div class="v-row"><b>${t("certId")}</b><span>${cert.id}</span></div>
    <div class="v-row"><b>${t("verifySkills")}</b><span>${(cert.skills || []).join(" · ")}</span></div>
    <div class="v-row"><b>${t("verifyStatus")}</b><span>${t("verifyStatusValid")}</span></div>
  </div>`;
}
function verifyInvalidHtml() {
  return `
  <div class="verify-badge invalid">❌</div>
  <div class="chip" style="color:var(--bad);font-size:14px">${t("verifyInvalid")}</div>
  <div style="margin-top:14px"><button class="btn btn-sm" id="tryAnotherBtn">${t("tryAnother")}</button></div>`;
}

function bindVerify() {
  bindTopbar();
  $("#verifyForm").onsubmit = async (e) => {
    e.preventDefault();
    const v = $("#verifyInput").value.trim();
    Router.go("verify", v);
    /* remote check: the registry is shared across devices */
    try {
      const r = await fetch(Sync.endpoint() + "/certs/" + encodeURIComponent(v));
      if (r.ok) {
        const out = await r.json();
        if (out.ok && out.cert && !findCertById(v)) {
          /* known on the server but not on this device: show the server's record */
          const box = $("#verifyResult");
          if (box) box.innerHTML = verifyResultHtml({ cert: out.cert, pathId: out.cert.pathId }, v);
          return;
        }
      }
    } catch (e) { /* server not running — local-only verification already rendered */ }
  };
  const ta = $("#tryAnotherBtn");
  if (ta) ta.onclick = () => Router.go("verify");
}

/* ============================================================
   VIEW: explore
   ============================================================ */
Views.explore = function () {
  const path = State.data.path || "web";
  const topics = EXPLORE_TOPICS[path] || [];
  const pct = pathProgress(path);
  const cards = topics.map(tp => {
    const unlocked = true; // topics are open — the world is explorable
    const seen = State.data.explored && State.data.explored[tp.id];
    return `
    <div class="explore-card">
      <span class="e-ico">${tp.emoji}</span>
      <h4>${L(tp.title)}</h4>
      <p>${L(tp.body).slice(0, 90)}…</p>
      <button class="e-open" data-topic="${tp.id}">${seen ? "↻ " : ""}${t("open")} →</button>
    </div>`;
  }).join("");
  return topbarHtml("explore") + `
  <div class="page">
    <div class="paths-head">
      <h1 class="grad-text">🧭 ${t("exploreTitle")}</h1>
      <p>${t("exploreSub")}</p>
    </div>
    <div class="explore-grid">${cards}</div>
  </div>`;
};

function bindExplore() {
  bindTopbar();
  $$('[data-topic]').forEach(b => {
    b.onclick = () => {
      const tp = (EXPLORE_TOPICS[State.data.path || "web"] || []).find(x => x.id === b.dataset.topic);
      if (!tp) return;
      State.data.explored = State.data.explored || {};
      State.data.explored[tp.id] = true;
      addXp(5);
      State.data.leveled = null;   /* level-ups here already fired their own celebration */
      State.save();
      modal(L(tp.title), `<div style="max-height:340px;overflow:auto">${mdLite(L(tp.body))}</div>`, [{ label: t("confirm"), primary: true }]);
    };
  });
}

/* ============================================================
   VIEW: roadmap (languages & technologies per path)
   ============================================================ */
Views.roadmap = function () {
  const lang = State.data.language === "ar" ? "ar" : "en";
  const cards = PATHS.map(id => {
    const p = PATH_INFO[id];
    const stages = ROADMAP_DATA[id] || [];
    const units = allUnits(id);
    const pct = pathProgress(id);
    const ns = nextStepInfo(id);
    const nsUnitId = ns && findStep(ns.id) ? findStep(ns.id).unit.id : null;
    const stageRows = stages.map(st => {
      const unit = units.find(u => u.id === st.id);
      const unitDone = unit && unit.steps.every(s => State.data.completed[s.id]);
      const badge = unitDone ? t("roadmapDone") : (State.data.path === id && st.id === nsUnitId ? t("roadmapInProgress") : "");
      return `
      <div class="rm-stage${unitDone ? " done" : ""}">
        <span class="rm-dot" aria-hidden="true"></span>
        <div class="rm-stage-body">
          <div class="rm-stage-head">
            <b>${st.emoji} ${esc(L(st.title))}</b>
            ${badge ? `<span class="rm-badge">${badge}</span>` : ""}
          </div>
          <div class="rm-tools">${st.tools.map(tool => `<span class="chip">${esc(tool)}</span>`).join("")}</div>
          <p class="rm-build"><span>${t("roadmapYouBuild")}</span> ${esc(L(st.youBuild))}</p>
        </div>
      </div>`;
    }).join("");
    const chipLine = `
      <div class="rm-chips">${stages.flatMap(st => st.tools).map(tool => `<span class="chip">${esc(tool)}</span>`).join("")}</div>`;
    return `
    <section class="rm-card" style="--pc:${p.color}">
      <div class="rm-head">
        <div>
          <h3>${I18N[lang].paths[id].emoji} ${pathName(id)}</h3>
          <span class="rm-meta">${t("roadmapStages")}: ${stages.length} · ${t("progress")}: ${pct}%</span>
        </div>
        ${pct > 0 && State.data.path === id ? `<span class="rm-badge">${t("roadmapInProgress")}</span>` : ""}
      </div>
      <div class="rm-timeline">${stageRows}</div>
      <div class="rm-foot">
        <span class="rm-foot-label">${t("roadmapIntro")}</span>
        ${chipLine}
      </div>
    </section>`;
  }).join("");
  return topbarHtml("roadmap") + `
  <div class="page">
    <div class="paths-head">
      <h1 class="grad-text">🗺️ ${t("roadmapTitle")}</h1>
      <p>${t("roadmapSub")}</p>
    </div>
    <div class="rm-grid">${cards}</div>
  </div>`;
};

function bindRoadmap() { bindTopbar(); }

/* ============================================================
   VIEW: settings
   ============================================================ */
/* ============================================================
   SYNC — optional cloud sync via the bundled Node server
   Identity = a 4x4 sync code (XXXX-XXXX-XXXX-XXXX). The code IS
   the credential (know-it-to-sync-it); it lives in localStorage.
   ============================================================ */
const Sync = {
  endpoint() { return State.data.syncServer || (location.origin + "/api"); },
  enabled() { return !!State.data.syncId; },
  code() { return State.data.syncId || ""; },

  genCode() {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const blk = () => Array.from({ length: 4 }, () => chars[(Math.random() * chars.length) | 0]).join("");
    return blk() + "-" + blk() + "-" + blk() + "-" + blk();
  },

  enable() {
    State.data.syncId = this.genCode();
    State.save();
    return this.push(true);
  },

  disable() {
    delete State.data.syncId;
    State.data.lastSyncAt = 0;
    State.save();
  },

  async push(isFirst) {
    if (!this.enabled()) return { ok: false, offline: true };
    try {
      const r = await fetch(this.endpoint() + "/sync/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncId: this.code(), payload: State.data })
      });
      const out = await r.json();
      if (out.ok) {
        State.data.lastSyncAt = Date.now();
        State.save();
        if (!isFirst) toast(t("syncPushed"), "☁️");
      }
      return out;
    } catch (e) { return { ok: false, offline: true }; }
  },

  async pull() {
    if (!this.enabled()) return { ok: false, offline: true };
    try {
      const r = await fetch(this.endpoint() + "/sync/pull?syncId=" + encodeURIComponent(this.code()));
      if (r.status === 404) return { ok: false, missing: true };
      const out = await r.json();
      if (!out.ok || !out.profile) return out;
      const mine = State.data;
      const srv = out.profile;
      const union = (a, b) => { const o = Object.assign({}, b); for (const k of Object.keys(a || {})) if (!(k in o)) o[k] = a[k]; return o; };
      const newer = (a, b) => (!a ? (b || null) : !b ? (a || null) : (b > a ? b : a));
      const merged = {
        language: mine.language, theme: mine.theme, accent: mine.accent,  /* device prefs stay local */
        name: mine.name || srv.name || "",
        path: mine.path || srv.path,
        startedAt: newer(mine.startedAt, srv.startedAt),
        xp: Math.max(Number(mine.xp) || 0, Number(srv.xp) || 0),
        completed: union(mine.completed, srv.completed),
        seenConcepts: union(mine.seenConcepts, srv.seenConcepts),
        achievements: union(mine.achievements, srv.achievements),
        certificates: union(mine.certificates, srv.certificates),
        chatLog: union(mine.chatLog, srv.chatLog),
        notifications: (mine.notifications.length >= (srv.notifications || []).length ? mine.notifications : srv.notifications),
        hintsUsed: union(mine.hintsUsed, srv.hintsUsed),
        dayLog: union(mine.dayLog, srv.dayLog),
        explored: union(mine.explored, srv.explored)
      };
      const changed = JSON.stringify(merged.completed) !== JSON.stringify(mine.completed)
        || merged.xp !== mine.xp || JSON.stringify(merged.certificates) !== JSON.stringify(mine.certificates)
        || JSON.stringify(merged.achievements) !== JSON.stringify(mine.achievements);
      State.data = Object.assign(State.defaults(), State.data, merged);
      State.save();
      applyLanguage(); applyTheme();
      if (changed) { toast(t("syncMerged"), "☁️"); Router.render(); }
      return { ok: true, changed };
    } catch (e) { return { ok: false, offline: true }; }
  },

  /* link this browser to an EXISTING code typed into settings */
  async link(code) {
    const id = String(code || "").trim().toUpperCase();
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(id)) return { ok: false, badCode: true };
    const prev = this.code();
    State.data.syncId = id;
    State.save();
    const r = await this.pull();          /* fetch the cloud profile first */
    if (r.offline) {                       /* server unreachable: keep the code, will retry later */
      State.data.lastSyncAt = 0; State.save();
      return { ok: true, linkedOffline: true };
    }
    if (r.missing) {                       /* fresh code: seed the cloud with this device */
      await this.push(true);
      return { ok: true, seeded: true };
    }
    void prev;
    return { ok: true, changed: r.changed };
  }
};

/* push after every meaningful save (debounced) */
let __syncTimer = null;
function autoSyncPush() {
  if (!Sync.enabled()) return;
  clearTimeout(__syncTimer);
  __syncTimer = setTimeout(() => { Sync.push(); }, 1200);
}
const __origStateSave = State.save.bind(State);
State.save = function () { __origStateSave(); autoSyncPush(); };

/* ============================================================
   AUTH — accounts, login/signup, admin
   Talks to server.js /api/auth/*. Guest browsing stays fully
   supported; accounts add a password-protected profile that
   remembers your progress code on any device.
   ============================================================ */
const Auth = {
  KEY: "codequest.auth",
  user: null,
  token: null,

  load() {
    try {
      const a = JSON.parse(localStorage.getItem(this.KEY) || "null");
      if (a && a.token && a.user) { this.token = a.token; this.user = a.user; }
    } catch (e) {}
  },
  persist() {
    try { localStorage.setItem(this.KEY, JSON.stringify({ token: this.token, user: this.user })); } catch (e) {}
  },
  clear() { this.token = null; this.user = null; try { localStorage.removeItem(this.KEY); } catch (e) {} },
  isAdmin() { return !!(this.user && this.user.role === "admin"); },

  async api(path, opts) {
    opts = opts || {};
    const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    if (this.token) headers.Authorization = "Bearer " + this.token;
    try {
      const r = await fetch(location.origin + "/api/auth/" + path, Object.assign({}, opts, { headers }));
      const out = await r.json().catch(() => ({}));
      if (r.status === 401 && this.token && path !== "login" && path !== "signup") this.clear();
      return Object.assign({ ok: false, error: "offline" }, out, { status: r.status });
    } catch (e) { return { ok: false, error: "offline" }; }
  },

  /* verify the saved token against the server (once at boot) */
  async refresh() {
    if (!this.token) return;
    const out = await this.api("me");
    if (out.ok) { this.user = out.user; this.persist(); }
    else if (!this.token) Router.render();          /* session died server-side */
  },

  async signup(username, password, name) {
    const out = await this.api("signup", { method: "POST", body: JSON.stringify({ username, password, name, syncId: Sync.code() || "" }) });
    if (out.ok) {
      this.token = out.token; this.user = out.user; this.persist();
      if (out.syncId && !Sync.enabled()) {
        const r = await Sync.link(out.syncId);
        if (r.ok) toast(t("authSyncLinked"), "☁️");
      }
      toast(t("authWelcomeToast") + (this.user.name ? ", " + this.user.name : "") + " 🎉", "👋");
    }
    return out;
  },

  async login(username, password) {
    const out = await this.api("login", { method: "POST", body: JSON.stringify({ username, password }) });
    if (out.ok) {
      this.token = out.token; this.user = out.user; this.persist();
      if (out.syncId && !Sync.enabled()) {
        const r = await Sync.link(out.syncId);
        if (r.ok) toast(t("authSyncLinked"), "☁️");
      }
      toast(t("authWelcomeToast") + (this.user.name ? ", " + this.user.name : "") + " 🎉", "👋");
    }
    return out;
  },

  async logout() {
    await this.api("logout", { method: "POST" });
    this.clear();
  },

  async listUsers() { return this.api("users"); },
  async setRole(id, role) { return this.api("users/" + id + "/role", { method: "POST", body: JSON.stringify({ role }) }); },
  async deleteUser(id) { return this.api("users/" + id, { method: "DELETE" }); },
  async resetUserPassword(id) { return this.api("users/" + id + "/password", { method: "POST", body: "{}" }); },
  async changePassword(currentPassword, newPassword) { return this.api("password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) }); },
  async status() { return this.api("status"); }
};

/* map server error codes to bilingual messages */
function authErrMsg(code) {
  const map = {
    invalid_username: "errInvalidUsername", invalid_password: "errInvalidPassword",
    username_taken: "errUsernameTaken", bad_credentials: "errBadCredentials",
    unauthorized: "errUnauthorized", forbidden: "errForbidden",
    self_delete: "errSelfDelete", last_admin: "errLastAdmin", not_found: "errNotFound",
    wrong_current: "errWrongCurrent"
  };
  return t(map[code] || "errOffline");
}

/* ---------- views: login / signup / account ---------- */
function authFormHtml(m) {
  const signup = m === "signup";
  return `
    <div class="card auth-card">
      <h1 class="grad-text" style="margin-bottom:4px">${signup ? "🚀 " + t("authSignupTitle") : "🔐 " + t("authLoginTitle")}</h1>
      <p class="muted small" style="margin-bottom:16px">${t(signup ? "authSignupSub" : "authLoginSub")}</p>
      <div class="seg auth-tabs">
        <button id="tabLogin" class="${!signup ? "active" : ""}">${t("tabLogin")}</button>
        <button id="tabSignup" class="${signup ? "active" : ""}">${t("tabSignup")}</button>
      </div>
      <form id="authForm" novalidate>
        <label class="fld"><span>${t("usernameLabel")}</span>
          <input id="authUser" type="text" autocomplete="username" placeholder="${t("usernamePlaceholder")}" style="direction:ltr">
        </label>
        ${signup ? `
        <label class="fld"><span>${t("displayNameLabel")}</span>
          <input id="authName" type="text" autocomplete="name" placeholder="${t("namePlaceholder")}">
        </label>` : ""}
        <label class="fld"><span>${t("passwordLabel")}</span>
          <input id="authPass" type="password" autocomplete="${signup ? "new-password" : "current-password"}" placeholder="${t("passwordPlaceholder")}" style="direction:ltr">
          <em class="small dim">${t("passwordHint")}</em>
        </label>
        <div id="authErr" class="auth-err" style="display:none"></div>
        <button type="submit" class="btn btn-primary btn-lg" id="authSubmit" style="width:100%">${t(signup ? "authSignupBtn" : "authLoginBtn")}</button>
      </form>
      <p class="muted small" style="margin-top:14px;text-align:center">${t(signup ? "authSwitchToLogin" : "authSwitchToSignup")}</p>
      ${signup ? `<p class="muted small" id="adminHint" style="display:none;text-align:center">${t("authFirstAdminHint")}</p>` : ""}
      <p class="muted small" style="text-align:center;margin-top:6px">${t("authGuestNote")}</p>
    </div>`;
}

function accountCardHtml() {
  const u = Auth.user;
  return `
    <div class="card auth-card">
      <h1 class="grad-text" style="margin-bottom:4px">👤 ${t("authAccountTitle")}</h1>
      <p class="muted small" style="margin-bottom:16px">${t("authLoggedInAs")} <b>${esc(u.name || u.username)}</b></p>
      <div class="set-row">
        <div class="sr-main"><b>${esc(u.name || u.username)}</b><span>@${esc(u.username)}</span></div>
        <span class="role-badge ${u.role === "admin" ? "admin" : ""}">${u.role === "admin" ? "⭐ " + t("roleAdmin") : t("roleUser")}</span>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
        ${u.role === "admin" ? `<button class="btn" data-nav="admin">🛠 ${t("authAdminPanelBtn")}</button>` : ""}
        <button class="btn" data-nav="settings">⚙️ ${t("authSettingsBtn")}</button>
        <button class="btn" id="passToggleBtn">🔑 ${t("passChangeBtn")}</button>
        <button class="btn btn-danger" id="logoutBtn">${t("logoutBtn")}</button>
      </div>
      <div id="passBox" class="pass-box" style="display:none">
        <h3 style="margin:0 0 10px">🔑 ${t("passChangeTitle")}</h3>
        <form id="passForm" novalidate>
          <label class="fld"><span>${t("passCurrent")}</span>
            <input id="passCurrent" type="password" autocomplete="current-password" style="direction:ltr">
          </label>
          <label class="fld"><span>${t("passNew")}</span>
            <input id="passNew" type="password" autocomplete="new-password" style="direction:ltr">
            <em class="small dim">${t("passwordHint")}</em>
          </label>
          <label class="fld"><span>${t("passNew2")}</span>
            <input id="passNew2" type="password" autocomplete="new-password" style="direction:ltr">
          </label>
          <p class="muted small" style="margin:2px 0 10px">${t("passChangeHint")}</p>
          <div id="passErr" class="auth-err" style="display:none"></div>
          <button type="submit" class="btn btn-primary" id="passSubmit">${t("passSave")}</button>
        </form>
      </div>
    </div>`;
}

Views.auth = function (mode) {
  const m = mode === "signup" ? "signup" : "login";
  return topbarHtml("auth") + `<div class="page page-narrow">${Auth.user ? accountCardHtml() : authFormHtml(m)}</div>`;
};

function bindAuthView(mode) {
  bindTopbar();
  if (Auth.user) {
    const lb = $("#logoutBtn");
    if (lb) lb.onclick = async () => { await Auth.logout(); toast(t("logoutBtn") + " ✓", "👋"); Router.render(); };
    /* change password */
    const pt = $("#passToggleBtn");
    const box = $("#passBox");
    if (pt && box) pt.onclick = () => {
      box.style.display = box.style.display === "none" ? "block" : "none";
      if (box.style.display === "block") $("#passCurrent").focus();
    };
    const pf = $("#passForm");
    if (pf) pf.onsubmit = async (e) => {
      e.preventDefault();
      const perr = $("#passErr");
      perr.style.display = "none";
      const cur = $("#passCurrent").value;
      const next = $("#passNew").value;
      const next2 = $("#passNew2").value;
      const showPassErr = (msg) => { perr.textContent = msg; perr.style.display = "block"; };
      if (next.length < 6) return showPassErr(t("errInvalidPassword"));
      if (next !== next2) return showPassErr(t("passMismatch"));
      const btn = $("#passSubmit"); btn.disabled = true;
      const out = await Auth.changePassword(cur, next);
      btn.disabled = false;
      if (out.ok) {
        pf.reset();
        box.style.display = "none";
        toast(t("passChanged"), "🔒");
      } else {
        showPassErr(authErrMsg(out.error));
      }
    };
    return;
  }
  const m = mode === "signup" ? "signup" : "login";
  const tabL = $("#tabLogin"); if (tabL) tabL.onclick = () => { location.hash = "#/auth/login"; };
  const tabS = $("#tabSignup"); if (tabS) tabS.onclick = () => { location.hash = "#/auth/signup"; };
  const err = $("#authErr");
  const showErr = (msg) => { err.textContent = msg; err.style.display = "block"; };
  const hint = $("#adminHint");
  if (hint) {
    Auth.status().then(s => { if (hint) hint.style.display = (s.ok && s.adminExists) ? "none" : "block"; });
  }
  $("#authForm").onsubmit = async (e) => {
    e.preventDefault();
    err.style.display = "none";
    const username = $("#authUser").value.trim();
    const password = $("#authPass").value;
    if (m === "signup" && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) return showErr(t("errInvalidUsername"));
    if (m === "signup" && password.length < 6) return showErr(t("errInvalidPassword"));
    if (m === "login" && (!username || !password)) return showErr(t("errBadCredentials"));
    const btn = $("#authSubmit"); btn.disabled = true;
    const nameInput = $("#authName");
    const out = m === "signup"
      ? await Auth.signup(username, password, nameInput ? nameInput.value.trim() : "")
      : await Auth.login(username, password);
    btn.disabled = false;
    if (out.ok) { Router.go("home"); Router.render(); }
    else showErr(authErrMsg(out.error));
  };
}

/* ---------- view: admin panel ---------- */
Views.admin = function () {
  return topbarHtml("admin") + `
  <div class="page">
    <h1 class="grad-text" style="margin-bottom:6px">🛠 ${t("adminTitle")}</h1>
    <p class="muted small" style="margin-bottom:16px">${t("adminSub")}</p>
    <div class="stats-grid" id="adminStats">
      <div class="stat"><div class="st-num">—</div><div class="st-lbl">👥 ${t("adminUsersStat")}</div></div>
      <div class="stat"><div class="st-num">—</div><div class="st-lbl">⭐ ${t("adminAdminsStat")}</div></div>
      <div class="stat"><div class="st-num">—</div><div class="st-lbl">⚡ ${t("adminTotalXpStat")}</div></div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">👥 ${t("navAdmin")}</h3>
        <button class="btn btn-sm" id="adminRefreshBtn">${t("adminRefresh")}</button>
      </div>
      <div class="admin-search">
        <input type="search" id="adminSearch" placeholder="${t("adminSearchPlaceholder")}" autocomplete="off">
        <button class="clear-btn" id="adminSearchClear" title="${t("adminSearchClear")}" aria-label="${t("adminSearchClear")}" style="display:none">✕</button>
      </div>
      <div id="adminTable" class="muted small">${t("adminEmpty")}</div>
    </div>
  </div>`;
};

const AdminSearch = { q: "" };

/* case-insensitive substring match on @username, display name, sync code (dash/space-insensitive for codes) */
function adminUserMatches(u, q) {
  const t = q.toLowerCase().replace(/[-\s]/g, "");
  const name = String(u.name || "").toLowerCase();
  const user = String(u.username || "").toLowerCase();
  const code = String(u.syncId || "").toLowerCase().replace(/[-\s]/g, "");
  return user.indexOf(t) !== -1 || name.indexOf(t) !== -1 || code.indexOf(t) !== -1;
}

/* re-render only the visible subset of an already-loaded table (stats stay global) */
function renderAdminMatches() {
  const tbody = document.querySelector("#adminTable tbody");
  const inp = $("#adminSearch");
  if (!tbody || !AdminSearch.rows) return;
  const rows = AdminSearch.rows;
  const q = AdminSearch.q.trim();
  const me = Auth.user;
  const hits = q ? rows.filter(u => adminUserMatches(u, q)) : rows;
  if (inp) inp.value = AdminSearch.q;
  const cb = $("#adminSearchClear");
  if (cb) cb.style.display = q ? "" : "none";
  tbody.innerHTML = hits.length ? hits.map(u => adminRowHtml(u, me)).join("") :
    `<tr><td colspan="7"><span class="muted small">${esc(t("adminNoResults").replace("%@", q))}</span></td></tr>`;
  bindAdminRowActions(tbody);
}

/* one table row — shared by the initial render and live filtering */
function adminRowHtml(u, me) {
  return `
          <tr>
            <td><b>${esc(u.name || u.username)}</b><br><span class="muted small">@${esc(u.username)}</span></td>
            <td><span class="role-badge ${u.role === "admin" ? "admin" : ""}">${u.role === "admin" ? "⭐ " + t("roleAdmin") : t("roleUser")}</span></td>
            <td>${u.syncId ? `<span class="sync-code" title="${esc(u.syncId)}">${esc(u.syncId)}</span>` : `<span class="muted small">—</span>`}</td>
            <td>${formatDate(u.createdAt)}</td>
            <td>${u.lastLoginAt ? formatDate(u.lastLoginAt) : t("adminNever")}</td>
            <td>${u.xp || 0}</td>
            <td style="white-space:nowrap">
              ${u.id === me.id ? `<span class="muted small">${t("adminNever")}</span>` : `
              <button class="btn btn-sm" data-roleid="${u.id}" data-torole="${u.role === "admin" ? "user" : "admin"}">${u.role === "admin" ? t("adminRemoveAdmin") : t("adminMakeAdmin")}</button>
              <button class="btn btn-sm" data-resetid="${u.id}" title="${t("adminResetPass")}">🔑</button>
              <button class="btn btn-sm btn-danger" data-delid="${u.id}">🗑</button>`}
            </td>
          </tr>`;
}

/* wire the row action buttons inside the rendered tbody */
function bindAdminRowActions(scope) {
  $$("[data-roleid]", scope).forEach(b => {
    b.onclick = async () => {
      const r = await Auth.setRole(b.dataset.roleid, b.dataset.torole);
      if (r.ok) toast(t("saved"), "✅");
      else toast(authErrMsg(r.error), "⚠️", "bad");
      bindAdminView();
    };
  });
  $$("[data-delid]", scope).forEach(b => {
    b.onclick = () => {
      modal(t("adminDeleteConfirmTitle"), `<p>${t("adminDeleteConfirmBody")}</p>`, [
        { label: t("cancel") },
        { label: t("adminDelete"), primary: true, fn: async () => {
            const r = await Auth.deleteUser(b.dataset.delid);
            if (r.ok) toast(t("saved"), "🗑️");
            else toast(authErrMsg(r.error), "⚠️", "bad");
            bindAdminView();
          } }
      ]);
    };
  });
  /* reset a user's password to a one-time temporary one (shown to the admin) */
  $$("[data-resetid]", scope).forEach(b => {
    b.onclick = () => {
      modal(t("adminResetConfirmTitle"), `<p>${t("adminResetConfirmBody")}</p>`, [
        { label: t("cancel") },
        { label: t("adminResetPass"), primary: true, fn: async () => {
            const r = await Auth.resetUserPassword(b.dataset.resetid);
            if (r.ok && r.tempPassword) {
              modal(t("adminResetDoneTitle"), `
                <p>${t("adminResetDoneBody")}</p>
                <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
                  <span class="sync-code" id="adminTempPass">${esc(r.tempPassword)}</span>
                  <button class="btn btn-sm" id="adminCopyTempPass">${t("copyBtn")}</button>
                </div>`, [
                { label: t("done"), primary: true }
              ]);
              const cp = $("#adminCopyTempPass");
              if (cp) cp.onclick = () => copyText(r.tempPassword);
              toast(t("adminResetToast"), "🔑");
            } else toast(authErrMsg(r.error), "⚠️", "bad");
          } }
      ]);
    };
  });
  /* click a sync code to copy it (troubleshooting cloud progress) */
  $$(".sync-code", scope).forEach(s => {
    s.onclick = () => copyText(s.textContent.trim());
  });
}

function bindAdminView() {
  bindTopbar();
  const refreshBtn = $("#adminRefreshBtn");
  if (refreshBtn) refreshBtn.onclick = () => bindAdminView();
  const box = $("#adminTable");
  const inp = $("#adminSearch");
  if (inp && !inp.dataset.bound) {
    inp.dataset.bound = "1";
    inp.addEventListener("input", () => { AdminSearch.q = inp.value; renderAdminMatches(); });
    inp.addEventListener("keydown", e => { if (e.key === "Escape") { AdminSearch.q = ""; inp.value = ""; renderAdminMatches(); } });
  }
  if (inp) inp.value = AdminSearch.q;
  const clear = $("#adminSearchClear");
  if (clear) clear.onclick = () => { AdminSearch.q = ""; const i = $("#adminSearch"); if (i) { i.value = ""; i.focus(); } renderAdminMatches(); };
  Auth.listUsers().then(out => {
    if (!box) return;
    if (out.error === "unauthorized") { toast(t("errUnauthorized"), "⚠️", "bad"); Router.render(); return; }
    if (!out.ok) { box.innerHTML = `<p class="muted small">${authErrMsg(out.error)}</p>`; return; }
    const users = out.users || [];
    AdminSearch.rows = users;
    const stats = $("#adminStats");
    if (stats) {
      const nums = stats.querySelectorAll(".st-num");
      if (nums[0]) nums[0].textContent = users.length;
      if (nums[1]) nums[1].textContent = users.filter(u => u.role === "admin").length;
      if (nums[2]) nums[2].textContent = users.reduce((s, u) => s + (Number(u.xp) || 0), 0);
    }
    if (!users.length) { box.innerHTML = `<p class="muted small">${t("adminEmpty")}</p>`; return; }
    const me = Auth.user;
    box.innerHTML = `
      <table class="atable">
        <thead><tr>
          <th>${t("adminUserCol")}</th><th>${t("adminRoleCol")}</th><th>${t("adminSyncCol")}</th><th>${t("adminJoinedCol")}</th>
          <th>${t("adminLastCol")}</th><th>${t("adminXpCol")}</th><th></th>
        </tr></thead>
        <tbody>${users.map(u => adminRowHtml(u, me)).join("")}</tbody>
      </table>`;
    bindAdminRowActions(box);
  });
}

/* pull on startup (silently) and when the tab regains focus */
window.addEventListener("load", () => { if (Sync.enabled()) Sync.pull(); });
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && Sync.enabled()) Sync.pull();
});

Views.settings = function () {
  const lang = State.data.language;
  return topbarHtml("settings") + `
  <div class="page page-narrow">
    <h1 class="grad-text" style="margin-bottom:6px">⚙️ ${t("settings")}</h1>
    <p class="muted small" style="margin-bottom:18px">${t("settingsSub")}</p>
    <div class="card">
      <div class="set-row">
        <div class="sr-main"><b>🌐 ${t("languageLabel")}</b><span>${t("languageDesc")}</span></div>
        <div class="seg">
          <button id="langAr" class="${lang === "ar" ? "active" : ""}">العربية</button>
          <button id="langEn" class="${lang === "en" ? "active" : ""}">English</button>
        </div>
      </div>
      <div class="set-row">
        <div class="sr-main"><b>👤 ${t("nameLabel")}</b><span>${t("nameDesc")}</span></div>
        <input id="nameInput" type="text" value="${esc(State.data.name || "")}" style="max-width:220px">
      </div>
      <div class="set-row">
        <div class="sr-main"><b>${State.data.theme === "light" ? "☀️" : "🌙"} ${t("themeLabel")}</b><span>${t("themeDesc")}</span></div>
        <div class="seg">
          <button id="thDark" class="${State.data.theme !== "light" ? "active" : ""}">${t("themeDark")}</button>
          <button id="thLight" class="${State.data.theme === "light" ? "active" : ""}">${t("themeLight")}</button>
        </div>
      </div>
      <div class="set-row">
        <div class="sr-main"><b>🎨 ${t("accentLabel")}</b><span>${t("accentDesc")}</span></div>
        <div class="accent-row">
          ${[["teal", "#5eead4,#38bdf8"], ["violet", "#a78bfa,#f472b6"], ["sunset", "#fb923c,#f472b6"], ["ocean", "#34d399,#38bdf8"]].map(([id, colors]) => `
          <button type="button" class="accent-swatch ${((State.data.accent || "teal") === id) ? "active" : ""}" data-accent="${id}" title="${t("accent" + id[0].toUpperCase() + id.slice(1))}">
            <span class="accent-dot" style="background:linear-gradient(135deg,${colors.split(",")[0]},${colors.split(",")[1]})"></span>
            <span class="accent-name">${t("accent" + id[0].toUpperCase() + id.slice(1))}</span>
          </button>`).join("")}
        </div>
      </div>
    </div>
    <div class="card">
      <h3>☁️ ${t("syncTitle")}</h3>
      <p class="muted small" style="margin-bottom:14px">${t("syncDesc")}</p>
      ${Sync.enabled() ? `
      <div class="sync-box">
        <div class="sync-code mono" id="syncCode">${esc(Sync.code())}</div>
        <div class="sync-status">${State.data.lastSyncAt ? `☁️ ${t("syncLast")}: ${new Date(State.data.lastSyncAt).toLocaleTimeString()}` : `⏳ ${t("syncPending")}`}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
          <button class="btn btn-sm" id="syncCopyBtn">📋 ${t("syncCopyCode")}</button>
          <button class="btn btn-sm" id="syncPushBtn">↑ ${t("syncPushNow")}</button>
          <button class="btn btn-sm" id="syncPullBtn">↓ ${t("syncPullNow")}</button>
          <button class="btn btn-sm btn-danger" id="syncOffBtn">${t("syncDisable")}</button>
        </div>
        <p class="muted small" style="margin-top:10px">${t("syncCodeHint")}</p>
      </div>` : `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary" id="syncEnableBtn">${t("syncEnable")}</button>
        <span class="muted small">${t("syncOr")}</span>
        <input id="syncLinkInput" type="text" placeholder="XXXX-XXXX-XXXX-XXXX" style="max-width:230px;direction:ltr;text-align:center;font-family:var(--mono);text-transform:uppercase">
        <button class="btn" id="syncLinkBtn">${t("syncLink")}</button>
      </div>
      <p class="muted small" style="margin-top:10px">${t("syncLinkHint")}</p>`}
    </div>
    <div class="card">
      <h3>💾 ${t("dataLabel")}</h3>
      <p class="muted small" style="margin-bottom:14px">${t("dataDesc")}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn" id="exportBtn">${t("exportBtn")}</button>
        <button class="btn" id="importBtn">${t("importBtn")}</button>
        <button class="btn btn-danger" id="resetBtn">${t("resetBtn")}</button>
      </div>
    </div>
  </div>`;
};

function bindSettings() {
  bindTopbar();
  $("#langAr").onclick = () => setLanguage("ar");
  $("#langEn").onclick = () => setLanguage("en");
  $("#thDark").onclick = () => setTheme("dark");
  $("#thLight").onclick = () => setTheme("light");
  $$(".accent-swatch").forEach(btn => {
    btn.onclick = () => {
      setAccent(btn.dataset.accent);
      toast(t("saved"), "🎨");
    };
  });
  const nameInput = $("#nameInput");
  nameInput.onchange = () => {
    State.data.name = nameInput.value.trim();
    State.save();
    toast(t("saved"), "✅");
  };
  const syncEnable = $("#syncEnableBtn");
  if (syncEnable) syncEnable.onclick = async () => {
    syncEnable.disabled = true;
    const r = await Sync.enable();
    toast(r.ok ? t("syncEnabled") : t("syncOffline"), r.ok ? "☁️" : "⚠️");
    Router.render();
  };
  const syncLink = $("#syncLinkBtn");
  if (syncLink) syncLink.onclick = async () => {
    const code = $("#syncLinkInput").value.trim();
    syncLink.disabled = true;
    const r = await Sync.link(code);
    if (r.badCode) toast(t("syncBadCode"), "⚠️", "bad");
    else if (r.linkedOffline) toast(t("syncLinkedOffline"), "☁️");
    else toast(t("syncLinked"), "☁️");
    Router.render();
  };
  const syncCopy = $("#syncCopyBtn");
  if (syncCopy) syncCopy.onclick = () => copyText(Sync.code());
  const syncPush = $("#syncPushBtn");
  if (syncPush) syncPush.onclick = async () => { syncPush.disabled = true; const r = await Sync.push(); toast(r.ok ? t("syncPushed") : t("syncOffline"), r.ok ? "☁️" : "⚠️"); Router.render(); };
  const syncPull = $("#syncPullBtn");
  if (syncPull) syncPull.onclick = async () => { syncPull.disabled = true; await Sync.pull(); Router.render(); };
  const syncOff = $("#syncOffBtn");
  if (syncOff) syncOff.onclick = () => {
    modal(t("syncDisable"), `<p>${t("syncDisableConfirm")}</p>`, [
      { label: t("cancel") },
      { label: t("syncDisable"), primary: true, fn: () => { Sync.disable(); toast(t("syncDisabled"), "☁️"); Router.render(); } }
    ]);
  };

  $("#exportBtn").onclick = () => {
    const blob = new Blob([JSON.stringify(State.data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "codequest-backup.json";
    a.click();
  };
  $("#importBtn").onclick = () => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "application/json";
    inp.onchange = () => {
      const f = inp.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          State.data = Object.assign(State.defaults(), data);
          State.save();
          applyLanguage(); applyTheme();
          toast(t("imported"), "✅");
          Router.render();
        } catch (e) { toast(t("importFailed"), "⚠️", "bad"); }
      };
      r.readAsText(f);
    };
    inp.click();
  };
  $("#resetBtn").onclick = () => {
    modal(t("resetConfirmTitle"), `<p>${t("resetConfirmBody")}</p>`, [
      { label: t("cancel") },
      { label: t("resetConfirm"), primary: true, fn: () => {
        State.reset();
        toast(t("resetDone"), "🗑️");
        Router.go("");
        Router.render();
      } }
    ]);
  };
}

function setLanguage(lang) {
  State.data.language = lang;
  State.save();
  applyLanguage();
  Router.render();
}
function setTheme(theme) {
  State.data.theme = theme;
  State.save();
  applyTheme();
  Router.render();
}
function setAccent(accent) {
  State.data.accent = accent;
  State.save();
  applyTheme();
  Router.render();
}

/* ============================================================
   CHAT SYSTEM (drawer): mentor | general | path
   ============================================================ */
const Chat = {
  kind: null,

  meta(kind) {
    const lang = State.data.language === "ar" ? "ar" : "en";
    const titles = {
      mentor: { en: "AI Mentor", ar: "المرشد الذكي", sub: { en: "Socratic guidance — helps you find the answer", ar: "إرشاد سقراطي — يساعدك أن تصل للإجابة بنفسك" } },
      general: { en: "General Chat", ar: "الملتقى العام", sub: { en: "Ask anything about programming and tech", ar: "اسأل عن أي شيء في البرمجة والتقنية" } },
      path: {
        en: { web: "Web Dev Chat", se: "Software Eng Chat", game: "Game Dev Chat" },
        ar: { web: "دردشة الويب", se: "دردشة الهندسة", game: "دردشة الألعاب" }
      }
    };
    let title, sub;
    if (kind === "path") {
      const pid = State.data.path || "web";
      title = titles.path[lang][pid];
      sub = lang === "ar" ? "خبير مسارك — يعرف أين وصلت" : "Your path specialist — knows where you are";
    } else {
      title = titles[kind][lang];
      sub = titles[kind].sub[lang];
    }
    return { title, sub };
  },

  logKey() { return "chat:" + this.kind + ":" + (this.kind === "path" ? (State.data.path || "web") : "g"); },

  suggestions(kind) {
    const lang = State.data.language === "ar" ? "ar" : "en";
    const en = {
      mentor: ["I'm stuck on a challenge", "Explain this concept differently", "Give me a hint"],
      general: ["What is programming?", "Which language should I learn first?", "What are APIs?", "How do databases work?", "Python vs C++?", "What should I learn after JavaScript?"],
      path: {
        web: ["How does HTML work?", "How do I center a div?", "Why is my JavaScript not working?", "When should I use React?"],
        se: ["How do I get better at algorithms?", "What is Git?", "How do I debug my code?"],
        game: ["How do game engines work?", "How do I make things move in a game?", "What is a game loop?"]
      }
    };
    const ar = {
      mentor: ["علقت في تحدي", "اشرح لي المفهوم بطريقة أخرى", "أعطني تلميحًا"],
      general: ["ما هي البرمجة؟", "ما أفضل لغة أبدأ بها؟", "ما هي واجهات API؟", "كيف تعمل قواعد البيانات؟", "بايثون أم ++C؟", "ماذا أتعلم بعد جافاسكريبت؟"],
      path: {
        web: ["كيف تعمل HTML؟", "كيف أوسّط عنصر div؟", "لماذا لا يعمل كود جافاسكريبت؟", "متى أستخدم React؟"],
        se: ["كيف أتحسن في الخوارزميات؟", "ما هو Git؟", "كيف أصحح أخطاء كودي؟"],
        game: ["كيف تعمل محركات الألعاب؟", "كيف أحرك الأشياء في اللعبة؟", "ما هي حلقة اللعبة؟"]
      }
    };
    const src = kind === "path" ? (lang === "ar" ? ar.path[State.data.path || "web"] : en.path[State.data.path || "web"]) : (lang === "ar" ? ar[kind] : en[kind]);
    return src || [];
  },

  open(kind, prefilled) {
    this.kind = kind;
    const drawer = $("#chatDrawer");
    drawer.hidden = false;
    const meta = this.meta(kind);
    $("#chatTitle").textContent = meta.title;
    $("#chatSubtitle").textContent = meta.sub;
    $("#chatInput").placeholder = t("chatPlaceholder");
    this.renderLog();
    this.renderSuggestions();
    if (prefilled) {
      $("#chatInput").value = prefilled;
      $("#chatInput").focus();
    }
  },

  close() { $("#chatDrawer").hidden = true; this.kind = null; },

  log() {
    State.data.chatLog = State.data.chatLog || {};
    const k = this.logKey();
    if (!State.data.chatLog[k]) {
      State.data.chatLog[k] = [];
      const lang = State.data.language === "ar" ? "ar" : "en";
      const hello = this.kind === "mentor" ? (lang === "ar" ? I18N.ar.chatEmptyMentor : I18N.en.chatEmptyMentor)
        : this.kind === "general" ? (lang === "ar" ? I18N.ar.chatEmptyGeneral : I18N.en.chatEmptyGeneral)
        : (lang === "ar" ? I18N.ar.chatEmptyPath : I18N.en.chatEmptyPath);
      State.data.chatLog[k].push({ role: "bot", text: hello });
      State.save();
    }
    return State.data.chatLog[k];
  },

  renderLog() {
    const box = $("#chatMessages");
    const lang = State.data.language === "ar" ? "ar" : "en";
    box.innerHTML = this.log().map(m => `
      <div class="msg ${m.role}">
        <span class="m-role">${m.role === "user" ? (lang === "ar" ? "أنت" : "You") : (lang === "ar" ? "المرشد" : "Mentor")}</span>
        ${mdLite(m.text)}
      </div>`).join("");
    box.scrollTop = box.scrollHeight;
  },

  renderSuggestions() {
    const wrap = $("#chatSuggestions");
    wrap.innerHTML = this.suggestions(this.kind).map(s => `<button type="button">${esc(s)}</button>`).join("");
    $$("button", wrap).forEach(b => b.onclick = () => { $("#chatInput").value = b.textContent; this.send(); });
  },

  send() {
    const input = $("#chatInput");
    const text = input.value.trim();
    if (!text || !this.kind) return;
    input.value = "";
    const log = this.log();
    log.push({ role: "user", text });
    State.save();
    this.renderLog();

    /* typing indicator */
    const typing = document.createElement("div");
    typing.className = "msg bot typing";
    typing.textContent = "…";
    $("#chatMessages").appendChild(typing);
    $("#chatMessages").scrollTop = 999999;

    setTimeout(() => {
      typing.remove();
      let reply;
      try { reply = Mentor.reply(this.kind, text); }
      catch (e) { reply = "⚠️ " + e.message; }
      log.push({ role: "bot", text: reply });
      State.save();
      this.renderLog();
    }, 500 + Math.random() * 600);
  },

  resetConv() {
    const k = this.logKey();
    delete (State.data.chatLog || {})[k];
    State.save();
    this.renderLog();
  }
};

function bindChatShell() {
  $("#chatClose").onclick = () => Chat.close();
  $("#chatReset").onclick = () => Chat.resetConv();
  $("#chatForm").onsubmit = (e) => { e.preventDefault(); Chat.send(); };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#chatDrawer").hidden) Chat.close();
  });
}

/* ============================================================
   VIEW: step (challenge / project / concept)
   ============================================================ */
Views.step = function (stepId) {
  const found = findStep(stepId);
  if (!found) return topbarHtml() + `<div class="page">Step not found.</div>`;
  const { step, unit, path } = found;
  const isConcept = step.kind === "concept";
  const kindLabel = isConcept ? t("concept") : (step.project ? t("project") : t("challenge"));
  const steps = allSteps(path);
  const idx = steps.findIndex(s => s.id === stepId);
  const nextS = steps[idx + 1];
  const done = !!State.data.completed[stepId];
  const saved = State.data.codeDrafts && State.data.codeDrafts[stepId];
  const starter = saved !== undefined ? saved : step.starter;

  const briefHtml = `
    <div class="brief">
      <div>${mdLite(L(step.brief || step.concept))}</div>
      ${!isConcept ? `
      <div class="task-box">🎯 <b>${t("yourBrowser") === "Result" ? "Task" : "المهمة"}:</b> ${mdLite(L(step.task))}</div>` : ``}
    </div>`;

  if (isConcept) {
    const q = step.quiz;
    return topbarHtml("home") + `
    <div class="page page-narrow">
      <div class="ch-head">
        <button class="btn btn-ghost btn-sm" id="backBtn">${t("backToMap")}</button>
        <span class="ch-badge">${t("concept")}</span>
        <h1>${stepTitle(step)}</h1>
      </div>
      <div class="pane"><div class="pane-body">${briefHtml}</div></div>
      <div class="pane" style="margin-top:16px">
        <div class="pane-head">⚡ ${t("conceptQuizQ")}</div>
        <div class="pane-body" id="quizBox">
          <p style="font-weight:600;margin-bottom:12px">${L(q.q)}</p>
          ${L(q.options).map((opt, i) => `<button class="btn" style="display:block;width:100%;margin-bottom:8px;text-align:start" data-quiz="${i}">${esc(opt)}</button>`).join("")}
          <div id="quizResult" class="runner-status"></div>
        </div>
      </div>
      <div class="complete-bar ${done ? "" : "hidden"}" id="completeBar" style="margin-top:16px">
        <span class="cb-emoji">📖</span>
        <span class="cb-txt"><b>${t("conceptRead")}</b><span>+<span class="cb-xp-num">${step.xp}</span> XP · ${step.skill}</span></span>
        ${nextS ? `<button class="btn btn-primary" id="nextStepBtn">${t("nextStep")}</button>` : `<button class="btn btn-primary" id="backToMapBtn">${t("backToMap")}</button>`}
      </div>
    </div>`;
  }

  const isCanvas = step.kind === "canvas";
  return topbarHtml("home") + `
  <div class="page">
    <div class="ch-head">
      <button class="btn btn-ghost btn-sm" id="backBtn">${t("backToMap")}</button>
      <span class="ch-badge">${kindLabel}</span>
      <h1>${stepTitle(step)}</h1>
      <span class="chip lvl">+${step.xp} XP</span>
    </div>

    <div class="split">
      <div class="pane">
        <div class="pane-head">📋 ${isConcept ? t("concept") : t("challenge")} <span class="ph-spacer"></span><span class="small dim">${step.skill}</span></div>
        <div class="pane-body">${briefHtml}</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="pane">
          <div class="pane-head">✍️ ${t("runCode")}
            <span class="ph-spacer"></span>
            <button class="tip-btn" id="resetCodeBtn">${t("reset")}</button>
          </div>
          <div class="pane-body">
            <div class="code-wrap">
              <textarea id="codeEditor" spellcheck="false">${esc(starter)}</textarea>
            </div>
            <div class="editor-foot">
              <button class="btn btn-primary" id="runBtn">${t("runChecks")}</button>
              <span class="runner-status" id="runnerStatus"></span>
            </div>
            <div class="results" id="results"></div>
            <div class="console-out hidden" id="consoleOut"></div>
          </div>
        </div>

        <div class="pane">
          <div class="pane-head">🖥️ ${isCanvas ? t("gamePreview") : t("livePreview")}</div>
          <div class="pane-body">
            ${isCanvas || step.kind === "html"
              ? `<iframe id="previewFrame" class="html-frame" sandbox="allow-scripts allow-same-origin"></iframe>`
              : `<div class="muted small">${t("output")} → ${t("console")}</div>`}
          </div>
        </div>

        <div class="pane">
          <div class="pane-head">🧭 ${t("needHelp")}</div>
          <div class="pane-body">
            <div class="editor-foot">
              <button class="tip-btn" id="hintBtn">💡 ${t("showHint")}</button>
              <button class="tip-btn" id="askMentorBtn">🤖 ${t("askMentor")}</button>
              <button class="tip-btn" id="solutionBtn">🔓 ${t("showSolution")}</button>
            </div>
            <div class="hint-area" id="hintArea"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="complete-bar hidden" id="completeBar">
      <span class="cb-emoji">${step.project ? "🎉" : "✅"}</span>
      <span class="cb-txt"><b>${step.project ? t("projectCompleteTitle") : t("challengeDone")}</b><span>+<span class="cb-xp-num">${step.xp}</span> XP · ${step.skill}</span></span>
      ${nextS ? `<button class="btn btn-primary" id="nextStepBtn">${t("nextStep")}</button>` : `<button class="btn btn-primary" id="backToMapBtn">${t("backToMap")}</button>`}
    </div>
  </div>`;
};

function bindStep(stepId) {
  bindTopbar();
  const found = findStep(stepId);
  if (!found) return;
  const { step, path } = found;
  const back = $("#backBtn");
  if (back) back.onclick = () => Router.go("map", path);

  /* ---------- concept flow: answering the quiz correctly completes it automatically ---------- */
  if (step.kind === "concept") {
    $$("#quizBox [data-quiz]").forEach(btn => {
      btn.onclick = () => {
        const ok = parseInt(btn.dataset.quiz, 10) === step.quiz.answer;
        const res = $("#quizResult");
        res.textContent = ok ? t("conceptQuizOk") : t("conceptQuizNo");
        res.className = "runner-status " + (ok ? "ok" : "bad");        if (ok) {
          let leveled = false;
          if (!State.data.completed[stepId]) {
            State.data.seenConcepts[stepId] = true;
            leveled = !!completeStep(stepId, path, { rerender: false });
          }
          const bar = $("#completeBar");
          if (bar) {
            bar.classList.remove("hidden");
            bar.scrollIntoView({ behavior: "smooth", block: "nearest" });
            const nb = $("#nextStepBtn");
            if (nb) nb.focus({ preventScroll: true });
            if (!leveled) Celebrate.burst({ originEl: bar });
            countUp(bar.querySelector(".cb-xp-num"), step.xp, 900);
          }
        }
      };
    });
    const nextBtn = $("#nextStepBtn");
    if (nextBtn) nextBtn.onclick = () => goToNextStep(stepId, path);
    const btm = $("#backToMapBtn");
    if (btm) btm.onclick = () => Router.go("map", path);
    return;
  }

  /* ---------- code flow ---------- */
  State.data.codeDrafts = State.data.codeDrafts || {};
  const editor = $("#codeEditor");
  State.data.currentStepKind = step.kind;   /* editor picks its language from this */
  CodeEditor.mount(editor);
  CodeEditor.refresh(editor);
  editor.addEventListener("cq:input", () => {
    State.data.codeDrafts[stepId] = editor.value;
    State.save();
    updatePreview(editor.value);
  });

  const previewFrame = $("#previewFrame");
  function updatePreview(code) {
    if (previewFrame) previewFrame.srcdoc = Engine.previewDoc(code);
  }
  updatePreview(editor.value);

  $("#resetCodeBtn").onclick = () => {
    editor.value = step.starter;
    State.data.codeDrafts[stepId] = step.starter;
    State.save();
    updatePreview(editor.value);
    CodeEditor.refresh(editor);
  };

  /* hints */
  let hintIdx = State.data.hintsUsed[stepId] || 0;
  const hintArea = $("#hintArea");
  function renderHints() {
    hintArea.innerHTML = "";
    for (let i = 0; i < hintIdx && i < step.hints.length; i++) {
      const d = document.createElement("div");
      d.className = "hint-item";
      d.innerHTML = "💡 " + mdLite(L(step.hints[i]));
      hintArea.appendChild(d);
    }
    const btn = $("#hintBtn");
    if (hintIdx >= step.hints.length) {
      btn.disabled = true;
      btn.textContent = "💡 " + t("noMoreHints");
    } else {
      btn.textContent = hintIdx === 0 ? "💡 " + t("showHint") : "💡 " + t("anotherHint");
    }
  }
  renderHints();
  $("#hintBtn").onclick = () => {
    if (hintIdx < step.hints.length) {
      hintIdx++;
      State.data.hintsUsed[stepId] = hintIdx;
      State.save();
      renderHints();
    }
  };

  $("#askMentorBtn").onclick = () => {
    State.data.lastMentorStepId = stepId;
    State.save();
    Chat.open("mentor", t("chatSugStuck"));
  };

  /* solution (behind confirmation) */
  $("#solutionBtn").onclick = () => {
    modal(t("showSolution"), `<p>${t("solutionWarning")}</p>`, [
      { label: t("cancel") },
      { label: t("showSolution"), primary: true, fn: () => {
        const d = document.createElement("div");
        d.className = "hint-item";        d.innerHTML = "<pre class=\"code-hl static\">" + CodeEditor.highlight(step.solution, CodeEditor.langOf(step.kind)) + "</pre>";
      hintArea.appendChild(d);
      } }
    ]);
  };

  /* run & check */
  const status = $("#runnerStatus");
  const resultsBox = $("#results");
  const consoleBox = $("#consoleOut");

  $("#runBtn").onclick = async () => {
    const code = editor.value;
    status.textContent = t("checking");
    status.className = "runner-status";
    const out = await Engine.checkStep(step, code);

    if (out.error) {
      status.textContent = "✖ " + out.error;
      status.className = "runner-status bad";
      resultsBox.innerHTML = "";
    } else {
      resultsBox.innerHTML = out.results.map(r => `
        <div class="result-item ${r.pass ? "pass" : "fail"}">
          <span class="r-ico">${r.pass ? "✅" : "❌"}</span>
          <span class="r-txt"><span class="r-lbl">${esc(r.label)}</span></span>
        </div>`).join("");
      const allPass = out.allPass;
      status.textContent = allPass ? "🎉 " + t("challengeDone") : "⚠️ " + t("toastCheckFail");
      status.className = "runner-status " + (allPass ? "ok" : "bad");
      if (allPass) {
        let leveled = false;
        if (!State.data.completed[stepId]) {
          leveled = !!completeStep(stepId, path, { rerender: false });
        }
        /* reveal the completion bar with the Next button */
        const bar = $("#completeBar");
        if (bar) {
          bar.classList.remove("hidden");
          bar.scrollIntoView({ behavior: "smooth", block: "nearest" });
          const nb = $("#nextStepBtn");
          if (nb) nb.focus({ preventScroll: true });
          if (!leveled) Celebrate.burst({ originEl: bar });
          countUp(bar.querySelector(".cb-xp-num"), step.xp, 900);
        }
      }
    }
    if (out.logs && out.logs.length) {
      consoleBox.classList.remove("hidden");
      consoleBox.textContent = out.logs.join("\n");
    } else {
      consoleBox.classList.add("hidden");
    }
  };

  const nextBtn = $("#nextStepBtn");
  if (nextBtn) nextBtn.onclick = () => goToNextStep(stepId, path);
  const btm = $("#backToMapBtn");
  if (btm) btm.onclick = () => Router.go("map", path);
}

function goToNextStep(stepId, path) {
  const steps = allSteps(path);
  const idx = steps.findIndex(s => s.id === stepId);
  if (steps[idx + 1]) Router.go("step", steps[idx + 1].id);
  else Router.go("map", path);
}

/* ============================================================
   CELEBRATION — zero-dependency confetti + XP count-ups
   ============================================================ */
const Celebrate = {
  canvas: null, ctx: null, parts: [], raf: 0,
  COLORS() {
    const cs = getComputedStyle(document.documentElement);
    const read = v => (v || "").trim();
    const list = [read(cs.getPropertyValue("--g2a")), read(cs.getPropertyValue("--g2b")),
      read(cs.getPropertyValue("--accent")), read(cs.getPropertyValue("--accent2")),
      read(cs.getPropertyValue("--accent3")), read(cs.getPropertyValue("--warn"))];
    const valid = list.filter(c => /^#|^rgb/.test(c));
    return valid.length ? valid : ["#5eead4", "#38bdf8", "#a78bfa", "#f472b6", "#fbbf24", "#34d399"];
  },
  ok() { return !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); },
  burst(opts) {
    if (!this.ok()) return;
    opts = opts || {};
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    if (this.canvas) this.canvas.remove();
    this.colors = opts.gold
      ? ["#fbbf24", "#f59e0b", "#fde68a", "#ffffff", "#f97316"]
      : opts.ember
      ? ["#fb923c", "#f97316", "#fdba74", "#fbbf24", "#ef4444"]
      : this.COLORS();
    const big = !!opts.big;
    const canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    document.body.appendChild(canvas);
    this.canvas = canvas; this.ctx = ctx; this.parts = [];
    /* launch points: the completion bar if available, else corner cannons */
    let origins = [];
    if (opts.originEl && document.contains(opts.originEl)) {
      const r = opts.originEl.getBoundingClientRect();
      /* only use the element as a launch pad if it's actually on screen (smooth scroll may not have arrived yet) */
      if (r.width > 0 && r.top < innerHeight - 60 && r.bottom > 60) {
        const oy = Math.min(Math.max(r.top + r.height / 2, 80), innerHeight - 80);
        origins = [
          { x: r.left + r.width * 0.22, y: oy, angle: -Math.PI / 2, spread: 0.9, speed: [7, 13] },
          { x: r.left + r.width * 0.78, y: oy, angle: -Math.PI / 2, spread: 0.9, speed: [7, 13] },
          { x: r.left + r.width / 2, y: oy, angle: -Math.PI / 2, spread: 2.6, speed: [4, 9] }
        ];
      }
    }
    if (!origins.length) {
      if (opts.small) {
        /* gentle single puff from the top center — for micro moments */
        origins = [{ x: innerWidth / 2, y: innerHeight * 0.18, angle: -Math.PI / 2, spread: 2.4, speed: [2.5, 5] }];
      } else {
        origins = [
          { x: innerWidth * 0.12, y: innerHeight * 0.9, angle: -Math.PI / 3, spread: 0.5, speed: [9, 15] },
          { x: innerWidth * 0.88, y: innerHeight * 0.9, angle: -Math.PI + Math.PI / 3, spread: 0.5, speed: [9, 15] },
          { x: innerWidth / 2, y: innerHeight * 0.35, angle: -Math.PI / 2, spread: 2.8, speed: [5, 10] }
        ];
      }
    }
    const per = big ? 70 : (opts.small ? 16 : 34);
    for (const o of origins) for (let i = 0; i < per; i++) this.parts.push(this.spawn(o, big, !!opts.small));
    this.tick();
  },
  spawn(o, big, gentle) {
    const ang = o.angle + (Math.random() - 0.5) * o.spread * 2;
    const spd = o.speed[0] + Math.random() * (o.speed[1] - o.speed[0]);
    return {
      x: o.x, y: o.y,
      vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
      g: gentle ? 0.05 + Math.random() * 0.04 : 0.16 + Math.random() * 0.08,
      size: 4 + Math.random() * (big ? 6 : 4),
      rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.25,
      color: this.colors[(Math.random() * this.colors.length) | 0],
      round: gentle ? Math.random() < 0.7 : Math.random() < 0.35,
      life: 0, ttl: (big ? 150 : gentle ? 90 : 120) + Math.random() * 60,
      wobble: Math.random() * Math.PI * 2
    };
  },
  tick() {
    if (!this.canvas) return;
    const ctx = this.ctx, W = innerWidth, H = innerHeight;
    ctx.clearRect(0, 0, W, H);
    this.parts = this.parts.filter(p => p.life < p.ttl && p.y < H + 40);
    for (const p of this.parts) {
      p.life++;
      p.vy += p.g;
      p.vx *= 0.99; p.vy *= 0.995;
      p.wobble += 0.1;
      p.x += p.vx + Math.sin(p.wobble) * 0.4;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, p.life - p.ttl * 0.7) / (p.ttl * 0.3));
      ctx.fillStyle = p.color;
      if (p.round) { ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, 7); ctx.fill(); }
      else {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        const sq = Math.abs(Math.sin(p.wobble)) * 0.7 + 0.3; /* paper flip */
        ctx.fillRect(-p.size / 2, -p.size * sq / 2, p.size, p.size * sq);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    if (this.parts.length) this.raf = requestAnimationFrame(() => this.tick());
    else { this.raf = 0; this.canvas.remove(); this.canvas = null; }
  }
};

function countUp(el, to, ms) {
  if (!el) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = to; return; }
  const start = performance.now();
  (function frame(now) {
    const p = Math.min(1, (now - start) / ms);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}

function animateXpChip(from, gain) {
  const chip = $(".topbar .chip.lvl");
  if (!chip) return;
  const to = from + gain;
  const set = v => { chip.textContent = "⚡ " + v + " " + t("xp"); };
  chip.classList.remove("bump");
  void chip.offsetWidth; /* restart the pulse animation */
  chip.classList.add("bump");
  setTimeout(() => chip.classList.remove("bump"), 950);
  if (gain <= 0 || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) { set(to); return; }
  const start = performance.now();
  (function frame(now) {
    const p = Math.min(1, (now - start) / 800);
    set(Math.round(from + gain * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}

function completeStep(stepId, path, opts) {
  const found = findStep(stepId);
  if (!found) return;
  const step = found.step;
  State.data.completed[stepId] = true;
  const before = State.data.xp;
  addXp(step.xp);
  const gained = State.data.xp - before;
  touchDay();
  toast(t("toastStepDone") + " +" + step.xp + " XP", step.project ? "🏗️" : "⚡");
  checkAchievements();
  checkUnitCompletion(path);
  checkPathCompletion(path);
  const leveledUp = !!State.data.leveled;
  State.data.leveled = null;   /* consume before saving so the flag never persists */
  checkStreakCelebration(leveledUp);    /* ember moment when this was the first step of the day */
  State.save();
  if (!opts || opts.rerender !== false) {
    Router.render();
    if (!leveledUp) Celebrate.burst();
  } else {
    /* count the topbar XP chip up to the new value */
    animateXpChip(before, gained);
  }
  return leveledUp;
}

function checkUnitCompletion(pathId) {
  const units = allUnits(pathId);
  for (const u of units) {
    const key = "unit:" + u.id;
    if (!State.data.achievements[key + ":notif"] && u.steps.every(s => State.data.completed[s.id])) {
      State.data.achievements[key + ":notif"] = Date.now();
      toast(t("toastUnit") + " " + u.emoji, "🏅");
      notify(t("toastUnit") + " " + L(u.title), u.emoji);
    }
  }
}

function checkPathCompletion(pathId) {
  if (!State.data.certificates[pathId]) {
    const steps = allSteps(pathId);
    if (steps.every(s => State.data.completed[s.id])) {
      const year = new Date().getFullYear();
      let id = "";
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
      const certId = pathId.toUpperCase() + "-" + year + "-" + id;
      State.data.certificates[pathId] = {
        id: certId,
        date: Date.now(),
        name: State.data.name || t("defaultUserName"),
        skills: PATH_INFO[pathId].skills.slice(0, 6)
      };
      toast(t("toastAllPathDone"), "🎓", "gold");
      notify(t("toastAllPathDone"), "🎓");
      Celebrate.burst({ big: true, gold: true });
      checkAchievements();
      State.save();
    }
  }
  checkMasterCertificate();
}

/* Full-screen celebration for the Grand Master certificate (replaces the generic toast). */
function showMasterCertificateScreen(cert) {
  const old = document.querySelector(".master-screen");
  if (old) old.remove();
  const lang = State.data.language === "ar" ? "ar" : "en";
  const info = I18N[lang].paths.master;
  const name = State.data.name || cert.name || t("defaultUserName");
  const el = document.createElement("div");
  el.className = "master-screen";
  el.innerHTML = `
    <div class="ms-card" role="dialog" aria-modal="true" aria-label="${esc(t("masterEarnedTitle"))}">
      <button class="ms-close" title="${esc(t("confirm"))}" aria-label="${esc(t("confirm"))}">×</button>
      <div class="ms-emoji">${info.emoji}</div>
      <div class="ms-title">${esc(t("masterEarnedTitle"))}</div>
      <div class="ms-path">${esc(info.name)}</div>
      <p class="ms-sub">${esc(t("masterEarnedSub"))}</p>
      <div class="ms-meta">
        <span class="ms-name">🎓 ${esc(name)}</span>
        <span class="ms-id">${t("certId")}: ${esc(cert.id)}</span>
      </div>
      <div class="ms-actions">
        <button class="btn btn-primary" data-ms="view">🏆 ${esc(t("openCerts"))}</button>
        <button class="btn" data-ms="close">${esc(t("masterEarnedClose"))}</button>
      </div>
    </div>`;
  const onKey = e => { if (e.key === "Escape") close(); };
  function close() {
    document.removeEventListener("keydown", onKey);
    el.remove();
  }
  el.addEventListener("click", e => { if (e.target === el) close(); });       /* backdrop dismisses */
  document.addEventListener("keydown", onKey);
  $(".ms-close", el).onclick = close;
  $('[data-ms="close"]', el).onclick = close;
  $('[data-ms="view"]', el).onclick = () => { close(); Router.go("certificate", "master"); };
  document.body.appendChild(el);
}

/* Grand Master certificate — one for getting everything: all paths completed. */
function checkMasterCertificate() {
  if (State.data.certificates.master) return false;
  if (!PATHS.every(p => State.data.certificates[p])) return false;
  const year = new Date().getFullYear();
  let id = "";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  State.data.certificates.master = {
    id: "MASTER-" + year + "-" + id,
    date: Date.now(),
    name: State.data.name || t("defaultUserName"),
    skills: PATHS.reduce((all, p) => all.concat(PATH_INFO[p].skills.slice(0, 2)), [])
  };
  notify(t("toastMasterCert"), "👑");
  Celebrate.burst({ big: true, gold: true });
  showMasterCertificateScreen(State.data.certificates.master);
  checkAchievements();
  State.save();
  return true;
}

/* ============================================================
   INIT
   ============================================================ */
State.load();
Auth.load();
applyTheme();
applyLanguage();
bindChatShell();
Router.render();
Auth.refresh();
/* Retroactive award: profiles that already hold every path certificate gain the
   Grand Master certificate the next time the app opens. */
if (checkMasterCertificate()) Router.render();
