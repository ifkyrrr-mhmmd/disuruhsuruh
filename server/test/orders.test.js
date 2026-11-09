import test from 'node:test';
import assert from 'node:assert/strict';
import { maskPhone, maskName } from '../src/utils/masking.js';

test('Utilitas masking menyamarkan nomor telepon dan nama', () => {
  assert.equal(maskPhone('081254329876'), '0812****9876');
  assert.equal(maskName('Ahmad Faris'), 'Ahmad F.');
  assert.equal(maskName('Budi'), 'Bu***');
});
