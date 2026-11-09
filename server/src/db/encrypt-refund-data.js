import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, pool } from './connection.js';
import { encryptSensitiveField } from '../utils/fieldEncryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  if (!pool) throw new Error('DATABASE_URL belum dikonfigurasi.');
  const result = await query('SELECT id, account_number, account_holder_name FROM refunds');
  let migrated = 0;

  for (const row of result.rows) {
    const accountNumber = String(row.account_number || '');
    const accountHolder = String(row.account_holder_name || '');
    const encryptedAccountNumber = accountNumber.startsWith('enc:v1:')
      ? accountNumber
      : encryptSensitiveField(accountNumber);
    const encryptedAccountHolder = accountHolder.startsWith('enc:v1:')
      ? accountHolder
      : encryptSensitiveField(accountHolder);
    if (encryptedAccountNumber === accountNumber && encryptedAccountHolder === accountHolder) continue;

    await query(
      'UPDATE refunds SET account_number = $2, account_holder_name = $3 WHERE id = $1',
      [row.id, encryptedAccountNumber, encryptedAccountHolder]
    );
    migrated += 1;
  }

  console.log(`[REFUND DATA] ${migrated} record lama dienkripsi.`);
};

try {
  await run();
} catch (error) {
  console.error('[REFUND DATA MIGRATION]', error.message);
  process.exitCode = 1;
} finally {
  if (pool) await pool.end();
}
