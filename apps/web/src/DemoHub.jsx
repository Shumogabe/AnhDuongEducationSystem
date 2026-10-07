import { Link } from 'react-router-dom';
import logo from './assets/logo.png';
import { PARENT_APP_URL } from './shared/data.js';

const ITEMS = [
  { to: '/', icon: 'fa-globe', title: 'Website công khai', text: 'Trang giới thiệu, tuyển sinh, tin tức cho phụ huynh.' },
  { to: '/admin', icon: 'fa-gauge', title: 'CMS quản trị website', text: 'Quản lý nội dung, tin tức, tuyển dụng, kết nối CRM.' },
  { to: '/portal', icon: 'fa-chalkboard-user', title: 'Portal Giáo viên / BGH', text: 'Điểm danh, nhật ký, đón trả, thu phí, CRM, báo cáo.' },
  { href: PARENT_APP_URL, icon: 'fa-mobile-screen', title: 'App Phụ huynh (WebApp)', text: 'Bản mobile chạy bằng Expo, mở cổng 8081 (xem hướng dẫn).' },
];

export default function DemoHub() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl space-y-8 px-4 py-12">
      <div className="space-y-3 text-center">
        <img src={logo} alt="Ánh Dương" className="mx-auto h-14 w-auto" />
        <h1 className="text-2xl font-bold">Bộ demo Hệ thống Giáo dục Mầm non Ánh Dương</h1>
        <p className="text-sm text-gray-500">Chọn ứng dụng để xem. Dữ liệu là mẫu, chưa kết nối máy chủ.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((i) => {
          const body = (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint2 text-xl text-brand-primary"><i className={`fa-solid ${i.icon}`} /></span>
              <span className="block text-base font-bold">{i.title}</span>
              <span className="block text-xs leading-relaxed text-gray-600">{i.text}</span>
            </>
          );
          const cls = 'space-y-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-brand-primary hover:shadow-md';
          return i.href ? <a key={i.title} href={i.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a> : <Link key={i.title} to={i.to} className={cls}>{body}</Link>;
        })}
      </div>
    </div>
  );
}
