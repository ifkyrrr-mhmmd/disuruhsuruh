import test from 'node:test';
import assert from 'node:assert/strict';
import { predictOrderWithFallback } from '../src/adapters/aiProxy.adapter.js';

test('AI Adapter graceful fallback saat service Python AI offline', async () => {
  // Override AI_SERVICE_URL to unreachable endpoint
  process.env.AI_SERVICE_URL = 'http://127.0.0.1:59999';

  const inputFeatures = {
    service_type: 'antar_barang',
    distance_km: 5.0,
    dynamic_payload: { item_weight_kg: 4 },
  };

  const result = await predictOrderWithFallback(inputFeatures);

  assert.equal(result.is_fallback, true);
  assert.ok(result.predicted_duration_minutes > 0);
  assert.ok(result.latency_ms >= 0);
  assert.equal(result.model_name, 'disuruhsuruh-heuristic-v1');
});
