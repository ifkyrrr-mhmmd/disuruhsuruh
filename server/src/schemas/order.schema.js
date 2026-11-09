import Joi from 'joi';
import { dynamicPayloadSchema } from './dynamicPayload.schema.js';

const indonesianPhoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;

export const createOrderSchema = Joi.object({
  service_type: Joi.string()
    .valid('antar_barang', 'titip_beli', 'bersih_rumah', 'layanan_lainnya')
    .required()
    .messages({
      'any.only': 'Tipe layanan harus antara antar_barang, titip_beli, bersih_rumah, atau layanan_lainnya',
      'any.required': 'Tipe layanan wajib diisi',
    }),
  customer_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nama pelanggan minimal 2 karakter',
      'any.required': 'Nama pelanggan wajib diisi',
    }),
  customer_phone: Joi.string()
    .pattern(indonesianPhoneRegex)
    .required()
    .messages({
      'string.pattern.base': 'Nomor WhatsApp tidak valid (harus nomor Indonesia berawalan 08 / +628)',
      'any.required': 'Nomor WhatsApp wajib diisi',
    }),
  pickup_address: Joi.string().allow('', null).optional(),
  dropoff_address: Joi.string()
    .min(3)
    .max(300)
    .required()
    .messages({
      'any.required': 'Alamat tujuan pengantaran/lokasi wajib diisi',
    }),
  pickup_coords: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  dropoff_coords: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  pickup_lat: Joi.number().optional(),
  pickup_lng: Joi.number().optional(),
  dropoff_lat: Joi.number().optional(),
  dropoff_lng: Joi.number().optional(),
  distance_km: Joi.number()
    .min(0)
    .max(50)
    .default(0)
    .messages({
      'number.max': 'Jarak pengantaran melebihi batas jangkauan Samarinda (50 km)',
    }),
  payment_method: Joi.string()
    .valid('COD', 'QRIS_DIGITAL')
    .default('COD')
    .messages({
      'any.only': 'Metode pembayaran harus COD atau QRIS_DIGITAL',
    }),
  dynamic_payload: dynamicPayloadSchema.default({}),
});

export default { createOrderSchema };
