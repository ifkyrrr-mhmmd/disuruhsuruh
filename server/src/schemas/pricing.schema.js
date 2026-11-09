import Joi from 'joi';
import { dynamicPayloadSchema } from './dynamicPayload.schema.js';

export const pricingEstimateSchema = Joi.object({
  service_type: Joi.string()
    .valid('antar_barang', 'titip_beli', 'bersih_rumah')
    .required()
    .messages({
      'any.only': 'Tipe layanan harus antara antar_barang, titip_beli, atau bersih_rumah',
      'any.required': 'Tipe layanan wajib diisi',
    }),
  distance_km: Joi.number()
    .min(0)
    .max(50)
    .default(0)
    .messages({
      'number.base': 'Jarak harus berupa angka',
      'number.max': 'Jarak melebihi radius operasional maksimum Samarinda (50 km)',
    }),
  pickup_coords: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).optional(),
  dropoff_coords: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).optional(),
  item_weight_kg: Joi.number().min(1).max(20).optional(),
  item_dimension: Joi.string().valid('kecil', 'sedang', 'besar').optional(),
  dynamic_payload: dynamicPayloadSchema.optional(),
  distance_is_fallback: Joi.boolean().optional(),
});

export default { pricingEstimateSchema };
