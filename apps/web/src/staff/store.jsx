import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { TODAY, nowHM } from '../shared/format.js';
import { useSessionState } from '../shared/ui.jsx';

export const ROLE_DEF = {
  gvcn: { label: 'Giáo viên chủ nhiệm', name: 'Lê Thu Hà', campus: 'phutho1', cls: 'a1', tfa: false },
  gvnk: { label: 'GV năng khiếu / Bảo mẫu', name: 'Phạm Thị Nga', campus: 'phutho1', cls: 'a1', tfa: false },
  yte: { label: 'Y tế', name: 'Đỗ Thu Trang', campus: 'phutho1', tfa: false },
  bep: { label: 'Nhà bếp', name: 'Vũ Văn Bếp', campus: 'phutho1', tfa: false },
  ketoan: { label: 'Kế toán / Thu phí', name: 'Ngô Thị Lan', campus: 'phutho1', tfa: true },
  vanphong: { label: 'Văn phòng / Giáo vụ', name: 'Hoàng Thị Mai', campus: 'phutho1', tfa: false },
  bgh: { label: 'BGH cơ sở', name: 'Nguyễn Thị Hiền', campus: 'phutho1', tfa: true },
  lanhdao: { label: 'Lãnh đạo hệ thống', name: 'Nguyễn Thị Lan', campus: '', tfa: true },
  admin: { label: 'Quản trị hệ thống', name: 'Nguyễn Văn Quản', campus: '', tfa: true },
};

export const CLASSES = {
  a1: { name: 'MG Bé A1', campus: 'phutho1', teacher: 'Lê Thu Hà' }, c1: { name: 'MG Nhỡ C1', campus: 'phutho1', teacher: 'Trần Thị Cúc' },
  d1: { name: 'MG Lớn D1', campus: 'quynhon', teacher: 'Lê Văn Biển' }, b2: { name: 'Nhà trẻ B2', campus: 'nhatrang', teacher: 'Trần Mai' }, e1: { name: 'MG Bé E1', campus: 'phutho2', teacher: 'Đinh Thị Hoa' },
};

/** m = quản lý, v = chỉ xem. */
export const ACCESS = {
  home: { all: 'm' },
  class: { gvcn: 'm', gvnk: 'm', bgh: 'v' },
  pickup: { gvcn: 'm', gvnk: 'm', vanphong: 'v', bgh: 'm' },
  students: { gvcn: 'v', gvnk: 'v', yte: 'v', ketoan: 'v', vanphong: 'm', bgh: 'v', admin: 'v' },
  health: { yte: 'm', gvcn: 'v', bgh: 'v' },
  menu: { bep: 'm', yte: 'v', gvcn: 'v', gvnk: 'v', bgh: 'v' },
  comms: { gvcn: 'm', vanphong: 'm', bgh: 'm' },
  fees: { ketoan: 'm', vanphong: 'v', bgh: 'v', lanhdao: 'v' },
  crm: { vanphong: 'm', bgh: 'm', ketoan: 'v' },
  reports: { ketoan: 'm', vanphong: 'm', bgh: 'm', lanhdao: 'v' },
  lessons: { gvcn: 'm', gvnk: 'm', bgh: 'm', vanphong: 'v', lanhdao: 'v' },
  hr: { gvcn: 'm', gvnk: 'm', yte: 'm', bep: 'm', ketoan: 'm', vanphong: 'v', bgh: 'm', lanhdao: 'v' },
  admin: { admin: 'm', bgh: 'v' },
  profile: { all: 'm' },
};

export const LEAD_FLOW = ['Mới', 'Đã liên hệ', 'Đã hẹn tham quan', 'Đã tham quan', 'Đã nộp hồ sơ', 'Nhập học'];
export const LEAD_ALL = [...LEAD_FLOW, 'Không liên lạc được', 'Từ chối'];
export const LEAD_TONE = { Mới: 'bg-blue-100 text-brand-blue', 'Đã liên hệ': 'bg-yellow-100 text-brand-gold', 'Đã hẹn tham quan': 'bg-yellow-100 text-brand-gold', 'Đã tham quan': 'bg-green-100 text-brand-green', 'Đã nộp hồ sơ': 'bg-green-100 text-brand-green', 'Nhập học': 'bg-brand-green text-white', 'Không liên lạc được': 'bg-gray-200 text-gray-600', 'Từ chối': 'bg-red-100 text-red-700' };
export const FEE_TONE = { 'Chưa đóng': 'bg-yellow-100 text-brand-gold', 'Quá hạn': 'bg-red-100 text-red-700', 'Đã đóng': 'bg-green-100 text-brand-green', 'Đã hủy': 'bg-gray-200 text-gray-600' };
export const PLAN_STATUS = { draft: ['Nháp', 'bg-gray-200 text-gray-600'], sent: ['Đã nộp', 'bg-blue-100 text-brand-blue'], ok: ['Đã duyệt', 'bg-green-100 text-brand-green'], fix: ['Cần sửa', 'bg-red-100 text-red-700'] };

const initial = {
  students: [
    { id: 'bin', name: 'Bé Bin', cls: 'a1', campus: 'phutho1', dob: '20/05/2023', parent: 'Nguyễn Thị Hoa', phone: '0905123456', allergy: 'Tôm, cua', consent: true, account: true },
    { id: 'kem', name: 'Bé Kem', cls: 'a1', campus: 'phutho1', dob: '02/02/2023', parent: 'Phạm Quốc Huy', phone: '0933222111', allergy: '', consent: true, account: true },
    { id: 'bo', name: 'Bé Bơ', cls: 'a1', campus: 'phutho1', dob: '14/08/2022', parent: 'Vũ Minh Tuấn', phone: '0977111222', allergy: 'Sữa bò', consent: false, account: true },
    { id: 'soc', name: 'Bé Sóc', cls: 'a1', campus: 'phutho1', dob: '30/11/2023', parent: 'Ngô Thị Lệ', phone: '0955666777', allergy: '', consent: true, account: false },
    { id: 'mit', name: 'Bé Mít', cls: 'c1', campus: 'phutho1', dob: '09/03/2022', parent: 'Đỗ Thu Hà', phone: '0966777888', allergy: '', consent: true, account: true },
    { id: 'su', name: 'Bé Su', cls: 'b2', campus: 'nhatrang', dob: '10/08/2024', parent: 'Nguyễn Thị Hoa', phone: '0905123456', allergy: '', consent: true, account: true },
    { id: 'gao', name: 'Bé Gạo', cls: 'd1', campus: 'quynhon', dob: '21/01/2021', parent: 'Bùi Văn Đức', phone: '0922333444', allergy: 'Đậu phộng', consent: true, account: true },
    { id: 'xiu', name: 'Bé Xíu', cls: 'e1', campus: 'phutho2', dob: '12/12/2022', parent: 'Hoàng Lan Anh', phone: '0944555666', allergy: '', consent: true, account: true },
  ],
  att: { bin: 'ok', kem: 'ok', bo: '', soc: '' },
  diary: {},
  leaves: [{ id: 1, kid: 'bin', from: '2026-10-09', to: '2026-10-09', reason: 'Bé sốt nhẹ, đi khám', status: 'Chờ xác nhận' }, { id: 2, kid: 'soc', from: '2026-10-08', to: '2026-10-10', reason: 'Về quê', status: 'Chờ xác nhận' }],
  meds: [
    { id: 1, kid: 'bin', drug: 'Paracetamol 120mg', dose: '1 gói', time: '11:30', status: 'Đã gửi', by: '' },
    { id: 2, kid: 'bo', drug: 'Siro ho Prospan', dose: '5ml', time: '11:30', status: 'Cô đã nhận', by: '' },
    { id: 3, kid: 'kem', drug: 'Men tiêu hóa', dose: '1 gói', time: '07:30', status: 'Đã cho uống', by: 'Lê Thu Hà lúc 07:35' },
  ],
  growth: { bin: [['T9', 13.7, 96.8], ['T10', 13.9, 97.4]], kem: [['T10', 14.5, 99]] },
  pickLog: [{ t: '16:12', kid: 'kem', who: 'Phạm Quốc Huy (Bố)', by: 'Lê Thu Hà', ok: true }, { t: '07:42', kid: 'bin', who: 'Nguyễn Thị Hoa (Mẹ)', by: 'Lê Thu Hà', ok: true }],
  notices: [
    { id: 1, scope: 'Cơ sở', target: 'phutho1', title: 'Lịch họp phụ huynh đầu năm', date: '2026-10-05', read: 118, total: 142, by: 'Hoàng Thị Mai' },
    { id: 2, scope: 'Lớp', target: 'a1', title: 'Nhắc mang đồ dùng cho buổi học trải nghiệm', date: '2026-10-06', read: 22, total: 28, by: 'Lê Thu Hà' },
    { id: 3, scope: 'Toàn trường', target: '', title: 'Thông báo nghỉ lễ', date: '2026-10-01', read: 480, total: 520, by: 'Nguyễn Văn Quản' },
  ],
  threads: [
    { id: 1, kid: 'bin', parent: 'Nguyễn Thị Hoa', cls: 'a1', unread: 1, msgs: [{ f: 'p', x: 'Hôm nay bé có ho không cô?', t: '16:25' }, { f: 't', x: 'Bé ho nhẹ buổi sáng, cô đã cho uống nước ấm.', t: '16:31' }, { f: 'p', x: 'Cảm ơn cô, mai con xin gửi thuốc ho nhé.', t: '16:40' }] },
    { id: 2, kid: 'kem', parent: 'Phạm Quốc Huy', cls: 'a1', unread: 0, msgs: [{ f: 'p', x: 'Mai bố đón bé sớm lúc 15h được không cô?', t: 'Hôm qua' }, { f: 't', x: 'Dạ được ạ, bố quét mã QR như bình thường.', t: 'Hôm qua' }] },
    { id: 3, kid: 'mit', parent: 'Đỗ Thu Hà', cls: 'c1', unread: 2, msgs: [{ f: 'p', x: 'Cô ơi bé có ăn hết cơm không ạ?', t: '11:50' }] },
  ],
  fees: [
    { id: 1, kid: 'bin', title: 'Học phí tháng 10/2026', type: 'Học phí', amount: 3000000, due: '2026-10-10', status: 'Chưa đóng' },
    { id: 2, kid: 'bin', title: 'Ngoại khóa Tiếng Anh quý 4', type: 'Ngoại khóa', amount: 600000, due: '2026-10-05', status: 'Quá hạn' },
    { id: 3, kid: 'kem', title: 'Học phí tháng 10/2026', type: 'Học phí', amount: 3000000, due: '2026-10-10', status: 'Đã đóng', receipt: 'BL-2026-1001', paidDate: '2026-10-03', method: 'Chuyển khoản' },
    { id: 4, kid: 'bo', title: 'Học phí tháng 10/2026', type: 'Học phí', amount: 3000000, due: '2026-10-10', status: 'Chưa đóng' },
    { id: 5, kid: 'soc', title: 'Tiền ăn tháng 10/2026', type: 'Tiền ăn', amount: 770000, due: '2026-10-10', status: 'Đã đóng', receipt: 'BL-2026-1002', paidDate: '2026-10-04', method: 'Tiền mặt' },
    { id: 6, kid: 'mit', title: 'Học phí tháng 10/2026', type: 'Học phí', amount: 3000000, due: '2026-10-10', status: 'Quá hạn' },
  ],
  leads: [
    { id: 1, parent: 'Nguyễn Thị Thu', phone: '0905111222', campus: 'phutho1', child: 'Bé Mun - 3 tuổi', source: 'Website', status: 'Mới', owner: '', note: '', date: '2026-10-07' },
    { id: 2, parent: 'Trần Văn Hải', phone: '0912333444', campus: 'phutho1', child: 'Bé Sen - 4 tuổi', source: 'Facebook', status: 'Đã hẹn tham quan', owner: 'Hoàng Thị Mai', note: 'Hẹn thứ 7 lúc 9h.', date: '2026-10-04' },
    { id: 3, parent: 'Lê Minh Châu', phone: '0988777666', campus: 'phutho1', child: 'Bé Tôm - 2 tuổi', source: 'Hotline', status: 'Đã tham quan', owner: 'Hoàng Thị Mai', note: '', date: '2026-10-01' },
    { id: 4, parent: 'Phạm Anh Khoa', phone: '0933444555', campus: 'nhatrang', child: 'Bé Bắp - 5 tuổi', source: 'Website', status: 'Đã nộp hồ sơ', owner: 'Đinh Thị Hoa', note: '', date: '2026-09-29' },
    { id: 5, parent: 'Bùi Thu Hương', phone: '0944555111', campus: 'quynhon', child: 'Bé Na - 3 tuổi', source: 'Giới thiệu', status: 'Không liên lạc được', owner: '', note: 'Gọi 3 lần.', date: '2026-09-27' },
    { id: 6, parent: 'Vũ Văn Long', phone: '0977888999', campus: 'phutho1', child: 'Bé Gấu - 4 tuổi', source: 'Website', status: 'Nhập học', owner: 'Hoàng Thị Mai', note: '', date: '2026-09-20' },
  ],
  plans: [
    { id: 1, teacher: 'Lê Thu Hà', cls: 'a1', period: 'Tuần 40 (28/09 - 02/10)', file: 'giao-an-tuan-40.docx', status: 'ok', note: 'Tốt, bổ sung hoạt động ngoài trời.' },
    { id: 2, teacher: 'Lê Thu Hà', cls: 'a1', period: 'Tuần 41 (05/10 - 09/10)', file: 'giao-an-tuan-41.pdf', status: 'sent', note: '' },
    { id: 3, teacher: 'Trần Thị Cúc', cls: 'c1', period: 'Tuần 41 (05/10 - 09/10)', file: 'giao-an-c1-t41.docx', status: 'sent', note: '' },
  ],
  checkins: [{ id: 1, name: 'Lê Thu Hà', in: '07:21', out: '' }, { id: 2, name: 'Phạm Thị Nga', in: '07:05', out: '' }, { id: 3, name: 'Trần Thị Cúc', in: '07:34', out: '' }],
  ots: [{ id: 1, name: 'Phạm Thị Nga', date: '2026-10-06', hours: 2, reason: 'Trực đón muộn', status: 'Chờ duyệt' }, { id: 2, name: 'Trần Thị Cúc', date: '2026-10-03', hours: 1.5, reason: 'Chuẩn bị sự kiện', status: 'Đã duyệt' }],
  accounts: [
    { id: 1, name: 'Nguyễn Văn Quản', email: 'quan@anhduong.edu.vn', role: 'admin', campus: '', locked: false },
    { id: 2, name: 'Nguyễn Thị Hiền', email: 'hien.viettri@anhduong.edu.vn', role: 'bgh', campus: 'phutho1', locked: false },
    { id: 3, name: 'Lê Thu Hà', email: 'ha.viettri@anhduong.edu.vn', role: 'gvcn', campus: 'phutho1', locked: false },
    { id: 4, name: 'Ngô Thị Lan', email: 'lan.viettri@anhduong.edu.vn', role: 'ketoan', campus: 'phutho1', locked: false },
    { id: 5, name: 'Đỗ Thu Trang', email: 'trang.viettri@anhduong.edu.vn', role: 'yte', campus: 'phutho1', locked: true },
  ],
  audit: [{ t: '2026-10-07 07:21', user: 'Lê Thu Hà', action: 'Đăng nhập' }, { t: '2026-10-06 16:12', user: 'Lê Thu Hà', action: 'Quét QR đón: Bé Kem' }, { t: '2026-10-06 09:40', user: 'Ngô Thị Lan', action: 'Xuất báo cáo thu tháng 9 (42 dòng)' }, { t: '2026-10-05 14:02', user: 'Nguyễn Thị Hiền', action: 'Xem cuộc trò chuyện Bé Bin' }],
  sheetLocked: false,
};

export const STAFF = [
  { id: 1, name: 'Lê Thu Hà', role: 'GVCN', cls: 'a1', shift: 'Sáng' }, { id: 2, name: 'Phạm Thị Nga', role: 'Bảo mẫu', cls: 'a1', shift: 'Cả ngày' },
  { id: 3, name: 'Trần Thị Cúc', role: 'GVCN', cls: 'c1', shift: 'Sáng' }, { id: 4, name: 'Đỗ Thu Trang', role: 'Y tế', cls: '', shift: 'Cả ngày' }, { id: 5, name: 'Vũ Văn Bếp', role: 'Nhà bếp', cls: '', shift: 'Sáng' },
];

const StaffContext = createContext(null);
export const useStaff = () => useContext(StaffContext);

export function StaffProvider({ children }) {
  const [session, setSession] = useSessionState('staff-session', false);
  const [role, setRole] = useSessionState('staff-role', 'gvcn');
  const [db, setDb] = useState(initial);
  const R = ROLE_DEF[role];

  const update = useCallback((key, fn) => setDb((d) => ({ ...d, [key]: typeof fn === 'function' ? fn(d[key]) : fn })), []);
  const audit = useCallback((action) => update('audit', (a) => [{ t: `${TODAY} ${nowHM()}`, user: ROLE_DEF[role].name, action }, ...a]), [update, role]);
  const lvl = useCallback((page) => (ACCESS[page] || {}).all || (ACCESS[page] || {})[role] || '', [role]);
  const sysWide = R.campus === '';
  const inScope = useCallback((campus) => sysWide || campus === R.campus, [sysWide, R.campus]);
  const classScoped = role === 'gvcn' || role === 'gvnk';
  const myStudents = useMemo(() => db.students.filter((s) => inScope(s.campus) && (!classScoped || s.cls === R.cls)), [db.students, inScope, classScoped, R.cls]);

  const value = useMemo(() => ({
    session, role, setRole, R, db, update, audit, lvl, sysWide, inScope, myStudents,
    kidName: (id) => (db.students.find((s) => s.id === id) || { name: id }).name,
    login: (r) => { setRole(r); setSession(true); },
    logout: () => { audit('Đăng xuất'); setSession(false); },
  }), [session, role, setRole, R, db, update, audit, lvl, sysWide, inScope, myStudents, setSession]);

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}
