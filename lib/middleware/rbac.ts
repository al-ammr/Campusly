// lib/middleware/rbac.ts
import { getAdminFromRequest } from '@/lib/auth/adminAuth';

/**
 * RBAC check – extracts admin session token, verifies against DB or master session, and checks role.
 * Returns true if the current admin has any of the requiredRoles.
 */
export async function enforceRoles(request: Request, requiredRoles: string[]): Promise<boolean> {
  const admin = await getAdminFromRequest(request);
  if (!admin || !admin.active) return false;

  const adminRole = admin.role.toLowerCase();
  const normalizedRequired = requiredRoles.map((r) => r.toLowerCase());

  return normalizedRequired.includes(adminRole);
}

export { getSessionFromRequest } from '@/lib/auth/session';
