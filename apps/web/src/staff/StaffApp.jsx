import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CAMPUSES } from '../shared/data.js';
import { rule, validate } from '../shared/format.js';
import { Btn, Input, Select } from '../shared/ui.jsx';
import { PagesA } from './pagesA.jsx';
import { PagesB } from './pagesB.jsx';
import { ROLE_DEF, StaffProvider, useStaff } from './store.jsx';

const PAGES = {
  home: { title: 'Trang chủ', icon: 'fa-house', el: <PagesA.Home /> },
  class: { title: 'Lớp của tôi', icon: 'fa-people-group', group: 'Lớp & học sinh', el: <PagesA.Class /> },
  pickup: { title: 'Đón trả', icon: 'fa-qrcode', group: 'Lớp & học sinh', el: <PagesA.Pickup /> },
  students: { title: 'Học sinh & phụ huynh', icon: 'fa-children', group: 'Lớp & học sinh', el: <PagesA.Students /> },
  health: { title: 'Y tế', icon: 'fa-heart-pulse', group: 'Chăm sóc', el: <PagesA.Health /> },
  menu: { title: 'Thực đơn', icon: 'fa-utensils', group: 'Chăm sóc', el: <PagesA.Menu /> },
  comms: { title: 'Thông báo & Tin nhắn', icon: 'fa-bullhorn', group: 'Liên lạc', el: <PagesA.Comms /> },
  fees: { title: 'Thu phí', icon: 'fa-wallet', group: 'Tài chính & tuyển sinh', el: <PagesB.Fees /> },
  crm: { title: 'CRM tuyển sinh', icon: 'fa-user-plus', group: 'Tài chính & tuyển sinh', el: <PagesB.Crm /> },
  reports: { title: 'Báo cáo & Dashboard', icon: 'fa-chart-column', group: 'Tài chính & tuyển sinh', el: <PagesB.Reports /> },
  lessons: { title: 'Giáo án', icon: 'fa-book', group: 'Chuyên môn & nhân sự', el: <PagesB.Lessons /> },
  hr: { title: 'Nhân sự & Chấm công', icon: 'fa-user-clock', group: 'Chuyên môn & nhân sự', el: <PagesB.Hr /> },
  admin: { title: 'Quản trị', icon: 'fa-gear', group: 'Hệ thống', el: <PagesB.Admin /> },
  profile: { title: 'Hồ sơ cá nhân', icon: 'fa-user', hidden: true, el: <PagesB.Profile /> },
};

function Login() {
  const { login } = useStaff();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [v, setV] = useState({ email: '', pass: '', role: 'gvcn', code: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (mode === 'tfa') {
      const errs = validate(v, { code: [(x) => (/^\d{6}$/.test(x) ? '' : 'Mã gồm 6 chữ số.')] });
      setErrors(errs);
      if (!Object.keys(errs).length) { login(v.role); navigate('/portal'); }
      return;
    }
    const rules = mode === 'login' ? { email: [rule.email()], pass: [rule.required('Vui lòng nhập mật khẩu.')] } : { email: [rule.email()] };
    const errs = validate(v, rules);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (mode === 'forgot') { setSent(true); return; }
    if (ROLE_DEF[v.role].tfa) { setMode('tfa'); return; }
    login(v.role);
    navigate('/portal');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-brand-tint2 bg-white p-6 shadow-xl sm:p-8">
        <img src={logo} alt="Ánh Dương Education System" className="mx-auto h-12 w-auto" />
        {sent ? (
          <div className="space-y-3 text-center"><i className="fa-solid fa-envelope-circle-check text-4xl text-brand-green" /><p className="text-sm">Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi (hiệu lực 30 phút).</p><button onClick={() => { setSent(false); setMode('login'); }} className="text-xs text-brand-primary">Quay lại đăng nhập</button></div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <h1 className="text-center text-xl font-bold">{{ login: 'Đăng nhập Portal', forgot: 'Quên mật khẩu', tfa: 'Xác thực hai bước' }[mode]}</h1>
            {mode === 'tfa' ? (
              <>
                <p className="text-center text-xs text-gray-500">Vai trò {ROLE_DEF[v.role].label} bắt buộc xác thực hai bước. Nhập mã 6 số từ ứng dụng Authenticator.</p>
                <Input label="Mã xác thực" inputMode="numeric" placeholder="______" value={v.code} onChange={set('code')} error={errors.code} />
              </>
            ) : (
              <>
                <Input label="Email" type="email" placeholder="ten@anhduong.edu.vn" value={v.email} onChange={set('email')} error={errors.email} />
                {mode === 'login' && <Input label="Mật khẩu" type="password" value={v.pass} onChange={set('pass')} error={errors.pass} />}
                {mode === 'login' && <Select label="Vai trò dùng thử" value={v.role} onChange={set('role')} options={Object.entries(ROLE_DEF).map(([k, r]) => [k, r.label + (r.tfa ? ' (có xác thực 2 bước)' : '')])} />}
              </>
            )}
            <Btn kind="primary" type="submit" className="w-full text-sm">{mode === 'login' ? 'Đăng nhập' : mode === 'forgot' ? 'Gửi liên kết đặt lại' : 'Xác nhận'}</Btn>
            {mode !== 'tfa' && <button type="button" onClick={() => setMode(mode === 'login' ? 'forgot' : 'login')} className="w-full text-xs text-brand-primary">{mode === 'login' ? 'Quên mật khẩu?' : 'Quay lại đăng nhập'}</button>}
            {mode === 'tfa' && <button type="button" onClick={() => setMode('login')} className="w-full text-xs text-gray-500">Quay lại</button>}
            <p className="rounded-xl bg-brand-tint p-3 text-center text-xs text-gray-500">{mode === 'tfa' ? 'Demo: nhập 6 số bất kỳ.' : 'Demo: email hợp lệ bất kỳ, mật khẩu bất kỳ. Chọn vai trò để xem menu và quyền tương ứng.'}</p>
          </form>
        )}
        <p className="text-center text-xs text-gray-500">Portal nội bộ. Mọi truy cập đều được ghi nhật ký.</p>
      </div>
    </div>
  );
}

function Forbidden() {
  const navigate = useNavigate();
  return <div className="space-y-3 py-16 text-center"><p className="text-6xl font-bold text-brand-primary">403</p><h2 className="text-xl font-bold">Bạn không có quyền truy cập mục này</h2><Btn kind="primary" onClick={() => navigate('/portal')}>Về trang chủ</Btn></div>;
}

function Shell() {
  const { role, setRole, R, lvl, logout } = useStaff();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => { setDrawer(false); setMenu(false); window.scrollTo({ top: 0 }); }, [pathname]);

  const page = pathname.replace(/^\/portal\/?/, '') || 'home';
  const cur = PAGES[page];
  useEffect(() => { document.title = `${cur?.title || 'Portal'} | Portal Ánh Dương`; }, [cur]);

  const groups = {};
  Object.entries(PAGES).forEach(([id, p]) => { if (!p.hidden && lvl(id)) (groups[p.group || ''] = groups[p.group || ''] || []).push([id, p]); });
  const roleSelect = (cls = '') => <select value={role} onChange={(e) => setRole(e.target.value)} className={`fld !w-auto !py-1.5 ${cls}`} aria-label="Xem thử với vai trò">{Object.entries(ROLE_DEF).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}</select>;

  return (
    <div className="min-h-screen md:flex">
      {drawer && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setDrawer(false)} />}
      <aside className={`fixed left-0 top-0 z-40 flex h-screen w-72 shrink-0 flex-col border-r border-brand-tint2 bg-white transition-transform md:sticky md:w-64 md:translate-x-0 ${drawer ? '' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-brand-tint2 p-4"><img src={logo} alt="Ánh Dương" className="h-9 w-auto" /><button onClick={() => setDrawer(false)} className="h-10 w-10 rounded-full hover:bg-brand-tint md:hidden" aria-label="Đóng menu"><i className="fa-solid fa-xmark" /></button></div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu Portal">
          {Object.entries(groups).map(([g, items]) => (
            <div key={g}>
              {g && <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400">{g}</p>}
              {items.map(([id, p]) => <NavLink key={id} to={id === 'home' ? '/portal' : `/portal/${id}`} end={id === 'home'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><i className={`fa-solid ${p.icon} w-4 text-center`} /><span>{p.title}</span>{lvl(id) === 'v' && <i className="fa-solid fa-eye ml-auto text-xs opacity-60" title="Chỉ xem" />}</NavLink>)}
            </div>
          ))}
        </nav>
        <div className="border-t border-brand-tint2 p-3 text-xs text-gray-500">{R.label}<br />{R.campus ? CAMPUSES[R.campus].short : 'Toàn hệ thống'}</div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-brand-tint2 bg-white/95 px-4 backdrop-blur md:px-6">
          <button onClick={() => setDrawer(true)} className="h-11 w-11 rounded-full hover:bg-brand-tint md:hidden" aria-label="Mở menu"><i className="fa-solid fa-bars text-lg" /></button>
          <h1 className="flex-1 truncate text-base font-bold text-gray-900 md:text-lg">{cur?.title}</h1>
          <label className="hidden items-center gap-2 text-xs text-gray-500 lg:flex"><span className="whitespace-nowrap">Xem thử với vai trò</span>{roleSelect()}</label>
          <div className="relative">
            <button onClick={() => setMenu(!menu)} className="tap flex items-center gap-2 rounded-full pl-1 pr-3 hover:bg-brand-tint" aria-haspopup="true" aria-expanded={menu}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">{R.name.split(' ').slice(-1)[0][0]}</span><span className="hidden text-xs font-semibold sm:inline">{R.name}</span><i className="fa-solid fa-chevron-down text-xs" /></button>
            {menu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-100 bg-white py-2 text-xs shadow-xl">
                <p className="px-4 py-2 text-gray-500">{R.label}{R.campus ? ` · ${CAMPUSES[R.campus].short}` : ' · toàn hệ thống'}</p>
                <div className="px-4 py-2 lg:hidden">{roleSelect('w-full')}</div>
                <button onClick={() => navigate('/portal/profile')} className="w-full px-4 py-2.5 text-left hover:bg-brand-tint"><i className="fa-regular fa-user mr-2" />Hồ sơ &amp; đổi mật khẩu</button>
                <button onClick={() => { logout(); navigate('/portal/login'); }} className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-brand-tint"><i className="fa-solid fa-right-from-bracket mr-2" />Đăng xuất</button>
              </div>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 p-4 md:p-6">
          {!cur ? <div className="space-y-3 py-16 text-center"><p className="text-6xl font-bold text-brand-primary">404</p><Btn kind="primary" onClick={() => navigate('/portal')}>Về trang chủ</Btn></div> : lvl(page) ? cur.el : <Forbidden />}
        </main>
      </div>
    </div>
  );
}

function Gate() {
  const { session } = useStaff();
  return (
    <Routes>
      <Route path="login" element={session ? <Navigate to="/portal" replace /> : <Login />} />
      <Route path="*" element={session ? <Shell /> : <Navigate to="/portal/login" replace />} />
    </Routes>
  );
}

export default function StaffApp() {
  return <StaffProvider><Gate /></StaffProvider>;
}
