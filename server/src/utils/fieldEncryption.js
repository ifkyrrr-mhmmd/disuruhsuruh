import crypto from 'crypto';

const PREFIX = 'enc:v1:';

const getEncryptionKey = () => {
  const value = process.env.REFUND_ENCRYPTION_KEY || '';
  if (!/^[a-fA-F0-9]{64}$/.test(value)) {
    const error = new Error('REFUND_ENCRYPTION_KEY belum dikonfigurasi. Gunakan 64 karakter hex acak.');
    error.statusCode = 503;
    throw error;
  }
  return Buffer.from(value, 'hex');
};

export const encryptSensitiveField = (value) => {
  if (value === null || value === undefined || value === '') return value;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString('base64url')}:${tag.toString('base64url')}:${encrypted.toString('base64url')}`;
};

export const decryptSensitiveField = (value) => {
  if (value === null || value === undefined || value === '') return value;
  // Legacy plaintext rows remain readable during migration; new writes are always encrypted.
  if (!String(value).startsWith(PREFIX)) return value;
  const [, version, ivEncoded, tagEncoded, dataEncoded] = String(value).split(':');
  if (version !== 'v1' || !ivEncoded || !tagEncoded || !dataEncoded) {
    const error = new Error('Format data terenkripsi tidak valid.');
    error.statusCode = 500;
    throw error;
  }
  const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(ivEncoded, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagEncoded, 'base64url'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataEncoded, 'base64url')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
};

export default { encryptSensitiveField, decryptSensitiveField };
