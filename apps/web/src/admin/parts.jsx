import { Btn, Note, useToast } from '../shared/ui.jsx';
import { useAdmin } from './store.jsx';

export const SharedNote = ({ show }) => (show ? <Note kind="lock">Nội dung dùng chung toàn hệ thống: chỉ Quản trị hệ thống được sửa. Bạn chỉ có quyền xem.</Note> : null);

/** Nút lưu giả lập: ghi nhật ký và báo đã lưu. */
export function SaveBar({ what, hidden }) {
  const { audit } = useAdmin();
  const toast = useToast();
  if (hidden) return null;
  return (
    <div className="flex justify-end">
      <Btn kind="primary" icon="fa-floppy-disk" onClick={() => { audit(`Lưu ${what}`); toast(`Đã lưu ${what} (demo, chưa ghi vào máy chủ)`); }}>Lưu thay đổi</Btn>
    </div>
  );
}

export const Grid2 = ({ children }) => <div className="grid gap-4 md:grid-cols-2">{children}</div>;
export const PhotoBox = ({ children, className = 'aspect-[4/3]' }) => (
  <div className={`flex items-center justify-center rounded-xl border-2 border-dashed border-brand-tint3 bg-brand-tint text-xs text-brand-primary ${className}`}><i className="fa-regular fa-image mr-1" />{children}</div>
);
