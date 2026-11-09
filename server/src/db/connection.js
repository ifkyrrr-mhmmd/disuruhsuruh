import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const isDummyUrl = !connectionString || connectionString.includes('npg_xxxx') || connectionString.includes('neon-db-host');

let pool = null;

if (!isDummyUrl) {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle PostgreSQL client:', err.message);
  });
} else {
  console.warn('[DB] DATABASE_URL is placeholder or missing. Database queries will require valid Neon credentials.');
}

export const query = async (text, params) => {
  if (!pool) {
    throw new Error('DATABASE_NOT_CONFIGURED: Sediakan DATABASE_URL Neon yang valid di server/.env');
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log('[DB Query]', { text: text.slice(0, 60), duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
};

export { pool };
export default { query, pool };
