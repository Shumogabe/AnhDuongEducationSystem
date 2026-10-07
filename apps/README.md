# Ứng dụng demo - Hệ thống Giáo dục Mầm non Ánh Dương

Hai ứng dụng React dùng để demo cho khách hàng. Dữ liệu là mẫu trong bộ nhớ, chưa kết nối máy chủ. Các bản HTML một file (`../demo_*.html`) giữ lại để tham chiếu thiết kế.

| Thư mục | Công nghệ | Nội dung |
|---|---|---|
| `web/` | React + Vite + Tailwind + React Router | Website công khai, CMS quản trị, Portal Giáo viên/BGH |
| `mobile/` | React Native + Expo (SDK 57) + React Navigation | App Phụ huynh |

## Chạy web

```bash
cd apps/web
npm install        # lần đầu
npm run dev        # http://localhost:5173
```

Địa chỉ dùng hash (`#/...`), nên không cần cấu hình máy chủ khi triển khai tĩnh (`npm run build` → thư mục `dist/`).

| Đường dẫn | Màn hình |
|---|---|
| `/#/` | Website công khai (Việt/Anh) |
| `/#/admin` | CMS quản trị. Đăng nhập: email hợp lệ bất kỳ, mật khẩu bất kỳ. Ô "Xem thử với vai trò" đổi giữa Quản trị hệ thống và Quản trị cơ sở |
| `/#/portal` | Portal Giáo viên/BGH. Chọn vai trò lúc đăng nhập; BGH, kế toán, lãnh đạo, quản trị cần mã 6 số bất kỳ |
| `/#/demo` | Trang chọn nhanh 4 ứng dụng |

## Chạy app Phụ huynh (React Native)

```bash
cd apps/mobile
npm install        # lần đầu
npx expo start     # hiện mã QR
```

- **Trên điện thoại:** cài **Expo Go** (App Store / CH Play), laptop và điện thoại cùng Wi-Fi, quét mã QR. Android quét trong Expo Go, iPhone quét bằng Camera.
- **Dự phòng khi mạng lỗi:** `npx expo start --web` (hoặc nhấn `w`) chạy cùng mã nguồn trên trình duyệt, nên thu nhỏ cửa sổ ở chiều rộng điện thoại.
- Nếu điện thoại không thấy máy tính: `npx expo start --tunnel` (cần cài thêm `@expo/ngrok`, hoặc dùng Wi-Fi/hotspot khác).
- Số điện thoại dùng thử: `0905123456` (Phụ huynh chính, 2 bé), `0912345678` (Người thân). OTP là 6 số bất kỳ.

## Cấu trúc

```
apps/web/src
  shared/     UI dùng chung (ui.jsx), tiện ích kiểm tra form (format.js), dữ liệu mẫu (data.js)
  site/       Website công khai (layout, trang, form, đa ngôn ngữ)
  admin/      CMS quản trị (store, các trang nội dung và tuyển sinh/tuyển dụng)
  staff/      Portal Giáo viên/BGH (store, phân quyền theo vai trò, các trang)
apps/mobile
  App.js      Điều hướng (tab + stack)
  src/        data.js, store.js, theme.js, ui.js, screens/
```

## Lưu ý khi chuyển sang sản phẩm thật

- Dữ liệu và đăng nhập đang giả lập: cần API backend (.NET), xác thực OTP/email, phân quyền kiểm tra ở máy chủ.
- Form chưa gửi dữ liệu đi; nút thanh toán chỉ mô phỏng.
- Website là SPA nên SEO cần render phía máy chủ hoặc prerender khi lên production.
- Thanh toán, hóa đơn VAT, thông báo đẩy nằm ngoài phạm vi bản demo (xem `../.structure/`).
