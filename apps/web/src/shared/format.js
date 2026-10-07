export const TODAY = '2026-10-07';

export const fmtDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
export const money = (n) => `${n.toLocaleString('vi-VN')}đ`;
export const isPhone = (v) => /^(0|\+84)\d{9,10}$/.test(v.replace(/[\s.-]/g, ''));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const maskPhone = (p) => (p ? `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}` : '');
export const maskName = (n) => n.split(' ').map((w) => `${w[0]}**`).join(' ');
export const nowHM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Chạy danh sách luật cho từng trường; trả về { field: message }. */
export function validate(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([name, checks]) => {
    for (const check of checks) {
      const msg = check(values[name], values);
      if (msg) { errors[name] = msg; break; }
    }
  });
  return errors;
}

export const rule = {
  required: (msg = 'Vui lòng nhập thông tin này.') => (v) => (String(v ?? '').trim() ? '' : msg),
  phone: (msg = 'Số điện thoại chưa đúng (ví dụ 0905 123 456).') => (v) => (isPhone(String(v ?? '')) ? '' : msg),
  email: (msg = 'Email chưa đúng định dạng.') => (v) => (isEmail(String(v ?? '')) ? '' : msg),
  minLen: (n, msg) => (v) => (String(v ?? '').trim().length >= n ? '' : msg || `Nhập ít nhất ${n} ký tự.`),
  file: ({ exts, maxMb }) => (f) => {
    if (!f) return 'Vui lòng chọn file.';
    const ext = f.name.split('.').pop().toLowerCase();
    if (!exts.includes(ext)) return `Chỉ nhận file ${exts.join(', ').toUpperCase()}.`;
    if (f.size > maxMb * 1024 * 1024) return `File vượt quá ${maxMb}MB.`;
    return '';
  },
};
