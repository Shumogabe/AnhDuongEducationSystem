# Sitemap App Phụ huynh - Hệ thống Giáo dục Mầm non Ánh Dương

> Dựa trên `parent_app/scope.md`. Các mục có dấu **(giả định)** là giả định tạm cho câu hỏi còn mở, xem mục 8.
> Nền tảng: WebApp (PWA) mobile-first trước, sau đó app React Native + Expo. Chỉ tiếng Việt.

## 1. Phạm vi bản đầu

| Có trong App | Không làm trong bản đầu |
|---|---|
| Nhật ký ngày, ảnh | Thanh toán thật (QR, VNPay, Momo) và hóa đơn điện tử VAT |
| Đón trả (QR động, người đón hộ), điểm danh, xin nghỉ | Nhận diện khuôn mặt |
| Sức khỏe, dặn thuốc, tăng trưởng | Chat nhóm, gọi thoại/video |
| Thực đơn, thông báo, chat 1-1 với cô chủ nhiệm | Thông báo đẩy hệ điều hành (giai đoạn 2) |
| Học phí: xem khoản phải đóng/đã đóng, biên lai, nút thanh toán mô phỏng | Tiếng Anh, giáo án, điểm số |

## 2. Vai trò trong app

| Vai trò | Ghi chú |
|---|---|
| **Phụ huynh chính** | Đầy đủ quyền với bé: dặn thuốc, xin nghỉ, học phí, quản lý người thân và người đón |
| **Người thân** (bố/mẹ/ông bà) | Xem nhật ký, thực đơn, thông báo, điểm danh; đón bé; nhắn tin cô |
| **Người đón hộ** | Không có tài khoản; chỉ nhận **mã tạm thời** do phụ huynh tạo |

Quy tắc dữ liệu: mỗi người chỉ thấy **bé được liên kết với số điện thoại của mình**. Một tài khoản có thể có nhiều bé, thuộc nhiều cơ sở; dữ liệu hiển thị theo bé đang chọn.

## 3. Cấu trúc điều hướng

- **Thanh dưới (5 mục):** Hôm nay · Nhật ký · Đón trả · Tin nhắn · Thêm.
- **Đầu màn hình:** bộ chọn bé (hiện tên bé, lớp, cơ sở) · chuông thông báo (kèm số chưa đọc).
- Các mục còn lại (Sức khỏe, Thực đơn, Học phí, Hồ sơ) nằm trong **Hôm nay** (lối tắt) và **Thêm**.

## 4. Cây sitemap

```
APP PHỤ HUYNH
├── 0. ĐĂNG NHẬP
│   ├── Nhập số điện thoại
│   ├── Nhập mã OTP (SMS/Zalo)        (giả định: thời hạn 5 phút, tối đa 5 lần gửi/giờ)
│   ├── Số chưa được nhà trường đăng ký → thông báo "Liên hệ nhà trường" (kèm hotline)
│   └── Chọn bé (nếu tài khoản có nhiều bé)
├── 1. HÔM NAY  (trang chủ)
│   ├── Trạng thái bé hôm nay (đã đến/chưa, giờ đến, ăn, ngủ)
│   ├── Lối tắt: Mã QR đón · Xin nghỉ · Dặn thuốc · Nhắn cô
│   ├── Thông báo mới nhất
│   ├── Thực đơn hôm nay
│   └── Học phí cần đóng (nếu có khoản chưa đóng/quá hạn)
├── 2. NHẬT KÝ
│   ├── Chọn ngày (lịch, dấu chấm ngày có nhật ký)
│   ├── Nhật ký ngày: ăn từng bữa · ngủ (giờ ngủ, dậy) · vệ sinh · tâm trạng · nhận xét của cô
│   └── Ảnh hoạt động (album theo ngày · xem lớn · tải về · báo "ảnh tự xóa sau 6 tháng")
├── 3. ĐÓN TRẢ & ĐIỂM DANH
│   ├── Mã QR đón (đổi mỗi 60 giây, dùng một lần, không chứa thông tin cá nhân)
│   ├── Người được phép đón
│   │   ├── Danh sách (tên, quan hệ, ảnh, số điện thoại)
│   │   └── Thêm / sửa / xóa                          (chỉ Phụ huynh chính)
│   ├── Người đón hộ
│   │   ├── Tạo mã tạm (họ tên, số điện thoại, hạn: trong ngày, dùng một lần)
│   │   ├── Gửi mã qua Zalo/SMS
│   │   └── Danh sách mã (Hiệu lực / Đã dùng / Hết hạn / Thu hồi) · Thu hồi mã
│   ├── Lịch sử đến/về (giờ, người đón, người xác nhận)
│   └── Xin nghỉ
│       ├── Tạo đơn (ngày bắt đầu/kết thúc, lý do, đính kèm giấy)
│       └── Danh sách đơn và trạng thái (Chờ xác nhận / Đã xác nhận / Từ chối)
├── 4. SỨC KHỎE  (từ mục Thêm hoặc lối tắt)
│   ├── Dặn thuốc
│   │   ├── Tạo đơn (tên thuốc, liều, giờ uống, thời gian dùng, ảnh đơn thuốc)
│   │   └── Danh sách đơn và trạng thái (Đã gửi / Cô đã nhận / Đã cho uống / Cần liên hệ)
│   ├── Biểu đồ tăng trưởng (cân nặng, chiều cao theo chuẩn WHO)
│   ├── Tiêm chủng (lịch sử, mũi sắp tới)
│   └── Dị ứng (xem, khai báo thêm → nhà bếp và cô thấy)
├── 5. THỰC ĐƠN
│   └── Thực đơn tuần theo cơ sở của bé (chọn ngày; ghi chú nếu bé có khẩu phần riêng)
├── 6. THÔNG BÁO  (chuông trên đầu màn hình)
│   ├── Danh sách (tag: Toàn trường / Cơ sở / Lớp; chưa đọc / đã đọc)
│   └── Chi tiết thông báo (tự ghi nhận "đã đọc")
├── 7. TIN NHẮN
│   ├── Chat 1-1 với cô chủ nhiệm của bé đang chọn
│   │   ├── Giờ làm việc hiển thị rõ; ngoài giờ báo "cô sẽ trả lời vào <giờ>"
│   │   └── Gửi chữ và ảnh (giới hạn dung lượng)
│   └── Danh sách cuộc trò chuyện (khi có nhiều bé khác lớp)
├── 8. HỌC PHÍ
│   ├── Tổng quan: số phải đóng, hạn gần nhất
│   ├── Khoản phải đóng (tháng/đợt, loại khoản, số tiền, hạn, trạng thái)
│   ├── Đã đóng (lịch sử)
│   ├── Chi tiết khoản
│   │   ├── Nút "Thanh toán" → QR / VNPay / Momo         (MÔ PHỎNG: chỉ giao diện, chưa xử lý)
│   │   └── Biên lai / hóa đơn (xem, tải PDF)             (biên lai nội bộ do nhà trường xuất)
│   └── Thông báo nhắc hạn đóng
└── 9. THÊM / HỒ SƠ & CÀI ĐẶT
    ├── Hồ sơ bé (ảnh, ngày sinh, lớp, cơ sở, giáo viên chủ nhiệm) · chỉ xem
    ├── Người thân có quyền xem bé                      (chỉ Phụ huynh chính: mời, đặt quyền, gỡ)
    ├── Đồng ý chụp và hiển thị ảnh (xem trạng thái đồng ý do nhà trường ghi nhận)
    ├── Cài đặt thông báo (bật/tắt từng nhóm)
    ├── Thiết bị đăng nhập · Đăng xuất · Đăng xuất mọi thiết bị
    ├── Liên hệ nhà trường (hotline, cơ sở, bản đồ)
    ├── Chính sách bảo mật · Điều khoản sử dụng
    └── Phiên bản app
```

## 5. Quyền theo vai trò

| Mục | Phụ huynh chính | Người thân |
|---|---|---|
| Hôm nay, Nhật ký, Ảnh, Thực đơn, Thông báo | Xem | Xem |
| Mã QR đón, Lịch sử đến/về | Có | Có (QR của chính mình) |
| Người được phép đón, Mã đón hộ | Tạo/sửa/thu hồi | Chỉ xem |
| Xin nghỉ | Tạo, sửa | Không |
| Dặn thuốc | Tạo, xem | Chỉ xem |
| Dị ứng, Tăng trưởng, Tiêm chủng | Xem, khai báo dị ứng | Xem |
| Tin nhắn với cô | Có | Có (xem lịch sử, nhắn tin) |
| Học phí, Biên lai | Xem, nút thanh toán mô phỏng | Không (giả định) |
| Quản lý người thân | Có | Không |

## 6. Luồng trạng thái

- **Dặn thuốc:** `Đã gửi → Cô đã nhận → Đã cho uống` (nhánh phụ: `Cần liên hệ`, `Từ chối`).
- **Xin nghỉ:** `Chờ xác nhận → Đã xác nhận` (nhánh phụ: `Từ chối`).
- **Mã đón hộ:** `Hiệu lực → Đã dùng` (nhánh phụ: `Hết hạn`, `Thu hồi`).
- **Khoản học phí:** `Chưa đóng → Đã đóng` (nhánh phụ: `Quá hạn`).

## 7. Yêu cầu chung

- Đăng nhập OTP, giới hạn số lần gửi và thử mã; phiên có hạn; đăng xuất thì phiên cũ vô hiệu.
- Mọi API kiểm tra quyền theo (tài khoản, bé, cơ sở); không để lộ dữ liệu bé khác qua đổi ID.
- Ảnh và dữ liệu sức khỏe: ghi nhật ký truy cập; ảnh tự xóa sau 6 tháng; chặn tải hàng loạt.
- Mã QR chỉ dùng một lần, đổi liên tục; người đón hộ nhận mã tạm có hạn.
- Mobile-first: vùng chạm tối thiểu 44px, tải nhanh trên mạng yếu, ảnh nén, có trạng thái tải/lỗi/trống cho mọi màn hình.
- Nút thanh toán mô phỏng phải ghi rõ "Chưa hỗ trợ thanh toán trong app" để phụ huynh không hiểu nhầm là đã trả tiền.

## 8. Giả định tạm (cần xác nhận)

| # | Giả định | Câu hỏi gốc (`scope.md` mục 9) |
|---|---|---|
| 1 | Dữ liệu học sinh, học phí do Portal nhập, không đồng bộ MISA EMIS | Câu 1 |
| 2 | Hóa đơn = **biên lai nội bộ** (PDF) do nhà trường xuất; chưa có hóa đơn VAT | Câu 2 |
| 3 | OTP gửi qua SMS hoặc Zalo, nhà cung cấp cấu hình được; hạn mã 5 phút, tối đa 5 lần/giờ | Câu 3 |
| 4 | Giờ chat: 7:00 - 17:00 từ thứ 2 đến thứ 6, cấu hình được theo cơ sở | Câu 4 |
| 5 | Đồng ý chụp ảnh ghi nhận trong hồ sơ nhập học (Portal), app chỉ hiển thị trạng thái | Câu 5 |
| 6 | Người thân **không** xem học phí; chỉ Phụ huynh chính | (mới) |
| 7 | Mã đón hộ có hạn trong ngày, dùng một lần | (mới) |

## 9. Giao diện demo

`demo_parent.html` (mở bằng web server tĩnh, ví dụ `python -m http.server`; hash route `#/trang`). Thiết kế mobile-first, trên máy tính hiển thị khung rộng 448px.

- Đăng nhập OTP bằng số dùng thử: `0905123456` (Phụ huynh chính, 2 bé: Việt Trì và Nha Trang) và `0912345678` (Người thân, ông của bé Bin). Số khác hiện "chưa được đăng ký". Mã OTP là 6 số bất kỳ.
- Có đủ các mục ở mục 4: Hôm nay, Nhật ký (chọn ngày, ảnh), Đón trả (QR đổi mỗi 60 giây, người được đón, mã đón hộ, xin nghỉ), Sức khỏe (dặn thuốc, tăng trưởng, tiêm chủng, dị ứng), Thực đơn, Thông báo, Tin nhắn (có giờ làm việc), Học phí (nút thanh toán mô phỏng, biên lai), Hồ sơ.
- Đăng nhập bằng số Người thân để xem các mục bị khóa theo mục 5 (không tạo đơn, không xem học phí).
- Dữ liệu là mẫu trong bộ nhớ trình duyệt, chưa có backend.