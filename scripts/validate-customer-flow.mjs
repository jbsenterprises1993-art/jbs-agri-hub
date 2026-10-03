import fs from "node:fs";

const requiredRoutes = [
  "src/app/login.tsx",
  "src/app/products.tsx",
  "src/app/cart.tsx",
  "src/app/checkout.tsx",
  "src/app/payment.tsx",
  "src/app/order-success.tsx",
  "src/app/my-orders.tsx",
  "src/app/track-order.tsx",
];

const requiredMarkers = [
  ["login", "src/app/login.tsx", "signInWithPhoneNumber"],
  ["products", "src/app/products.tsx", "router.push"],
  ["cart", "src/app/cart.tsx", "saveCheckoutDraft"],
  ["checkout", "src/app/checkout.tsx", 'pathname: "/payment"'],
  ["COD boundary", "src/app/payment.tsx", 'paymentMethod === "cod"'],
  ["order persistence", "src/app/order-success.tsx", "persistOrder"],
  ["inventory sale", "src/app/order-success.tsx", "applyOrderSale"],
  ["my orders", "src/app/my-orders.tsx", "subscribeToCurrentUserOrders"],
  ["tracking", "src/app/track-order.tsx", "orderId"],
];

const missingRoutes = requiredRoutes.filter((path) => !fs.existsSync(path));
const missingMarkers = requiredMarkers.filter(([, path, marker]) => {
  return !fs.readFileSync(path, "utf8").includes(marker);
});

if (missingRoutes.length || missingMarkers.length) {
  console.error("Customer smoke-flow contract failed.");
  for (const path of missingRoutes) console.error(`Missing route: ${path}`);
  for (const [name, path, marker] of missingMarkers) {
    console.error(`Missing marker [${name}] in ${path}: ${marker}`);
  }
  process.exit(1);
}

console.log(`Customer smoke-flow contract passed (${requiredRoutes.length} routes, ${requiredMarkers.length} markers).`);
