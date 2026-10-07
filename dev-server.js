/* Minimal static file server for running CodeQuest locally.
   Usage:  node dev-server.js [port]     (default 8090)
   Can also be required: exports the request handler. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

function staticHandler(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

/* CLI mode: when required by server.js, startServer is called instead */
if (require.main === module) {
  const PORT = process.argv[2] || 8090;
  http.createServer(staticHandler).listen(PORT, () => console.log("CodeQuest running at http://localhost:" + PORT));
}

module.exports = { staticHandler };
