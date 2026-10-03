export type JbsStatus = "completed" | "in_progress" | "planned" | "blocked";

export type JbsTask = {
  id: string;
  name: string;
  status: JbsStatus;
};

export type JbsApp = {
  id: string;
  name: string;
  tamil: string;
  tasks: JbsTask[];
};

export const JBS_ECOSYSTEM: JbsApp[] = [
  {
    id: "inventory",
    name: "JBS Inventory",
    tamil: "Stock Control",
    tasks: [
      { id: "stock", name: "Local stock control", status: "completed" },
      { id: "low-stock", name: "Low-stock monitoring", status: "completed" },
      { id: "cloud", name: "Cloud inventory sync", status: "planned" }
    ]
  },
  
  {
    id: "agri-hub",
    name: "JBS Agri Hub",
    tamil: "வாடிக்கையாளர் App",
    tasks: [
      { id: "home", name: "Home screen", status: "completed" },
      { id: "login", name: "Login / OTP flow", status: "completed" },
      { id: "products", name: "Products & Sprayers", status: "completed" },
      { id: "cart", name: "Cart", status: "completed" },
      { id: "checkout", name: "Checkout", status: "completed" },
      { id: "payment", name: "Payment", status: "completed" },
      { id: "orders", name: "Orders & tracking", status: "completed" },
      { id: "admin-orders", name: "Admin orders screen", status: "completed" },
      { id: "firebase", name: "Production Firebase validation", status: "in_progress" },
      { id: "release", name: "Production release validation", status: "in_progress" }
    ]
  },
  {
    id: "owner",
    name: "JBS Owner App",
    tamil: "Owner Control",
    tasks: [
      { id: "dashboard", name: "Owner dashboard", status: "in_progress" },
      { id: "kpi", name: "Live business KPIs", status: "planned" },
      { id: "controls", name: "Owner controls", status: "planned" }
    ]
  },
  {
    id: "orchestrator",
    name: "JBS Orchestrator",
    tamil: "Ecosystem Control",
    tasks: [
      { id: "dashboard", name: "Orchestrator dashboard", status: "completed" },
      { id: "queue", name: "AI task queue", status: "in_progress" },
      { id: "dependencies", name: "Dependency tracking", status: "in_progress" },
      { id: "release", name: "Release checklist", status: "planned" }
    ]
  },
  {
    id: "billing",
    name: "JBS Billing",
    tamil: "Billing",
    tasks: [
      { id: "invoice", name: "Invoice / GST workflow", status: "planned" },
      { id: "pdf", name: "Bill PDF", status: "planned" }
    ]
  },
  {
    id: "attendance",
    name: "JBS Attendance",
    tamil: "Attendance & Salary",
    tasks: [
      { id: "attendance", name: "Attendance tracking", status: "planned" },
      { id: "salary", name: "Salary automation", status: "planned" }
    ]
  },
  {
    id: "accounts",
    name: "JBS Accounts",
    tamil: "Accounts",
    tasks: [
      { id: "accounts", name: "Accounts management", status: "planned" },
      { id: "bank", name: "Bank transfer rules", status: "planned" }
    ]
  },
  {
    id: "marketing",
    name: "JBS Marketing",
    tamil: "Marketing",
    tasks: [
      { id: "posts", name: "Post generation", status: "planned" },
      { id: "social", name: "Social publishing", status: "planned" },
      { id: "ai", name: "Marketing AI assistant", status: "planned" }
    ]
  },
  {
    id: "delivery",
    name: "JBS Delivery",
    tamil: "Delivery & Tracking",
    tasks: [
      { id: "delivery", name: "Delivery workflow", status: "planned" },
      { id: "tracking", name: "Transport tracking", status: "planned" }
    ]
  },
  {
    id: "ai",
    name: "JBS AI",
    tamil: "AI Assistant",
    tasks: [
      { id: "owner-ai", name: "Owner AI assistant", status: "planned" },
      { id: "voice", name: "Voice controls", status: "planned" }
    ]
  }
];
