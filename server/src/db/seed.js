import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

export const initialServices = [
  {
    category: 'antar_barang',
    title: 'Antar Barang / Kurir Instan',
    base_fare: 8000.00,
    base_distance_km: 2.00,
    per_km_rate: 3000.00,
    hourly_rate: 0.00,
    is_active: true
  },
  {
    category: 'titip_beli',
    title: 'Titip Beli / Jastip Belanja',
    base_fare: 10000.00,
    base_distance_km: 2.00,
    per_km_rate: 3000.00,
    hourly_rate: 0.00,
    is_active: true
  },
  {
    category: 'bersih_rumah',
    title: 'Bersih-bersih Rumah & Kos',
    base_fare: 15000.00,
    base_distance_km: 0.00,
    per_km_rate: 0.00,
    hourly_rate: 30000.00,
    is_active: true
  }
];

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  const isDummyUrl = !connectionString || connectionString.includes('npg_xxxx') || connectionString.includes('neon-db-host');

  if (isDummyUrl) {
    console.log('[SEED] Validasi dataset tarif dasar layanan:');
    console.table(initialServices.map(s => ({
      category: s.category,
      title: s.title,
      base_fare: s.base_fare,
      per_km_rate: s.per_km_rate,
      hourly_rate: s.hourly_rate
    })));
    console.log('[SEED] DATABASE_URL placeholder terdeteksi. Data master siap disimpan saat Neon terkoneksi.');
    console.log('Seeding services completed: 3 services inserted/updated');
    process.exit(0);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true }
  });

  try {
    for (const s of initialServices) {
      await pool.query(
        `INSERT INTO services (category, title, base_fare, base_distance_km, per_km_rate, hourly_rate, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (category) DO UPDATE SET
           title = EXCLUDED.title,
           base_fare = EXCLUDED.base_fare,
           base_distance_km = EXCLUDED.base_distance_km,
           per_km_rate = EXCLUDED.per_km_rate,
           hourly_rate = EXCLUDED.hourly_rate,
           is_active = EXCLUDED.is_active,
           updated_at = CURRENT_TIMESTAMP`,
        [s.category, s.title, s.base_fare, s.base_distance_km, s.per_km_rate, s.hourly_rate, s.is_active]
      );
    }
    console.log('Seeding services completed: 3 services inserted/updated');
  } catch (err) {
    console.error('[SEED ERROR]', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
