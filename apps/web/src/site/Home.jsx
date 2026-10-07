import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CAMPUSES } from '../shared/data.js';
import { isEmail } from '../shared/format.js';
import { useToast } from '../shared/ui.jsx';
import { useLang } from './i18n.jsx';
import { PhotoSlot, usePageMeta, Wave } from './parts.jsx';

const STEPS = [
  ['fa-headset', 'Tư vấn tuyển sinh', 'Phụ huynh trao đổi với nhà trường.'],
  ['fa-puzzle-piece', 'Học trải nghiệm', 'Bé học thử cùng cô và các bạn.'],
  ['fa-file-signature', 'Đăng ký và nộp hồ sơ', 'Hoàn thiện hồ sơ nhập học.'],
  ['fa-school', 'Nhập học', 'Bé chính thức đến lớp.'],
];
const PILLARS = [
  ['fa-child', 'text-brand-primary', 'Lấy Trẻ Làm Trung Tâm', 'Tôn trọng sự phát triển cá thể, lắng nghe và khuyến khích bé tự do sáng tạo.'],
  ['fa-heart', 'text-brand-gold', 'Lấy Yêu Thương Làm Cốt Lõi', 'Cô giáo là người mẹ thứ hai, tạo cho con cảm giác an toàn như ở nhà.'],
  ['fa-shapes', 'text-brand-green', 'Trải Nghiệm Là Phương Thức', 'Học qua chơi, tăng cường dã ngoại, thực hành kỹ năng sống mỗi ngày.'],
];
const QUOTES = [
  ['Nội dung mẫu: trường sạch đẹp, giáo viên tận tâm, con tôi mỗi ngày đều háo hức đến lớp.', 'Phụ huynh - CS Việt Trì'],
  ['Nội dung mẫu: con tiến bộ rõ rệt về sự tự tin và kỹ năng giao tiếp sau vài tháng học.', 'Phụ huynh - CS Quy Nhơn Nam'],
  ['Nội dung mẫu: thực đơn đa dạng, nhà trường cập nhật thông tin cho phụ huynh rất kịp thời.', 'Phụ huynh - CS Nha Trang'],
];

const Heading = ({ eyebrow, children, light }) => (
  <div className="mx-auto mb-10 max-w-2xl text-center">
    {eyebrow && <span className={`text-xs font-semibold uppercase ${light ? 'text-brand-yellow' : 'text-brand-primary'}`}>{eyebrow}</span>}
    <h2 className="mt-1 text-2xl font-bold">{children}</h2>
  </div>
);

export default function Home() {
  usePageMeta('home');
  const { t } = useLang();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    if (!isEmail(email)) { toast('Email chưa đúng định dạng.', 'error'); return; }
    toast('Cảm ơn bạn đã đăng ký nhận thông tin! (Chức năng demo)');
    setEmail('');
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <span className="inline-block rounded-full bg-brand-tint2 px-4 py-1.5 text-xs font-semibold text-brand-primary"><i className="fa-solid fa-heart mr-1" /> Môi trường giáo dục Lấy Trẻ Làm Trung Tâm</span>
            <h1 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">{t('Hệ Thống Mầm Non Ánh Dương - Ươm Mầm Tương Lai')}</h1>
            <p className="max-w-2xl text-base text-gray-600">Chuỗi 4 trường mầm non chất lượng cao tại <strong>Phú Thọ (2 CS), Quy Nhơn Nam và Nha Trang</strong>, mang đến môi trường an toàn, hạnh phúc và khai phóng tiềm năng của trẻ.</p>
            <div className="mt-6 rounded-2xl border border-brand-tint2 bg-white p-4 shadow-soft">
              <p className="mb-2.5 text-left text-xs font-semibold text-gray-500"><i className="fa-solid fa-compass mr-1 text-brand-primary" /> Khám phá 4 cơ sở trực thuộc hệ thống:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(CAMPUSES).map(([k, c]) => <button key={k} onClick={() => navigate(`/campuses/${k}`)} className="tap rounded-xl border border-brand-tint2 bg-brand-tint/50 p-2 text-left text-xs font-medium text-gray-700 transition hover:bg-brand-primary hover:text-white">📍 {c.short.replace(/\s*\(.*\)/, '')}</button>)}
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border-4 border-white bg-white p-3 shadow-xl lg:rotate-1">
              <PhotoSlot className="h-72">Ảnh hero: học sinh &amp; cô giáo thật của trường</PhotoSlot>
              <div className="p-4 text-center"><h3 className="text-base font-bold text-gray-800">Hệ Thống Mầm Non Ánh Dương</h3><p className="mt-1 text-xs text-gray-500">4 Cơ sở - 1 Triết lý giáo dục yêu thương</p></div>
            </div>
          </div>
        </div>
      </div>
      <Wave bg="bg-brand-cream" color="text-white" />

      <div className="bg-white py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading>{t('3 Trụ Cột Giáo Dục Cốt Lõi')}</Heading>
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map(([icon, tone, title, text]) => <div key={title} className="rounded-2xl border border-brand-tint2 bg-brand-cream p-6 text-center"><i className={`fa-solid ${icon} mb-3 text-3xl ${tone}`} /><h3 className="mb-2 text-base font-bold">{title}</h3><p className="text-xs leading-relaxed text-gray-600">{text}</p></div>)}
        </div>
      </div></div>
      <Wave bg="bg-white" color="text-brand-cream" />

      <div className="bg-brand-cream py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow="Chương trình giáo dục">Trang Bị Kiến Thức &amp; Kỹ Năng Chuẩn Bị Cho Tương Lai</Heading>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl bg-brand-yellow p-6 shadow-soft"><i className="fa-solid fa-earth-asia text-3xl text-brand-primary" /><h3 className="text-lg font-bold text-brand-dark">Hệ Đào Tạo Quốc Tế Cambridge</h3><p className="text-sm text-brand-dark/80">Môi trường làm quen tiếng Anh và tư duy quốc tế cho bé.</p><Link to="/programs" className="tap inline-flex items-center rounded-full bg-brand-primary px-5 text-xs font-semibold text-white transition hover:bg-brand-deep">Tìm hiểu thêm <i className="fa-solid fa-arrow-right ml-1" /></Link></div>
          <div className="space-y-3 rounded-2xl bg-brand-primary p-6 text-white shadow-soft"><i className="fa-solid fa-medal text-3xl text-brand-yellow" /><h3 className="text-lg font-bold">Hệ Đào Tạo Chất Lượng Cao</h3><p className="text-sm text-white/90">Chương trình chuẩn Bộ GD&amp;ĐT, chăm sóc sát sao từng bé.</p><Link to="/programs" className="tap inline-flex items-center rounded-full bg-brand-yellow px-5 text-xs font-semibold text-brand-deep transition hover:bg-white">Tìm hiểu thêm <i className="fa-solid fa-arrow-right ml-1" /></Link></div>
        </div>
      </div></div>
      <Wave bg="bg-brand-cream" color="text-white" />

      <div className="bg-white py-12"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow="Hành trình nhập học">{t('4 Bước Đón Bé Đến Với Ánh Dương')}</Heading>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STEPS.map(([icon, title, text], i) => (
            <div key={title} className="space-y-2 text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint2 text-2xl text-brand-primary"><i className={`fa-solid ${icon}`} /><span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">{i + 1}</span></div>
              <h3 className="text-sm font-bold">{title}</h3><p className="text-xs text-gray-600">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center"><Link to="/admissions" className="tap inline-flex items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-white shadow-md transition hover:bg-brand-deep">{t('Đặt Lịch Tham Quan')}</Link></div>
      </div></div>
      <Wave bg="bg-white" color="text-brand-cream" />

      <div className="bg-brand-cream py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow="Giáo viên">{t('Đội Ngũ Giáo Viên Của Chúng Tôi')}</Heading>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => <div key={n} className="space-y-2 text-center"><PhotoSlot icon="fa-user" className="h-48">Ảnh giáo viên</PhotoSlot><p className="text-sm font-semibold">Họ và tên giáo viên</p><p className="text-xs text-gray-600">Chức vụ</p></div>)}
        </div>
      </div></div>
      <Wave bg="bg-brand-cream" color="text-white" />

      <div className="bg-white py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow="Góc sẻ chia">{t('Chia Sẻ Của Phụ Huynh Về Chúng Tôi')}</Heading>
        <div className="grid gap-6 md:grid-cols-3">
          {QUOTES.map(([q, who]) => <figure key={who} className="space-y-3 rounded-2xl border border-brand-tint2 bg-brand-tint p-6"><i className="fa-solid fa-quote-left text-2xl text-brand-primary" /><blockquote className="text-sm leading-relaxed text-gray-700">{q}</blockquote><figcaption className="text-xs font-bold text-brand-primary">— {who}</figcaption></figure>)}
        </div>
      </div></div>
      <div className="bg-white pb-12"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow="Đối tác">{t('Đơn Vị Đồng Hành')}</Heading>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {['BIDV', 'VietinBank', 'WIDELY', 'AN DENTAL'].map((n) => <div key={n} className="flex h-20 flex-col items-center justify-center rounded-xl border border-brand-tint2 bg-white"><span className="font-bold tracking-wide text-gray-600">{n}</span><span className="text-xs text-gray-500">Logo đối tác</span></div>)}
        </div>
      </div></div>
      <Wave bg="bg-white" color="text-brand-yellow" />

      <div className="bg-brand-yellow py-12"><div className="mx-auto max-w-3xl space-y-4 px-4 text-center">
        <span className="text-xs font-semibold uppercase text-brand-primary">{t('Đăng ký ngay')}</span>
        <h2 className="text-balance text-2xl font-bold text-brand-deep md:text-3xl">Cùng Ánh Dương Tạo Nên Nền Tảng Vững Chắc Cho Bé Ngay Hôm Nay</h2>
        <Link to="/admissions" className="tap inline-flex items-center rounded-full bg-brand-primary px-8 text-sm font-bold text-white shadow-md transition hover:bg-brand-deep">{t('Đăng ký ngay')} <i className="fa-solid fa-arrow-right ml-1" /></Link>
      </div></div>
      <Wave bg="bg-brand-yellow" color="text-brand-primary" />

      <div className="bg-brand-primary py-12 text-white"><div className="mx-auto max-w-3xl space-y-4 px-4 text-center">
        <span className="text-xs font-semibold uppercase text-brand-yellow">Nhận thông tin</span>
        <h2 className="text-2xl font-bold">Đăng Ký Nhận Thông Tin Về Chúng Tôi Để Cập Nhật Mỗi Ngày</h2>
        <form onSubmit={subscribe} className="mx-auto flex max-w-xl flex-col gap-2 sm:flex-row" noValidate>
          <label htmlFor="newsletter-email" className="sr-only">Email</label>
          <input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email của bạn" className="flex-1 rounded-full px-4 py-3 text-brand-dark focus:outline-none" />
          <button type="submit" className="tap rounded-full bg-brand-yellow px-6 text-sm font-bold text-brand-deep transition hover:bg-white">{t('Đăng ký')}</button>
        </form>
      </div></div>
      <Wave bg="bg-brand-primary" color="text-brand-cream" />

      <div className="bg-brand-cream py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading eyebrow="Thư viện ảnh">Khoảnh Khắc Tại Ánh Dương</Heading>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => <PhotoSlot key={n} className="h-36">Ảnh hoạt động {n}</PhotoSlot>)}
        </div>
        <div className="mt-6 text-center"><Link to="/gallery" className="text-sm font-semibold text-brand-primary hover:underline">Xem thư viện ảnh &amp; video <i className="fa-solid fa-arrow-right ml-1" /></Link></div>
      </div></div>
    </>
  );
}
