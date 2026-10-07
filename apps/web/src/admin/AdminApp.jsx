import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { rule, validate } from '../shared/format.js';
import { Btn, Input, NotFound, ToastProvider } from '../shared/ui.jsx';
import { Dashboard, ContentHome, ContentAbout, ContentCampuses, ContentPrograms, ContentNutrition, ContentNews, NewsEdit, ContentGallery, ContentMedia } from './pagesContent.jsx';
import { AdmLeads, AdmContent, AdmConfig, JobPosts, JobApps, MailSubscribers, MailCompose, MailInbox, Users, Settings, AuditLog, Profile } from './pagesOps.jsx';
import { AdminProvider, ROLES, useAdmin } from './store.jsx';

/** path: đường dẫn con của /admin; system: chỉ Quản trị hệ thống; ro: nội dung dùng chung (cơ sở chỉ xem) */
export const MENU = [
  { path: '', title: 'Bảng điều khiển', icon: 'fa-gauge', el: <Dashboard /> },
  { path: 'content/home', title: 'Trang chủ', icon: 'fa-house', group: 'Nội dung (CMS)', shared: true, el: <ContentHome /> },
  { path: 'content/about', title: 'Giới thiệu hệ thống', icon: 'fa-circle-info', group: 'Nội dung (CMS)', shared: true, el: <ContentAbout /> },
  { path: 'content/campuses', title: 'Cơ sở trường', icon: 'fa-school', group: 'Nội dung (CMS)', el: <ContentCampuses /> },
  { path: 'content/programs', title: 'Chương trình học', icon: 'fa-book-open', group: 'Nội dung (CMS)', shared: true, el: <ContentPrograms /> },
  { path: 'content/nutrition', title: 'Dinh dưỡng & Y tế', icon: 'fa-utensils', group: 'Nội dung (CMS)', el: <ContentNutrition /> },
  { path: 'content/news', title: 'Tin tức & Sự kiện', icon: 'fa-newspaper', group: 'Nội dung (CMS)', el: <ContentNews /> },
  { path: 'content/gallery', title: 'Thư viện Ảnh & Video', icon: 'fa-images', group: 'Nội dung (CMS)', el: <ContentGallery /> },
  { path: 'content/media', title: 'Thư viện phương tiện', icon: 'fa-folder-open', group: 'Nội dung (CMS)', el: <ContentMedia /> },
  { path: 'admissions/leads', title: 'Lead từ website → CRM', icon: 'fa-right-left', group: 'Tuyển sinh', el: <AdmLeads /> },
  { path: 'admissions/content', title: 'Nội dung tuyển sinh', icon: 'fa-file-lines', group: 'Tuyển sinh', el: <AdmContent /> },
  { path: 'admissions/config', title: 'Cấu hình form & kết nối CRM', icon: 'fa-sliders', group: 'Tuyển sinh', el: <AdmConfig /> },
  { path: 'jobs/posts', title: 'Tin tuyển dụng', icon: 'fa-briefcase', group: 'Tuyển dụng', el: <JobPosts /> },
  { path: 'jobs/apps', title: 'Hồ sơ ứng tuyển', icon: 'fa-user-tie', group: 'Tuyển dụng', el: <JobApps /> },
  { path: 'mail/subscribers', title: 'Người đăng ký bản tin', icon: 'fa-envelope-open-text', group: 'Bản tin & Liên hệ', system: true, el: <MailSubscribers /> },
  { path: 'mail/compose', title: 'Soạn & gửi bản tin', icon: 'fa-paper-plane', group: 'Bản tin & Liên hệ', system: true, el: <MailCompose /> },
  { path: 'mail/inbox', title: 'Hộp thư liên hệ', icon: 'fa-inbox', group: 'Bản tin & Liên hệ', system: true, el: <MailInbox /> },
  { path: 'users', title: 'Người dùng & Phân quyền', icon: 'fa-users-gear', group: 'Hệ thống', system: true, el: <Users /> },
  { path: 'settings', title: 'Cài đặt', icon: 'fa-gear', group: 'Hệ thống', system: true, el: <Settings /> },
  { path: 'audit', title: 'Nhật ký hoạt động', icon: 'fa-clock-rotate-left', group: 'Hệ thống', system: true, el: <AuditLog /> },
];

function Login() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [v, setV] = useState({ email: '', pass: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(v, mode === 'login' ? { email: [rule.email()], pass: [rule.required('Vui lòng nhập mật khẩu.')] } : { email: [rule.email()] });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (mode === 'forgot') { setSent(true); return; }
    login();
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-brand-tint2 bg-white p-6 shadow-xl sm:p-8">
        <img src={logo} alt="Ánh Dương Education System" className="mx-auto h-12 w-auto" />
        {sent ? (
          <div className="space-y-3 text-center">
            <i className="fa-solid fa-envelope-circle-check text-4xl text-brand-green" />
            <h1 className="text-lg font-bold">Kiểm tra email của bạn</h1>
            <p className="text-xs text-gray-600">Nếu email tồn tại trong hệ thống, liên kết đặt lại mật khẩu sẽ được gửi (hiệu lực 30 phút).</p>
            <button onClick={() => { setSent(false); setMode('login'); }} className="text-xs text-brand-primary hover:underline">Quay lại đăng nhập</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <h1 className="text-center text-xl font-bold">{mode === 'login' ? 'Đăng nhập quản trị' : 'Quên mật khẩu'}</h1>
            <Input label="Email *" type="email" value={v.email} onChange={set('email')} error={errors.email} placeholder="ban@anhduong.edu.vn" />
            {mode === 'login' && <Input label="Mật khẩu *" type="password" value={v.pass} onChange={set('pass')} error={errors.pass} />}
            <Btn kind="primary" className="w-full text-sm" type="submit">{mode === 'login' ? 'Đăng nhập' : 'Gửi liên kết'}</Btn>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'forgot' : 'login')} className="w-full text-xs text-brand-primary hover:underline">{mode === 'login' ? 'Quên mật khẩu?' : 'Quay lại đăng nhập'}</button>
            {mode === 'login' && <p className="rounded-xl bg-brand-tint p-3 text-center text-xs text-gray-500">Demo: nhập email hợp lệ và mật khẩu bất kỳ. Chọn vai trò ở thanh trên sau khi đăng nhập.</p>}
          </form>
        )}
        <p className="text-center text-xs text-gray-500">Trang quản trị nội bộ. Truy cập trái phép sẽ bị ghi nhật ký.</p>
      </div>
    </div>
  );
}

function Shell() {
  const { role, setRole, user, isSystem, logout } = useAdmin();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => { setDrawer(false); setUserMenu(false); window.scrollTo({ top: 0 }); }, [pathname]);

  const sub = pathname.replace(/^\/admin\/?/, '');
  const current = MENU.find((m) => m.path === sub) || (sub.startsWith('content/news/') ? MENU.find((m) => m.path === 'content/news') : sub === 'profile' ? { title: 'Hồ sơ cá nhân' } : null);
  useEffect(() => { document.title = `${current?.title || 'Quản trị'} | Quản trị Ánh Dương`; }, [current]);

  const groups = {};
  MENU.filter((m) => !m.system || isSystem).forEach((m) => { (groups[m.group || ''] = groups[m.group || ''] || []).push(m); });
  const roleSelect = (cls) => (
    <select value={role} onChange={(e) => setRole(e.target.value)} className={`fld !w-auto !py-1.5 ${cls || ''}`} aria-label="Xem thử với vai trò">
      {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{k === 'campus' ? 'Quản trị cơ sở (Việt Trì)' : r.label}</option>)}
    </select>
  );

  return (
    <div className="min-h-screen md:flex">
      {drawer && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setDrawer(false)} />}
      <aside className={`fixed left-0 top-0 z-40 flex h-screen w-72 shrink-0 flex-col border-r border-brand-tint2 bg-white transition-transform md:sticky md:w-64 md:translate-x-0 ${drawer ? '' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-brand-tint2 p-4"><img src={logo} alt="Ánh Dương" className="h-9 w-auto" /><button onClick={() => setDrawer(false)} className="h-10 w-10 rounded-full hover:bg-brand-tint md:hidden" aria-label="Đóng menu"><i className="fa-solid fa-xmark" /></button></div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu quản trị">
          {Object.entries(groups).map(([g, items]) => (
            <div key={g}>
              {g && <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400">{g}</p>}
              {items.map((m) => (
                <NavLink key={m.path} to={`/admin/${m.path}`} end={m.path === ''} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                  <i className={`fa-solid ${m.icon} w-4 text-center`} /><span>{m.title}</span>{m.shared && !isSystem && <i className="fa-solid fa-lock ml-auto text-xs opacity-60" title="Chỉ xem" />}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-brand-tint2 p-3 text-xs text-gray-500">Giai đoạn 1 · CMS &amp; Tuyển sinh</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-brand-tint2 bg-white/95 px-4 backdrop-blur md:px-6">
          <button onClick={() => setDrawer(true)} className="h-11 w-11 rounded-full hover:bg-brand-tint md:hidden" aria-label="Mở menu"><i className="fa-solid fa-bars text-lg" /></button>
          <h1 className="flex-1 truncate text-base font-bold text-gray-900 md:text-lg">{current?.title}</h1>
          <label className="hidden items-center gap-2 text-xs text-gray-500 sm:flex"><span className="whitespace-nowrap">Xem thử với vai trò</span>{roleSelect()}</label>
          <div className="relative">
            <button onClick={() => setUserMenu(!userMenu)} className="tap flex items-center gap-2 rounded-full pl-1 pr-3 hover:bg-brand-tint" aria-haspopup="true" aria-expanded={userMenu}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">{user.name.split(' ').slice(-1)[0][0]}</span>
              <span className="hidden text-xs font-semibold sm:inline">{user.name}</span><i className="fa-solid fa-chevron-down text-xs" />
            </button>
            {userMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 text-xs shadow-xl">
                <p className="px-4 py-2 text-gray-500">{user.label}</p>
                <div className="px-4 py-2 sm:hidden">{roleSelect('w-full')}</div>
                <button onClick={() => navigate('/admin/profile')} className="w-full px-4 py-2.5 text-left hover:bg-brand-tint"><i className="fa-regular fa-user mr-2" />Hồ sơ &amp; đổi mật khẩu</button>
                <button onClick={() => { logout(); navigate('/admin/login'); }} className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-brand-tint"><i className="fa-solid fa-right-from-bracket mr-2" />Đăng xuất</button>
              </div>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 md:p-6">
          <Routes>
            {MENU.map((m) => <Route key={m.path} path={m.path} element={m.system && !isSystem ? <Forbidden /> : m.el} />)}
            <Route path="content/news/:id" element={<NewsEdit />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound onHome={() => navigate('/admin')} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function Forbidden() {
  const navigate = useNavigate();
  return (
    <div className="space-y-3 py-16 text-center">
      <p className="text-6xl font-bold text-brand-primary">403</p>
      <h2 className="text-xl font-bold">Bạn không có quyền truy cập</h2>
      <p className="text-sm text-gray-600">Mục này chỉ dành cho Quản trị hệ thống.</p>
      <Btn kind="primary" onClick={() => navigate('/admin')}>Về bảng điều khiển</Btn>
    </div>
  );
}

function Gate() {
  const { session } = useAdmin();
  return (
    <Routes>
      <Route path="login" element={session ? <Navigate to="/admin" replace /> : <Login />} />
      <Route path="*" element={session ? <Shell /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default function AdminApp() {
  return <AdminProvider><Gate /></AdminProvider>;
}
