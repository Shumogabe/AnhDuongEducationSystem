import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CAMPUSES, HOTLINE, HOTLINE_TEL, OFFICIAL_EMAIL, PARENT_APP_URL } from '../shared/data.js';
import { Modal } from '../shared/ui.jsx';
import { useLang } from './i18n.jsx';

const NAV = [
  ['/', 'Trang Chủ'],
  ['/about', 'Giới Thiệu'],
  ['/campuses', 'Hệ Thống Cơ Sở', 'campus'],
  ['/programs', 'Chương Trình Học'],
  ['/nutrition', 'Dinh Dưỡng'],
  ['', 'Thông Tin', 'info'],
];
const INFO = [
  ['/news', 'fa-regular fa-newspaper', 'Tin Tức'],
  ['/admissions', 'fa-solid fa-graduation-cap', 'Tuyển Sinh'],
  ['/careers', 'fa-solid fa-briefcase', 'Tuyển Dụng'],
  ['/gallery', 'fa-regular fa-images', 'Thư Viện Ảnh'],
  ['/contact', 'fa-solid fa-envelope', 'Liên Hệ'],
];

function Dropdown({ label, children, to }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex items-center py-4" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {to ? <NavLink to={to} className="py-2 hover:text-brand-primary">{label}</NavLink> : <button className="py-2 hover:text-brand-primary" onClick={() => setOpen(!open)} aria-haspopup="true" aria-expanded={open}>{label}</button>}
      <button className="px-1 py-2 hover:text-brand-primary" onClick={() => setOpen(!open)} aria-label={`Mở ${label}`}><i className="fa-solid fa-chevron-down text-xs" /></button>
      {open && <div className="absolute left-0 top-full z-50 w-64 rounded-2xl border border-gray-100 bg-white py-3 shadow-xl" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  );
}

function PortalModal({ type, onClose }) {
  const navigate = useNavigate();
  const parent = type === 'parent';
  return (
    <Modal title={parent ? 'Cổng Sổ Liên Lạc Phụ Huynh' : 'Cổng Quản Lý Cán Bộ & Giáo Viên'} onClose={onClose} size="max-w-md">
      <div className="space-y-4 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint2 text-2xl text-brand-primary"><i className={`fa-solid ${parent ? 'fa-mobile-screen' : 'fa-user-lock'}`} /></span>
        <p className="text-sm text-gray-600">{parent ? 'Theo dõi nhật ký ăn, ngủ, sức khỏe và điểm danh của bé.' : 'Dành cho giáo viên nộp giáo án, điểm danh và Ban giám hiệu duyệt báo cáo.'}</p>
        {parent ? (
          <>
            <a href={PARENT_APP_URL} target="_blank" rel="noopener noreferrer" className="tap inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-bold text-white hover:bg-brand-deep"><i className="fa-solid fa-arrow-up-right-from-square" />Mở WebApp Phụ huynh</a>
            <p className="text-xs text-gray-500">Bản mobile: cài ứng dụng Ánh Dương Phụ huynh trên App Store / CH Play (demo dùng Expo Go).</p>
          </>
        ) : (
          <button onClick={() => { onClose(); navigate('/portal'); }} className="tap w-full rounded-xl bg-brand-primary text-sm font-bold text-white hover:bg-brand-deep">Vào Portal nội bộ</button>
        )}
      </div>
    </Modal>
  );
}

export default function SiteLayout() {
  const { t, lang, toggle } = useLang();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [acc, setAcc] = useState('');
  const [portal, setPortal] = useState(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => { setMenu(false); window.scrollTo({ top: 0 }); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (to) => { setMenu(false); navigate(to); };
  const mobileBtn = 'tap w-full rounded-xl px-3 text-left hover:bg-brand-tint';
  const bn = [['/', 'fa-house', 'Trang chủ'], ['/campuses', 'fa-location-dot', 'Chọn cơ sở'], ['/admissions', 'fa-calendar-check', 'Đặt lịch tour']];

  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      {/* Top bar */}
      <div className="bg-brand-primary px-4 py-0.5 text-xs text-white md:py-2.5 md:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-6">
            <span><i className="fa-solid fa-phone mr-1" /> Hotline: {HOTLINE}</span>
            <span className="hidden lg:inline"><i className="fa-solid fa-envelope mr-1" /> {OFFICIAL_EMAIL}</span>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <button onClick={toggle} aria-label={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'} className="flex min-h-[44px] items-center font-medium hover:underline md:min-h-0">
              <i className="fa-solid fa-globe mr-1" /><span className={lang === 'vi' ? 'font-bold' : ''}>VI</span><span className="mx-0.5">/</span><span className={lang === 'en' ? 'font-bold' : ''}>EN</span>
            </button>
            <span>|</span>
            <button onClick={() => setPortal('parent')} className="flex min-h-[44px] items-center font-medium hover:underline md:min-h-0"><i className="fa-solid fa-mobile-screen mr-1" /><span className="sm:hidden">{t('Phụ Huynh')}</span><span className="hidden sm:inline">{t('App Phụ Huynh')}</span></button>
            <span>|</span>
            <button onClick={() => setPortal('staff')} className="flex min-h-[44px] items-center font-medium hover:underline md:min-h-0"><i className="fa-solid fa-user-lock mr-1" /><span className="sm:hidden">{t('Nội Bộ')}</span><span className="hidden sm:inline">{t('Portal Nội Bộ (GV/BGH)')}</span></button>
          </div>
        </div>
      </div>

      {/* Menu chính */}
      <nav className="sticky top-0 z-40 border-b border-brand-tint2 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Link to="/" aria-label="Ánh Dương Education System"><img src={logo} alt="Ánh Dương Education System" className="h-8 w-auto sm:h-11 md:h-12" /></Link>
            <div className="hidden items-center space-x-6 text-sm font-medium text-gray-700 lg:flex">
              {NAV.map(([to, label, kind]) => {
                if (kind === 'campus') return (
                  <Dropdown key={label} label={t(label)} to={to}>
                    {Object.entries(CAMPUSES).map(([k, c]) => <button key={k} onClick={() => go(`/campuses/${k}`)} className="flex w-full items-center px-4 py-2 text-left text-xs hover:bg-brand-tint hover:text-brand-primary"><i className="fa-solid fa-location-dot mr-2 text-brand-primary" />{c.province} - {c.short.replace(/\(.*\)/, '').trim()}</button>)}
                  </Dropdown>
                );
                if (kind === 'info') return (
                  <Dropdown key={label} label={t(label)}>
                    {INFO.map(([p, icon, l]) => <button key={p} onClick={() => go(p)} className="flex w-full items-center px-4 py-2.5 text-left text-xs hover:bg-brand-tint hover:text-brand-primary"><i className={`${icon} mr-2 text-brand-primary`} />{t(l)}</button>)}
                  </Dropdown>
                );
                return <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `py-2 transition hover:text-brand-primary ${isActive ? 'text-brand-primary' : ''}`}>{t(label)}</NavLink>;
              })}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => go('/admissions')} className="tap whitespace-nowrap rounded-full bg-brand-primary px-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-brand-deep sm:px-4 md:px-5 md:text-sm">
                <i className="fa-regular fa-calendar-check mr-1 md:mr-2" /><span className="sm:hidden">{t('Đăng ký tư vấn')}</span><span className="hidden sm:inline">{t('Đặt Lịch Tham Quan')}</span>
              </button>
              <button onClick={() => setMenu(!menu)} className="tap flex w-11 items-center justify-center rounded-full hover:bg-brand-tint lg:hidden" aria-label="Mở menu" aria-expanded={menu}><i className="fa-solid fa-bars text-xl" /></button>
            </div>
          </div>
        </div>
        {menu && (
          <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-brand-tint2 bg-white lg:hidden">
            <div className="space-y-1 px-4 py-3 text-sm font-medium text-gray-700">
              <button className={mobileBtn} onClick={() => go('/')}>{t('Trang Chủ')}</button>
              <button className={mobileBtn} onClick={() => go('/about')}>{t('Giới Thiệu')}</button>
              <div>
                <button className={`${mobileBtn} flex items-center justify-between`} onClick={() => setAcc(acc === 'c' ? '' : 'c')} aria-expanded={acc === 'c'}>{t('Hệ Thống Cơ Sở')}<i className="fa-solid fa-chevron-down text-xs" /></button>
                {acc === 'c' && <div className="space-y-1 pl-4">{Object.entries(CAMPUSES).map(([k, c]) => <button key={k} className={`${mobileBtn} text-sm`} onClick={() => go(`/campuses/${k}`)}>{c.short}</button>)}</div>}
              </div>
              <button className={mobileBtn} onClick={() => go('/programs')}>{t('Chương Trình Học')}</button>
              <button className={mobileBtn} onClick={() => go('/nutrition')}>{t('Dinh Dưỡng')}</button>
              <div>
                <button className={`${mobileBtn} flex items-center justify-between`} onClick={() => setAcc(acc === 'i' ? '' : 'i')} aria-expanded={acc === 'i'}>{t('Thông Tin')}<i className="fa-solid fa-chevron-down text-xs" /></button>
                {acc === 'i' && <div className="space-y-1 pl-4">{INFO.map(([p, , l]) => <button key={p} className={`${mobileBtn} text-sm`} onClick={() => go(p)}>{t(l)}</button>)}</div>}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-brand-deep py-10 text-gray-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 text-xs sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="space-y-3">
            <div className="inline-block rounded-xl bg-white p-2"><img src={logo} alt="Ánh Dương Education System" className="h-10 w-auto" /></div>
            <p className="leading-relaxed">Hệ thống giáo dục mầm non chất lượng cao gồm 4 cơ sở tại Phú Thọ, Quy Nhơn Nam và Nha Trang.</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">{t('Danh Mục')}</h4>
            <ul className="space-y-2">
              {[['/', 'Trang chủ'], ['/about', 'Giới thiệu hệ thống'], ['/campuses', 'Hệ thống cơ sở'], ['/programs', 'Chương trình học'], ['/news', 'Tin Tức'], ['/admissions', 'Tuyển Sinh'], ['/careers', 'Tuyển Dụng'], ['/contact', 'Liên Hệ']].map(([p, l]) => <li key={p}><Link to={p} className="hover:text-brand-yellow">{t(l)}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">{t('Liên Kết Tiện Ích')}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setPortal('parent')} className="hover:text-brand-yellow"><i className="fa-solid fa-mobile mr-1" /> {t('App Phụ Huynh')}</button></li>
              <li><button onClick={() => setPortal('staff')} className="hover:text-brand-yellow"><i className="fa-solid fa-user-lock mr-1" /> {t('Cổng Giáo Viên & BGH')}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">{t('Liên Hệ Ban Quản Trị')}</h4>
            <p className="break-words"><i className="fa-solid fa-envelope mr-1" /> {OFFICIAL_EMAIL}</p>
            <p className="mt-1"><i className="fa-solid fa-phone mr-1" /> Hotline: {HOTLINE}</p>
            <p className="mt-1"><a href="https://m.me/TruongMamnonAnhDuongVT" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow"><i className="fa-brands fa-facebook-messenger mr-1" /> Messenger</a></p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 px-4 pt-4 text-center text-xs">
          © 2026 Hệ thống Giáo dục Mầm non Ánh Dương. All rights reserved.
          <Link to="/privacy" className="ml-2 underline hover:text-brand-yellow">{t('Chính sách bảo mật')}</Link>
        </div>
      </footer>

      {/* Nút nổi */}
      <div className="fixed bottom-20 right-3 z-40 flex flex-col gap-2 md:bottom-6 md:right-5">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Lên đầu trang" tabIndex={showTop ? 0 : -1} className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-primary bg-white text-brand-primary shadow-lg transition ${showTop ? 'opacity-100' : 'pointer-events-none opacity-0'}`}><i className="fa-solid fa-chevron-up" /></button>
        <a href="https://zalo.me/0965284866" target="_blank" rel="noopener noreferrer" aria-label="Zalo" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white shadow-lg">Zalo</a>
        <a href="https://m.me/TruongMamnonAnhDuongVT" target="_blank" rel="noopener noreferrer" aria-label="Messenger" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg"><i className="fa-brands fa-facebook-messenger text-xl" /></a>
        <a href="mailto:mnanhduong.pgdviettri@gmail.com" aria-label="Gửi email" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg"><i className="fa-solid fa-envelope text-lg" /></a>
        <a href={HOTLINE_TEL} aria-label="Gọi hotline" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white shadow-lg"><i className="fa-solid fa-phone text-lg" /></a>
      </div>

      {/* Menu dưới (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-brand-tint2 bg-white text-xs md:hidden" aria-label="Điều hướng nhanh">
        {bn.map(([to, icon, label]) => (
          <button key={to} onClick={() => go(to)} className={`tap flex flex-col items-center justify-center gap-0.5 py-2 ${pathname === to ? 'text-brand-primary' : 'text-gray-500'}`}><i className={`fa-solid ${icon} text-lg`} />{t(label)}</button>
        ))}
        <button onClick={() => setPortal('parent')} className="tap flex flex-col items-center justify-center gap-0.5 py-2 text-gray-500"><i className="fa-solid fa-book-open text-lg" />{t('Sổ liên lạc')}</button>
      </nav>

      {portal && <PortalModal type={portal} onClose={() => setPortal(null)} />}
    </div>
  );
}
