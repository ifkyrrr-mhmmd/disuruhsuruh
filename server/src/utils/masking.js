/**
 * Utilitas masking untuk melindungi privasi data pelanggan pada halaman pelacakan publik
 */

export const maskPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.trim();
  if (cleaned.length <= 6) return cleaned;
  const start = cleaned.slice(0, 4);
  const end = cleaned.slice(-4);
  return `${start}****${end}`;
};

export const maskName = (name) => {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    const single = parts[0];
    if (single.length <= 2) return single;
    return `${single.slice(0, 2)}***`;
  }
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || '';
  return `${first} ${lastInitial}.`;
};

export default { maskPhone, maskName };
