# Phạm vi Portal Giáo viên / BGH - Hệ thống Giáo dục Mầm non Ánh Dương

> Trạng thái: **đã chốt phạm vi** (phỏng vấn ngày 2026-10-07). Chưa có sitemap hay thiết kế giao diện. Mục 10 là câu hỏi còn mở.
> Liên quan: `parent_app/scope.md` (App Phụ huynh), `backend/sitemap.md` (CMS website), `SumarySystem.md` (Group A-D).

## 1. Mục đích

Portal là nơi nhà trường **nhập và quản lý dữ liệu vận hành**: học sinh, nhật ký, đón trả, y tế, thực đơn, học phí, tuyển sinh, giáo án, nhân sự. App Phụ huynh chỉ **hiển thị** phần dữ liệu này. Portal là hệ thống riêng với website và CMS; website chỉ có nút "Đăng nhập Portal" (Cài đặt → Liên kết cổng).

## 2. Nguyên tắc dữ liệu

- **Portal là nguồn dữ liệu duy nhất** cho học sinh, phụ huynh, quan hệ người thân, lớp, học phí. Nhập trực tiếp trong Portal.
- MISA EMIS **không đồng bộ** ở bản đầu (chỉ tham chiếu nghiệp vụ trong `Emis_Misa/`). Nếu nhà trường vẫn dùng song song EMIS thì phải nhập hai nơi, xem câu hỏi mục 10.
- Mọi bản ghi gắn với **cơ sở**; quyền theo cơ sở (mục 4).

## 3. Thiết bị và đăng nhập

| Nhóm | Thiết bị chính |
|---|---|
| Giáo viên, bảo mẫu, y tế, bếp | **Điện thoại** (nhập nhật ký, điểm danh, quét QR tại lớp) |
| BGH, kế toán, văn phòng, lãnh đạo | **Máy tính** (duyệt, báo cáo, bảng biểu); vẫn dùng được trên điện thoại |

- Đăng nhập **email + mật khẩu**, mật khẩu băm bằng bcrypt/Argon2, giới hạn đăng nhập sai, phiên có hạn, đăng xuất thì phiên cũ vô hiệu.
- **Bắt buộc xác thực hai bước** cho BGH, kế toán, lãnh đạo hệ thống; khuyến nghị cho vai trò còn lại.
- Không dùng chung tài khoản; một người một tài khoản.

## 4. Vai trò và phạm vi dữ liệu

| Vai trò | Phạm vi | Quyền chính |
|---|---|---|
| Giáo viên chủ nhiệm | Lớp của mình | Nhật ký, ảnh, điểm danh, duyệt xin nghỉ, chat phụ huynh, nộp giáo án |
| Giáo viên năng khiếu / bảo mẫu | Lớp/ca được phân công | Nhật ký và điểm danh giới hạn; nộp giáo án (GV năng khiếu); xem lịch phân công |
| Y tế | Cơ sở | Đơn dặn thuốc, dị ứng, chỉ số tăng trưởng, tiêm chủng |
| Nhà bếp | Cơ sở | Thực đơn tuần, xem dị ứng (không xem thông tin liên hệ phụ huynh) |
| Kế toán / thu phí | Cơ sở | Khoản phải thu, xác nhận đã thu, biên lai, báo cáo thu |
| Văn phòng / giáo vụ | Cơ sở | Hồ sơ học sinh, phụ huynh, xếp lớp, CRM tuyển sinh |
| BGH cơ sở | Cơ sở của mình | Xem và duyệt toàn bộ trong cơ sở: giáo án, xin nghỉ ngoại lệ, chat (kiểm soát), bảng công, báo cáo cơ sở |
| Lãnh đạo hệ thống | Cả 4 cơ sở | **Chỉ xem** báo cáo và Dashboard HQ; không sửa dữ liệu gốc |
| Quản trị hệ thống | Toàn bộ | Tài khoản, phân quyền, danh mục (cơ sở, lớp, ca), nhật ký |

Quy tắc: quyền tối thiểu cần thiết; giáo viên không thấy dữ liệu lớp khác; BGH cơ sở không thấy cơ sở khác.

## 5. Mô-đun và đợt triển khai

### Đợt 1 - Lõi vận hành (để App Phụ huynh chạy được)
1. **Học sinh và phụ huynh:** hồ sơ bé, phụ huynh, quan hệ người thân và quyền, cơ sở/lớp, đồng ý chụp ảnh; tạo tài khoản App Phụ huynh (nhập số điện thoại).
2. **Nhật ký ngày và ảnh:** ăn, ngủ, vệ sinh, tâm trạng, nhận xét, ảnh (tự xóa sau 6 tháng).
3. **Đón trả và điểm danh:** quét QR động của phụ huynh/người đón hộ, ghi giờ đến/về, danh sách người được phép đón, duyệt xin nghỉ.
4. **Y tế:** nhận và xác nhận đơn dặn thuốc, ghi nhận đã cho uống, nhập cân nặng/chiều cao, lịch tiêm chủng, dị ứng.
5. **Thực đơn:** đăng thực đơn tuần theo cơ sở.
6. **Thông báo và chat:** gửi thông báo toàn trường/cơ sở/lớp, theo dõi đã đọc; chat 1-1 với phụ huynh trong giờ làm việc.
7. **Thu phí:** khoản phải thu (học phí, tiền ăn, ngoại khóa, đón muộn), xác nhận đã thu thủ công, xuất biên lai. Chưa tích hợp thanh toán.

### Đợt 2 - Tuyển sinh và báo cáo
8. **CRM tuyển sinh:** nhận lead từ website, theo dõi `Mới → Đã liên hệ → Đã hẹn tham quan → Đã tham quan → Đã nộp hồ sơ → Nhập học` (nhánh `Không liên lạc được`, `Từ chối`), ghi chú, người phụ trách; bấm **"Nhập học"** để tạo học sinh và tài khoản phụ huynh.
9. **Dashboard HQ** cho lãnh đạo hệ thống và BGH cơ sở:
   - Sĩ số và chuyên cần theo cơ sở/lớp.
   - Học phí: phải thu, đã thu, còn nợ theo tháng và cơ sở.
   - Nhân sự: sĩ số giáo viên, đi làm/nghỉ, tăng ca.
   - Tuyển sinh: số lead, tỷ lệ chuyển đổi.

### Đợt 3 - Chuyên môn và nhân sự
10. **Giáo án và kế hoạch giảng dạy:** giáo viên **tải file** (Word/PDF) nộp theo tuần/tháng; **một cấp BGH cơ sở** duyệt hoặc trả lại kèm nhận xét; lưu lịch sử phiên bản; kho tài nguyên dùng chung (bài hát, trò chơi, video); khung chương trình theo khối tuổi.
11. **Phân công và chấm công:** phân GVCN, GV năng khiếu, bảo mẫu theo lớp và ca; chấm công theo ca và tăng ca; xuất bảng công cuối tháng cho kế toán. **Không tính lương** trong Portal.

## 6. Quan hệ với CMS website (đã cập nhật)

Đã chốt: **CRM trong Portal là nơi xử lý lead**; CMS **không lưu và không xử lý lead**. Đã sửa `backend/sitemap.md` và `demo_backend.html` theo đó:

- Form "Đăng ký tham quan" trên website gọi API của Portal để tạo lead (giả định, xem `staff_portal/sitemap.md` mục 8).
- CMS giữ: **nội dung tuyển sinh** (quy trình, bảng phí, FAQ), **cấu hình form** (trường, chống spam, email thông báo) và **kết nối CRM** (địa chỉ API, khóa API, kiểm tra kết nối).
- CMS thêm **hàng đợi chuyển lead**: nếu Portal tạm không nhận được, lead nằm ở trạng thái `Chờ chuyển` / `Lỗi` và được chuyển lại (từng lead hoặc tất cả). Lead đã chuyển chỉ giữ thời gian, cơ sở và mã CRM; họ tên và số điện thoại bị ẩn khỏi CMS.
- Nhân viên xử lý lead (Văn phòng, BGH cơ sở) làm việc trong Portal, không dùng CMS.
- Trong giai đoạn website chạy trước khi CRM sẵn sàng, cần giải pháp tạm (ví dụ gửi email thông báo cho cơ sở); chưa thiết kế.

## 7. Ngoài phạm vi

- Tính lương, phiếu lương, bảo hiểm, thuế.
- Thanh toán thật và hóa đơn điện tử VAT.
- Đồng bộ với MISA EMIS / AMIS.
- Nhận diện khuôn mặt, chấm công sinh trắc học.
- Soạn giáo án trực tiếp theo biểu mẫu, duyệt nhiều cấp.
- Đăng nhập một lần (SSO) với website/App Phụ huynh (giai đoạn 2).
- Quản lý kho/nguyên liệu bếp (tự động xuất chợ) và tính calo tự động (để sau).

## 8. Yêu cầu chung

- **Nhật ký hoạt động:** ai xem, sửa, xuất dữ liệu nào, lúc nào; ghi mọi lần xuất file (danh sách học sinh, công nợ, bảng công).
- **Dữ liệu trẻ em và nhân sự** là dữ liệu cá nhân: chỉ người có quyền xem; kiểm tra quyền theo (người dùng, cơ sở, lớp) ở mọi API; thời hạn lưu: ảnh 6 tháng, hồ sơ chưa nhập học 3 tháng.
- **Mobile-first cho giáo viên:** thao tác nhập nhật ký và điểm danh cả lớp trong vài chạm; chịu được mạng yếu (lưu nháp, gửi lại khi có mạng).
- **Chạy Docker trên Linux**, PostgreSQL; Valkey cho phiên, giới hạn tần suất, mã QR.
- Nội dung giáo viên nhập (nhận xét, tên file) phải chống XSS; upload giới hạn loại và dung lượng (ảnh, giáo án).

## 9. Tiêu chí hoàn thành

**Đợt 1:** nhập học sinh/phụ huynh tạo được tài khoản App; giáo viên nhập nhật ký và điểm danh cả lớp từ điện thoại; quét QR đón thành công (kể cả người đón hộ); xác nhận dặn thuốc; kế toán ghi khoản phải thu và xuất biên lai; không truy cập chéo lớp/cơ sở.
**Đợt 2:** lead từ website xuất hiện trong CRM; "Nhập học" tạo được học sinh và phụ huynh; Dashboard hiển thị đúng 4 nhóm chỉ số.
**Đợt 3:** giáo viên nộp giáo án, BGH duyệt/trả lại có lịch sử; bảng công theo ca và tăng ca xuất được cho kế toán.

## 10. Câu hỏi còn mở

1. **MISA EMIS:** nhà trường có tiếp tục dùng EMIS song song không? Nếu có, nhập hai nơi hay có kế hoạch di chuyển dữ liệu?
2. **Cách chấm công nhân sự:** nhân viên tự chấm (QR dán tại cơ sở, GPS) hay BGH/văn phòng xác nhận? Có tăng ca cần duyệt không?
3. **Định nghĩa chỉ số:** "chuyên cần" tính thế nào (ngày có mặt/ngày học)? "Tỷ lệ chuyển đổi" tính từ lead nào?
4. **Chuyển lead từ website:** cơ chế (API trực tiếp hay CMS đẩy) và trong thời gian chuyển tiếp lead nằm ở đâu?
5. **Ai tạo tài khoản nhân sự:** chỉ Quản trị hệ thống, hay BGH cơ sở tạo cho nhân viên của mình?
6. **Mẫu giáo án và kỳ nộp:** hạn nộp từng tuần/tháng, định dạng file chấp nhận, ai được xem giáo án lớp khác.
7. **Số người dùng ước tính** (giáo viên, nhân viên, BGH mỗi cơ sở) để tính tải.
8. **Nguồn danh mục chuẩn:** danh sách lớp, ca làm, loại khoản thu, khung tăng trưởng WHO do ai cung cấp.

## 11. Bước tiếp theo

1. Trả lời các câu hỏi mở (mục 10) và `parent_app/scope.md` mục 9.
2. Viết sitemap Portal (`staff_portal/sitemap.md`) và App Phụ huynh (`parent_app/sitemap.md`).
3. Cập nhật `backend/sitemap.md` và `demo_backend.html` theo mục 6.
4. Dựng `demo_staff.html` và `demo_parent.html` (mobile-first).
