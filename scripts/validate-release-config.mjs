import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson(relative) {
  const file = path.join(root, relative);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const app = readJson("app.json").expo;
const eas = readJson("eas.json");
const checks = [
  ["Android package id", app?.android?.package === "com.bala44933team.jbsagrihub"],
  ["Google services file configured", app?.android?.googleServicesFile === "./google-services.json"],
  ["Google services file exists", fs.existsSync(path.join(root, "google-services.json"))],
  ["EAS production profile", Boolean(eas?.build?.production)],
  ["EAS production auto increment", eas?.build?.production?.autoIncrement === true],
  ["EAS project id", typeof app?.extra?.eas?.projectId === "string" && app.extra.eas.projectId.length > 0],
  ["Production submit profile", Boolean(eas?.submit?.production)],
];

let passed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} — ${name}`);
  if (ok) passed += 1;
}

if (passed !== checks.length) {
  console.error(`Release config preflight failed: ${passed}/${checks.length}`);
  process.exit(1);
}

console.log(`Release config preflight passed: ${passed}/${checks.length}`);
