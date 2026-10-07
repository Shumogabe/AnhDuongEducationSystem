import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CAMPUSES } from '../shared/data.js';
import { TODAY, nowHM } from '../shared/format.js';
import { useSessionState } from '../shared/ui.jsx';

export const ROLES = {
  system: { label: 'Quản trị hệ thống', name: 'Nguyễn Văn Quản', campus: '' },
  campus: { label: `Quản trị cơ sở - ${CAMPUSES.phutho1.short}`, name: 'Trần Thị Cơ Sở', campus: 'phutho1' },
};

export const NEWS_STATUS = { draft: ['Nháp', 'bg-gray-200 text-gray-600'], pending: ['Chờ duyệt', 'bg-yellow-100 text-brand-gold'], published: ['Đã xuất bản', 'bg-green-100 text-brand-green'] };
export const NEWS_CATS = ['Tin hệ thống', 'Hoạt động', 'Góc chuyên gia', 'Sự kiện'];
export const LEAD_STATE = { 'Đã chuyển': 'bg-green-100 text-brand-green', 'Chờ chuyển': 'bg-yellow-100 text-brand-gold', Lỗi: 'bg-red-100 text-red-700' };
export const JOB_STATUS = { open: ['Đang tuyển', 'bg-green-100 text-brand-green'], draft: ['Nháp', 'bg-gray-200 text-gray-600'], closed: ['Đã đóng', 'bg-gray-200 text-gray-600'] };
export const APP_STATUS = ['Mới', 'Đã xem', 'Hẹn phỏng vấn', 'Nhận việc', 'Từ chối'];

const initial = {
  news: [
    { id: 1, title: 'Rộn ràng không khí Tết Trung Thu tại các cơ sở Ánh Dương', titleEn: 'Mid-Autumn Festival at Anh Duong campuses', cat: 'Sự kiện', campus: '', status: 'published', author: 'Nguyễn Văn Quản', date: '2026-09-25', body: 'Các bé tại cả 4 cơ sở đã có mùa Trung Thu đáng nhớ...', bodyEn: '' },
    { id: 2, title: 'Chuyến dã ngoại tìm hiểu thiên nhiên của khối Mẫu Giáo Lớn', titleEn: '', cat: 'Hoạt động', campus: 'phutho1', status: 'pending', author: 'Trần Thị Cơ Sở', date: '2026-10-05', body: 'Khối Mẫu Giáo Lớn đã có buổi dã ngoại...', bodyEn: '' },
    { id: 3, title: 'Ngày hội Tiếng Anh tại Quy Nhơn Nam', titleEn: '', cat: 'Hoạt động', campus: 'quynhon', status: 'pending', author: 'Lê Văn Biển', date: '2026-10-04', body: '', bodyEn: '' },
    { id: 4, title: 'Phương pháp rèn luyện tính tự lập cho trẻ 3-4 tuổi', titleEn: '', cat: 'Góc chuyên gia', campus: '', status: 'published', author: 'Nguyễn Văn Quản', date: '2026-09-20', body: 'Ở độ tuổi 3-4, trẻ bắt đầu muốn tự làm mọi việc...', bodyEn: '' },
    { id: 5, title: 'Lễ khai giảng tại Việt Trì', titleEn: '', cat: 'Sự kiện', campus: 'phutho1', status: 'draft', author: 'Trần Thị Cơ Sở', date: '2026-10-06', body: '', bodyEn: '' },
  ],
  outbox: [
    { id: 1, parent: 'Nguyễn Thị Hoa', phone: '0905123456', campus: 'phutho1', child: 'Bé Bin - 3 tuổi', state: 'Chờ chuyển', date: '2026-10-07', tries: 2, error: 'Portal không phản hồi (hết thời gian chờ)', crmId: '' },
    { id: 2, parent: 'Trần Văn Nam', phone: '0912345678', campus: 'quynhon', child: 'Bé Su - 4 tuổi', state: 'Lỗi', date: '2026-10-06', tries: 5, error: 'Khóa API bị từ chối (401)', crmId: '' },
    { id: 3, parent: 'Ngô Thị Lệ', phone: '0955666777', campus: 'phutho1', child: 'Bé Sóc - 2 tuổi', state: 'Lỗi', date: '2026-10-06', tries: 5, error: 'Portal không phản hồi (hết thời gian chờ)', crmId: '' },
    { id: 4, parent: 'N** T** M**', phone: '', campus: 'nhatrang', child: '', state: 'Đã chuyển', date: '2026-10-05', tries: 1, error: '', crmId: 'L-1043' },
    { id: 5, parent: 'P** Q** H**', phone: '', campus: 'phutho1', child: '', state: 'Đã chuyển', date: '2026-10-04', tries: 1, error: '', crmId: 'L-1041' },
    { id: 6, parent: 'Đ** T** H**', phone: '', campus: 'phutho2', child: '', state: 'Đã chuyển', date: '2026-10-01', tries: 1, error: '', crmId: 'L-1038' },
    { id: 7, parent: 'H** L** A**', phone: '', campus: 'quynhon', child: '', state: 'Đã chuyển', date: '2026-09-28', tries: 1, error: '', crmId: 'L-1035' },
  ],
  jobs: [
    { id: 1, title: 'Giáo Viên Mầm Non', campus: 'phutho1', type: 'Toàn thời gian', deadline: '2026-10-31', status: 'open' },
    { id: 2, title: 'Nhân Viên Bếp / Bảo Mẫu', campus: 'quynhon', type: 'Toàn thời gian', deadline: '2026-10-31', status: 'open' },
    { id: 3, title: 'Giáo Viên Tiếng Anh Mầm Non', campus: 'nhatrang', type: 'Bán thời gian', deadline: '2026-11-15', status: 'draft' },
  ],
  apps: [
    { id: 1, name: 'Nguyễn Thị Thu', phone: '0905111222', email: 'thu@example.com', job: 1, campus: 'phutho1', status: 'Mới', seen: false, date: '2026-10-06' },
    { id: 2, name: 'Lê Văn Cường', phone: '0912333444', email: 'cuong@example.com', job: 2, campus: 'quynhon', status: 'Đã xem', seen: true, date: '2026-10-03' },
    { id: 3, name: 'Trần Thu Trang', phone: '0988777666', email: 'trang@example.com', job: 1, campus: 'phutho1', status: 'Hẹn phỏng vấn', seen: true, date: '2026-10-01' },
    { id: 4, name: 'Phạm Anh Khoa', phone: '0933444555', email: 'khoa@example.com', job: 3, campus: 'nhatrang', status: 'Mới', seen: false, date: '2026-10-05' },
  ],
  subs: [
    { id: 1, email: 'phuhuynh1@example.com', date: '2026-10-06', active: true },
    { id: 2, email: 'mamnon.mom@example.com', date: '2026-10-02', active: true },
    { id: 3, email: 'baba.bin@example.com', date: '2026-09-28', active: false },
    { id: 4, email: 'co.lan@example.com', date: '2026-09-20', active: true },
  ],
  msgs: [
    { id: 1, name: 'Hoàng Văn Sơn', phone: '0901234567', campus: 'quynhon', text: 'Cho tôi hỏi trường có nhận bé 18 tháng không?', date: '2026-10-06', done: false },
    { id: 2, name: 'Phạm Mai', phone: '0912000111', campus: '', text: 'Tôi muốn đề nghị hợp tác tổ chức chương trình trải nghiệm.', date: '2026-10-04', done: true },
  ],
  users: [
    { id: 1, name: 'Nguyễn Văn Quản', email: 'quan@anhduong.edu.vn', role: 'system', campus: '', locked: false },
    { id: 2, name: 'Trần Thị Cơ Sở', email: 'coso.viettri@anhduong.edu.vn', role: 'campus', campus: 'phutho1', locked: false },
    { id: 3, name: 'Lê Văn Biển', email: 'coso.quynhon@anhduong.edu.vn', role: 'campus', campus: 'quynhon', locked: false },
    { id: 4, name: 'Đỗ Thị Thủy', email: 'coso.nhatrang@anhduong.edu.vn', role: 'campus', campus: 'nhatrang', locked: true },
  ],
  audit: [
    { t: '2026-10-06 09:12', user: 'Nguyễn Văn Quản', action: 'Đăng nhập' },
    { t: '2026-10-05 16:40', user: 'Trần Thị Cơ Sở', action: 'Gửi duyệt bài "Chuyến dã ngoại..."' },
    { t: '2026-10-05 10:05', user: 'Nguyễn Văn Quản', action: 'Kiểm tra kết nối CRM: Portal không phản hồi' },
    { t: '2026-10-04 14:22', user: 'Lê Văn Biển', action: 'Chuyển lại lead #4 sang CRM (mã L-1043)' },
    { t: '2026-10-03 08:30', user: 'Nguyễn Văn Quản', action: 'Khóa tài khoản Đỗ Thị Thủy' },
  ],
  albums: [{ t: 'Đêm hội Trung Thu', campus: 'phutho1', n: 42 }, { t: 'Dã ngoại vườn cây', campus: 'phutho2', n: 36 }, { t: 'Ngày hội Tiếng Anh', campus: 'quynhon', n: 28 }, { t: 'Lễ khai giảng', campus: 'nhatrang', n: 51 }],
  media: [['trung-thu-01.jpg', 'image'], ['khai-giang.jpg', 'image'], ['thuc-don-tuan.pdf', 'file'], ['logo-bidv.png', 'image'], ['hero-1.jpg', 'image'], ['gioi-thieu.mp4', 'video']],
  crm: { online: false, url: 'https://portal.anhduong.edu.vn/api/leads', key: 'ad_live_••••••••3f9a', last: '2026-10-07 08:14' },
};

const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {
  const [session, setSession] = useSessionState('admin-session', false);
  const [role, setRole] = useSessionState('admin-role', 'system');
  const [db, setDb] = useState(initial);

  const user = ROLES[role];
  const isSystem = role === 'system';
  const myCampus = user.campus;

  const update = useCallback((key, fn) => setDb((d) => ({ ...d, [key]: fn(d[key]) })), []);
  const audit = useCallback((action) => update('audit', (a) => [{ t: `${TODAY} ${nowHM()}`, user: ROLES[role].name, action }, ...a]), [update, role]);
  const scoped = useCallback((list) => (isSystem ? list : list.filter((x) => x.campus === myCampus)), [isSystem, myCampus]);

  const value = useMemo(() => ({
    session, role, setRole, user, isSystem, myCampus, db, update, audit, scoped,
    login: () => { setSession(true); audit('Đăng nhập'); },
    logout: () => { audit('Đăng xuất'); setSession(false); },
  }), [session, role, setRole, user, isSystem, myCampus, db, update, audit, scoped, setSession]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
