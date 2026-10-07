import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';

/* ===== Toast ===== */
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const show = useCallback((message, kind) => {
    setToast({ message, kind });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div role="status" className={`fixed bottom-24 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 rounded-full px-5 py-3 text-center text-xs font-medium text-white shadow-xl md:bottom-8 ${toast.kind === 'error' ? 'bg-red-600' : 'bg-brand-deep'}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/* ===== Nút, nhãn, thẻ ===== */
const BTN = {
  primary: 'bg-brand-primary text-white hover:bg-brand-deep',
  ghost: 'border border-brand-tint3 text-brand-primary hover:bg-brand-tint bg-white',
  danger: 'border border-red-200 text-red-600 hover:bg-red-50 bg-white',
  green: 'bg-brand-green text-white hover:opacity-90',
  light: 'bg-brand-yellow text-brand-deep hover:opacity-90',
};

export function Btn({ children, kind = 'ghost', icon, className = '', ...rest }) {
  return (
    <button type="button" {...rest} className={`tap inline-flex items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold transition disabled:opacity-50 ${BTN[kind]} ${className}`}>
      {icon && <i className={`fa-solid ${icon}`} />}
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'bg-gray-200 text-gray-600' }) {
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${tone}`}>{children}</span>;
}

export function Card({ title, actions, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 md:px-5">
          <h2 className="text-sm font-bold text-brand-primary">{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
}

export function Note({ kind = 'info', children }) {
  const style = { info: 'border-blue-200 bg-blue-50 text-blue-800', lock: 'border-yellow-200 bg-yellow-50 text-yellow-800' }[kind];
  const icon = kind === 'lock' ? 'fa-lock' : 'fa-circle-info';
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 text-xs ${style}`}>
      <i className={`fa-solid ${icon} mt-0.5`} />
      <p>{children}</p>
    </div>
  );
}

export function Empty({ icon = 'fa-folder-open', children }) {
  return (
    <div className="py-8 text-center text-gray-400">
      <i className={`fa-regular ${icon} mb-2 text-3xl`} />
      <p className="text-sm">{children}</p>
    </div>
  );
}

/* ===== Form ===== */
function FieldShell({ label, error, hint, className = '', id, children }) {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1 block text-xs font-semibold text-gray-700">{label}</label>}
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Input({ label, error, hint, className, ...rest }) {
  const id = useId();
  return (
    <FieldShell {...{ label, error, hint, className, id }}>
      <input id={id} aria-invalid={Boolean(error)} {...rest} className="fld" />
    </FieldShell>
  );
}

export function Textarea({ label, error, hint, className, rows = 3, ...rest }) {
  const id = useId();
  return (
    <FieldShell {...{ label, error, hint, className, id }}>
      <textarea id={id} rows={rows} aria-invalid={Boolean(error)} {...rest} className="fld" />
    </FieldShell>
  );
}

/** options: [[value, label], ...] */
export function Select({ label, error, hint, className, options, ...rest }) {
  const id = useId();
  return (
    <FieldShell {...{ label, error, hint, className, id }}>
      <select id={id} aria-invalid={Boolean(error)} {...rest} className="fld">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </FieldShell>
  );
}

export function Bilingual({ label, name, values, onChange, textarea, disabled }) {
  const Control = textarea ? Textarea : Input;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Control label={`${label} (Tiếng Việt)`} value={values[`${name}_vi`] ?? ''} onChange={(e) => onChange(`${name}_vi`, e.target.value)} disabled={disabled} />
      <Control label={`${label} (English)`} value={values[`${name}_en`] ?? ''} onChange={(e) => onChange(`${name}_en`, e.target.value)} disabled={disabled} />
    </div>
  );
}

/* ===== Bảng, tab, modal ===== */
export function Table({ heads, rows, empty = 'Chưa có dữ liệu.', minWidth = 520 }) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-xs" style={{ minWidth }}>
        <thead className="bg-brand-tint text-left text-brand-primary">
          <tr>{heads.map((h) => <th key={h} scope="col" className="whitespace-nowrap p-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-brand-cream/60">
              {r.map((c, j) => <td key={j} className="p-3 align-top">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** tabs: [[key, label], ...] */
export function Tabs({ tabs, value, onChange }) {
  return (
    <div role="tablist" className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {tabs.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={k === value} onClick={() => onChange(k)} className={`tab-btn ${k === value ? 'active' : ''}`}>{l}</button>
      ))}
    </div>
  );
}

export function Modal({ title, onClose, children, size = 'max-w-2xl' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`max-h-[92vh] w-full ${size} overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-brand-tint" aria-label="Đóng"><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="space-y-4 p-5">{children}</div>
      </div>
    </div>
  );
}

export function Confirm({ message, onYes, onClose }) {
  return (
    <Modal title="Xác nhận" onClose={onClose} size="max-w-md">
      <p className="text-sm text-gray-700">{message}</p>
      <div className="flex justify-end gap-2">
        <Btn onClick={onClose}>Hủy</Btn>
        <Btn kind="primary" onClick={() => { onClose(); onYes(); }}>Đồng ý</Btn>
      </div>
    </Modal>
  );
}

export function BackLink({ onClick, children }) {
  return (
    <button onClick={onClick} className="tap inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">
      <i className="fa-solid fa-arrow-left" />{children}
    </button>
  );
}

export function NotFound({ onHome }) {
  return (
    <div className="space-y-3 py-16 text-center">
      <p className="text-6xl font-bold text-brand-primary">404</p>
      <h2 className="text-xl font-bold">Không tìm thấy trang</h2>
      <Btn kind="primary" onClick={onHome}>Về trang chủ</Btn>
    </div>
  );
}

/** Lưu state đơn giản trong sessionStorage (không lỗi khi bị chặn). */
export function useSessionState(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = sessionStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  const set = useCallback((v) => {
    setValue(v);
    try { sessionStorage.setItem(key, JSON.stringify(v)); } catch { /* bỏ qua khi bị chặn */ }
  }, [key]);
  return [value, set];
}
