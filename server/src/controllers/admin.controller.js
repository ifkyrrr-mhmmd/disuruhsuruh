import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { customAlphabet } from 'nanoid';
import { listAllOrders, findById, updateOrder, insertOrder } from '../models/order.model.js';
import { generateDynamicQRIS } from '../adapters/midtrans.adapter.js';
import { calculatePricing } from '../services/pricing.service.js';
import { predictOrderWithFallback } from '../adapters/aiProxy.adapter.js';

const generateNanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

export const adminLogin = async (req, res, next) => {
  try {
    const { pin, username, password } = req.body;
    const configuredPin = process.env.ADMIN_PIN;
    const secret = process.env.JWT_SECRET;

    if (!configuredPin || configuredPin.length < 8 || !secret || secret.length < 32) {
      return res.status(503).json({ status: 'error', message: 'Login admin belum dikonfigurasi oleh pengelola.' });
    }

    const suppliedPin = typeof pin === 'string' ? pin : (typeof password === 'string' ? password : '');
    const suppliedBuffer = Buffer.from(suppliedPin);
    const configuredBuffer = Buffer.from(configuredPin);
    const isValid = suppliedBuffer.length === configuredBuffer.length
      && crypto.timingSafeEqual(suppliedBuffer, configuredBuffer);

    if (!isValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'PIN atau kredensial admin salah',
      });
    }

    const token = jwt.sign(
      { username: 'admin', role: 'admin' },
      secret,
      { expiresIn: '8h', algorithm: 'HS256' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login admin berhasil',
      data: {
        token,
        role: 'admin',
        username: username || 'Admin disuruhsuruh',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
    const offset = Math.max(0, Number.parseInt(req.query.offset, 10) || 0);
    const allowedStatuses = new Set(['PENDING_REVIEW', 'AWAITING_PAYMENT', 'CONFIRMED', 'EXPIRED', 'PAYMENT_CONFIRMED', 'MITRA_ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED_BY_USER', 'CANCELLED_BY_ADMIN', 'REFUND_REQUESTED', 'REFUNDED']);
    if (status && !allowedStatuses.has(status)) {
      return res.status(400).json({ status: 'fail', message: 'Filter status tidak dikenal.' });
    }
    const orders = await listAllOrders({ status, limit, offset });

    res.status(200).json({
      status: 'success',
      data: {
        total: orders.length,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const allOrders = await listAllOrders({ limit: 1000 });

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === 'PENDING_REVIEW').length,
      awaiting_payment: allOrders.filter((o) => o.status === 'AWAITING_PAYMENT').length,
      active: allOrders.filter((o) => ['CONFIRMED', 'PAYMENT_CONFIRMED', 'MITRA_ASSIGNED', 'IN_PROGRESS'].includes(o.status)).length,
      completed: allOrders.filter((o) => o.status === 'COMPLETED').length,
      refund_requested: allOrders.filter((o) => o.status === 'REFUND_REQUESTED').length,
      revenue_idr: allOrders
        .filter((o) => o.payment_status === 'PAID')
        .reduce((acc, curr) => acc + (Number(curr.final_price) || 0), 0),
    };

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const approveOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      final_price,
      price_override_reason = 'Disetujui admin',
      assigned_mitra_name,
      assigned_mitra_phone,
    } = req.body;

    const order = await findById(id);
    if (!order) {
      return res.status(404).json({ status: 'fail', message: `Order ${id} tidak ditemukan` });
    }

    const price = final_price !== undefined ? Number(final_price) : Number(order.initial_estimated_price);
    if (!Number.isFinite(price) || price <= 0 || price > 100000000) {
      return res.status(400).json({ status: 'fail', message: 'Harga final harus berupa angka positif yang valid.' });
    }
    if (!['PENDING_REVIEW', 'CONFIRMED', 'PAYMENT_CONFIRMED'].includes(order.status)) {
      return res.status(409).json({ status: 'fail', message: 'Pesanan ini sudah melewati tahap persetujuan atau penugasan.' });
    }
    if (['CONFIRMED', 'PAYMENT_CONFIRMED'].includes(order.status) && !assigned_mitra_name) {
      return res.status(400).json({ status: 'fail', message: 'Nama mitra wajib diisi untuk penugasan.' });
    }
    if (String(price_override_reason || '').trim().length > 500) {
      return res.status(400).json({ status: 'fail', message: 'Alasan penyesuaian harga maksimal 500 karakter.' });
    }
    if (assigned_mitra_name && (String(assigned_mitra_name).trim().length < 2 || String(assigned_mitra_name).trim().length > 100)) {
      return res.status(400).json({ status: 'fail', message: 'Nama mitra harus terdiri dari 2 sampai 100 karakter.' });
    }
    if (assigned_mitra_phone && !/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(String(assigned_mitra_phone))) {
      return res.status(400).json({ status: 'fail', message: 'Nomor WhatsApp mitra tidak valid.' });
    }
    if (order.status !== 'PENDING_REVIEW' && price !== Number(order.final_price)) {
      return res.status(409).json({ status: 'fail', message: 'Harga tidak dapat diubah setelah pesanan dikonfirmasi. Ajukan penyesuaian melalui prosedur admin.' });
    }

    const updatePayload = {
      final_price: price,
      price_override_reason,
      assigned_mitra_name: assigned_mitra_name || order.assigned_mitra_name,
      assigned_mitra_phone: assigned_mitra_phone || order.assigned_mitra_phone,
    };

    if (['CONFIRMED', 'PAYMENT_CONFIRMED'].includes(order.status)) {
      if (order.payment_method === 'QRIS_DIGITAL' && order.payment_status !== 'PAID') {
        return res.status(409).json({ status: 'fail', message: 'Pembayaran QRIS belum diterima, mitra belum dapat ditugaskan.' });
      }
      updatePayload.status = 'MITRA_ASSIGNED';
    } else if (order.payment_method === 'QRIS_DIGITAL') {
      const qrisResult = await generateDynamicQRIS({
        ...order,
        final_price: price,
      });

      updatePayload.status = 'AWAITING_PAYMENT';
      updatePayload.qris_qr_url = qrisResult.qris_qr_url;
      updatePayload.payment_expiry_at = qrisResult.payment_expiry_at;
      updatePayload.payment_transaction_id = qrisResult.transaction_id;
    } else {
      // COD -> langsung siap jalan
      // COD belum dibayar saat order disetujui. Status pesanan dipisahkan dari status pembayaran.
      updatePayload.status = assigned_mitra_name ? 'MITRA_ASSIGNED' : 'CONFIRMED';
    }

    const updated = await updateOrder(id, updatePayload);

    res.status(200).json({
      status: 'success',
      message: 'Pesanan berhasil disetujui',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, proof_image_url, assigned_mitra_name, assigned_mitra_phone } = req.body;

    const existing = await findById(id);
    if (!existing) {
      return res.status(404).json({ status: 'fail', message: `Order ${id} tidak ditemukan` });
    }

    const allowedTransitions = {
      PENDING_REVIEW: ['CONFIRMED', 'CANCELLED_BY_ADMIN'],
      AWAITING_PAYMENT: ['CONFIRMED', 'CANCELLED_BY_ADMIN'],
      CONFIRMED: ['MITRA_ASSIGNED', 'CANCELLED_BY_ADMIN'],
      PAYMENT_CONFIRMED: ['MITRA_ASSIGNED', 'CANCELLED_BY_ADMIN'],
      MITRA_ASSIGNED: ['IN_PROGRESS', 'CANCELLED_BY_ADMIN'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED_BY_ADMIN'],
    };
    if (status === 'CONFIRMED' && existing.payment_method === 'QRIS_DIGITAL' && existing.payment_status !== 'PAID') {
      return res.status(409).json({ status: 'fail', message: 'Pesanan QRIS hanya dapat dikonfirmasi setelah pembayaran diterima.' });
    }
    if (status === 'MITRA_ASSIGNED' && !(assigned_mitra_name || existing.assigned_mitra_name)) {
      return res.status(409).json({ status: 'fail', message: 'Nama mitra wajib diisi sebelum status penugasan diperbarui.' });
    }
    if (status === 'IN_PROGRESS' && !existing.assigned_mitra_name) {
      return res.status(409).json({ status: 'fail', message: 'Pesanan belum memiliki mitra yang ditugaskan.' });
    }
    if (status === 'MITRA_ASSIGNED' && existing.payment_method === 'QRIS_DIGITAL' && existing.payment_status !== 'PAID') {
      return res.status(409).json({ status: 'fail', message: 'Mitra belum dapat ditugaskan sebelum pembayaran QRIS diterima.' });
    }
    if (status && status !== existing.status && !(allowedTransitions[existing.status] || []).includes(status)) {
      return res.status(409).json({
        status: 'fail',
        message: `Transisi status ${existing.status} ke ${status} tidak diizinkan.`,
      });
    }

    const updatePayload = {};
    if (status) updatePayload.status = status;
    if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes;
    if (proof_image_url !== undefined) updatePayload.proof_image_url = proof_image_url;
    if (assigned_mitra_name) updatePayload.assigned_mitra_name = assigned_mitra_name;
    if (assigned_mitra_phone) updatePayload.assigned_mitra_phone = assigned_mitra_phone;

    // Saat pesanan COD selesai dikerjakan, kurir telah menagih uang tunai di tempat -> ubah payment_status jadi PAID
    if (status === 'COMPLETED' && existing.payment_method === 'COD') {
      updatePayload.payment_status = 'PAID';
    }
    if (req.body.payment_status !== undefined) {
      updatePayload.payment_status = req.body.payment_status;
    }

    const updated = await updateOrder(id, updatePayload);

    res.status(200).json({
      status: 'success',
      message: `Status pesanan berhasil diubah menjadi ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const csvCell = (value) => {
  const safe = String(value ?? '').replace(/[\r\n]/g, ' ').replace(/\"/g, '\"\"');
  const formulaSafe = /^[=+@\-\t]/.test(safe) ? `'${safe}` : safe;
  return `\"${formulaSafe}\"`;
};

export const exportOrdersCsv = async (req, res, next) => {
  try {
    const orders = await listAllOrders({ limit: 10000 });

    const headers = [
      'ID',
      'NanoID',
      'Waktu',
      'Layanan',
      'Pelanggan',
      'WhatsApp',
      'Alamat Tujuan',
      'Jarak (km)',
      'Metode Bayar',
      'Status Bayar',
      'Harga Awal',
      'Harga Final',
      'Alasan Override',
      'Mitra',
      'Status',
    ];

    const rows = orders.map((o) => [
      csvCell(o.id), csvCell(o.nano_id), csvCell(new Date(o.created_at).toLocaleString('id-ID')),
      csvCell(o.service_type), csvCell(o.customer_name), csvCell(o.customer_phone),
      csvCell(o.dropoff_address), csvCell(o.distance_km || 0), csvCell(o.payment_method),
      csvCell(o.payment_status), csvCell(o.initial_estimated_price || 0),
      csvCell(o.final_price || 0), csvCell(o.price_override_reason),
      csvCell(o.assigned_mitra_name), csvCell(o.status),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="disuruhsuruh-orders-${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const createManualOrder = async (req, res, next) => {
  try {
    const {
      service_type,
      customer_name,
      customer_phone,
      pickup_address,
      dropoff_address,
      distance_km = 0,
      payment_method = 'COD',
      dynamic_payload = {},
      initial_status = 'CONFIRMED',
      assigned_mitra_name,
      assigned_mitra_phone,
      custom_final_price,
    } = req.body;

    if (!service_type || !customer_name || !customer_phone || !dropoff_address) {
      return res.status(400).json({
        status: 'fail',
        message: 'Layanan, nama pelanggan, nomor WhatsApp, dan alamat tujuan wajib diisi',
      });
    }

    const cleanPhone = String(customer_phone).trim();
    if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(cleanPhone)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Nomor WhatsApp tidak valid (harus berawalan 08 atau +628)',
      });
    }

    const dist = Math.min(25, Math.max(0, Number(distance_km) || 0));

    // Kalkulasi tarif via pricing engine
    const calculation = calculatePricing({
      service_type,
      distance_km: dist,
      dynamic_payload: {
        ...dynamic_payload,
        custom_price: custom_final_price || dynamic_payload.custom_price || 0,
      },
    });

    const finalPrice = custom_final_price !== undefined && custom_final_price !== null && custom_final_price !== ''
      ? Math.max(0, Number(custom_final_price))
      : calculation.total_estimated_price;

    const nanoId = `ds_${generateNanoId()}`;
    const aiPrediction = await predictOrderWithFallback({
      service_type,
      distance_km: dist,
      dynamic_payload,
    });

    const newOrder = await insertOrder({
      nano_id: nanoId,
      service_type,
      customer_name: customer_name.trim(),
      customer_phone: cleanPhone,
      pickup_address: pickup_address?.trim() || null,
      dropoff_address: dropoff_address.trim(),
      distance_km: dist,
      dynamic_payload,
      initial_estimated_price: finalPrice,
      final_price: finalPrice,
      predicted_duration_minutes: aiPrediction.predicted_duration_minutes,
      payment_method: payment_method === 'QRIS_DIGITAL' ? 'QRIS_DIGITAL' : 'COD',
      payment_status: 'UNPAID',
      status: ['CONFIRMED', 'PENDING_REVIEW', 'MITRA_ASSIGNED'].includes(initial_status)
        ? initial_status
        : 'CONFIRMED',
      assigned_mitra_name: assigned_mitra_name || null,
      assigned_mitra_phone: assigned_mitra_phone || null,
    });

    const serviceLabels = {
      antar_barang: 'Kurir / Antar Barang',
      titip_beli: 'Titip Beli / Jastip Pasar',
      bersih_rumah: 'Jasa Bersih-bersih',
      layanan_lainnya: 'Layanan Khusus / Lainnya',
    };
    const sLabel = serviceLabels[service_type] || service_type;
    const trackingUrl = `/track/${newOrder.nano_id}`;

    const waTemplate = `Halo Kak ${newOrder.customer_name}, pesanan disuruhsuruh Anda sudah dicatat oleh admin! 🛵\n\n` +
      `📋 Layanan: ${sLabel}\n` +
      `📍 Alamat Tujuan: ${newOrder.dropoff_address}\n` +
      `💵 Tarif: Rp${Number(newOrder.final_price).toLocaleString('id-ID')} (${newOrder.payment_method === 'QRIS_DIGITAL' ? 'QRIS' : 'COD'})\n\n` +
      `Lacak status kurir Anda langsung tanpa login di link ini:\n` +
      `👉 https://disuruhsuruh.id/track/${newOrder.nano_id}\n\n` +
      `Terima kasih sudah mempercayakan pesanan pada disuruhsuruh Samarinda!`;

    res.status(201).json({
      status: 'success',
      message: 'Pesanan manual berhasil dibuat dan disimpan',
      data: {
        ...newOrder,
        tracking_url: trackingUrl,
        breakdown: calculation.breakdown,
        wa_template: waTemplate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  adminLogin,
  getOrders,
  getOrderStats,
  approveOrder,
  updateStatus,
  exportOrdersCsv,
  createManualOrder,
};
