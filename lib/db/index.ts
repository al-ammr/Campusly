import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { env } from '@/lib/env';

// Prevent multiple pool instances in development with Next.js HMR
const globalForDb = globalThis as unknown as {
  campuslyDbPool?: Pool;
};

export const pool =
  globalForDb.campuslyDbPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 20, // Max concurrent connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (env.NODE_ENV !== 'production') {
  globalForDb.campuslyDbPool = pool;
}

/**
 * Execute a parameterised SQL query against the connection pool.
 * Standing Rule: Parameterised queries only. Zero raw query concatenation.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === 'development') {
      console.log(`[SQL Query] (${duration}ms):`, text.replace(/\s+/g, ' ').trim());
    }
    return res;
  } catch (error) {
    console.error('[SQL Error]:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Execute a unit of work inside an ACID database transaction.
 * Automatically handles BEGIN, COMMIT, and ROLLBACK.
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('[Transaction Rollback Error]:', rollbackError);
    }
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Gracefully shut down the database connection pool.
 */
export async function shutdownDb(): Promise<void> {
  await pool.end();
}
