# Sitemap Backend (Quản trị) - Hệ thống Giáo dục Mầm non Ánh Dương

## 1. Phạm vi giai đoạn 1

| Có trong backend                | Không làm trong backend này                                         |
| ------------------------------- | ------------------------------------------------------------------- |
| CMS nội dung website            | Sổ liên lạc, nhật ký ăn ngủ, điểm danh                              |
| Đăng ký tham quan và tuyển sinh | Giáo án, báo cáo của giáo viên                                      |
| Tuyển dụng                      | Học phí, thanh toán                                                 |
| Bản tin email và liên hệ        | Đăng nhập một lần (SSO) cho App Phụ huynh / Portal (để giai đoạn 2) |

App Phụ huynh và Portal Giáo viên/BGH là hệ thống riêng. Backend này **chỉ lưu địa chỉ liên kết** để hai nút "Đăng nhập" trên website trỏ tới (mục Cài đặt → Liên kết cổng).

## 2. Vai trò và phạm vi dữ liệu

| Vai trò               | Phạm vi                           | Ghi chú                                          |
| --------------------- | --------------------------------- | ------------------------------------------------ |
| **Quản trị hệ thống** | Toàn bộ 4 cơ sở và nội dung chung | Quản lý người dùng, cài đặt, nội dung dùng chung |
| **Quản trị cơ sở**    | Chỉ dữ liệu của cơ sở được gán    | Không xem và không sửa dữ liệu cơ sở khác        |

Quy tắc dữ liệu: mỗi bản ghi có trường **cơ sở**. Bản ghi để trống cơ sở là nội dung chung của cả hệ thống, chỉ Quản trị hệ thống được sửa.

## 3. Cây sitemap

```
BACKEND (Trang quản trị)
├── 0. ĐĂNG NHẬP & TÀI KHOẢN CỦA TÔI
│   ├── Đăng nhập / Quên mật khẩu
│   └── Hồ sơ cá nhân & Đổi mật khẩu
├── 1. BẢNG ĐIỀU KHIỂN (Dashboard)
│   ├── Số đăng ký tham quan mới (lọc theo cơ sở)
│   ├── Hồ sơ ứng tuyển chưa xem
│   └── Bài viết chờ xuất bản
├── 2. NỘI DUNG (CMS)
│   ├── Trang chủ
│   │   ├── Hero & ảnh nền
│   │   ├── 3 Trụ cột giáo dục
│   │   ├── Hai hệ chương trình (Cambridge / Chất lượng cao)
│   │   ├── Hành trình nhập học (4 bước)
│   │   ├── Chia sẻ của phụ huynh
│   │   ├── Đơn vị đồng hành (logo đối tác)
│   │   └── Dải kêu gọi "Đăng ký ngay"
│   ├── Giới thiệu hệ thống (Sứ mệnh, tầm nhìn, Ban quản trị)
│   ├── Cơ sở trường (theo từng cơ sở)
│   │   ├── Thông tin & địa chỉ, bản đồ
│   │   ├── Tiện ích cơ sở vật chất
│   │   ├── Đội ngũ Ban giám hiệu & Giáo viên
│   │   └── Khung học phí & chính sách ưu đãi
│   ├── Chương trình học (Nhà trẻ, MG Bé, MG Nhỡ, MG Lớn, Năng khiếu & Tiếng Anh)
│   ├── Dinh dưỡng & Y tế
│   │   ├── Thực đơn tuần (theo cơ sở)
│   │   └── Quy trình y tế, an toàn, đón trả trẻ
│   ├── Tin tức & Sự kiện
│   │   ├── Bài viết (nháp / chờ duyệt / xuất bản)
│   │   └── Danh mục: Tin hệ thống, Hoạt động, Góc chuyên gia
│   ├── Thư viện Ảnh & Video (theo cơ sở, album)
│   └── Thư viện phương tiện (kho ảnh, tài liệu dùng chung)
├── 3. TUYỂN SINH
│   ├── Đăng ký tham quan / nhập học
│   │   ├── Danh sách (lọc: cơ sở, trạng thái, ngày)
│   │   ├── Chi tiết & ghi chú xử lý
│   │   └── Xuất file danh sách
│   ├── Nội dung tuyển sinh
│   │   ├── Quy trình đăng ký nhập học
│   │   ├── Bảng phí & Học bổng
│   │   └── Câu hỏi thường gặp (FAQ)
│   └── Cấu hình form & thông báo (email nhận đăng ký theo cơ sở)
├── 4. TUYỂN DỤNG
│   ├── Tin tuyển dụng (vị trí, cơ sở, hạn nộp, trạng thái)
│   └── Hồ sơ ứng tuyển (danh sách, xem CV, đổi trạng thái)
├── 5. BẢN TIN & LIÊN HỆ
│   ├── Người đăng ký bản tin (danh sách, xuất file, hủy đăng ký)
│   ├── Soạn & gửi bản tin (giai đoạn 1: xuất danh sách để gửi qua dịch vụ ngoài)
│   └── Hộp thư liên hệ (nếu có form liên hệ)
├── 6. NGƯỜI DÙNG & PHÂN QUYỀN  (chỉ Quản trị hệ thống)
│   ├── Tài khoản quản trị
│   ├── Gán vai trò & cơ sở
│   └── Khóa / mở tài khoản
├── 7. CÀI ĐẶT  (phần chung: chỉ Quản trị hệ thống)
│   ├── Thông tin liên hệ chung (Hotline, Zalo, Messenger, Email)
│   ├── Thông tin liên hệ theo cơ sở
│   ├── Liên kết cổng (đường dẫn App Phụ huynh, Portal Giáo viên/BGH)
│   ├── Menu website & Logo
│   └── SEO & mạng xã hội
└── 8. NHẬT KÝ HOẠT ĐỘNG  (chỉ Quản trị hệ thống)
    └── Ai sửa gì, lúc nào
```

## 4. Quyền theo vai trò

| Mục                                                      | Quản trị hệ thống | Quản trị cơ sở                     |
| -------------------------------------------------------- | ----------------- | ---------------------------------- |
| Bảng điều khiển                                          | Toàn hệ thống     | Cơ sở của mình                     |
| Trang chủ, Giới thiệu, Chương trình học (nội dung chung) | Xem, sửa          | Chỉ xem                            |
| Cơ sở trường                                             | Mọi cơ sở         | Chỉ cơ sở của mình                 |
| Thực đơn tuần, Thư viện ảnh                              | Mọi cơ sở         | Chỉ cơ sở của mình                 |
| Tin tức                                                  | Mọi bài           | Bài của cơ sở mình (xem câu hỏi 1) |
| Đăng ký tham quan / tuyển sinh                           | Tất cả            | Chỉ đăng ký vào cơ sở mình         |
| Bảng phí & Học bổng, FAQ                                 | Sửa chung         | Sửa phần của cơ sở mình            |
| Tuyển dụng, hồ sơ ứng tuyển                              | Tất cả            | Chỉ vị trí và hồ sơ của cơ sở mình |
| Bản tin và liên hệ                                       | Tất cả            | Không (chỉ nhận thông báo)         |
| Người dùng, Cài đặt, Nhật ký                             | Có                | Không                              |

## 5. Luồng trạng thái đăng ký tuyển sinh

`Mới → Đã liên hệ → Đã hẹn tham quan → Đã tham quan → Đã nộp hồ sơ → Nhập học` (nhánh phụ: `Không liên lạc được`, `Từ chối`)

Trường lấy từ form website: Họ tên phụ huynh, Số điện thoại, Cơ sở, Tên và tuổi của bé.

## 6. Yêu cầu chung

- Dữ liệu cá nhân (phụ huynh, ứng viên): chỉ người có quyền xem; ghi nhật ký khi xuất file; có chính sách thời gian lưu.
- Form công khai (đăng ký tham quan, bản tin, ứng tuyển): chống spam; ứng tuyển giới hạn loại và dung lượng file.
- Mật khẩu băm bằng bcrypt; hỗ trợ xác thực hai bước cho Quản trị hệ thống (đề xuất).
- Mọi hành động sửa, xóa, xuất dữ liệu đều vào Nhật ký hoạt động.

## 7. Cần xác nhận

1. Quản trị cơ sở đăng tin tức thì được xuất bản ngay, hay cần Quản trị hệ thống duyệt? - cần quản trị hệ thống duyệt
2. Gửi bản tin email: dùng dịch vụ ngoài (như Mailchimp, Brevo) hay chỉ lưu danh sách và xuất file? -
3. Website chỉ có tiếng Việt, hay cần thêm tiếng Anh (ví dụ cho hệ Cambridge)?
4. Hồ sơ ứng tuyển và đăng ký tuyển sinh lưu tối đa bao lâu trước khi xóa?
