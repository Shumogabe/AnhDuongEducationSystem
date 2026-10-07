# Sitemap Website (Portal công khai) - Hệ thống Giáo dục Mầm non Ánh Dương

> Cập nhật theo `demo_portal.html` (SPA một file, định tuyến bằng hash `#/trang[/tham-số]`, ví dụ `#/campuses/quynhon`, `#/article/trung-thu`).
> Ký hiệu: ✅ đã có giao diện · 🟡 có giao diện nhưng dùng dữ liệu/ảnh mẫu hoặc chưa kết nối backend · ❌ chưa có.

## 1. Cây sitemap và mức độ hoàn thiện giao diện

```
HOME  #/home                                                  ✅
├── Hero + bộ chọn 4 cơ sở                                    🟡 ảnh hero là khung giữ chỗ
├── 3 Trụ cột giáo dục, 2 hệ chương trình, 4 bước nhập học    ✅
├── Đội ngũ giáo viên                                         🟡 khung giữ chỗ
├── Chia sẻ của phụ huynh                                     🟡 nội dung mẫu
├── Đơn vị đồng hành                                          🟡 chưa có logo chính thức
├── Dải "Đăng ký ngay", đăng ký bản tin (báo lỗi email, chưa gửi thật) ✅/🟡
├── Thư viện ảnh (khung giữ chỗ)                              🟡
└── Footer (danh mục, tiện ích, liên hệ, chính sách bảo mật)  ✅
1. GIỚI THIỆU  #/about                                        ✅
│ ├── Sứ mệnh - Tầm nhìn - Giá trị cốt lõi                    ✅
│ ├── Câu chuyện thương hiệu                                  🟡 nội dung mẫu
│ ├── Ban quản trị                                            🟡
│ ├── Hội đồng chuyên môn                                     🟡 họ tên đang cập nhật
│ └── Hệ thống 4 cơ sở (nút tới từng cơ sở)                   ✅
2. CƠ SỞ TRƯỜNG  #/campuses, #/campuses/{phutho1|phutho2|quynhon|nhatrang}   ✅
│ ├── Danh sách 4 cơ sở                                       ✅ (ảnh Unsplash tạm)
│ ├── Tab Tổng quan: 6 tiện ích, gallery, tham quan ảo 360°   🟡 khung giữ chỗ
│ ├── Tab Đội ngũ: Ban giám hiệu, giáo viên các khối          🟡 họ tên/ảnh đang cập nhật
│ ├── Tab Liên hệ & Bản đồ: địa chỉ, hotline, Google Maps, Chỉ đường ✅ (hotline dùng chung toàn hệ thống)
│ └── Tab Học phí & Ưu đãi                                    🟡 số liệu minh họa
3. CHƯƠNG TRÌNH HỌC  #/programs                               ✅
│ ├── 4 thẻ khối tuổi                                         ✅
│ ├── Chi tiết từng khối #/program/{nhatre|mgbe|mgnho|mglon}: mục tiêu, hoạt động, lịch ngày ✅ (nội dung mẫu)
│ └── Năng khiếu & Tiếng Anh (4 môn)                          🟡 nội dung mẫu
4. DINH DƯỠNG & Y TẾ  #/nutrition                             ✅
│ ├── Thực đơn tuần chọn theo cơ sở và theo ngày              🟡 thực đơn mẫu
│ ├── Theo dõi y tế                                           ✅
│ └── Quy trình an toàn & Đón trả trẻ (4 bước)                🟡 nội dung mẫu
5. TIN TỨC & SỰ KIỆN  #/news                                  ✅
│ ├── Danh sách, lọc theo 4 danh mục, phân trang              ✅ (6 bài mẫu)
│ ├── Chi tiết bài #/article/{id} + bài liên quan             ✅
│ └── Thư viện Ảnh & Video #/gallery (album lọc theo cơ sở, video giới thiệu) 🟡 khung giữ chỗ
6. TUYỂN SINH  #/admissions                                   ✅
│ ├── Form đặt lịch tham quan (4 trường, báo lỗi từng ô, chống spam) 🟡 chưa gửi về backend
│ ├── Quy trình nhập học 6 bước                               ✅
│ ├── Bảng phí & Học bổng                                     🟡 số liệu minh họa
│ ├── Câu hỏi thường gặp (FAQ)                                ✅
│ └── Trang cảm ơn #/thanks                                   ✅
7. TUYỂN DỤNG  #/careers                                      ✅
│ ├── Danh sách 3 vị trí mẫu                                  ✅
│ └── Chi tiết vị trí #/job/{id} + form ứng tuyển, tải CV (PDF/DOC/DOCX, ≤ 5MB) 🟡 chưa gửi về backend
8. CỔNG TIỆN ÍCH                                              🟡
│ ├── Đăng nhập App Sổ liên lạc Phụ huynh (modal)             🟡 modal giả lập
│ └── Đăng nhập Portal Cán bộ / Giáo viên (modal)             🟡 modal giả lập
TOÀN CỤC
├── Top bar, header cố định, menu desktop + hamburger         ✅
├── Bottom navigation mobile, cột nút nổi                     ✅
├── Liên hệ #/contact (form + danh sách cơ sở)                🟡 chưa gửi về backend
├── Chính sách bảo mật #/privacy                              🟡 bản nháp, cần rà soát pháp lý
├── Trang 404 #/notfound (route sai hoặc tham số sai)         ✅
├── Công tắc ngôn ngữ VI/EN                                   🟡 mới dịch khung giao diện (menu, footer, nút, tiêu đề trang chính); nội dung bài viết/CMS cần song ngữ
└── SEO: title và meta description đổi theo trang, Open Graph cơ bản ✅ (cần SSR hoặc prerender khi lên production)
```

## 2. Tổng hợp

| Trang | Trạng thái | Việc còn lại |
|---|---|---|
| Trang chủ | Gần đủ | Ảnh thật, giáo viên, logo đối tác, gửi bản tin |
| Giới thiệu | Đủ giao diện | Nội dung chính thức, họ tên Ban quản trị / Hội đồng |
| Cơ sở | Đủ giao diện | Dữ liệu thật từng cơ sở (ảnh, đội ngũ, hotline riêng, học phí) |
| Chương trình | Đủ giao diện | Nội dung chính thức theo khung chương trình |
| Dinh dưỡng | Đủ giao diện | Thực đơn thật theo cơ sở và tuần |
| Tin tức | Đủ giao diện | Bài viết thật; Thư viện ảnh thật |
| Tuyển sinh | Đủ giao diện | Mức phí chính thức; gửi form về backend |
| Tuyển dụng | Đủ giao diện | Tin tuyển dụng thật; gửi hồ sơ + CV về backend |
| Toàn cục | Đủ khung | Nội dung tiếng Anh đầy đủ, rà soát pháp lý chính sách bảo mật |

Kết luận: toàn bộ giao diện theo sitemap đã có trong demo. Phần còn lại chủ yếu là **nội dung thật** (ảnh, văn bản, số liệu) và **kết nối backend**.

## 3. Đối chiếu với Backend

| Mục Backend | Chỗ hiển thị trên website | Giao diện |
|---|---|---|
| Trang chủ (hero, 3 trụ cột, 2 hệ, 4 bước, chia sẻ, đối tác, dải CTA) | Trang chủ | ✅ |
| Giới thiệu hệ thống | Giới thiệu | ✅ |
| Cơ sở trường (thông tin, tiện ích, đội ngũ, học phí) | Chi tiết cơ sở (4 tab) | ✅ |
| Thực đơn tuần theo cơ sở, quy trình y tế - an toàn | Dinh dưỡng | ✅ |
| Tin tức, danh mục, thư viện ảnh/video | Tin tức, Thư viện | ✅ |
| Đăng ký tham quan | Tuyển sinh (form) | ✅ giao diện, chưa kết nối |
| Bảng phí & Học bổng, FAQ | Tuyển sinh | ✅ |
| Tin tuyển dụng, hồ sơ ứng tuyển | Tuyển dụng, chi tiết vị trí | ✅ giao diện, chưa kết nối |
| Người đăng ký bản tin | Form bản tin trang chủ | ✅ giao diện, chưa kết nối |
| Hộp thư liên hệ | Trang Liên hệ | ✅ giao diện, chưa kết nối |
| Cài đặt: liên hệ chung và theo cơ sở | Top bar, footer, nút nổi, tab Liên hệ | 🟡 gắn cứng trong HTML |
| Cài đặt: liên kết cổng | 2 nút đăng nhập | 🟡 modal giả lập |
| SEO | Meta theo trang | ✅ |

Quyết định đã xác nhận: **website có cả tiếng Việt và tiếng Anh**; tên cơ sở chính thức **"Quy Nhơn Nam - Gia Lai"**; bài của Quản trị cơ sở cần Quản trị hệ thống duyệt; hồ sơ lưu tối đa 3 tháng.

## 4. Việc tiếp theo

1. Thay dữ liệu mẫu bằng nội dung thật (ảnh, thực đơn, học phí, đội ngũ).
2. Chuyển demo sang React (cấu trúc route như trên) và kết nối API backend.
3. Dịch đầy đủ sang tiếng Anh theo trường song ngữ của CMS.
4. Hotline/email theo từng cơ sở (hiện dùng chung một số).
