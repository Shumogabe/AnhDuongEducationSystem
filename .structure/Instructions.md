# Định hướng Giao diện & Trải nghiệm Người dùng (UI/UX)

> Cập nhật theo `demo1.html`. Cột **Trạng thái** cho biết hạng mục đã có trong demo hay còn cần làm.

## 1. Phong cách Thiết kế UI (Visual Style)

### Bảng màu (lấy từ logo của trang cũ)

| Vai trò | Màu | Mã | Dùng cho |
|---|---|---|---|
| Chủ đạo | Đỏ đô | `#8E2424` | Top bar, nút chính, tiêu đề nhấn, khối bản tin |
| Đậm | Đỏ đô đậm | `#5A1515` | Footer, trạng thái hover của nút chính |
| Điểm nhấn | Vàng logo | `#EFE77B` | Dải "Đăng ký ngay", thẻ hệ Cambridge, nút trên nền đỏ |
| Vàng sậm | Vàng đậm | `#A07F00` | Icon và chữ vàng trên nền sáng (vàng logo quá nhạt) |
| Phụ | Xanh lá | `#2E7D32` | Y tế, dinh dưỡng, nút gọi hotline |
| Liên hệ | Xanh Zalo | `#0068FF` | Nút Zalo |
| Nền | Kem / trắng | `#FFF9F0` / `#FFFFFF` | Nền xen kẽ các khối |
| Nền nhạt | Hồng nhạt | `#FBF1EF`, `#F5DEDA`, `#EDC3BD` | Thẻ, nhãn, khung giữ chỗ |
| Chữ | Xám xanh | `#2D3748` | Nội dung chính |

- Chữ trắng trên đỏ đô đạt độ tương phản 8,6:1 (đạt chuẩn đọc được 4,5:1). Không dùng chữ trắng trên vàng hoặc cam nhạt.
- Phông chữ: **Lexend** (Google Fonts), fallback sans-serif.
- Logo: dùng logo của trang cũ, nhúng trực tiếp trong file HTML. Ở footer đặt trong khung trắng bo tròn vì chữ logo màu đen.

### Phong cách đồ họa

- Bo tròn góc ở mọi card, nút, ô nhập (`rounded-xl` đến `rounded-full`).
- **Dải ngăn cách hình sóng** giữa các khối trang chủ, màu đổi theo khối kế tiếp. Trạng thái: **Đã có** (chỉ trang chủ).
- Icon nét đơn giản (Font Awesome). Icon minh họa ngộ nghĩnh riêng cho món ăn, giờ ngủ, môn học: **Chưa làm**.
- Hình ảnh thật 100% từ học sinh và cô giáo, hạn chế ảnh stock. Trạng thái: **Chưa có ảnh thật**, hero, giáo viên, thư viện ảnh đang là khung giữ chỗ nét đứt. Các trang Cơ sở, Tin tức vẫn dùng ảnh Unsplash tạm.

## 2. Định hướng Trải nghiệm UX (User Experience)

### A. Trải nghiệm trên Mobile (Mobile-First)

Trên 85% phụ huynh mầm non truy cập web bằng điện thoại di động.

| Hạng mục | Trạng thái |
|---|---|
| Sticky header: logo + nút "Đăng ký tư vấn" + hamburger | **Đã có** |
| Top bar: Hotline, App Phụ Huynh, Portal Nội Bộ (rút gọn nhãn trên mobile) | **Đã có** |
| Menu hamburger (dưới 1024px) có accordion "Hệ Thống Cơ Sở" và "Thông Tin" | **Đã có** |
| Bottom Navigation: Trang chủ / Chọn cơ sở / Đặt lịch tour / Sổ liên lạc | **Đã có** |
| Vùng chạm tối thiểu 44px; ô nhập 16px trên mobile (tránh iOS tự zoom) | **Đã có** |
| Không tràn ngang từ 320px đến 1830px trên mọi trang | **Đã kiểm tra** |

### B. Điều hướng desktop

- Menu: Trang chủ, Giới thiệu, Hệ thống cơ sở (dropdown 4 cơ sở), Chương trình học, Dinh dưỡng, **Thông Tin** (dropdown: Tin tức, Tuyển sinh, Tuyển dụng).
- Dropdown mở bằng hover, bàn phím (Tab) và chạm (tablet). **Đã có**

### C. Trải nghiệm Chọn Cơ sở Linh hoạt (Multi-location UX)

- Bộ chọn 4 cơ sở ngay Banner trang chủ. **Đã có**, hiện mở khối thông tin cơ sở (tên, địa chỉ, tiện ích).
- Chưa có: tự đổi Hotline/ảnh theo cơ sở được chọn, nút "Chỉ đường đến cơ sở gần nhất" tích hợp Google Maps. **Chưa làm**

### D. Tăng Tỷ lệ Chuyển đổi Tuyển sinh (CRO)

- Form "Đăng ký Tham quan Trường" gồm đúng 4 trường: Họ tên phụ huynh, Số điện thoại, Cơ sở, Tên & tuổi của bé. **Đã có** (chưa gửi dữ liệu về backend)
- Nút "Đặt lịch tham quan" cố định trên header. **Đã có**. Nút "Đăng ký tư vấn" dạng floating riêng: không dùng, vì nút cố định trên header đã đảm nhiệm.
- **Cột nút nổi (FLOATING CONTACT)** góc phải dưới, từ trên xuống: Cuộn lên đầu trang (chỉ hiện khi đã cuộn), Zalo, Messenger, Email, Gọi Hotline. **Đã có**
- Chat Zalo/Messenger tự chào và nối thẳng bộ phận tuyển sinh từng cơ sở: **Chưa làm** (hiện chỉ là liên kết).

## 3. Cấu trúc Trang chủ (thứ tự các khối)

1. Hero + bộ chọn 4 cơ sở
2. 3 Trụ cột giáo dục cốt lõi
3. Hai hệ chương trình: Quốc tế Cambridge và Chất lượng cao
4. Hành trình nhập học 4 bước (Tư vấn tuyển sinh, Học trải nghiệm, Đăng ký và nộp hồ sơ, Nhập học)
5. Đội ngũ giáo viên
6. Chia sẻ của phụ huynh
7. Đơn vị đồng hành
8. Dải kêu gọi "Đăng ký ngay"
9. Đăng ký nhận bản tin (giao diện, chưa gửi thật)
10. Thư viện ảnh
11. Footer: logo, danh mục, tiện ích (App Phụ Huynh, Cổng Giáo viên & BGH), liên hệ

Các trang con: Giới thiệu, Hệ thống cơ sở, Chương trình học, Dinh dưỡng, Tin tức, Tuyển sinh, Tuyển dụng.

## 4. Thông tin liên hệ dùng trong demo

| Kênh | Giá trị | Ghi chú |
|---|---|---|
| Hotline | 0965 284 866 | Lấy từ trang cũ |
| Zalo | `https://zalo.me/0965284866` | |
| Messenger | `https://m.me/TruongMamnonAnhDuongVT` | |
| Email nút nổi | `mnanhduong.pgdviettri@gmail.com` | |
| Email top bar và footer | `tuyensinh@anhduongschool.edu.vn` | **Đang là dữ liệu mẫu**, cần xác nhận email chính thức |

# Các Hạng mục Nội dung Đặc thù cần Chuẩn bị

## 1. Hình ảnh & Video

- Bộ ảnh cơ sở vật chất (phòng học, sân chơi, nhà ăn, WC) chuẩn nét cho cả 4 cơ sở.
- Ảnh hero, ảnh đội ngũ giáo viên (kèm họ tên, chức vụ), ảnh thư viện hoạt động.
- Logo chính thức của các đơn vị đồng hành (BIDV, VietinBank, WIDELY, AN DENTAL) hoặc văn bản cho phép sử dụng.
- Video ngắn 1-2 phút giới thiệu tổng quan Hệ thống Ánh Dương.

## 2. Nội dung Văn bản (Copywriting)

- Thông điệp truyền thông ngắn gọn, chạm tới cảm xúc phụ huynh (An tâm, Yêu thương, Trải nghiệm).
- Mô tả chính thức cho hai hệ chương trình (Cambridge, Chất lượng cao), hiện là câu tạm.
- Lời chia sẻ thật của phụ huynh (kèm đồng ý hiển thị), hiện là "nội dung mẫu".
- Lộ trình học chi tiết cho từng độ tuổi.
