import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_MENU, CAMPUSES, CAMPUS_OPTIONS, DAY_LABELS, FEE_ROWS } from '../shared/data.js';
import { TODAY, fmtDate, rule, validate } from '../shared/format.js';
import { BackLink, Badge, Bilingual, Btn, Card, Empty, Input, Modal, Note, Select, Table, Tabs, Textarea, useToast } from '../shared/ui.jsx';
import { Grid2, PhotoBox, SaveBar, SharedNote } from './parts.jsx';
import { LEAD_STATE, NEWS_CATS, NEWS_STATUS, useAdmin } from './store.jsx';

const useBilingual = (init = {}) => {
  const [v, setV] = useState(init);
  return [v, (k, val) => setV((x) => ({ ...x, [k]: val }))];
};

/* ===== Bảng điều khiển ===== */
export function Dashboard() {
  const { db, scoped, isSystem, myCampus } = useAdmin();
  const navigate = useNavigate();
  const leads = scoped(db.outbox);
  const stuck = leads.filter((r) => r.state !== 'Đã chuyển').length;
  const unseen = scoped(db.apps).filter((a) => !a.seen).length;
  const pending = scoped(db.news).filter((n) => n.status === 'pending').length;
  const states = Object.keys(LEAD_STATE);
  const max = Math.max(1, ...states.map((s) => leads.filter((r) => r.state === s).length));
  const recent = [...leads].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const kpi = (icon, tone, value, label, to) => (
    <button onClick={() => navigate(to)} className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:shadow-md">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><i className={`fa-solid ${icon}`} /></div>
      <p className="text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-gray-500">{label}</p>
    </button>
  );
  return (
    <>
      <p className="text-sm text-gray-600">{isSystem ? 'Số liệu toàn hệ thống (4 cơ sở).' : `Số liệu của ${CAMPUSES[myCampus].short}.`}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {kpi('fa-right-left', stuck ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-brand-blue', stuck, 'Lead website chưa chuyển sang CRM', '/admin/admissions/leads')}
        {kpi('fa-user-tie', 'bg-yellow-100 text-brand-gold', unseen, 'Hồ sơ ứng tuyển chưa xem', '/admin/jobs/apps')}
        {kpi('fa-newspaper', 'bg-green-100 text-brand-green', pending, 'Bài viết chờ xuất bản', '/admin/content/news')}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card title="Lead website gần đây" actions={<Btn onClick={() => navigate('/admin/admissions/leads')}>Xem tất cả</Btn>}>
            <Table heads={['Ngày', 'Cơ sở', 'Trạng thái', 'Mã CRM']} rows={recent.map((r) => [fmtDate(r.date), CAMPUSES[r.campus].short, <Badge key="s" tone={LEAD_STATE[r.state]}>{r.state}</Badge>, r.crmId || '-'])} empty="Chưa có lead." minWidth={420} />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Kết nối CRM">
            <div className="space-y-3">
              <p className="text-xs">Trạng thái: {db.crm.online ? <Badge tone="bg-green-100 text-brand-green">Đang hoạt động</Badge> : <Badge tone="bg-red-100 text-red-700">Chưa ổn định</Badge>}</p>
              {states.map((s) => { const n = leads.filter((r) => r.state === s).length; return (
                <div key={s} className="flex items-center gap-3 text-xs"><span className="w-24 shrink-0 text-gray-600">{s}</span><div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-3 rounded-full bg-brand-primary" style={{ width: `${(n / max) * 100}%` }} /></div><span className="w-6 text-right font-semibold">{n}</span></div>
              ); })}
              <p className="text-xs text-gray-500">Xử lý lead (gọi, hẹn, nhập học) thực hiện trong CRM của Portal.</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ===== Nội dung chung ===== */
const HOME_SECTIONS = ['Hero & ảnh nền', '3 Trụ cột giáo dục', 'Hai hệ chương trình (Cambridge / Chất lượng cao)', 'Hành trình nhập học (4 bước)', 'Chia sẻ của phụ huynh', 'Đơn vị đồng hành (logo đối tác)', 'Dải kêu gọi "Đăng ký ngay"'];

export function ContentHome() {
  const { isSystem } = useAdmin();
  const ro = !isSystem;
  const [v, set] = useBilingual(Object.fromEntries(HOME_SECTIONS.map((s, i) => [`h${i}t_vi`, s])));
  return (
    <>
      <SharedNote show={ro} />
      <p className="text-sm text-gray-600">Mỗi khối có nội dung Tiếng Việt và English. Tắt công tắc để ẩn khối khỏi trang chủ.</p>
      <div className="space-y-3">
        {HOME_SECTIONS.map((s, i) => (
          <details key={s} open={i === 0} className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <summary className="tap flex items-center justify-between gap-3 px-5 py-3"><span className="text-sm font-semibold"><span className="mr-2 text-brand-primary">{i + 1}.</span>{s}</span><i className="fa-solid fa-chevron-down text-xs text-brand-primary" /></summary>
            <div className="space-y-3 border-t border-gray-100 px-5 pb-5 pt-4">
              <Bilingual label="Tiêu đề" name={`h${i}t`} values={v} onChange={set} disabled={ro} />
              <Bilingual label="Nội dung" name={`h${i}b`} values={v} onChange={set} textarea disabled={ro} />
              <div className="flex flex-wrap items-center justify-between gap-3"><PhotoBox className="h-20 w-40">Ảnh</PhotoBox><label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" defaultChecked disabled={ro} className="h-5 w-5 accent-[#8E2424]" /> Hiển thị khối này</label></div>
            </div>
          </details>
        ))}
      </div>
      <SaveBar what="trang chủ" hidden={ro} />
    </>
  );
}

export function ContentAbout() {
  const { isSystem } = useAdmin();
  const ro = !isSystem;
  const [v, set] = useBilingual({ vision_vi: 'Trở thành hệ thống mầm non uy tín hàng đầu...', values_vi: 'Yêu thương, Tôn trọng, Sáng tạo' });
  const [members] = useState([['ThS. Nguyễn Thị Lan', 'Giám đốc Hội đồng Giáo dục Hệ thống'], ['Cô Hoàng Thị Nga', 'Trưởng Ban Chuyên môn Mầm non']]);
  return (
    <>
      <SharedNote show={ro} />
      <Card title="Sứ mệnh, tầm nhìn, giá trị cốt lõi">
        <div className="space-y-4">
          <Bilingual label="Câu chuyện thương hiệu" name="story" values={v} onChange={set} textarea disabled={ro} />
          <Bilingual label="Tầm nhìn & Sứ mệnh" name="vision" values={v} onChange={set} textarea disabled={ro} />
          <Bilingual label="Giá trị cốt lõi" name="values" values={v} onChange={set} textarea disabled={ro} />
        </div>
      </Card>
      <Card title="Ban quản trị & Hội đồng chuyên môn">
        <div className="space-y-3">{members.map(([n, r]) => <Grid2 key={n}><Input label="Họ tên" defaultValue={n} disabled={ro} /><Input label="Chức danh" defaultValue={r} disabled={ro} /></Grid2>)}</div>
      </Card>
      <SaveBar what="giới thiệu hệ thống" hidden={ro} />
    </>
  );
}

const PROGRAMS = [['Khối Nhà Trẻ', '12 - 36 tháng'], ['Mẫu Giáo Bé', '3 - 4 tuổi'], ['Mẫu Giáo Nhỡ', '4 - 5 tuổi'], ['Mẫu Giáo Lớn', '5 - 6 tuổi'], ['Năng khiếu & Tiếng Anh', 'Ngoài giờ chính khóa']];

export function ContentPrograms() {
  const { isSystem, audit } = useAdmin();
  const toast = useToast();
  const ro = !isSystem;
  const [edit, setEdit] = useState(null);
  const [v, set] = useBilingual();
  return (
    <>
      <SharedNote show={ro} />
      <Card title="Khối tuổi và môn học">
        <Table heads={['Chương trình', 'Độ tuổi', 'Hiển thị', '']} rows={PROGRAMS.map((p, i) => [<strong key="n">{p[0]}</strong>, p[1], <Badge key="b" tone="bg-green-100 text-brand-green">Hiển thị</Badge>, <Btn key="e" onClick={() => setEdit(i)}>{ro ? 'Xem' : 'Sửa'}</Btn>])} />
      </Card>
      {edit !== null && (
        <Modal title={PROGRAMS[edit][0]} onClose={() => setEdit(null)}>
          <Bilingual label="Mô tả ngắn" name="ps" values={v} onChange={set} textarea disabled={ro} />
          <Bilingual label="Mục tiêu phát triển" name="pg" values={v} onChange={set} textarea disabled={ro} />
          <Bilingual label="Hoạt động tiêu biểu" name="pa" values={v} onChange={set} textarea disabled={ro} />
          <div className="flex justify-end gap-2"><Btn onClick={() => setEdit(null)}>Đóng</Btn>{!ro && <Btn kind="primary" onClick={() => { audit('Lưu chương trình'); toast('Đã lưu chương trình (demo)'); setEdit(null); }}>Lưu</Btn>}</div>
        </Modal>
      )}
    </>
  );
}

/* ===== Cơ sở ===== */
export function ContentCampuses() {
  const { isSystem, myCampus } = useAdmin();
  const [pick, setPick] = useState('phutho1');
  const [tab, setTab] = useState('info');
  const campus = isSystem ? pick : myCampus;
  const c = CAMPUSES[campus];
  const tabs = [['info', 'Thông tin & bản đồ'], ['amen', 'Tiện ích cơ sở vật chất'], ['team', 'Đội ngũ'], ['fees', 'Học phí & ưu đãi']];
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {isSystem ? <Select label="Chọn cơ sở" value={pick} onChange={(e) => setPick(e.target.value)} options={CAMPUS_OPTIONS} /> : <p className="text-sm"><strong>{c.short}</strong> <span className="text-gray-500">(cơ sở của bạn)</span></p>}
      </div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <Card title={tabs.find((t) => t[0] === tab)[1]}>
        {tab === 'info' && <Grid2><Input label="Tên cơ sở" defaultValue={c.short} /><Input label="Hotline cơ sở" defaultValue="0965 284 866" hint="Đang dùng chung số hệ thống" /><Input className="md:col-span-2" label="Địa chỉ" defaultValue={c.addr} /><Input label="Email tuyển sinh" type="email" /><Input label="Liên kết bản đồ (Google Maps)" placeholder="https://maps.google.com/..." /></Grid2>}
        {tab === 'amen' && <div className="space-y-3">{['An ninh: Camera 24/7', 'Bếp ăn 1 chiều đạt chuẩn ATTP', 'Sân chơi ngoài trời'].map((a) => <Grid2 key={a}><Input label="Tiện ích (VI)" defaultValue={a} /><Input label="Amenity (EN)" /></Grid2>)}<div className="grid grid-cols-3 gap-3 pt-2">{[1, 2, 3].map((n) => <PhotoBox key={n}>Ảnh</PhotoBox>)}</div></div>}
        {tab === 'team' && <div className="space-y-3">{['Hiệu trưởng', 'Phó hiệu trưởng chuyên môn', 'Giáo viên chủ nhiệm Nhà trẻ'].map((r) => <div key={r} className="grid gap-3 md:grid-cols-3"><Input label="Họ tên" /><Input label="Chức vụ" defaultValue={r} /><Input label="Ảnh" type="file" /></div>)}</div>}
        {tab === 'fees' && (
          <>
            <Table heads={['Khối', 'Học phí / tháng', 'Tiền ăn / ngày']} rows={FEE_ROWS.map((f) => [f[0], <input key="a" aria-label="Học phí" className="fld" defaultValue={f[1]} />, <input key="b" aria-label="Tiền ăn" className="fld" defaultValue={f[2]} />])} />
            <div className="mt-4"><Textarea label="Chính sách ưu đãi địa phương" defaultValue="Giảm học phí cho bé thứ hai trở đi." /></div>
          </>
        )}
      </Card>
      <SaveBar what={`cơ sở ${c.short}`} />
    </>
  );
}

/* ===== Dinh dưỡng ===== */
export function ContentNutrition() {
  const { isSystem, myCampus } = useAdmin();
  const [pick, setPick] = useState('phutho1');
  const campus = isSystem ? pick : myCampus;
  const ro = !isSystem;
  const [v, set] = useBilingual({ pick_vi: '1. Đăng ký người đón. 2. Xác thực khi đón...' });
  const toast = useToast();
  return (
    <>
      <div className="flex flex-wrap items-end gap-3">
        {isSystem ? <Select label="Cơ sở" value={pick} onChange={(e) => setPick(e.target.value)} options={CAMPUS_OPTIONS} /> : <p className="text-sm"><strong>{CAMPUSES[campus].short}</strong></p>}
        <Input label="Tuần" type="date" defaultValue="2026-10-05" />
      </div>
      <Card title={`Thực đơn tuần - ${CAMPUSES[campus].short}`} actions={<Btn icon="fa-copy" onClick={() => toast('Đã sao chép thực đơn tuần trước (demo)')}>Sao chép từ tuần trước</Btn>}>
        <Table heads={['Thứ', 'Bữa sáng', 'Bữa trưa', 'Bữa chiều']} minWidth={640} rows={BASE_MENU.map((d, i) => [<strong key="d">{DAY_LABELS[i]}</strong>, ...d.map((m, j) => <input key={j} aria-label={`${DAY_LABELS[i]} bữa ${j + 1}`} className="fld" defaultValue={m} />)])} />
      </Card>
      <SaveBar what="thực đơn tuần" />
      <Card title={<>Quy trình y tế, an toàn, đón trả trẻ{ro && <i className="fa-solid fa-lock ml-2 text-xs text-gray-400" />}</>}>
        <div className="space-y-3"><Bilingual label="Quy trình đón trả trẻ" name="pick" values={v} onChange={set} textarea disabled={ro} /><Bilingual label="Theo dõi y tế" name="med" values={v} onChange={set} textarea disabled={ro} /></div>
      </Card>
      <SaveBar what="quy trình y tế, an toàn" hidden={ro} />
    </>
  );
}

/* ===== Tin tức ===== */
export function ContentNews() {
  const { db, scoped, isSystem, update, audit } = useAdmin();
  const navigate = useNavigate();
  const toast = useToast();
  const [status, setStatus] = useState('');
  const [campus, setCampus] = useState('');
  const list = scoped(db.news).filter((n) => (!status || n.status === status) && (!campus || n.campus === campus));
  const approve = (n) => { update('news', (a) => a.map((x) => (x.id === n.id ? { ...x, status: 'published' } : x))); audit(`Duyệt và xuất bản bài "${n.title}"`); toast('Đã duyệt và xuất bản bài viết'); };
  const rows = list.map((n) => [
    <span key="t"><strong>{n.title}</strong><br /><span className="text-gray-500">{n.cat}</span></span>,
    n.campus ? CAMPUSES[n.campus].short : 'Chung toàn hệ thống',
    <Badge key="s" tone={NEWS_STATUS[n.status][1]}>{NEWS_STATUS[n.status][0]}</Badge>,
    n.author, fmtDate(n.date),
    <div key="a" className="flex flex-wrap gap-1"><Btn onClick={() => navigate(`/admin/content/news/${n.id}`)}>Sửa</Btn>{isSystem && n.status === 'pending' && <Btn kind="green" onClick={() => approve(n)}>Duyệt</Btn>}</div>,
  ]);
  return (
    <>
      {!isSystem && <Note>Bài của cơ sở cần Quản trị hệ thống duyệt trước khi xuất bản.</Note>}
      <Card title="Danh sách bài viết" actions={<Btn kind="primary" icon="fa-plus" onClick={() => navigate('/admin/content/news/new')}>Viết bài mới</Btn>}>
        <div className="mb-4 flex flex-wrap gap-2">
          <select aria-label="Lọc trạng thái" value={status} onChange={(e) => setStatus(e.target.value)} className="fld !w-auto"><option value="">Mọi trạng thái</option>{Object.entries(NEWS_STATUS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select>
          {isSystem && <select aria-label="Lọc cơ sở" value={campus} onChange={(e) => setCampus(e.target.value)} className="fld !w-auto"><option value="">Mọi cơ sở</option>{CAMPUS_OPTIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>}
        </div>
        <Table heads={['Bài viết', 'Cơ sở', 'Trạng thái', 'Tác giả', 'Ngày', '']} rows={rows} empty="Không có bài viết phù hợp." minWidth={720} />
      </Card>
    </>
  );
}

export function NewsEdit() {
  const { id } = useParams();
  const { db, update, audit, isSystem, myCampus, user } = useAdmin();
  const navigate = useNavigate();
  const toast = useToast();
  const isNew = id === 'new';
  const existing = isNew ? null : db.news.find((n) => String(n.id) === id);
  const [v, setV] = useState(() => existing || { title: '', titleEn: '', cat: NEWS_CATS[0], campus: myCampus, body: '', bodyEn: '', status: 'draft' });
  const [errors, setErrors] = useState({});
  const allowed = isNew || (existing && (isSystem || existing.campus === myCampus));
  if (!allowed) return <div className="py-16 text-center"><p className="text-6xl font-bold text-brand-primary">404</p><p className="mt-2 text-sm text-gray-600">Không tìm thấy dữ liệu.</p><Btn kind="primary" className="mt-4" onClick={() => navigate('/admin/content/news')}>Về danh sách</Btn></div>;

  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));
  const save = (status) => {
    const errs = validate(v, { title: [rule.required('Vui lòng nhập tiêu đề.')] });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const label = { draft: 'Lưu nháp', pending: 'Gửi duyệt', published: 'Xuất bản' }[status];
    if (isNew) update('news', (a) => [{ ...v, id: Date.now(), status, author: user.name, date: TODAY }, ...a]);
    else update('news', (a) => a.map((x) => (x.id === existing.id ? { ...x, ...v, status } : x)));
    audit(`${label} bài "${v.title}"`);
    toast(status === 'pending' ? 'Đã gửi duyệt cho Quản trị hệ thống' : status === 'published' ? 'Đã xuất bản' : 'Đã lưu nháp');
    navigate('/admin/content/news');
  };
  const st = NEWS_STATUS[v.status];
  return (
    <>
      <BackLink onClick={() => navigate('/admin/content/news')}>Tất cả bài viết</BackLink>
      <Card title="Nội dung">
        <div className="space-y-4">
          <Grid2><Input label="Tiêu đề (Tiếng Việt)" value={v.title} onChange={set('title')} error={errors.title} /><Input label="Tiêu đề (English)" value={v.titleEn} onChange={set('titleEn')} /></Grid2>
          <Grid2><Textarea label="Nội dung (Tiếng Việt)" rows={8} value={v.body} onChange={set('body')} /><Textarea label="Nội dung (English)" rows={8} value={v.bodyEn} onChange={set('bodyEn')} /></Grid2>
        </div>
      </Card>
      <Card title="Thiết lập">
        <div className="grid gap-4 md:grid-cols-3">
          <Select label="Danh mục" value={v.cat} onChange={set('cat')} options={NEWS_CATS.map((c) => [c, c])} />
          <Select label="Cơ sở" value={v.campus} onChange={set('campus')} options={isSystem ? [['', 'Chung toàn hệ thống'], ...CAMPUS_OPTIONS] : [[myCampus, CAMPUSES[myCampus].short]]} />
          <Input label="Ảnh bìa" type="file" />
        </div>
        <p className="mt-3 text-xs text-gray-500">Trạng thái hiện tại: <Badge tone={st[1]}>{st[0]}</Badge></p>
      </Card>
      <div className="flex flex-wrap justify-end gap-2">
        <Btn onClick={() => save('draft')}>Lưu nháp</Btn>
        {isSystem ? <Btn kind="primary" icon="fa-globe" onClick={() => save('published')}>Xuất bản</Btn> : <Btn kind="primary" icon="fa-paper-plane" onClick={() => save('pending')}>Gửi duyệt</Btn>}
      </div>
    </>
  );
}

/* ===== Thư viện ===== */
export function ContentGallery() {
  const { db, scoped, isSystem, myCampus, update, audit } = useAdmin();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ t: '', campus: isSystem ? 'phutho1' : myCampus });
  const [err, setErr] = useState('');
  const list = scoped(db.albums);
  const create = (e) => {
    e.preventDefault();
    if (!v.t.trim()) { setErr('Vui lòng nhập tên album.'); return; }
    update('albums', (a) => [...a, { t: v.t.trim(), campus: v.campus, n: 0 }]);
    audit(`Tạo album "${v.t.trim()}"`); setOpen(false); setV({ ...v, t: '' }); setErr(''); toast('Đã tạo album');
  };
  return (
    <>
      <Card title="Album ảnh & video" actions={<Btn kind="primary" icon="fa-plus" onClick={() => setOpen(true)}>Tạo album</Btn>}>
        {list.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{list.map((a) => <div key={a.t} className="space-y-2"><PhotoBox><span>{a.n} ảnh</span></PhotoBox><p className="text-xs font-bold">{a.t}</p><p className="text-xs text-gray-500">{CAMPUSES[a.campus].short}</p></div>)}</div> : <Empty>Chưa có album.</Empty>}
      </Card>
      {open && (
        <Modal title="Tạo album" onClose={() => setOpen(false)}>
          <form onSubmit={create} noValidate className="space-y-4">
            <Input label="Tên album *" value={v.t} onChange={(e) => setV({ ...v, t: e.target.value })} error={err} />
            <Select label="Cơ sở" value={v.campus} onChange={(e) => setV({ ...v, campus: e.target.value })} options={isSystem ? CAMPUS_OPTIONS : [[myCampus, CAMPUSES[myCampus].short]]} />
            <div className="flex justify-end gap-2"><Btn onClick={() => setOpen(false)}>Hủy</Btn><Btn kind="primary" type="submit">Tạo</Btn></div>
          </form>
        </Modal>
      )}
    </>
  );
}

const ICONS = { image: 'fa-image', file: 'fa-file-pdf', video: 'fa-film' };
export function ContentMedia() {
  const { db, update, audit } = useAdmin();
  const toast = useToast();
  const [err, setErr] = useState('');
  const upload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const msg = rule.file({ exts: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4'], maxMb: 10 })(f);
    setErr(msg);
    if (msg) { e.target.value = ''; return; }
    const kind = /\.pdf$/i.test(f.name) ? 'file' : /\.mp4$/i.test(f.name) ? 'video' : 'image';
    update('media', (m) => [[f.name, kind], ...m]);
    audit(`Tải lên "${f.name}"`); toast('Đã tải lên (demo)');
  };
  return (
    <Card title="Kho ảnh & tài liệu dùng chung">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="tap inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-primary px-4 text-xs font-semibold text-white hover:bg-brand-deep"><i className="fa-solid fa-upload" />Tải lên<input type="file" className="sr-only" accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4" onChange={upload} /></label>
          <span className="text-xs text-gray-500">JPG, PNG, WEBP, PDF, MP4 · tối đa 10MB</span>
        </div>
        {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {db.media.map(([n, k]) => <div key={n} className="space-y-1 text-center text-xs"><div className="flex aspect-square items-center justify-center rounded-xl bg-brand-tint text-3xl text-brand-primary"><i className={`fa-regular ${ICONS[k]}`} /></div><p className="truncate" title={n}>{n}</p></div>)}
        </div>
      </div>
    </Card>
  );
}
