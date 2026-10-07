/** Dữ liệu mẫu dùng chung cho website, CMS và Portal (sau này lấy từ API). */

export const HOTLINE = '0965 284 866';
export const HOTLINE_TEL = 'tel:0965284866';
export const OFFICIAL_EMAIL = 'tuyensinh@anhduongschool.edu.vn';

/** Địa chỉ ứng dụng khác trong bộ demo (đổi khi triển khai). */
export const PARENT_APP_URL = 'http://localhost:8081';

export const CAMPUSES = {
  phutho1: { short: 'CS Việt Trì (Phú Thọ)', name: 'Mầm Non Ánh Dương - Cơ Sở 1 Việt Trì (Phú Thọ)', addr: 'Tái định cư Gia Cẩm, TP. Việt Trì, Tỉnh Phú Thọ', province: 'Phú Thọ', title: 'CS1: Việt Trì - Phú Thọ', street: 'TĐC Gia Cẩm, TP. Việt Trì', img: 'photo-1580582932707-520aed937b7b', coastal: false },
  phutho2: { short: 'CS Thị Xã (Phú Thọ)', name: 'Mầm Non Ánh Dương - Cơ Sở 2 Thị Xã (Phú Thọ)', addr: 'Đường Hùng Vương, Thị Xã Phú Thọ, Tỉnh Phú Thọ', province: 'Phú Thọ', title: 'CS2: Thị Xã Phú Thọ', street: 'Đ. Hùng Vương, TX. Phú Thọ', img: 'photo-1509062522246-3755977927d7', coastal: false },
  quynhon: { short: 'CS Quy Nhơn Nam (Gia Lai)', name: 'Mầm Non Ánh Dương - Cơ Sở Quy Nhơn Nam (Gia Lai)', addr: 'Đường Nguyễn Thái Học, TP. Quy Nhơn Nam, Tỉnh Gia Lai', province: 'Gia Lai', title: 'CS3: Quy Nhơn Nam', street: 'Đ. Nguyễn Thái Học, TP. Quy Nhơn Nam', img: 'photo-1577896851231-70ef18881754', coastal: true },
  nhatrang: { short: 'CS Nha Trang (Khánh Hòa)', name: 'Mầm Non Ánh Dương - Cơ Sở Nha Trang (Khánh Hòa)', addr: 'Đường Trần Phú, TP. Nha Trang, Tỉnh Khánh Hòa', province: 'Khánh Hòa', title: 'CS4: Nha Trang', street: 'Đ. Trần Phú, TP. Nha Trang', img: 'photo-1544717305-2782549b5136', coastal: true },
};
export const CAMPUS_OPTIONS = Object.entries(CAMPUSES).map(([k, c]) => [k, c.short]);

export const unsplash = (id, w = 500) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
export const mapsDirectionsUrl = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
export const mapsEmbedUrl = (addr) => `https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`;

export const AMENITIES = [
  ['fa-shield-halved', 'text-brand-primary', 'An ninh: Camera 24/7 toàn bộ phòng học'],
  ['fa-utensils', 'text-brand-green', 'Bếp ăn 1 chiều đạt chuẩn ATTP'],
  ['fa-tree', 'text-brand-gold', 'Sân chơi ngoài trời xanh mát'],
  ['fa-snowflake', 'text-brand-blue', 'Phòng học đủ ánh sáng, điều hòa'],
  ['fa-book-open', 'text-brand-primary', 'Thư viện và góc sáng tạo'],
  ['fa-house-medical', 'text-brand-green', 'Phòng y tế riêng'],
];

export const PROGRAMS = {
  nhatre: { code: 'NT', tone: 'bg-brand-tint2 text-brand-primary', name: 'Khối Nhà Trẻ', age: '12 - 36 tháng', summary: 'Tập trung thích nghi môi trường, phát triển ngôn ngữ đơn giản và tập tự phục vụ bản thân.', goals: ['Thích nghi môi trường mới, gắn bó với cô giáo', 'Phát triển vận động thô và vận động tinh cơ bản', 'Nói từ đơn, câu ngắn; làm quen bài hát, truyện', 'Tập tự xúc ăn, tự rửa tay, ngủ đúng giờ'], activities: ['Vận động theo nhạc', 'Chơi với cát, nước, đất nặn', 'Xem tranh, nghe kể chuyện', 'Trò chơi cảm giác'] },
  mgbe: { code: 'MGB', tone: 'bg-yellow-100 text-brand-gold', name: 'Mẫu Giáo Bé', age: '3 - 4 tuổi', summary: 'Hình thành thói quen giao tiếp, nhận biết màu sắc, hình khối và vận động tinh qua trò chơi.', goals: ['Mạnh dạn giao tiếp với cô và bạn', 'Nhận biết màu sắc, hình khối, số lượng đến 5', 'Phát triển vận động tinh: cầm bút, xếp hình', 'Thói quen vệ sinh, ăn uống gọn gàng'], activities: ['Tạo hình, tô màu', 'Âm nhạc và vận động', 'Trò chơi đóng vai', 'Làm quen Tiếng Anh qua bài hát'] },
  mgnho: { code: 'MGN', tone: 'bg-green-100 text-brand-green', name: 'Mẫu Giáo Nhỡ', age: '4 - 5 tuổi', summary: 'Khám phá khoa học đơn giản, làm quen Tiếng Anh phản xạ và rèn luyện tư duy logic.', goals: ['Khám phá thiên nhiên, thí nghiệm khoa học đơn giản', 'Tư duy logic: phân loại, sắp xếp, so sánh', 'Tiếng Anh phản xạ qua giao tiếp hằng ngày', 'Kỹ năng hợp tác trong nhóm nhỏ'], activities: ['Khám phá khoa học', 'Trồng cây, chăm sóc vườn', 'Kể chuyện sáng tạo', 'Thể dục nhịp điệu'] },
  mglon: { code: 'MGL', tone: 'bg-blue-100 text-brand-blue', name: 'Mẫu Giáo Lớn', age: '5 - 6 tuổi', summary: 'Sẵn sàng vào Lớp 1: làm quen chữ cái, toán tư duy, kỹ năng tự lập và làm việc nhóm.', goals: ['Làm quen chữ cái, tập tô, tập viết đúng tư thế', 'Toán tư duy: đếm, so sánh, phép cộng trừ đơn giản', 'Tự lập: tự chuẩn bị đồ dùng, tự giải quyết xung đột', 'Tinh thần trách nhiệm và làm việc nhóm'], activities: ['Làm quen với trường tiểu học', 'Dự án nhóm', 'Trải nghiệm thực tế', 'Chuẩn bị tâm thế vào lớp 1'] },
};
export const DAY_SCHEDULE = [
  ['07:00 - 08:00', 'Đón trẻ, chơi tự do'], ['08:00 - 08:30', 'Ăn sáng'], ['08:30 - 10:30', 'Hoạt động học, hoạt động góc'], ['10:30 - 11:30', 'Hoạt động ngoài trời'],
  ['11:30 - 12:30', 'Ăn trưa, vệ sinh'], ['12:30 - 14:30', 'Ngủ trưa'], ['14:30 - 16:00', 'Ăn chiều, hoạt động chiều'], ['16:00 - 17:30', 'Chơi tự do, trả trẻ'],
];
export const TALENTS = [
  { icon: 'fa-language', tone: 'text-brand-primary', name: 'Tiếng Anh', desc: 'Giao tiếp phản xạ qua bài hát, trò chơi, giáo viên chuẩn quốc tế.' },
  { icon: 'fa-music', tone: 'text-brand-gold', name: 'Âm nhạc & Múa', desc: 'Cảm thụ nhịp điệu, hát múa theo nhóm, biểu diễn cuối kỳ.' },
  { icon: 'fa-palette', tone: 'text-brand-green', name: 'Mỹ thuật sáng tạo', desc: 'Vẽ, nặn, thủ công; phát triển trí tưởng tượng và vận động tinh.' },
  { icon: 'fa-person-running', tone: 'text-brand-blue', name: 'Thể chất & Kỹ năng', desc: 'Vận động, trò chơi tập thể, kỹ năng tự bảo vệ bản thân.' },
];

export const BASE_MENU = [
  ['Súp gà ngô ngọt + Sữa hạt', 'Cơm mềm, Tôm rim me, Canh rau ngót', 'Phở bò + Sinh tố đu đủ'],
  ['Cháo thịt bằm', 'Cơm, Gà kho gừng, Canh bí đỏ', 'Bánh flan + Sữa chua'],
  ['Bánh mì trứng + Sữa', 'Cơm, Cá hồi áp chảo, Canh cải', 'Miến gà + Nước cam'],
  ['Bún riêu cua', 'Cơm, Bò xào bông cải, Canh mồng tơi', 'Chè đậu xanh'],
  ['Xôi đậu xanh + Sữa đậu nành', 'Cơm, Trứng hấp thịt, Canh khoai cà rốt', 'Bánh bao + Sữa'],
];
export const COASTAL_BREAKFAST = ['Bánh canh chả cá', 'Bún cá', 'Cháo cá lóc rau thơm', 'Bánh xèo mini + Sữa', 'Mì Quảng gà'];
export const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
export const menuFor = (campusKey, dayIdx) => {
  const m = [...BASE_MENU[dayIdx]];
  if (CAMPUSES[campusKey].coastal) m[0] = COASTAL_BREAKFAST[dayIdx];
  return m;
};

export const NEWS_CATS = {
  system: { label: 'Tin hệ thống', tone: 'bg-brand-tint2 text-brand-primary' },
  event: { label: 'Sự kiện', tone: 'bg-yellow-100 text-brand-gold' },
  activity: { label: 'Hoạt động', tone: 'bg-blue-100 text-brand-blue' },
  expert: { label: 'Góc chuyên gia', tone: 'bg-green-100 text-brand-green' },
};
export const NEWS = [
  { id: 'trung-thu', cat: 'event', date: '25/09/2026', title: 'Rộn ràng không khí Tết Trung Thu tại các cơ sở Ánh Dương', img: 'photo-1516627145497-ae6968895b74', body: ['Các bé tại cả 4 cơ sở Ánh Dương đã có một mùa Trung Thu đáng nhớ với đêm hội rước đèn, múa lân và phá cỗ cùng cô giáo.', 'Mỗi lớp tự trang trí mâm cỗ và làm đèn lồng từ vật liệu tái chế, giúp bé hiểu ý nghĩa của ngày Tết đoàn viên.', 'Ban giám hiệu cảm ơn quý phụ huynh đã đồng hành cùng nhà trường trong chương trình.'] },
  { id: 'tu-lap', cat: 'expert', date: '20/09/2026', title: 'Phương pháp rèn luyện tính tự lập cho trẻ 3-4 tuổi tại nhà', img: 'photo-1503676260728-1c00da094a0b', body: ['Ở độ tuổi 3-4, trẻ bắt đầu muốn tự làm mọi việc. Cha mẹ nên giao những việc nhỏ vừa sức như tự cất giày dép, tự xúc ăn.', 'Hãy khen ngợi nỗ lực thay vì kết quả, và kiên nhẫn để bé tự thử, kể cả khi bé làm chưa hoàn hảo.', 'Nhất quán giữa nhà và trường là chìa khóa: cô giáo và phụ huynh dùng cùng một cách nhắc nhở, cùng thói quen hằng ngày.'] },
  { id: 'da-ngoai', cat: 'activity', date: '15/09/2026', title: 'Chuyến dã ngoại tìm hiểu thiên nhiên của khối Mẫu Giáo Lớn', img: 'photo-1577896851231-70ef18881754', body: ['Khối Mẫu Giáo Lớn đã có buổi dã ngoại khám phá vườn cây, quan sát côn trùng và nhặt lá để làm tranh.', 'Hoạt động giúp bé rèn kỹ năng quan sát, làm việc nhóm và yêu thiên nhiên.', 'Nhà trường đảm bảo tỷ lệ cô trên trẻ và có nhân viên y tế đi cùng.'] },
  { id: 'tuyen-sinh-2026', cat: 'system', date: '10/09/2026', title: 'Hệ thống Ánh Dương mở đăng ký tuyển sinh năm học 2026 - 2027', img: 'photo-1509062522246-3755977927d7', body: ['Hệ thống mở đăng ký tuyển sinh cho các khối Nhà trẻ, Mẫu giáo Bé, Nhỡ, Lớn tại cả 4 cơ sở.', 'Phụ huynh có thể đặt lịch tham quan trường để trải nghiệm môi trường học và gặp gỡ đội ngũ giáo viên.', 'Số lượng chỗ có hạn theo từng lớp, vui lòng đăng ký sớm.'] },
  { id: 'dinh-duong', cat: 'expert', date: '05/09/2026', title: 'Thực đơn cân bằng cho bé mầm non: nên và không nên', img: 'photo-1544717305-2782549b5136', body: ['Bữa ăn của bé cần đủ bốn nhóm chất: đạm, tinh bột, chất béo tốt và vitamin khoáng chất.', 'Hạn chế đồ ngọt và nước có gas; ưu tiên trái cây tươi và sữa chua ít đường.', 'Nếu bé dị ứng thực phẩm, hãy báo cô giáo để nhà bếp điều chỉnh khẩu phần riêng.'] },
  { id: 'khai-giang', cat: 'event', date: '05/09/2026', title: 'Lễ khai giảng năm học mới: Ánh Dương chào đón các bé', img: 'photo-1580582932707-520aed937b7b', body: ['Năm học mới bắt đầu với lễ khai giảng ấm áp tại các cơ sở, nơi các bé lần đầu đến trường được cô giáo đón bằng nụ cười.', 'Nhà trường tổ chức buổi gặp mặt phụ huynh để chia sẻ kế hoạch năm học và quy trình đón trả trẻ.', 'Chúc các bé có một năm học vui vẻ và nhiều trải nghiệm bổ ích.'] },
];
export const ALBUMS = [
  { title: 'Đêm hội Trung Thu', campus: 'phutho1', count: 42 }, { title: 'Dã ngoại vườn cây', campus: 'phutho2', count: 36 },
  { title: 'Ngày hội Tiếng Anh', campus: 'quynhon', count: 28 }, { title: 'Lễ khai giảng', campus: 'nhatrang', count: 51 },
  { title: 'Bé tập bơi mùa hè', campus: 'nhatrang', count: 24 }, { title: 'Ngày hội thể thao', campus: 'phutho1', count: 33 },
  { title: 'Chào năm học mới', campus: 'quynhon', count: 40 }, { title: 'Triển lãm tranh của bé', campus: 'phutho2', count: 19 },
];

export const ADMISSION_STEPS = [
  ['fa-headset', 'Tư vấn tuyển sinh', 'Phụ huynh để lại thông tin hoặc gọi hotline, bộ phận tuyển sinh liên hệ trong 24 giờ.'],
  ['fa-school', 'Tham quan trường', 'Đặt lịch tham quan, gặp cô giáo, xem phòng học và bếp ăn.'],
  ['fa-child-reaching', 'Học trải nghiệm', 'Bé học thử một buổi cùng lớp để làm quen môi trường.'],
  ['fa-file-signature', 'Nộp hồ sơ', 'Hoàn thiện hồ sơ nhập học và ký hợp đồng dịch vụ.'],
  ['fa-money-bill-wave', 'Đóng phí giữ chỗ', 'Thanh toán học phí đợt đầu theo thông báo của cơ sở.'],
  ['fa-hand-holding-heart', 'Nhập học', 'Bé đến lớp, cô giáo đồng hành giai đoạn làm quen đầu tiên.'],
];
export const FEE_ROWS = [
  ['Nhà trẻ (12 - 36 tháng)', '3.500.000đ', '35.000đ', 'Tỷ lệ cô/trẻ thấp hơn'],
  ['Mẫu giáo Bé (3 - 4 tuổi)', '3.000.000đ', '35.000đ', ''],
  ['Mẫu giáo Nhỡ (4 - 5 tuổi)', '3.000.000đ', '35.000đ', 'Có Tiếng Anh làm quen'],
  ['Mẫu giáo Lớn (5 - 6 tuổi)', '3.200.000đ', '35.000đ', 'Chương trình vào lớp 1'],
];
export const SCHOLARSHIPS = [
  ['fa-star', 'Học bổng Bé ngoan - Bé tài năng', 'Xét theo kết quả rèn luyện và năng khiếu nổi bật trong năm học.'],
  ['fa-people-roof', 'Ưu đãi anh chị em', 'Giảm học phí cho bé thứ hai trở đi trong cùng gia đình.'],
  ['fa-clock', 'Ưu đãi đăng ký sớm', 'Ưu đãi cho phụ huynh đăng ký và giữ chỗ trước thời hạn công bố.'],
];
export const FAQS = [
  ['Bé bao nhiêu tháng tuổi thì nhận vào trường?', 'Trường nhận bé từ 12 tháng tuổi vào khối Nhà trẻ. Bé dưới 12 tháng vui lòng liên hệ để được tư vấn.'],
  ['Giờ đón và trả trẻ như thế nào?', 'Giờ đón trả cụ thể theo từng cơ sở và được thông báo khi nhập học. Phụ huynh có thể đăng ký đón muộn theo quy định.'],
  ['Trường có đưa đón bé bằng xe không?', 'Thông tin xe đưa đón khác nhau theo cơ sở, vui lòng hỏi bộ phận tuyển sinh của cơ sở bạn quan tâm.'],
  ['Bé dị ứng thực phẩm thì ăn như thế nào?', 'Phụ huynh báo dị ứng khi nhập học. Nhà bếp sẽ điều chỉnh khẩu phần riêng và cô giáo theo dõi sát trong bữa ăn.'],
  ['Bé ốm hoặc cần uống thuốc ở trường thì sao?', 'Phụ huynh gửi đơn dặn thuốc qua App Phụ huynh, cô giáo cho bé uống đúng giờ và ghi nhận lại.'],
  ['Làm sao để đặt lịch tham quan trường?', 'Điền form Đặt lịch tham quan ở đầu trang này hoặc gọi hotline. Bộ phận tuyển sinh sẽ xác nhận lịch với bạn.'],
  ['Hồ sơ nhập học gồm những gì?', 'Gồm giấy khai sinh, sổ tiêm chủng, ảnh bé và giấy tờ của phụ huynh. Danh sách chi tiết được gửi khi bạn đăng ký.'],
];
export const JOBS = [
  { id: 'giao-vien', title: 'Giáo Viên Mầm Non (Các Cơ Sở)', type: 'Toàn thời gian', campus: 'Tất cả cơ sở', salary: '8.000.000 - 12.000.000 VNĐ', deadline: '31/10/2026', req: ['Tốt nghiệp Cao đẳng/Đại học Sư phạm Mầm non', 'Yêu trẻ, kiên nhẫn, giao tiếp tốt', 'Ưu tiên có kinh nghiệm từ 1 năm'], desc: ['Chăm sóc, giáo dục trẻ theo kế hoạch của lớp', 'Cập nhật nhật ký hoạt động và trao đổi với phụ huynh qua App', 'Phối hợp tổ chức sự kiện, hoạt động trải nghiệm'] },
  { id: 'bep-bao-mau', title: 'Nhân Viên Bếp / Bảo Mẫu', type: 'Toàn thời gian', campus: 'Tất cả cơ sở', salary: '6.000.000 - 8.000.000 VNĐ', deadline: '31/10/2026', req: ['Có chứng chỉ nấu ăn/bảo mẫu', 'Sạch sẽ, chu đáo, trung thực', 'Có giấy khám sức khỏe còn hiệu lực'], desc: ['Chế biến suất ăn theo thực đơn và quy trình ATTP', 'Hỗ trợ cô giáo chăm sóc trẻ trong giờ ăn, ngủ, vệ sinh'] },
  { id: 'giao-vien-tieng-anh', title: 'Giáo Viên Tiếng Anh Mầm Non', type: 'Toàn thời gian / Bán thời gian', campus: 'Phú Thọ, Quy Nhơn Nam, Nha Trang', salary: 'Thỏa thuận theo năng lực', deadline: '15/11/2026', req: ['Cử nhân Sư phạm Anh hoặc có chứng chỉ giảng dạy (TESOL/TEFL)', 'Phát âm chuẩn, giao tiếp tự nhiên với trẻ nhỏ', 'Ưu tiên có kinh nghiệm dạy mầm non'], desc: ['Giảng dạy Tiếng Anh theo khung chương trình Cambridge', 'Thiết kế trò chơi, bài hát phù hợp lứa tuổi'] },
];
export const BENEFITS = ['Lương thưởng theo năng lực, thưởng lễ tết', 'Bảo hiểm xã hội đầy đủ', 'Đào tạo chuyên môn định kỳ', 'Môi trường làm việc thân thiện'];
