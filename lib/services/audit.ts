// lib/services/audit.ts
import { query } from '@/lib/db';
import { PoolClient } from 'pg';

export interface AuditRowParams {
  adminId?: string | null;
  action: string;
  objectType: string;
  objectId?: string | null;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
  ipHash?: string;
  note?: string;
}

/**
 * Create an audit row for admin or system actions into the immutable audit_log table (D05 Section 6).
 */
export async function createAuditRow(
  dbClientOrPool: PoolClient | typeof query,
  params: AuditRowParams
) {
  const {
    adminId = null,
    action,
    objectType,
    objectId = null,
    before = null,
    after = null,
    ipHash = 'system_or_unrecorded',
  } = params;

  const sql = `
    INSERT INTO audit_log (admin_id, action, object_type, object_id, before, after, ip_hash)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, at
  `;
  const values = [
    adminId,
    action.substring(0, 64),
    objectType.substring(0, 64),
    objectId,
    before ? JSON.stringify(before) : null,
    after ? JSON.stringify(after) : null,
    ipHash,
  ];

  if (typeof dbClientOrPool === 'function') {
    return await dbClientOrPool(sql, values);
  } else {
    return await dbClientOrPool.query(sql, values);
  }
}
