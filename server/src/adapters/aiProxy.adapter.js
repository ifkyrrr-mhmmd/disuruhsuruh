import axios from 'axios';
import { logInferenceResult } from '../models/aiLog.model.js';

export const predictOrderWithFallback = async (features, orderId = null) => {
  const startTime = Date.now();
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  const {
    service_type = 'antar_barang',
    distance_km = 0,
    dynamic_payload = {},
  } = features;

  try {
    const response = await axios.post(
      `${aiServiceUrl}/predict`,
      {
        service_type,
        distance_km: Number(distance_km) || 0,
        dynamic_payload,
      },
      {
        timeout: 3000,
      }
    );

    const latency_ms = Date.now() - startTime;
    const result = {
      predicted_duration_minutes: response.data.predicted_duration_minutes || 20,
      predicted_price: response.data.predicted_price || null,
      model_name: response.data.model_name || 'disuruhsuruh-ai-python-v1',
      is_fallback: false,
      latency_ms,
    };

    // Fire-and-forget logging to database
    logInferenceResult({
      order_id: orderId,
      model_name: result.model_name,
      input_features: features,
      predicted_output: result.predicted_duration_minutes,
      is_fallback: false,
      latency_ms,
    }).catch((err) => console.warn('[AI LOG] Log save skipped:', err.message));

    return result;
  } catch (err) {
    const latency_ms = Date.now() - startTime;

    // Graceful Heuristic Fallback based on Samarinda city speed ~25 km/h
    const dist = Math.max(0, Number(distance_km) || 0);
    let fallbackMinutes = 20;

    if (service_type === 'antar_barang') {
      fallbackMinutes = Math.max(15, Math.round(dist * 2.4 + 10));
    } else if (service_type === 'titip_beli') {
      fallbackMinutes = Math.max(25, Math.round(dist * 2.4 + 20));
    } else if (service_type === 'bersih_rumah') {
      const hours = Number(dynamic_payload.duration_hours) || 2;
      fallbackMinutes = hours * 60;
    }

    const fallbackResult = {
      predicted_duration_minutes: fallbackMinutes,
      predicted_price: null,
      model_name: 'disuruhsuruh-heuristic-v1',
      is_fallback: true,
      latency_ms,
    };

    // Fire-and-forget logging to database
    logInferenceResult({
      order_id: orderId,
      model_name: fallbackResult.model_name,
      input_features: features,
      predicted_output: fallbackMinutes,
      is_fallback: true,
      latency_ms,
    }).catch((logErr) => console.warn('[AI LOG] Fallback log save skipped:', logErr.message));

    return fallbackResult;
  }
};

export default { predictOrderWithFallback };
