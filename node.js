/* ============================================================
   node.js — minimal starter script
   Run with:  node node.js
   ============================================================ */

// greeting + template strings
const app = "CodeQuest";
const year = new Date().getFullYear();
console.log(`Hello from Node.js! 🚀 Welcome to ${app} (${year}).`);

// functions
const square = n => n * n;
console.log("5 squared =", square(5));

// arrays & strings
const languages = ["HTML", "CSS", "JavaScript"];
console.log("You'll learn:", languages.join(" → "));

// objects
const learner = { name: "Future Developer", xp: 125, level: 2 };
console.log(`Learner: ${learner.name} — ${learner.xp} XP (level ${learner.level})`);

// async file read (this file's own size)
const fs = require("fs/promises");
(async () => {
  const stat = await fs.stat(__filename);
  console.log(`This file is ${stat.size} bytes. Happy hacking! ✨`);
})();
