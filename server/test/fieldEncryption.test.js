import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptSensitiveField, decryptSensitiveField } from '../src/utils/fieldEncryption.js';

test('field encryption stores opaque data and decrypts the original value', () => {
  process.env.REFUND_ENCRYPTION_KEY = 'b'.repeat(64);
  const plaintext = '081234567890';
  const encrypted = encryptSensitiveField(plaintext);
  assert.notEqual(encrypted, plaintext);
  assert.match(encrypted, /^enc:v1:/);
  assert.equal(decryptSensitiveField(encrypted), plaintext);
});

test('field encryption fails closed without a valid key', () => {
  const previous = process.env.REFUND_ENCRYPTION_KEY;
  delete process.env.REFUND_ENCRYPTION_KEY;
  assert.throws(() => encryptSensitiveField('12345678'), /REFUND_ENCRYPTION_KEY/);
  if (previous === undefined) delete process.env.REFUND_ENCRYPTION_KEY;
  else process.env.REFUND_ENCRYPTION_KEY = previous;
});
