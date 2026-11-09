import { query, pool } from '../db/connection.js';

export const logInferenceResult = async ({
  order_id = null,
  model_name,
  input_features,
  predicted_output = 0,
  is_fallback = false,
  latency_ms,
}) => {
  if (!pool) {
    // In offline or dummy DB mode, log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[AI LOG MEMORY]', { model_name, is_fallback, latency_ms });
    }
    return null;
  }

  const sql = `
    INSERT INTO ai_inference_logs (order_id, model_name, input_features, predicted_output, is_fallback, latency_ms)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, created_at;
  `;

  const values = [
    order_id,
    model_name,
    JSON.stringify(input_features),
    predicted_output,
    is_fallback,
    latency_ms,
  ];

  return query(sql, values);
};

export default { logInferenceResult };
