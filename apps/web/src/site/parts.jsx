import { useEffect } from 'react';
import { useLang } from './i18n.jsx';

export const PAGE_META = {
  home: ['Hệ Thống Giáo Dục Mầm Non Ánh Dương', 'Hệ thống mầm non Ánh Dương: 4 cơ sở tại Phú Thọ, Quy Nhơn Nam, Nha Trang. Đặt lịch tham quan trường hôm nay.'],
  about: ['Giới Thiệu | Mầm Non Ánh Dương', 'Câu chuyện thương hiệu, sứ mệnh, tầm nhìn, giá trị cốt lõi và ban quản trị hệ thống mầm non Ánh Dương.'],
  campuses: ['Hệ Thống Cơ Sở | Mầm Non Ánh Dương', 'Thông tin 4 cơ sở: địa chỉ, tiện ích, đội ngũ, bản đồ và học phí.'],
  programs: ['Chương Trình Học | Mầm Non Ánh Dương', 'Chương trình theo độ tuổi từ Nhà trẻ đến Mẫu giáo Lớn, cùng các môn Năng khiếu và Tiếng Anh.'],
  nutrition: ['Dinh Dưỡng & Y Tế | Mầm Non Ánh Dương', 'Thực đơn tuần theo cơ sở, theo dõi y tế, quy trình an toàn và đón trả trẻ.'],
  news: ['Tin Tức & Hoạt Động | Mầm Non Ánh Dương', 'Tin hệ thống, sự kiện, hoạt động và góc chuyên gia nuôi dạy con.'],
  gallery: ['Thư Viện Ảnh & Video | Mầm Non Ánh Dương', 'Album ảnh hoạt động theo từng cơ sở.'],
  admissions: ['Tuyển Sinh 2026 - 2027 | Mầm Non Ánh Dương', 'Đặt lịch tham quan, quy trình nhập học, bảng phí, học bổng và câu hỏi thường gặp.'],
  careers: ['Tuyển Dụng | Mầm Non Ánh Dương', 'Cơ hội nghề nghiệp tại hệ thống mầm non Ánh Dương.'],
  contact: ['Liên Hệ | Mầm Non Ánh Dương', 'Gửi câu hỏi hoặc liên hệ Ban quản trị và các cơ sở của hệ thống Ánh Dương.'],
  privacy: ['Chính Sách Bảo Mật | Mầm Non Ánh Dương', 'Cách hệ thống Ánh Dương thu thập, sử dụng và lưu trữ dữ liệu cá nhân.'],
  thanks: ['Cảm Ơn | Mầm Non Ánh Dương', 'Chúng tôi đã nhận thông tin của bạn.'],
  notfound: ['Không Tìm Thấy Trang | Mầm Non Ánh Dương', 'Trang bạn tìm không tồn tại.'],
};

/** Đặt title và meta description theo trang. */
export function usePageMeta(key, titleOverride) {
  useEffect(() => {
    const [title, desc] = PAGE_META[key] || PAGE_META.home;
    document.title = titleOverride ? `${titleOverride} | Mầm Non Ánh Dương` : title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  }, [key, titleOverride]);
}

export function Wave({ bg, color }) {
  return (
    <div className={`${bg} ${color} leading-none`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="currentColor" className="block w-full" style={{ height: 'clamp(28px, 5vw, 64px)' }}>
        <path d="M0,40 C180,90 360,0 540,35 C720,70 900,5 1080,35 C1260,65 1350,30 1440,45 L1440,80 L0,80 Z" />
      </svg>
    </div>
  );
}

export function PhotoSlot({ icon = 'fa-image', className = 'h-48', children }) {
  return (
    <div className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-tint3 bg-brand-tint text-brand-primary ${className}`}>
      <i className={`fa-solid ${icon} text-2xl`} />
      <span className="px-3 text-center text-xs font-semibold">{children}</span>
    </div>
  );
}

export function PageHead({ eyebrow, title, sub }) {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <span className="text-xs font-semibold uppercase text-brand-primary">{eyebrow}</span>}
      <h1 className="mt-2 text-3xl font-bold text-gray-900">{t(title)}</h1>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

export const Wrap = ({ children, className = 'max-w-7xl', space = 'space-y-8' }) => (
  <div className={`mx-auto px-4 py-12 sm:px-6 lg:px-8 ${className} ${space}`}>{children}</div>
);
