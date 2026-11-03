import * as fs from 'fs';
import * as path from 'path';
import { query, withTransaction, shutdownDb } from '../lib/db';

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

  await withTransaction(async (client) => {
    console.log(`[Migrations] Applying ${filename}...`);
    await client.query(sql);
    console.log(`[Migrations] Successfully executed ${filename}`);
  });

  console.log(`[Migrations] Completed successfully.`);
}

if (require.main === module) {
  const direction = process.argv[2] === 'down' ? 'down' : 'up';
  runMigrations(direction)
    .then(() => shutdownDb())
    .catch(async (err) => {
      console.error('[Migrations Error]:', err);
      await shutdownDb();
      process.exit(1);
    });
}
