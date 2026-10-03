import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [
  ["billing storage", "src/services/billing-storage.ts", /AsyncStorage/],
  ["invoice numbering", "src/services/invoice.ts", /nextInvoiceNumber/],
  ["invoice order link", "src/data/billing-types.ts", /orderId\?: string/],
  ["gross margin reporting", "src/services/business-reports.ts", /costOfGoods/],
  ["payroll calculation", "src/services/payroll.ts", /calculateSalary/],
  ["payment server verification", "src/services/payment-boundary.ts", /verifiedByServer/],
  ["order success payment boundary", "src/app/order-success.tsx", /resolvePaymentStatus\(requestedPaymentStatus\)/],
  ["invoice fallback normalization", "src/services/invoice.ts", /replace\(\/\\\\s\+\/g, "-"\)/],
  ["client cannot mark paid", "src/services/payment-boundary.ts", /canClientMarkPaid\(\): false/],
  ["delivery order bridge", "src/services/delivery-order.ts", /deliveryToOrderStatus/],
  ["marketing due scheduler", "src/services/marketing-scheduler.ts", /getDueScheduledPosts/],
  ["AI permissions", "src/services/ai-permissions.ts", /canPublishAiResult/],
  ["release target", "docs/10-day-production-target.md", /Day 10 — Release readiness/],
];

let passed = 0;
for (const [name, relative, pattern] of checks) {
  const file = path.join(root, relative);
  const content = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const ok = pattern.test(content);
  console.log(`${ok ? "PASS" : "FAIL"} — ${name}`);
  if (ok) passed += 1;
}

if (passed !== checks.length) {
  console.error(`Production boundary regression failed: ${passed}/${checks.length}`);
  process.exit(1);
}

console.log(`Production boundary regression passed: ${passed}/${checks.length}`);
