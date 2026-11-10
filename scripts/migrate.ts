import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import { env } from '../lib/env';

export async function runMigrations(direction: 'up' | 'down' = 'up') {
  console.log(`[Migrations] Running migrations (${direction})...`);
  const migrationsDir = path.resolve(__dirname, 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  const filename = direction === 'up' ? '001_initial_schema.sql' : '001_initial_schema.down.sql';
  const filePath = path.join(migrationsDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Migration file not found: ${filePath}`);
  }

  const sql = fs.readFileSync(filePath, 'utf-8');

  const connectionString = env.DATABASE_DIRECT_URL || env.DATABASE_URL;
  console.log(`[Migrations] Connecting to database...`);
  const client = new Client({
    connectionString: connectionString || '',
    ssl: connectionString?.includes('localhost') ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();

  try {
    console.log(`[Migrations] Beginning transaction for ${filename}...`);
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log(`[Migrations] Successfully executed and committed ${filename}`);
  } catch (err) {
    console.error(`[Migrations Error]:`, err);
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }

  console.log(`[Migrations] Completed successfully.`);
}

if (require.main === module) {
  const direction = process.argv[2] === 'down' ? 'down' : 'up';
  runMigrations(direction)
    .then(() => {
      console.log('[Migrations Process Exited Cleanly]');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Migrations Execution Failed]:', err);
      process.exit(1);
    });
}
