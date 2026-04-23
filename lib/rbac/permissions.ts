import type { Role } from "@/lib/constants";

export const PERMISSIONS: Record<Role, string[]> = {
  artisan: [
    "profile:manage",
    "workshop:manage",
    "product:manage-own",
    "request:submit-own",
    "payment:create-own",
    "certificate:read-own",
  ],
  inspector: [
    "mission:read-assigned",
    "inspection:create-assigned",
    "inspection:upload-assigned",
  ],
  lab_agent: [
    "lab:read-assigned",
    "lab:update-assigned",
    "lab:upload-assigned",
  ],
  admin: ["*"],
};

export function hasPermission(role: Role, permission: string) {
  return PERMISSIONS[role].includes("*") || PERMISSIONS[role].includes(permission);
}
