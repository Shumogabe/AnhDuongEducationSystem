/** Dữ liệu mẫu (sau này lấy từ API). */
export const TODAY = '2026-10-07';

export const USERS = {
  '0905123456': { name: 'Nguyễn Thị Hoa', role: 'main', kids: ['bin', 'su'] },
  '0912345678': { name: 'Nguyễn Văn Bà', role: 'relative', kids: ['bin'] },
};

export const KIDS = {
  bin: { name: 'Bé Bin', cls: 'MG Bé A1', campus: 'CS Việt Trì (Phú Thọ)', teacher: 'Cô Lê Thu Hà', dob: '20/05/2023', coastal: false },
  su: { name: 'Bé Su', cls: 'Nhà trẻ B2', campus: 'CS Nha Trang (Khánh Hòa)', teacher: 'Cô Trần Mai', dob: '10/08/2024', coastal: true },
};

export const HOTLINE = '0965 284 866';

export const initialData = {
  pickers: {
    bin: [{ id: 1, name: 'Nguyễn Thị Hoa', rel: 'Mẹ', phone: '0905123456' }, { id: 2, name: 'Trần Văn Nam', rel: 'Bố', phone: '0988111222' }, { id: 3, name: 'Nguyễn Văn Bà', rel: 'Ông', phone: '0912345678' }],
    su: [{ id: 4, name: 'Nguyễn Thị Hoa', rel: 'Mẹ', phone: '0905123456' }],
  },
  codes: [
    { id: 1, kid: 'bin', name: 'Lê Thị Cúc', phone: '0933555777', code: 'K7M2-9QX4', status: 'Hiệu lực', date: TODAY },
    { id: 2, kid: 'bin', name: 'Phạm Văn Dũng', phone: '0944666888', code: 'B3N8-2LT6', status: 'Đã dùng', date: '2026-10-02' },
  ],
  leaves: [
    { id: 1, kid: 'bin', from: '2026-10-09', to: '2026-10-09', reason: 'Bé sốt nhẹ, đi khám', status: 'Chờ xác nhận' },
    { id: 2, kid: 'bin', from: '2026-09-18', to: '2026-09-19', reason: 'Về quê', status: 'Đã xác nhận' },
  ],
  meds: [
    { id: 1, kid: 'bin', drug: 'Paracetamol 120mg', dose: '1 gói', time: '11:30', days: 'Hôm nay', status: 'Cô đã nhận', note: '' },
    { id: 2, kid: 'bin', drug: 'Siro ho Prospan', dose: '5ml', time: '07:30, 17:30', days: '3 ngày', status: 'Đã cho uống', note: 'Cho uống lúc 07:35' },
  ],
  allergies: { bin: ['Tôm, cua (nổi mẩn)'], su: [] },
  notices: [
    { id: 1, scope: 'Lớp', title: 'Nhắc mang đồ dùng cho buổi học trải nghiệm thứ 6', body: 'Phụ huynh nhớ chuẩn bị cho bé: mũ, nước uống, một bộ quần áo dự phòng. Giờ đón bình thường.', date: '2026-10-06', read: false },
    { id: 2, scope: 'Cơ sở', title: 'Lịch họp phụ huynh đầu năm', body: 'Cơ sở tổ chức họp phụ huynh vào sáng thứ 7 tuần này. Nội dung: kế hoạch năm học và quy trình đón trả.', date: '2026-10-05', read: false },
    { id: 3, scope: 'Toàn trường', title: 'Thông báo nghỉ lễ', body: 'Toàn hệ thống nghỉ lễ theo lịch của Nhà nước. Trường sẽ đón trẻ lại bình thường vào ngày làm việc kế tiếp.', date: '2026-10-01', read: true },
    { id: 4, scope: 'Toàn trường', title: 'Đăng ký tham gia chương trình Tiếng Anh ngoại khóa', body: 'Chương trình mở đăng ký đến hết tháng 10. Phụ huynh liên hệ cô chủ nhiệm để đăng ký.', date: '2026-09-28', read: true },
  ],
  chats: {
    bin: [
      { from: 'teacher', text: 'Chào chị, hôm nay bé Bin ăn rất ngoan, ngủ trưa đủ giấc ạ.', t: '16:20' },
      { from: 'me', text: 'Cảm ơn cô ạ. Hôm nay bé có ho không cô?', t: '16:25' },
      { from: 'teacher', text: 'Bé ho nhẹ buổi sáng, cô đã cho uống nước ấm. Chiều đỡ nhiều ạ.', t: '16:31' },
    ],
    su: [],
  },
  fees: {
    bin: [
      { id: 1, title: 'Học phí tháng 10/2026', type: 'Học phí', amount: 3000000, due: '2026-10-10', status: 'Chưa đóng' },
      { id: 2, title: 'Tiền ăn tháng 10/2026', type: 'Tiền ăn', amount: 770000, due: '2026-10-10', status: 'Chưa đóng' },
      { id: 3, title: 'Ngoại khóa Tiếng Anh quý 4', type: 'Ngoại khóa', amount: 600000, due: '2026-10-05', status: 'Quá hạn' },
      { id: 4, title: 'Học phí tháng 9/2026', type: 'Học phí', amount: 3000000, due: '2026-09-10', status: 'Đã đóng', paidDate: '2026-09-08', receipt: 'BL-2026-0912' },
      { id: 5, title: 'Tiền ăn tháng 9/2026', type: 'Tiền ăn', amount: 735000, due: '2026-09-10', status: 'Đã đóng', paidDate: '2026-09-08', receipt: 'BL-2026-0913' },
    ],
    su: [
      { id: 6, title: 'Học phí tháng 10/2026', type: 'Học phí', amount: 3500000, due: '2026-10-10', status: 'Chưa đóng' },
      { id: 7, title: 'Học phí tháng 9/2026', type: 'Học phí', amount: 3500000, due: '2026-09-10', status: 'Đã đóng', paidDate: '2026-09-09', receipt: 'BL-2026-0987' },
    ],
  },
};

export const GROWTH = {
  bin: [['T5', 12.8, 94], ['T6', 13.0, 94.8], ['T7', 13.2, 95.5], ['T8', 13.5, 96], ['T9', 13.7, 96.8], ['T10', 13.9, 97.4]],
  su: [['T5', 10.1, 80], ['T6', 10.3, 80.6], ['T7', 10.5, 81.2], ['T8', 10.8, 82], ['T9', 11.0, 82.5], ['T10', 11.2, 83.1]],
};
export const VACCINES = {
  bin: [['Sởi - Quai bị - Rubella (mũi 2)', '2025-06-10', true], ['Viêm não Nhật Bản (mũi 3)', '2025-11-20', true], ['Cúm mùa', '2026-11-05', false]],
  su: [['Sởi - Quai bị - Rubella (mũi 1)', '2025-09-15', true], ['Thủy đậu', '2026-11-12', false]],
};

const MENU = [
  ['Súp gà ngô ngọt + Sữa hạt', 'Cơm mềm, Tôm rim me, Canh rau ngót', 'Phở bò + Sinh tố đu đủ'],
  ['Cháo thịt bằm', 'Cơm, Gà kho gừng, Canh bí đỏ', 'Bánh flan + Sữa chua'],
  ['Bánh mì trứng + Sữa', 'Cơm, Cá hồi áp chảo, Canh cải', 'Miến gà + Nước cam'],
  ['Bún riêu cua', 'Cơm, Bò xào bông cải, Canh mồng tơi', 'Chè đậu xanh'],
  ['Xôi đậu xanh + Sữa đậu nành', 'Cơm, Trứng hấp thịt, Canh khoai cà rốt', 'Bánh bao + Sữa'],
];
const COASTAL_BREAKFAST = ['Bánh canh chả cá', 'Bún cá', 'Cháo cá lóc rau thơm', 'Bánh xèo mini + Sữa', 'Mì Quảng gà'];
export const menuFor = (kid, dayIdx) => {
  const m = [...MENU[dayIdx]];
  if (KIDS[kid].coastal) m[0] = COASTAL_BREAKFAST[dayIdx];
  return m;
};
export const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
export const DOW = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

// ===== Hàm tiện ích =====
export const fmtDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
export const money = (n) => `${n.toLocaleString('vi-VN')}đ`;
export const dowOf = (iso) => new Date(`${iso}T00:00:00`).getDay();
export const addDays = (iso, n) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
export const isPhone = (v) => /^(0|\+84)\d{9,10}$/.test(v.replace(/[\s.-]/g, ''));
export const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00`).getTime());

const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
export { hash };

export function diaryFor(kid, iso) {
  const d = dowOf(iso);
  if (d === 0 || d === 6 || iso > TODAY) return null;
  const h = hash(kid + iso);
  const eat = ['Ăn hết suất', 'Ăn 3/4 suất', 'Ăn nửa suất', 'Ăn hết suất'];
  const mood = ['Vui vẻ, hào hứng', 'Hơi mệt, cần nghỉ ngơi', 'Rất hòa đồng', 'Vui vẻ'];
  const remark = ['Bé tích cực tham gia hoạt động nhóm và biết nhường bạn.', 'Bé tự xúc ăn gọn gàng, chủ động rửa tay.', 'Bé hát rất to trong giờ âm nhạc, được cô khen.', 'Hôm nay bé cần cô nhắc nhở thêm khi xếp hàng.'];
  const today = iso === TODAY;
  return {
    meals: [['Bữa sáng', eat[h % 4]], ['Bữa trưa', eat[(h >>> 2) % 4]], today ? ['Bữa chiều', 'Chưa đến giờ'] : ['Bữa chiều', eat[(h >>> 4) % 4]]],
    sleep: ['12:20', `14:${10 + (h % 40)}`],
    wc: `${(h % 3) + 2} lần, bình thường`,
    mood: mood[h % 4],
    remark: remark[(h >>> 1) % 4],
    photos: 3 + (h % 4),
  };
}

export function inWorkHours() {
  const d = new Date();
  const w = d.getDay();
  const h = d.getHours();
  return w >= 1 && w <= 5 && h >= 7 && h < 17;
}
