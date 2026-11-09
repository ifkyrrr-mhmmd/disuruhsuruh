import { findByNanoId } from '../models/order.model.js';
import {
  createRefundRequest,
  listAllRefunds,
  completeRefundRequest,
  findRefundById,
} from '../models/refund.model.js';

export const requestRefund = async (req, res, next) => {
  try {
    const { nanoId } = req.params;
    const {
      bank_name,
      account_number,
      account_holder_name,
      reason = 'Barang kosong di toko',
    } = req.body;

    if (!String(bank_name || '').trim() || !String(account_number || '').trim() || !String(account_holder_name || '').trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Nama bank, nomor rekening, dan nama pemilik rekening wajib diisi',
      });
    }

    const order = await findByNanoId(nanoId);
    if (!order) {
      return res.status(404).json({ status: 'fail', message: `Order ${nanoId} tidak ditemukan` });
    }

    if (order.service_type !== 'titip_beli') {
      return res.status(409).json({ status: 'fail', message: 'Pengajuan refund otomatis hanya tersedia untuk layanan Titip Beli.' });
    }
    if (order.payment_status !== 'PAID' || !['CONFIRMED', 'PAYMENT_CONFIRMED', 'MITRA_ASSIGNED', 'IN_PROGRESS'].includes(order.status)) {
      return res.status(409).json({ status: 'fail', message: 'Pesanan belum memenuhi syarat pengajuan refund.' });
    }
    if (!/^\d{6,30}$/.test(String(account_number)) || String(bank_name).trim().length > 50 || String(account_holder_name).trim().length > 100) {
      return res.status(400).json({ status: 'fail', message: 'Format data rekening tidak valid.' });
    }
    // Insert refund dan ubah status order dilakukan dalam satu transaksi database.
    const refundRecord = await createRefundRequest({
      order_id: order.id,
      bank_name,
      account_number,
      account_holder_name,
      refund_amount: order.final_price,
      reason: String(reason).trim().slice(0, 500),
    });


    res.status(201).json({
      status: 'success',
      message: 'Pengajuan refund berhasil dikirim dan menunggu verifikasi admin.',
      data: { id: refundRecord.id, refund_amount: refundRecord.refund_amount, is_completed: refundRecord.is_completed },
    });
  } catch (error) {
    next(error);
  }
};

export const getRefunds = async (req, res, next) => {
  try {
    const refunds = await listAllRefunds();
    res.status(200).json({
      status: 'success',
      data: refunds,
    });
  } catch (error) {
    next(error);
  }
};

export const completeRefund = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transfer_receipt_url } = req.body;
    if (transfer_receipt_url) {
      try {
        const receiptUrl = new URL(transfer_receipt_url);
        if (receiptUrl.protocol !== 'https:') throw new Error('URL bukti transfer harus menggunakan HTTPS.');
      } catch {
        return res.status(400).json({ status: 'fail', message: 'URL bukti transfer tidak valid. Gunakan tautan HTTPS.' });
      }
    }
    const adminUser = req.admin?.username || 'Admin';

    const existing = await findRefundById(id);
    if (!existing) {
      return res.status(404).json({
        status: 'fail',
        message: `Data refund ${id} tidak ditemukan`,
      });
    }

    if (existing.is_completed) {
      return res.status(409).json({ status: 'fail', message: 'Refund ini sudah ditandai selesai.' });
    }
    const updatedRefund = await completeRefundRequest(id, adminUser, transfer_receipt_url);
    if (!updatedRefund) {
      return res.status(409).json({ status: 'fail', message: 'Refund sudah diproses oleh admin lain.' });
    }


    res.status(200).json({
      status: 'success',
      message: 'Refund telah berhasil ditandai selesai ditransfer',
      data: updatedRefund,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  requestRefund,
  getRefunds,
  completeRefund,
};
