import fs from "node:fs";

const rules = fs.readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");

const requiredChecks = [
  ["signed-in create boundary", "allow create: if signedIn() && validOrderCreate(orderId);"],
  ["customer ownership on create", "request.resource.data.userId == request.auth.uid"],
  ["non-negative order total", "request.resource.data.total >= 0"],
  ["non-empty customer name", "request.resource.data.name.size() > 0"],
  ["non-empty order date", "request.resource.data.date.size() > 0"],
  ["allow-listed order status", "validOrderStatus(request.resource.data.status)"],
  ["customer read ownership", "resource.data.userId == request.auth.uid"],
  ["trusted admin claim", "request.auth.token.admin == true"],
  ["admin-only update", "allow update: if isAdmin();"],
  ["admin-only delete", "allow delete: if isAdmin();"],
];

const missing = requiredChecks.filter(([, fragment]) => !rules.includes(fragment));

if (missing.length > 0) {
  console.error("Firestore rule contract check failed:");
  for (const [name, fragment] of missing) {
    console.error(`- ${name}: missing "${fragment}"`);
  }
  process.exit(1);
}

console.log(`Firestore rule contract check passed (${requiredChecks.length} checks).`);
