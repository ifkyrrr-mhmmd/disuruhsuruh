import Joi from 'joi';

export const dynamicPayloadSchema = Joi.object({
  item_weight_kg: Joi.number().min(1).max(20),
  item_dimension: Joi.string().valid('kecil', 'sedang', 'besar'),
  item_notes: Joi.string().max(500).allow(''),
  shopping_list: Joi.string().trim().min(3).max(2000).allow(''),
  estimated_items_cost: Joi.number().min(0).max(10000000),
  out_of_stock_preference: Joi.string().valid('call_customer', 'buy_available', 'cancel_order'),
  is_traditional_market: Joi.boolean(),
  additional_stores_count: Joi.number().integer().min(0).max(10),
  property_type: Joi.string().valid('kos', 'rumah', 'kantor'),
  cleaning_intensity: Joi.string().valid('ringan', 'standar', 'deep_clean'),
  duration_hours: Joi.number().integer().min(1).max(4),
  cleaner_gender_preference: Joi.string().valid('bebas', 'wanita', 'pria'),
}).unknown(true);

export default dynamicPayloadSchema;
