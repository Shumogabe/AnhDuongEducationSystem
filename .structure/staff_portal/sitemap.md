# Sitemap Portal Giáo viên / BGH - Hệ thống Giáo dục Mầm non Ánh Dương

> Dựa trên `staff_portal/scope.md`. Các mục có dấu **(giả định)** là giả định tạm cho câu hỏi còn mở, xem mục 8.
> Ký hiệu đợt triển khai: **[Đ1]** lõi vận hành · **[Đ2]** tuyển sinh và báo cáo · **[Đ3]** giáo án và nhân sự.
> Giáo viên dùng điện thoại là chính; BGH, kế toán, văn phòng dùng máy tính. Menu tự thay đổi theo vai trò.

## 1. Phạm vi

| Có trong Portal | Không làm |
|---|---|
| Học sinh, phụ huynh, lớp, nhật ký, ảnh | Tính lương, phiếu lương, bảo hiểm, thuế |
| Điểm danh, đón trả (quét QR), xin nghỉ | Thanh toán thật, hóa đơn điện tử VAT |
| Y tế: dặn thuốc, tăng trưởng, tiêm chủng, dị ứng | Đồng bộ MISA EMIS/AMIS |
| Thực đơn, thông báo, chat phụ huynh | Nhận diện khuôn mặt, chấm công sinh trắc học |
| Thu phí thủ công và biên lai | Soạn giáo án theo biểu mẫu, duyệt nhiều cấp |
| CRM tuyển sinh, Dashboard HQ [Đ2] | SSO với website/App (giai đoạn 2) |
| Giáo án (nộp file), phân công, chấm công [Đ3] | Quản lý kho nguyên liệu bếp |

## 2. Vai trò và phạm vi dữ liệu

| Vai trò | Phạm vi |
|---|---|
| Giáo viên chủ nhiệm (GVCN) | Lớp của mình |
| Giáo viên năng khiếu / Bảo mẫu | Lớp và ca được phân công |
| Y tế | Cơ sở |
| Nhà bếp | Cơ sở |
| Kế toán / Thu phí | Cơ sở |
| Văn phòng / Giáo vụ | Cơ sở |
| BGH cơ sở | Cơ sở của mình |
| Lãnh đạo hệ thống | 4 cơ sở, **chỉ xem** |
| Quản trị hệ thống | Toàn bộ |

Quy tắc dữ liệu: mỗi bản ghi có trường **cơ sở** (và **lớp** nếu liên quan); người dùng chỉ thấy phạm vi của vai trò. Một người có thể có nhiều vai trò (ví dụ GVCN kiêm Y tế) nhưng mỗi vai trò gắn một phạm vi riêng.

## 3. Cây sitemap

```
PORTAL
├── 0. ĐĂNG NHẬP & TÀI KHOẢN CỦA TÔI
│   ├── Đăng nhập (email + mật khẩu) / Xác thực hai bước / Quên mật khẩu
│   └── Hồ sơ cá nhân · Đổi mật khẩu · Thiết bị đăng nhập
├── 1. TRANG CHỦ  (thay đổi theo vai trò)
│   ├── GV: lớp hôm nay (chưa điểm danh, chưa nhập nhật ký, đơn thuốc chờ, tin nhắn chưa đọc, xin nghỉ chờ)
│   ├── Y tế: đơn thuốc cần cho uống hôm nay
│   ├── Văn phòng: học sinh mới, lead cần xử lý [Đ2]
│   ├── Kế toán: khoản quá hạn, thu hôm nay
│   └── BGH: tổng quan cơ sở (sĩ số, vắng, giáo án chờ duyệt [Đ3], bảng công chờ xác nhận [Đ3])
├── 2. LỚP CỦA TÔI  (GVCN, GV năng khiếu, bảo mẫu)                                  [Đ1]
│   ├── Điểm danh (cả lớp một màn hình: Có mặt / Vắng có phép / Vắng không phép)
│   ├── Nhật ký ngày
│   │   ├── Nhập nhanh cả lớp (ăn, ngủ, vệ sinh theo từng bé, chọn nhiều bé cùng lúc)
│   │   ├── Nhận xét từng bé · tâm trạng
│   │   ├── Ảnh hoạt động (tải lên, gắn bé, chọn bé hiển thị theo đồng ý của phụ huynh)
│   │   └── Lưu nháp · tự gửi lại khi có mạng
│   ├── Xin nghỉ (danh sách đơn · xác nhận / từ chối)
│   ├── Đơn dặn thuốc của lớp (xem · xác nhận đã nhận)
│   ├── Tin nhắn phụ huynh (chat 1-1)
│   └── Danh sách học sinh lớp (thông tin cơ bản, dị ứng, người được phép đón)
├── 3. ĐÓN TRẢ                                                                      [Đ1]
│   ├── Quét mã QR đón (xác nhận bé, người đón, giờ; cảnh báo mã hết hạn / đã dùng / sai bé)
│   ├── Đón hộ: kiểm tra mã tạm và đối chiếu giấy tờ
│   ├── Nhật ký đón trả (giờ đến, giờ về, người đón)
│   └── Xử lý ngoại lệ: đón muộn · người lạ · không có mã (BGH xác nhận qua điện thoại phụ huynh)
├── 4. HỌC SINH & PHỤ HUYNH  (Văn phòng, BGH)                                       [Đ1]
│   ├── Danh sách học sinh (lọc: cơ sở, lớp, trạng thái)
│   ├── Hồ sơ học sinh (thông tin, ngày sinh, giấy tờ, đồng ý chụp ảnh)
│   ├── Phụ huynh và người thân (số điện thoại, quan hệ, Phụ huynh chính / Người thân, người được phép đón)
│   ├── Tạo tài khoản App Phụ huynh (liên kết số điện thoại) · khóa / mở
│   ├── Xếp lớp · chuyển lớp · chuyển cơ sở · nghỉ học / bảo lưu
│   └── Nhập danh sách từ file (kiểm tra lỗi trước khi nhập)
├── 5. Y TẾ                                                                         [Đ1]
│   ├── Đơn dặn thuốc (Đã gửi → Cô đã nhận → Đã cho uống · ghi giờ, người cho uống)
│   ├── Chỉ số tăng trưởng (nhập cân nặng, chiều cao theo kỳ · biểu đồ WHO)
│   ├── Tiêm chủng (lịch sử, mũi sắp tới)
│   └── Dị ứng (danh sách bé có dị ứng, cảnh báo cho bếp và cô)
├── 6. THỰC ĐƠN  (Nhà bếp)                                                          [Đ1]
│   ├── Thực đơn tuần theo cơ sở (3 bữa × 5 ngày)
│   ├── Sao chép từ tuần trước · Đăng
│   └── Dị ứng hôm nay (chỉ tên bé, món cần tránh; không có thông tin liên hệ)
├── 7. THÔNG BÁO & TIN NHẮN                                                         [Đ1]
│   ├── Gửi thông báo (đối tượng: toàn trường / cơ sở / khối / lớp) · lên lịch gửi
│   ├── Danh sách thông báo (số người đã đọc / chưa đọc)
│   ├── Hộp tin nhắn phụ huynh (theo lớp, bé)
│   └── BGH: xem chat để kiểm soát (ghi nhật ký khi xem)
├── 8. THU PHÍ  (Kế toán)                                                           [Đ1]
│   ├── Danh mục khoản thu (học phí, tiền ăn, ngoại khóa, đón muộn)
│   ├── Tạo khoản phải thu (hàng loạt theo lớp/khối, hạn đóng) · điều chỉnh miễn giảm
│   ├── Ghi nhận đã thu (thủ công: tiền mặt, chuyển khoản; ngày, người thu)
│   ├── Biên lai (xuất PDF · hủy có lý do · phụ huynh xem trong App)
│   ├── Công nợ (theo bé, lớp, cơ sở · nhắc đóng qua thông báo)
│   └── Báo cáo thu (theo ngày, tháng, khoản) · xuất file
├── 9. CRM TUYỂN SINH  (Văn phòng, BGH)                                             [Đ2]
│   ├── Danh sách lead (nguồn: Website, Facebook, Hotline, Giới thiệu; lọc cơ sở, trạng thái, người phụ trách)
│   ├── Chi tiết lead (thông tin, lịch sử liên hệ, ghi chú, hẹn tham quan)
│   ├── Trạng thái: Mới → Đã liên hệ → Đã hẹn tham quan → Đã tham quan → Đã nộp hồ sơ → Nhập học
│   │             (nhánh: Không liên lạc được, Từ chối)
│   ├── Nhập học → tạo học sinh, phụ huynh và tài khoản App (chuyển sang mục 4)
│   └── Lịch tham quan (danh sách theo ngày)
├── 10. BÁO CÁO & DASHBOARD HQ  (Lãnh đạo hệ thống, BGH)                            [Đ2]
│   ├── Sĩ số và chuyên cần (theo cơ sở/lớp, theo ngày/tháng)
│   ├── Học phí (phải thu, đã thu, còn nợ; theo tháng và cơ sở)
│   ├── Nhân sự (sĩ số GV, đi làm/nghỉ, tăng ca)                       [cần dữ liệu từ Đ3]
│   ├── Tuyển sinh (số lead, đã tham quan, nhập học, tỷ lệ chuyển đổi, theo nguồn)
│   └── Xuất báo cáo (ghi nhật ký)
├── 11. GIÁO ÁN  (GV nộp, BGH duyệt)                                                [Đ3]
│   ├── Nộp giáo án (tuần/tháng; tải file Word/PDF; ghi chú)
│   ├── Danh sách giáo án của tôi (Đã nộp / Đã duyệt / Cần sửa) · lịch sử phiên bản
│   ├── Duyệt giáo án (BGH: xem, duyệt hoặc trả lại kèm nhận xét)
│   ├── Khung chương trình theo khối tuổi (xem)
│   └── Kho tài nguyên giảng dạy (bài hát, trò chơi, video, tài liệu dùng chung)
├── 12. NHÂN SỰ  (BGH, Văn phòng)                                                   [Đ3]
│   ├── Danh sách nhân sự (vai trò, cơ sở, lớp)
│   ├── Phân công (GVCN, GV năng khiếu, bảo mẫu theo lớp và ca)
│   ├── Ca làm việc (danh mục ca)
│   ├── Chấm công (nhân viên tự chấm tại cơ sở · BGH xác nhận ngoại lệ)  (giả định)
│   ├── Tăng ca (đăng ký · BGH duyệt)
│   └── Bảng công tháng (xem · khóa sổ · xuất file cho kế toán)
└── 13. QUẢN TRỊ HỆ THỐNG  (chỉ Quản trị hệ thống)
    ├── Tài khoản nhân sự (tạo, gán vai trò và phạm vi, khóa / mở, đặt lại mật khẩu)  (giả định: BGH cơ sở chỉ khóa/mở và gán lớp)
    ├── Danh mục: cơ sở · lớp · khối · năm học · loại khoản thu
    ├── Cấu hình: giờ làm việc của chat · hạn nộp giáo án · thời gian lưu ảnh · mẫu thông báo
    ├── Nhà cung cấp OTP / Zalo / SMS (khóa API)
    └── Nhật ký hoạt động (ai xem, sửa, xuất gì, lúc nào)
```

## 4. Quyền theo vai trò

| Mục | GVCN | GV năng khiếu / Bảo mẫu | Y tế | Bếp | Kế toán | Văn phòng | BGH cơ sở | Lãnh đạo HT |
|---|---|---|---|---|---|---|---|---|
| Lớp của tôi (điểm danh, nhật ký) | Lớp mình | Lớp/ca được giao (giới hạn) | Không | Không | Không | Không | Xem toàn cơ sở | Không |
| Đón trả | Quét QR | Quét QR (nếu được giao) | Không | Không | Không | Xem | Xem, xử lý ngoại lệ | Không |
| Học sinh & Phụ huynh | Xem lớp mình | Xem lớp được giao | Xem bé có dị ứng/thuốc | Chỉ danh sách dị ứng | Xem để thu phí | Quản lý | Xem | Không |
| Y tế | Xem lớp mình | Không | Quản lý | Chỉ dị ứng | Không | Không | Xem | Không |
| Thực đơn | Xem | Xem | Xem | Quản lý | Không | Không | Duyệt/xem | Không |
| Thông báo & Tin nhắn | Chat lớp mình | Không | Không | Không | Không | Gửi thông báo cơ sở | Gửi, xem chat (có nhật ký) | Không |
| Thu phí | Không | Không | Không | Không | Quản lý | Xem | Xem | Xem báo cáo |
| CRM tuyển sinh [Đ2] | Không | Không | Không | Không | Xem | Quản lý | Quản lý | Xem báo cáo |
| Báo cáo & Dashboard [Đ2] | Lớp mình | Không | Không | Không | Báo cáo thu | Báo cáo cơ sở | Cơ sở mình | **Toàn hệ thống** |
| Giáo án [Đ3] | Nộp của mình | Nộp của mình | Không | Không | Không | Xem | **Duyệt** | Xem |
| Nhân sự [Đ3] | Chấm công của mình | Chấm công của mình | Chấm công của mình | Chấm công của mình | Chấm công của mình | Xem | **Xác nhận, duyệt** | Xem báo cáo |
| Quản trị hệ thống | Không | Không | Không | Không | Không | Không | Khóa/mở, gán lớp | Không |

Lãnh đạo hệ thống: chỉ xem, không sửa dữ liệu gốc. Quản trị hệ thống có toàn quyền ở mục 13 và đọc được mọi dữ liệu để hỗ trợ (mọi truy cập đều ghi nhật ký).

## 5. Luồng trạng thái

- **Đơn dặn thuốc:** `Đã gửi → Cô đã nhận → Đã cho uống` (nhánh phụ: `Cần liên hệ`, `Từ chối`). Y tế hoặc GVCN thực hiện.
- **Xin nghỉ:** `Chờ xác nhận → Đã xác nhận` (nhánh phụ: `Từ chối`).
- **Điểm danh:** `Chưa điểm danh → Có mặt / Vắng có phép / Vắng không phép`; giờ về ghi khi quét QR đón.
- **Khoản phải thu:** `Chưa đóng → Đã đóng` (nhánh phụ: `Quá hạn`, `Miễn giảm`, `Hủy`).
- **Lead tuyển sinh:** `Mới → Đã liên hệ → Đã hẹn tham quan → Đã tham quan → Đã nộp hồ sơ → Nhập học` (nhánh phụ: `Không liên lạc được`, `Từ chối`).
- **Giáo án:** `Nháp → Đã nộp → Đã duyệt` (nhánh phụ: `Cần sửa` → nộp lại).
- **Bảng công tháng:** `Đang ghi → Chờ xác nhận → Đã khóa sổ`.

## 6. Quan hệ với App Phụ huynh

| Hành động trong Portal | Hiện trong App Phụ huynh |
|---|---|
| Nhập nhật ký, ảnh | Mục Nhật ký |
| Quét QR, ghi giờ đón | Lịch sử đến/về; Hôm nay |
| Xác nhận xin nghỉ | Trạng thái đơn xin nghỉ |
| Xác nhận/ghi nhận cho uống thuốc | Trạng thái đơn dặn thuốc |
| Nhập chỉ số tăng trưởng, tiêm chủng | Mục Sức khỏe |
| Đăng thực đơn | Mục Thực đơn |
| Gửi thông báo, trả lời chat | Mục Thông báo, Tin nhắn |
| Tạo khoản phải thu, ghi nhận đã thu, xuất biên lai | Mục Học phí |
| Nhập học (CRM), tạo tài khoản App | Phụ huynh đăng nhập được bằng OTP |

## 7. Yêu cầu chung

- Nhật ký hoạt động: ghi xem/sửa/xuất dữ liệu nhạy cảm; xuất file (danh sách học sinh, công nợ, bảng công) luôn ghi nhật ký.
- Dữ liệu trẻ em và nhân sự là dữ liệu cá nhân: kiểm tra quyền theo (người dùng, cơ sở, lớp) ở mọi API; ảnh lưu 6 tháng; hồ sơ chưa nhập học lưu tối đa 3 tháng.
- Mobile-first cho giáo viên: điểm danh cả lớp và nhập nhật ký trong vài chạm; lưu nháp, gửi lại khi có mạng; vùng chạm tối thiểu 44px.
- Mật khẩu băm bcrypt/Argon2; xác thực hai bước bắt buộc cho BGH, kế toán, lãnh đạo, quản trị; giới hạn đăng nhập sai; phiên có hạn.
- Upload (ảnh, giáo án, giấy tờ): giới hạn loại và dung lượng; nội dung nhập vào được thoát ký tự để chống XSS.
- Mọi hành động xóa/hủy (biên lai, khoản thu, học sinh) cần xác nhận và lý do, không xóa cứng dữ liệu tài chính.

## 8. Giả định tạm (cần xác nhận)

| # | Giả định | Câu hỏi gốc (`scope.md` mục 10) |
|---|---|---|
| 1 | Không dùng EMIS song song; Portal độc lập, nhập dữ liệu trực tiếp | Câu 1 |
| 2 | Chấm công: nhân viên tự chấm tại cơ sở (QR cơ sở đổi theo ngày), BGH xác nhận ngoại lệ; tăng ca phải đăng ký và BGH duyệt | Câu 2 |
| 3 | **Chuyên cần** = số ngày có mặt / số ngày học theo lịch. **Tỷ lệ chuyển đổi** = số nhập học / số lead tạo trong cùng kỳ | Câu 3 |
| 4 | Website gọi API Portal để tạo lead; trong đợt 1 CMS vẫn xử lý lead, sang đợt 2 chuyển dữ liệu sang Portal một lần | Câu 4 |
| 5 | Quản trị hệ thống tạo tài khoản nhân sự; BGH cơ sở chỉ khóa/mở và gán lớp trong cơ sở mình | Câu 5 |
| 6 | Giáo án nộp theo tuần (hoặc tháng), hạn do BGH cấu hình; file PDF/DOC/DOCX tối đa 10MB; GV chỉ xem giáo án của mình, BGH xem trong cơ sở | Câu 6 |
| 7 | Giáo viên năng khiếu/bảo mẫu chỉ nhập điểm danh và nhật ký phần được giao; không chat phụ huynh | (mới) |
| 8 | Nhà bếp chỉ thấy tên bé và món cần tránh, không thấy thông tin liên hệ phụ huynh | (mới) |
| 9 | Lãnh đạo hệ thống xem được báo cáo tổng hợp, không xem chi tiết chat hay ảnh của bé | (mới) |

## 9. Giao diện demo

`demo_staff.html` (mở bằng web server tĩnh; hash route `#/trang`). Giáo viên dùng bố cục điện thoại, BGH/kế toán dùng bố cục máy tính.

- Đăng nhập chọn vai trò dùng thử; vai trò BGH, kế toán, lãnh đạo, quản trị cần mã xác thực hai bước (6 số bất kỳ). Công tắc "Xem thử với vai trò" để đổi vai trò, menu và quyền thay đổi theo ma trận mục 4.
- Có đủ 13 mục ở mục 3, cả 3 đợt (Đ1-Đ3) để xem thử toàn bộ thiết kế: Điểm danh, Nhật ký, Xin nghỉ, Dặn thuốc, Quét QR đón (thử hợp lệ, hết hạn, đã dùng, đón hộ), Học sinh, Y tế, Thực đơn, Thông báo/Chat, Thu phí (ghi nhận thu, hủy biên lai có lý do), CRM (nhập học tạo học sinh), Dashboard HQ, Giáo án, Chấm công/Tăng ca/Bảng công, Quản trị, Nhật ký hoạt động.
- Dữ liệu là mẫu trong bộ nhớ trình duyệt, chưa có backend. Các thao tác ghi vào Nhật ký hoạt động (xem được ở vai trò Quản trị hệ thống).