# Phạm vi App Phụ huynh - Hệ thống Giáo dục Mầm non Ánh Dương

> Trạng thái: **đã chốt phạm vi bản đầu** (phỏng vấn ngày 2026-10-07). Chưa có sitemap hay thiết kế giao diện. Mục 9 là các câu hỏi còn mở.
> Nguồn: `SumarySystem.md` (Group A, C) và các quyết định bên dưới.

## 1. Mục đích

Cho phụ huynh theo dõi bé hằng ngày và làm việc với nhà trường qua điện thoại: xem nhật ký, đón trả, sức khỏe, thực đơn, thông báo, nhắn cô giáo, xem học phí. App là hệ thống **riêng** với website và backend CMS; website chỉ có nút "Đăng nhập" trỏ tới đây (xem `backend/sitemap.md`, mục Cài đặt → Liên kết cổng).

## 2. Nền tảng và giai đoạn

| Giai đoạn | Nội dung |
|---|---|
| 1 | **WebApp (PWA)** dùng được trên điện thoại, thiết kế mobile-first. Dùng để thử nghiệm với phụ huynh thật |
| 2 | Đóng gói thành **app React Native + Expo** (App Store, CH Play), thêm thông báo đẩy và quét camera |

Điều kiện: WebApp và app dùng **chung một API backend** và chung quy ước dữ liệu. Phần giao diện nên chọn công nghệ để tái sử dụng được logic khi sang React Native. Giai đoạn 1 chỉ cần thông báo trong app và Zalo/SMS, chưa đẩy thông báo hệ điều hành.

Chỉ **tiếng Việt**.

## 3. Chức năng bản đầu (có)

### 3.1 Nhật ký hằng ngày của bé
- Xem theo ngày: ăn (mức ăn từng bữa), ngủ (giờ ngủ, giờ dậy), vệ sinh, tâm trạng, nhận xét của cô, ảnh hoạt động.
- Phụ huynh **chỉ xem**; cô giáo nhập từ Portal.
- Ảnh tự xóa sau **6 tháng**; phụ huynh tải về trước đó. Mỗi bé cần có đồng ý của phụ huynh cho việc chụp và hiển thị ảnh.

### 3.2 Đón trả trẻ và điểm danh
- **Mã QR động** (đổi mỗi 60 giây) cho người đón; cô quét bằng Portal.
- Đăng ký danh sách người được phép đón; **người đón hộ không cần tài khoản**: phụ huynh tạo mã tạm thời có hạn, giới hạn một lần dùng hoặc trong ngày.
- Xem giờ đến và giờ về của bé, lịch sử điểm danh.
- Xin nghỉ trực tuyến (ngày, lý do); cô xác nhận.
- Không làm nhận diện khuôn mặt ở bản đầu (liên quan dữ liệu sinh trắc học, để sau khi có rà soát pháp lý).

### 3.3 Sức khỏe và dặn thuốc
- Gửi **đơn dặn thuốc** (tên thuốc, liều, giờ uống, ảnh đơn); cô xác nhận đã nhận và đã cho uống.
- Xem biểu đồ tăng trưởng (cân nặng, chiều cao theo chuẩn WHO), lịch tiêm chủng, thông tin dị ứng.
- Phụ huynh khai báo dị ứng; nhà bếp và cô xem được.

### 3.4 Thực đơn, thông báo, tin nhắn
- Thực đơn tuần theo cơ sở của bé.
- Thông báo từ nhà trường (toàn trường, theo cơ sở, theo lớp) kèm trạng thái đã đọc.
- **Chat 1-1 với cô chủ nhiệm, trong giờ làm việc.** Ngoài giờ hiển thị giờ trả lời dự kiến. Ban giám hiệu xem được nội dung để kiểm soát. Không có chat nhóm.

### 3.5 Học phí (giao diện, chưa xử lý thanh toán)
- Xem **khoản phải đóng và đã đóng** theo tháng/đợt: học phí, tiền ăn, ngoại khóa, đón muộn.
- Nút **"Thanh toán" QR / VNPay / Momo là nút mô phỏng**: chỉ hiển thị giao diện, chưa tích hợp, chưa ghi nhận tiền. Thanh toán trong app thuộc giai đoạn sau.
- **Biên lai / hóa đơn:** phụ huynh xem được biên lai các khoản đã đóng (nhà trường xác nhận thu thủ công). Nhà trường cũng xem được danh sách này ở Portal.
  - Khả thi ở mức **biên lai nội bộ**. Hóa đơn điện tử có giá trị pháp lý (VAT) cần nhà cung cấp hóa đơn và xác nhận của kế toán, xem mục 9.

## 4. Tài khoản và quan hệ dữ liệu

- **Đăng nhập:** OTP qua SMS hoặc Zalo theo số điện thoại. **Nhà trường tạo sẵn** (nhập số phụ huynh khi nhập học); số lạ không vào được. Không có mật khẩu.
- Phiên có hạn sử dụng; đăng xuất thì phiên cũ vô hiệu; giới hạn số lần gửi OTP.
- **Một tài khoản, nhiều bé:** bộ chọn bé ở đầu màn hình.
- **Nhiều người thân cho một bé** (bố, mẹ, ông bà), quyền khác nhau. Đề xuất vai trò: *Phụ huynh chính* (đầy đủ, quản lý người thân, dặn thuốc, xin nghỉ, xem học phí); *Người thân* (xem nhật ký, thực đơn, thông báo, đón bé).
- **Bé học nhiều cơ sở:** gộp trong một tài khoản; dữ liệu hiển thị theo cơ sở của từng bé.
- **Người đón hộ:** không tài khoản; mã tạm thời có hạn (mục 3.2).

## 5. Phụ thuộc vào Portal giáo viên (Group B, C, D)

App chỉ hiển thị dữ liệu mà nhà trường nhập. Bản đầu của App Phụ huynh cần Portal tối thiểu có:

| Chức năng Portal | Phục vụ |
|---|---|
| Quản lý học sinh, phụ huynh, quan hệ người thân, cơ sở/lớp | Tài khoản và phạm vi dữ liệu |
| Nhập nhật ký ngày, đăng ảnh | 3.1 |
| Quét QR đón trả, điểm danh, duyệt xin nghỉ | 3.2 |
| Xác nhận và ghi nhận dặn thuốc, nhập chỉ số tăng trưởng | 3.3 |
| Đăng thực đơn, gửi thông báo, trả lời chat | 3.4 |
| Ghi khoản phải thu, xác nhận đã thu, xuất biên lai | 3.5 |

Phạm vi chi tiết của Portal sẽ chốt riêng ở bước sau.

## 6. Ngoài phạm vi bản đầu

- Thanh toán thật (QR, VNPay, Momo), hóa đơn điện tử VAT, thông báo đẩy hệ điều hành (giai đoạn 2).
- Nhận diện khuôn mặt khi đón trả.
- Chat nhóm lớp, gọi thoại/video.
- Tiếng Anh.
- Đăng nhập một lần (SSO) giữa website, App Phụ huynh và Portal (giai đoạn 2).
- Giáo án, điểm số, báo cáo học tập chi tiết.
- Giao diện cho cô giáo/BGH (thuộc Portal).

## 7. Yêu cầu chung

- **Dữ liệu trẻ em** là dữ liệu cá nhân nhạy cảm: ghi nhật ký truy cập ảnh và dữ liệu sức khỏe; mỗi phụ huynh chỉ thấy bé của mình; ảnh lưu có thời hạn, chia sẻ ra ngoài cần chặn tải hàng loạt. Cần rà soát pháp lý về bảo vệ dữ liệu cá nhân (ví dụ Nghị định 13/2023/NĐ-CP) trước khi vận hành thật.
- Mã QR đón trả đổi liên tục và chỉ dùng một lần; không đưa thông tin cá nhân vào nội dung mã.
- Mọi API kiểm tra quyền theo (tài khoản, bé, cơ sở). Không để lộ dữ liệu bé khác qua đổi ID.
- Mobile-first: vùng chạm tối thiểu 44px, chạy mượt trên mạng yếu, đọc tốt ngoài trời.
- Chạy trong Docker trên Linux, dùng PostgreSQL; Valkey cho OTP, giới hạn tần suất và phiên.

## 8. Tiêu chí hoàn thành bản đầu

1. Phụ huynh đăng nhập OTP, thấy đúng bé (kể cả nhiều bé, nhiều cơ sở).
2. Xem được nhật ký ngày, ảnh, thực đơn, thông báo.
3. Tạo mã QR đón (cả người đón hộ) và cô quét thành công trên Portal.
4. Gửi đơn dặn thuốc và xin nghỉ, cô xác nhận, phụ huynh thấy trạng thái.
5. Chat 1-1 với cô trong giờ làm việc; BGH xem được.
6. Xem khoản phải đóng/đã đóng và biên lai; nút thanh toán hiển thị mô phỏng.
7. Không có truy cập chéo dữ liệu giữa các gia đình (kiểm tra bằng thử nghiệm phân quyền).

## 9. Câu hỏi còn mở

1. **Nguồn dữ liệu học sinh và học phí:** có lấy từ MISA EMIS (`Emis_Misa/`) hay nhập riêng trong Portal? Ảnh hưởng đến việc đồng bộ và tránh nhập hai lần.
2. **Hóa đơn:** nhà trường cần hóa đơn điện tử VAT hay biên lai nội bộ là đủ? Nếu cần VAT thì dùng nhà cung cấp nào?
3. **Kênh OTP:** SMS hay Zalo OA? Chi phí và đăng ký thương hiệu tin nhắn (brandname) do ai xử lý?
4. **Giờ làm việc chat** của cô giáo cụ thể là mấy giờ, và ai trả lời khi cô nghỉ?
5. **Đồng ý chụp ảnh:** mẫu đồng ý nằm ở hồ sơ nhập học hay trong app?
6. **Số lượng ước tính:** số bé và số phụ huynh dự kiến để tính tải và chi phí hạ tầng.
7. **Tên và địa chỉ** WebApp (tên miền con) để gắn vào Cài đặt → Liên kết cổng.

## 10. Bước tiếp theo

1. Chốt phạm vi **Portal giáo viên/BGH** (bảng mục 5 là điểm xuất phát).
2. Viết sitemap App Phụ huynh (`parent_app/sitemap.md`).
3. Dựng `demo_parent.html` (mobile-first) và `demo_staff.html`.
