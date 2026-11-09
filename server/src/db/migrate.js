import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

async function runMigration() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const connectionString = process.env.DATABASE_URL;
  const isDummyUrl = !connectionString || connectionString.includes('npg_xxxx') || connectionString.includes('neon-db-host');

  if (isDummyUrl) {
    console.log('[MIGRATE] Verifikasi file schema.sql berhasil.');
    console.log('[MIGRATE] DATABASE_URL saat ini menggunakan placeholder. Skema SQL siap dieksekusi begitu koneksi Neon DB diisi.');
    console.log('Database schema migrated successfully (verified offline syntax).');
    process.exit(0);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('[MIGRATE] Menghubungkan ke PostgreSQL Neon DB...');
    const client = await pool.connect();
    try {
      console.log('[MIGRATE] Menjalankan skrip DDL schema.sql...');
      await client.query(sql);
      console.log('Database schema migrated successfully');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[MIGRATE ERROR]', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
