# Tổng quan Hệ thống Phần mềm - Giáo dục Mầm non Ánh Dương

> Chuyển từ `SumarySystem.docx`. Giữ nguyên nội dung, chỉ sửa lại cấp tiêu đề.

## 1. Hệ thống giáo dục mầm non cần phần mềm với mục đích gì?

Các hệ thống của Cao đẳng FPT (CMS, LMS, FLM, EduNext) được thiết kế cho giáo dục nghề nghiệp / đại học, tập trung vào tự học, thi cử, bài tập về nhà và nộp sản phẩm trực tuyến. Giáo dục mầm non có đặc thù quản lý khác hoàn toàn:

- Đối tượng tương tác chính không phải là học sinh mà là **Phụ huynh (Parents)**.
- Nội dung quản lý trọng tâm không phải điểm số/học liệu lý thuyết mà là **Sức khỏe, Dinh dưỡng, Điểm danh đón/trả trẻ, Học phí và Tương tác hàng ngày** (Sổ liên lạc điện tử).

## 2. Chuỗi phần mềm quản lý nội bộ cần thêm gì?

Cần một **Bộ giải pháp Quản lý Mầm non đa cơ sở (Kindergarten Enterprise Resource Planning)** gồm 4 nhóm mô-đun:

### Group A: Chăm sóc & Vận hành hàng ngày (bắt buộc cho mầm non)

1. **Sổ liên lạc điện tử & App Phụ huynh (Parent App)**
   - Đón/trả trẻ bằng mã QR hoặc nhận diện khuôn mặt.
   - Nhật ký hoạt động hàng ngày (bé ăn bao nhiêu, ngủ lúc mấy giờ, đi vệ sinh, hình ảnh hoạt động).
   - Dặn thuốc (phụ huynh gửi đơn thuốc cho cô giáo).
   - Xin nghỉ phép trực tuyến.
2. **Quản lý Dinh dưỡng & Khẩu phần ăn**
   - Tính calo/chất dinh dưỡng chuẩn theo quy định của Bộ Giáo dục & Đào tạo.
   - Tự động lên thực đơn tuần/tháng cho 4 cơ sở và xuất chợ/kho nguyên liệu.
3. **Quản lý Y tế & Sức khỏe**
   - Lịch sử tiêm chủng, biểu đồ tăng trưởng (chiều cao, cân nặng theo chuẩn WHO).
   - Theo dõi dị ứng thực phẩm của từng bé.

### Group B: Nhân sự, Lịch dạy & Học liệu (nội bộ giáo viên)

1. **Quản lý Giáo án & Kế hoạch giảng dạy** (tương đương CMS/LMS mầm non)
   - Quản lý khung chương trình học theo lứa tuổi (Nhà trẻ, Mẫu giáo Bé/Nhỡ/Lớn).
   - Giáo viên nộp giáo án tuần/tháng, Ban giám hiệu duyệt online.
   - Kho lưu trữ tài nguyên giảng dạy (bài hát, trò chơi, video mầm non).
2. **Chấm công & Lịch phân công công tác**
   - Phân công giáo viên chủ nhiệm, giáo viên năng khiếu, bảo mẫu theo từng lớp.
   - Chấm công theo ca, tính giờ tăng ca.

### Group C: Tài chính & Tuyển sinh (cho Ban Quản trị Hệ thống)

1. **Học phí & Thu hộ**
   - Tự động tính học phí, tiền ăn, tiền ngoại khóa, tiền đón muộn.
   - Gửi thông báo học phí qua App/Zalo OA; thanh toán qua QR Code/VNPay/Momo.
2. **CRM Tuyển sinh mầm non**
   - Quản lý hotline/lead phụ huynh đăng ký tư vấn từ Website, Facebook.
   - Theo dõi hành trình: tư vấn → Tham quan trường (School Tour) → Nhập học.

### Group D: Quản lý Chuỗi cơ sở (riêng cho Hệ thống Ánh Dương - 4 cơ sở)

1. **Báo cáo Trung tâm (Dashboard HQ)**
   - Ban lãnh đạo xem tổng quan sĩ số, doanh thu học phí, biến động nhân sự theo thời gian thực của 2 trường Phú Thọ, 1 trường Quy Nhơn Nam và 1 trường Nha Trang trên cùng một màn hình.

## 3. Tích hợp giữa Website và Phần mềm nội bộ

- **Website mới (Landing Page / Portal):** là **bộ mặt thương hiệu (Marketing & Tuyển sinh)**. Thiết kế đơn giản, ấm áp, truyền tải tình yêu thương, giúp phụ huynh tìm cơ sở gần nhất và bấm **"Đăng ký tư vấn / Tham quan trường"**.
- **Phần mềm quản lý:** chạy ngầm phía sau (Backend). Trên website chỉ tích hợp 2 nút tiện ích:
  - **"Đăng nhập Sổ liên lạc / Portal Phụ huynh"** (dẫn sang WebApp/App Store).
  - **"Cổng thông tin Nội bộ Cán bộ Nhân viên"** (dẫn sang trang quản lý của GV/BGH).

## 4. Liên hệ với các tài liệu khác

- Website công khai: `portal/sitemap.md`, UI/UX: `Instructions.md`.
- Backend CMS giai đoạn 1: `backend/sitemap.md` (không làm Group A, B, C, D; chỉ lưu liên kết tới App Phụ huynh / Portal).
