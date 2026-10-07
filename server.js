/* ============================================================
   CodeQuest server — zero-dependency Node backend
   - Serves the static app (reuses dev-server's handler)
   - API:
       POST /api/sync/push      {syncId, payload}   -> upsert profile
       GET  /api/sync/pull?syncId=XXXX              -> profile or 404
       POST /api/certs          {cert}              -> register/refresh cert
       GET  /api/certs/:id                          -> verify a certificate
   - Storage: ./data/db.json (auto-created, JSON file)
   - Usage: node server.js [port]   (default 8090)
   ============================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { staticHandler } = require("./dev-server");
const crypto = require("crypto");

const PORT = Number(process.argv[2]) || 8090;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

/* ---------- tiny JSON file DB ---------- */
let db = { syncs: {}, certs: {}, users: {}, sessions: {} };
try { db = JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch (e) { /* first run */ }
db.users = db.users || {};       /* accounts (login/signup) */
db.sessions = db.sessions || {}; /* bearer auth tokens */
let saveTimer = null;
function saveDb() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(db));
    } catch (e) { console.error("db save failed:", e.message); }
  }, 120);
}

/* ---------- helpers ---------- */
function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, Object.assign({ "Content-Type": "application/json", "Cache-Control": "no-store" }, CORS));
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", c => { size += c.length; if (size > 512 * 1024) { reject(new Error("payload too large")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); }
      catch (e) { reject(new Error("invalid JSON")); }
    });
    req.on("error", reject);
  });
}
/* keep only whitelisted keys of a profile — the client sends its whole State */
function sanitizeProfile(raw) {
  const d = (raw && typeof raw === "object") ? raw : {};
  const pick = (v, fb) => (v !== undefined && v !== null ? v : fb);
  return {
    language: pick(d.language, "en"), name: String(d.name || "").slice(0, 60),
    theme: d.theme === "light" ? "light" : "dark",
    accent: String(d.accent || "teal").slice(0, 12),
    path: String(d.path || "web").slice(0, 8), startedAt: pick(d.startedAt, null),
    xp: Number(d.xp) || 0, completed: d.completed || {}, seenConcepts: d.seenConcepts || {},
    achievements: d.achievements || {}, certificates: d.certificates || {},
    chatLog: d.chatLog || {}, notifications: Array.isArray(d.notifications) ? d.notifications.slice(0, 40) : [],
    hintsUsed: d.hintsUsed || {}, dayLog: d.dayLog || {}, explored: d.explored || {}
  };
}
/* union-merge two profiles; per-key conflict resolution prefers the "richer" side */
function mergeProfiles(local, remote) {
  const union = (a, b) => { const o = Object.assign({}, a); for (const k of Object.keys(b || {})) if (!(k in o)) o[k] = b[k]; return o; };
  const newer = (a, b, ka, kb) => (!a ? b : !b ? a : (kb > ka ? b : a));
  return {
    language: local.language, theme: local.theme, accent: local.accent,   /* device-local prefs */
    name: local.name || remote.name || "",
    path: local.path || remote.path,
    startedAt: newer(local.startedAt, remote.startedAt, 0, 0),
    xp: Math.max(Number(local.xp) || 0, Number(remote.xp) || 0),
    completed: union(local.completed, remote.completed),
    seenConcepts: union(local.seenConcepts, remote.seenConcepts),
    achievements: union(local.achievements, remote.achievements),
    certificates: union(local.certificates, remote.certificates),
    chatLog: union(local.chatLog, remote.chatLog),
    notifications: (local.notifications.length >= (remote.notifications || []).length ? local.notifications : remote.notifications),
    hintsUsed: union(local.hintsUsed, remote.hintsUsed),
    dayLog: union(local.dayLog, remote.dayLog),
    explored: union(local.explored, remote.explored)
  };
}
function registerCertsFromProfile(profile) {
  const certs = profile.certificates || {};
  for (const pid of Object.keys(certs)) {
    const c = certs[pid];
    if (!c || !c.id) continue;
    const prev = db.certs[c.id];
    db.certs[c.id] = {
      id: c.id, pathId: pid, name: c.name || profile.name || "Future Developer",
      date: c.date || Date.now(), skills: c.skills || [], syncedAt: Date.now()
    };
    if (prev && prev.date && !c.date) db.certs[c.id].date = prev.date;
  }
}

/* ---------- API router ---------- */
async function api(req, res, url) {
  const parts = url.pathname.split("/").filter(Boolean);   // ["api", ...]
  try {
    /* POST /api/sync/push  {syncId, payload} */
    if (req.method === "POST" && parts[1] === "sync" && parts[2] === "push") {
      const body = await readBody(req);
      const id = String(body.syncId || "").trim().toUpperCase();
      if (!/^[A-Z0-9-]{8,40}$/.test(id)) return send(res, 400, { ok: false, error: "invalid syncId" });
      const clean = sanitizeProfile(body.payload || {});
      const prev = db.syncs[id];
      db.syncs[id] = { profile: prev ? mergeProfiles(clean, prev.profile) : clean, updatedAt: Date.now() };
      registerCertsFromProfile(db.syncs[id].profile);
      saveDb();
      return send(res, 200, { ok: true, merged: !!prev, updatedAt: db.syncs[id].updatedAt });
    }

    /* GET /api/sync/pull?syncId=XXXX */
    if (req.method === "GET" && parts[1] === "sync" && parts[2] === "pull") {
      const id = String(url.searchParams.get("syncId") || "").trim().toUpperCase();
      if (!/^[A-Z0-9-]{8,40}$/.test(id)) return send(res, 400, { ok: false, error: "invalid syncId" });
      const rec = db.syncs[id];
      if (!rec) return send(res, 404, { ok: false, error: "no such sync code" });
      return send(res, 200, { ok: true, profile: rec.profile, updatedAt: rec.updatedAt });
    }

    /* POST /api/certs  {cert:{id,name,date,skills}, pathId}  (explicit register) */
    if (req.method === "POST" && parts[1] === "certs" && parts.length === 2) {
      const body = await readBody(req);
      const c = body.cert || {};
      if (!/^[A-Z]+-\d{4}-[A-Z0-9]{6}$/.test(String(c.id || ""))) return send(res, 400, { ok: false, error: "invalid cert id" });
      db.certs[c.id] = {
        id: c.id, pathId: String(body.pathId || "").slice(0, 8),
        name: String(c.name || "Future Developer").slice(0, 60),
        date: Number(c.date) || Date.now(), skills: Array.isArray(c.skills) ? c.skills.slice(0, 12) : [],
        syncedAt: Date.now()
      };
      saveDb();
      return send(res, 200, { ok: true });
    }

    /* GET /api/certs/:id */
    if (req.method === "GET" && parts[1] === "certs" && parts.length === 3) {
      const id = decodeURIComponent(parts[2] || "").trim().toUpperCase();
      const rec = db.certs[id];
      if (!rec) return send(res, 404, { ok: false, error: "unknown certificate" });
      return send(res, 200, { ok: true, cert: rec });
    }

    /* ============================================================
       AUTH — accounts, sessions, admin
       Passwords: scrypt + per-user random salt (timing-safe compare).
       Sessions: bearer tokens, 90-day expiry.
       The FIRST account created becomes the platform admin.
       ============================================================ */
    if (parts[1] === "auth") {
      /* GET /api/auth/status — public: has an admin been created yet? */
      if (req.method === "GET" && parts[2] === "status") {
        const users = Object.values(db.users);
        return send(res, 200, { ok: true, userCount: users.length, adminExists: users.some(u => u.role === "admin") });
      }

      /* POST /api/auth/signup  {username, password, name?, syncId?} */
      if (req.method === "POST" && parts[2] === "signup") {
        const body = await readBody(req);
        const username = String(body.username || "").trim();
        const password = String(body.password || "");
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return send(res, 400, { ok: false, error: "invalid_username" });
        if (password.length < 6 || password.length > 100) return send(res, 400, { ok: false, error: "invalid_password" });
        const key = username.toLowerCase();
        if (db.users[key]) return send(res, 400, { ok: false, error: "username_taken" });
        const isFirst = Object.keys(db.users).length === 0;
        const salt = crypto.randomBytes(16).toString("hex");
        const u = {
          id: crypto.randomBytes(5).toString("hex"),
          username,
          name: String(body.name || "").trim().slice(0, 60),
          salt,
          passHash: crypto.scryptSync(password, salt, 64).toString("hex"),
          role: isFirst ? "admin" : "user",
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
          syncId: /^[A-Z0-9-]{8,40}$/.test(String(body.syncId || "").toUpperCase()) ? String(body.syncId).toUpperCase() : ""
        };
        db.users[key] = u;
        const token = crypto.randomBytes(24).toString("hex");
        db.sessions[token] = { userId: u.id, createdAt: Date.now() };
        saveDb();
        return send(res, 200, {
          ok: true, token, firstAdmin: isFirst, syncId: u.syncId,
          user: { id: u.id, username: u.username, name: u.name, role: u.role, createdAt: u.createdAt, lastLoginAt: u.lastLoginAt }
        });
      }

      /* POST /api/auth/login  {username, password} */
      if (req.method === "POST" && parts[2] === "login") {
        const body = await readBody(req);
        const u = db.users[String(body.username || "").trim().toLowerCase()];
        if (!u) return send(res, 401, { ok: false, error: "bad_credentials" });
        const h = crypto.scryptSync(String(body.password || ""), u.salt, 64);
        const e = Buffer.from(u.passHash, "hex");
        if (h.length !== e.length || !crypto.timingSafeEqual(h, e)) return send(res, 401, { ok: false, error: "bad_credentials" });
        const token = crypto.randomBytes(24).toString("hex");
        db.sessions[token] = { userId: u.id, createdAt: Date.now() };
        u.lastLoginAt = Date.now();
        saveDb();
        return send(res, 200, {
          ok: true, token, syncId: u.syncId || "",
          user: { id: u.id, username: u.username, name: u.name, role: u.role, createdAt: u.createdAt, lastLoginAt: u.lastLoginAt }
        });
      }

      /* everything below requires a valid bearer token */
      const authHeader = /^Bearer\s+(.+)$/.exec(req.headers.authorization || "");
      const session = authHeader ? db.sessions[authHeader[1]] : null;
      if (!session || Date.now() - session.createdAt > 90 * 24 * 3600 * 1000) {
        if (session) delete db.sessions[authHeader[1]];
        return send(res, 401, { ok: false, error: "unauthorized" });
      }
      const me = Object.values(db.users).find(u => u.id === session.userId);
      if (!me) return send(res, 401, { ok: false, error: "unauthorized" });

      /* GET /api/auth/me */
      if (req.method === "GET" && parts[2] === "me") {
        return send(res, 200, { ok: true, user: { id: me.id, username: me.username, name: me.name, role: me.role, createdAt: me.createdAt, lastLoginAt: me.lastLoginAt } });
      }

      /* POST /api/auth/logout */
      if (req.method === "POST" && parts[2] === "logout") {
        delete db.sessions[authHeader[1]];
        saveDb();
        return send(res, 200, { ok: true });
      }

      /* PATCH /api/auth/password  {currentPassword, newPassword}
         Verifies the current password, then re-salts + rehashes.
         All OTHER sessions of this user are signed out. */
      if (req.method === "PATCH" && parts[2] === "password" && parts.length === 3) {
        const body = await readBody(req);
        const cur = String(body.currentPassword || "");
        const next = String(body.newPassword || "");
        if (next.length < 6 || next.length > 100) return send(res, 400, { ok: false, error: "invalid_password" });
        const h = crypto.scryptSync(cur, me.salt, 64);
        const e = Buffer.from(me.passHash, "hex");
        if (h.length !== e.length || !crypto.timingSafeEqual(h, e)) return send(res, 400, { ok: false, error: "wrong_current" });
        me.salt = crypto.randomBytes(16).toString("hex");
        me.passHash = crypto.scryptSync(next, me.salt, 64).toString("hex");
        for (const tk of Object.keys(db.sessions)) {
          if (db.sessions[tk].userId === me.id && tk !== authHeader[1]) delete db.sessions[tk];
        }
        saveDb();
        return send(res, 200, { ok: true });
      }

      /* admin-only below */
      if (me.role !== "admin") return send(res, 403, { ok: false, error: "forbidden" });
      const adminCount = () => Object.values(db.users).filter(u => u.role === "admin").length;

      /* GET /api/auth/users */
      if (req.method === "GET" && parts[2] === "users" && parts.length === 3) {
        const users = Object.values(db.users).map(u => ({
          id: u.id, username: u.username, name: u.name, role: u.role,
          createdAt: u.createdAt, lastLoginAt: u.lastLoginAt, syncId: u.syncId || "",
          xp: (u.syncId && db.syncs[u.syncId] && db.syncs[u.syncId].profile && Number(db.syncs[u.syncId].profile.xp)) || 0
        }));
        return send(res, 200, { ok: true, users });
      }

      /* POST /api/auth/users/:id/role  {role} — promote/demote */
      if (req.method === "POST" && parts.length === 5 && parts[2] === "users" && parts[4] === "role") {
        const target = Object.values(db.users).find(u => u.id === parts[3]);
        if (!target) return send(res, 404, { ok: false, error: "not_found" });
        const body = await readBody(req);
        const role = body.role === "admin" ? "admin" : "user";
        if (target.role === "admin" && role !== "admin" && adminCount() <= 1) return send(res, 400, { ok: false, error: "last_admin" });
        target.role = role;
        saveDb();
        return send(res, 200, { ok: true, user: { id: target.id, username: target.username, name: target.name, role: target.role } });
      }

      /* DELETE /api/auth/users/:id */
      if (req.method === "DELETE" && parts.length === 4 && parts[2] === "users") {
        const target = Object.values(db.users).find(u => u.id === parts[3]);
        if (!target) return send(res, 404, { ok: false, error: "not_found" });
        if (target.id === me.id) return send(res, 400, { ok: false, error: "self_delete" });
        if (target.role === "admin" && adminCount() <= 1) return send(res, 400, { ok: false, error: "last_admin" });
        delete db.users[target.username.toLowerCase()];
        for (const tk of Object.keys(db.sessions)) if (db.sessions[tk].userId === target.id) delete db.sessions[tk];
        saveDb();
        return send(res, 200, { ok: true });
      }

      /* POST /api/auth/users/:id/password  — admin resets a user's password to a server-generated temp one.
         The target's sessions are all signed out; the temp password is returned ONCE to the admin. */
      if (req.method === "POST" && parts.length === 5 && parts[2] === "users" && parts[4] === "password") {
        const target = Object.values(db.users).find(u => u.id === parts[3]);
        if (!target) return send(res, 404, { ok: false, error: "not_found" });
        const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
        let temp = "";
        const rnd = crypto.randomBytes(12);
        for (let i = 0; i < 12; i++) temp += chars[rnd[i] % chars.length];
        target.salt = crypto.randomBytes(16).toString("hex");
        target.passHash = crypto.scryptSync(temp, target.salt, 64).toString("hex");
        for (const tk of Object.keys(db.sessions)) if (db.sessions[tk].userId === target.id) delete db.sessions[tk];
        saveDb();
        return send(res, 200, { ok: true, tempPassword: temp });
      }

      return send(res, 404, { ok: false, error: "unknown endpoint" });
    }

    return send(res, 404, { ok: false, error: "unknown endpoint" });
  } catch (e) {
    return send(res, 400, { ok: false, error: e.message || "bad request" });
  }
}

/* ---------- server ---------- */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
  if (req.method === "OPTIONS") { res.writeHead(204, CORS); return res.end(); }
  if (url.pathname.startsWith("/api/")) return api(req, res, url);
  return staticHandler(req, res);
});

server.listen(PORT, () => console.log("CodeQuest server (API + static) at http://localhost:" + PORT));
