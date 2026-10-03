import type { JbsRole } from "@/domain/jbs-types";

const rolePermissions: Record<JbsRole, readonly string[]> = {
  customer: ["orders.read", "orders.create", "coins.read"],
  staff: ["orders.read", "orders.update", "stock.read", "attendance.write"],
  branch_manager: ["orders.read", "orders.update", "stock.read", "stock.write", "attendance.read", "attendance.write"],
  owner: ["*"],
  controller: ["*"],
};

export function hasJbsPermission(role: JbsRole, permission: string) {
  const permissions = rolePermissions[role];
  return permissions.includes("*") || permissions.includes(permission);
}

export function getJbsPermissions(role: JbsRole) {
  return [...rolePermissions[role]];
}
