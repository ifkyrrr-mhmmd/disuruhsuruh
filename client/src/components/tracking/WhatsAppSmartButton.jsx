import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppSmartButton({ nanoId, smartLink }) {
  const defaultLink = `https://wa.me/6285332455999?text=${encodeURIComponent(
    `Halo Admin disuruhsuruh, saya ingin mengonfirmasi pesanan saya dengan nomor resi [${nanoId}].`
  )}`;

  return (
    <a
      href={smartLink || defaultLink}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full inline-flex items-center justify-center gap-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow transition active:scale-[0.98]"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span>Hubungi Admin via WhatsApp (+62 853-3245-5999)</span>
    </a>
  );
}
