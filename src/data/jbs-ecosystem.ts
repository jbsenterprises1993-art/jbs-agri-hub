export type JbsStatus = "completed" | "in_progress" | "planned" | "blocked";

export type JbsTask = { id: string; name: string; status: JbsStatus };
export type JbsApp = { id: string; name: string; tamil: string; tasks: JbsTask[] };

export const JBS_ECOSYSTEM: JbsApp[] = [
  { id:"inventory", name:"JBS Inventory", tamil:"Stock Control", tasks:[
    {id:"stock",name:"Local stock control",status:"completed"},
    {id:"low-stock",name:"Low-stock monitoring",status:"completed"},
    {id:"cloud",name:"Cloud inventory sync",status:"planned"}]},
  { id:"agri-hub", name:"JBS Agri Hub", tamil:"வாடிக்கையாளர் App", tasks:[
    {id:"home",name:"Home screen",status:"completed"},{id:"login",name:"Login / OTP flow",status:"completed"},
    {id:"products",name:"Products & Sprayers",status:"completed"},{id:"cart",name:"Cart",status:"completed"},
    {id:"checkout",name:"Checkout",status:"completed"},{id:"payment",name:"Payment",status:"completed"},
    {id:"orders",name:"Orders & tracking",status:"completed"},{id:"admin-orders",name:"Admin orders screen",status:"completed"},
    {id:"firebase-audit",name:"Firebase auth/cloud boundary audit",status:"completed"},
    {id:"firebase-bridge",name:"Native Auth → Firestore REST bridge",status:"in_progress"},
    {id:"integration-tests",name:"TypeScript integration validation",status:"in_progress"},
    {id:"firebase",name:"Production Firebase validation",status:"blocked"},
    {id:"release",name:"Production release validation",status:"in_progress"},{id:"firebase-security",name:"Firestore ownership & admin-claim security",status:"in_progress"},{id:"android-smoke",name:"Android customer smoke-flow validation",status:"in_progress"}]},
  { id:"owner", name:"JBS Owner App", tamil:"Owner Control", tasks:[
    {id:"dashboard",name:"Owner dashboard",status:"in_progress"},{id:"kpi",name:"Live business KPIs",status:"planned"},{id:"controls",name:"Owner controls",status:"planned"}]},
  { id:"orchestrator", name:"JBS Orchestrator", tamil:"Ecosystem Control", tasks:[
    {id:"dashboard",name:"Orchestrator dashboard",status:"completed"},{id:"queue",name:"AI task queue",status:"in_progress"},
    {id:"dependencies",name:"Dependency tracking",status:"in_progress"},{id:"release",name:"Release checklist",status:"planned"}]},
  { id:"billing", name:"JBS Billing", tamil:"Billing", tasks:[
    {id:"invoice",name:"Invoice / GST workflow",status:"in_progress"},{id:"persistence",name:"Invoice persistence & numbering",status:"completed"},{id:"pdf",name:"Bill PDF",status:"planned"}]},
  { id:"attendance", name:"JBS Attendance", tamil:"Attendance & Salary", tasks:[
    {id:"attendance",name:"Attendance tracking",status:"completed"},{id:"payroll",name:"Attendance-driven payroll calculation",status:"in_progress"},{id:"salary",name:"Salary automation",status:"planned"}]},
  { id:"accounts", name:"JBS Accounts", tamil:"Accounts", tasks:[
    {id:"accounts",name:"Accounts management",status:"completed"},{id:"ledger",name:"Double-entry transfer ledger",status:"completed"},{id:"bank",name:"Bank transfer rules",status:"planned"}]},
  { id:"marketing", name:"JBS Marketing", tamil:"Marketing", tasks:[
    {id:"posts",name:"Post generation",status:"completed"},{id:"scheduler",name:"Scheduled post detection",status:"completed"},{id:"social",name:"Social publishing",status:"planned"},{id:"ai",name:"Marketing AI assistant",status:"in_progress"}]},
  { id:"delivery", name:"JBS Delivery", tamil:"Delivery & Tracking", tasks:[
    {id:"delivery",name:"Delivery workflow",status:"completed"},{id:"order-sync",name:"Delivery → order status sync",status:"completed"},{id:"tracking",name:"Transport tracking",status:"planned"}]},
  { id:"ai", name:"JBS AI", tamil:"AI Assistant", tasks:[
    {id:"owner-ai",name:"Owner AI assistant",status:"in_progress"},{id:"permissions",name:"AI action permissions",status:"completed"},{id:"voice",name:"Voice controls",status:"planned"}]}
];
