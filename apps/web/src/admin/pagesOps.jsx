import { useState } from 'react';
import { CAMPUSES, CAMPUS_OPTIONS, FAQS, FEE_ROWS } from '../shared/data.js';
import { TODAY, fmtDate, maskName, maskPhone, rule, validate } from '../shared/format.js';
import { Badge, Bilingual, Btn, Card, Confirm, Input, Modal, Note, Select, Table, Tabs, Textarea, useToast } from '../shared/ui.jsx';
import { Grid2, SaveBar, SharedNote } from './parts.jsx';
import { APP_STATUS, JOB_STATUS, LEAD_STATE, ROLES, useAdmin } from './store.jsx';

const useBilingual = (init = {}) => {
  const [v, setV] = useState(init);
  return [v, (k, val) => setV((x) => ({ ...x, [k]: val }))];
};

/* ===== Lead → CRM ===== */
export function AdmLeads() {
  const { db, scoped, isSystem, update, audit } = useAdmin();
  const toast = useToast();
  const [f, setF] = useState({ campus: '', state: '', from: '', to: '' });
  const crm = db.crm;
  const list = scoped(db.outbox).filter((r) => (!f.campus || r.campus === f.campus) && (!f.state || r.state === f.state) && (!f.from || r.date >= f.from) && (!f.to || r.date <= f.to));
  const failed = list.filter((r) => r.state !== 'Đã chuyển');

  const transfer = (ids) => update('outbox', (a) => a.map((r) => {
    if (!ids.includes(r.id)) return r;
    const crmId = `L-${1044 + r.id}`;
    audit(`Chuyển lại lead #${r.id} sang CRM (mã ${crmId})`);
    return { ...r, state: 'Đã chuyển', crmId, error: '', tries: r.tries + 1, parent: maskName(r.parent), phone: '', child: '' };
  }));
  const needOnline = () => { if (!crm.online) { toast('Chưa kết nối được CRM. Hãy kiểm tra kết nối trước.', 'error'); return false; } return true; };
  const retry = (id) => { if (needOnline()) { transfer([id]); toast('Đã chuyển lead sang CRM'); } };
  const retryAll = () => { if (needOnline()) { transfer(failed.map((r) => r.id)); toast(`Đã chuyển ${failed.length} lead sang CRM`); } };
  const test = () => {
    const online = !crm.online;
    update('crm', (c) => ({ ...c, online, last: `${TODAY} 08:30` }));
    audit(`Kiểm tra kết nối CRM: ${online ? 'thành công' : 'Portal không phản hồi'}`);
    toast(online ? 'Kết nối CRM hoạt động' : 'Không kết nối được CRM. Lead sẽ chờ trong hàng đợi.', online ? undefined : 'error');
  };

  const rows = list.map((r) => [
    fmtDate(r.date),
    r.state === 'Đã chuyển' ? <span key="p" className="text-gray-400">{r.parent} · đã ẩn</span> : <span key="p"><strong>{r.parent}</strong><br /><span className="text-gray-500">{maskPhone(r.phone)}</span></span>,
    r.child || '-', CAMPUSES[r.campus].short,
    <span key="s"><Badge tone={LEAD_STATE[r.state]}>{r.state}</Badge>{r.error && <div className="mt-1 text-red-600">{r.error}</div>}</span>,
    r.crmId || `${r.tries} lần thử`,
    r.state !== 'Đã chuyển' ? <Btn key="b" icon="fa-rotate" onClick={() => retry(r.id)}>Chuyển lại</Btn> : '',
  ]);
  const sel = (key, label, opts) => <select aria-label={label} value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} className="fld !w-auto"><option value="">{label}</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>;
  return (
    <>
      <Note>Lead tuyển sinh được xử lý trong <strong>CRM của Portal</strong> (Văn phòng, BGH cơ sở). Trang này chỉ theo dõi việc chuyển lead từ website sang CRM và chuyển lại khi có lỗi. Lead đã chuyển không còn lưu thông tin cá nhân trong CMS.</Note>
      <Card title="Kết nối CRM">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <p>Trạng thái: {crm.online ? <Badge tone="bg-green-100 text-brand-green">Đang hoạt động</Badge> : <Badge tone="bg-red-100 text-red-700">Chưa ổn định</Badge>} · Kiểm tra gần nhất {crm.last}</p>
          <div className="flex gap-2"><Btn icon="fa-plug" onClick={test}>Kiểm tra kết nối</Btn><Btn icon="fa-arrow-up-right-from-square" onClick={() => toast('Mở CRM trong Portal (demo)')}>Mở CRM trong Portal</Btn></div>
        </div>
      </Card>
      <Card title="Lead từ website" actions={failed.length ? <Btn kind="primary" icon="fa-rotate" onClick={retryAll}>Chuyển lại tất cả ({failed.length})</Btn> : null}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {isSystem && sel('campus', 'Mọi cơ sở', CAMPUS_OPTIONS)}
          {sel('state', 'Mọi trạng thái', Object.keys(LEAD_STATE).map((s) => [s, s]))}
          <label className="flex items-center gap-1 text-xs text-gray-500">Từ <input type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} className="fld !w-auto" /></label>
          <label className="flex items-center gap-1 text-xs text-gray-500">Đến <input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} className="fld !w-auto" /></label>
        </div>
        <Table heads={['Ngày', 'Phụ huynh', 'Bé', 'Cơ sở', 'Trạng thái', 'Mã CRM / số lần thử', '']} rows={rows} empty="Không có lead phù hợp." minWidth={760} />
      </Card>
      <p className="text-xs text-gray-500"><i className="fa-solid fa-shield-halved mr-1" />Lead chờ chuyển hoặc lỗi giữ đủ thông tin để chuyển lại, chỉ người có quyền được xem và tự xóa sau 3 tháng.</p>
    </>
  );
}

/* ===== Nội dung tuyển sinh ===== */
export function AdmContent() {
  const { isSystem, myCampus } = useAdmin();
  const [tab, setTab] = useState('process');
  const [scope, setScope] = useState('');
  const [v, set] = useBilingual({ sch_vi: 'Học bổng Bé ngoan; ưu đãi anh chị em' });
  const tabs = [['process', 'Quy trình nhập học'], ['fees', 'Bảng phí & Học bổng'], ['faq', 'Câu hỏi thường gặp']];
  const steps = ['Tư vấn tuyển sinh', 'Tham quan trường', 'Học trải nghiệm', 'Nộp hồ sơ', 'Đóng phí giữ chỗ', 'Nhập học'];
  const scopeSel = isSystem ? <Select label="Phạm vi" value={scope} onChange={(e) => setScope(e.target.value)} options={[['', 'Phần chung'], ...CAMPUS_OPTIONS]} /> : <p className="text-xs text-gray-600">Bạn sửa phần của <strong>{CAMPUSES[myCampus].short}</strong>.</p>;
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <Card title={tabs.find((t) => t[0] === tab)[1]}>
        {tab === 'process' && <><SharedNote show={!isSystem} /><div className="mt-3 space-y-3">{steps.map((s, i) => <Bilingual key={s} label={`Bước ${i + 1}`} name={`st${i}`} values={{ [`st${i}_vi`]: s, ...v }} onChange={set} disabled={!isSystem} />)}</div><div className="mt-4"><SaveBar what="quy trình nhập học" hidden={!isSystem} /></div></>}
        {tab === 'fees' && (
          <div className="space-y-4">{scopeSel}
            <Table heads={['Khối', 'Học phí / tháng', 'Tiền ăn / ngày']} rows={FEE_ROWS.map((r) => [r[0], <input key="a" aria-label="Học phí" className="fld" defaultValue={r[1]} />, <input key="b" aria-label="Tiền ăn" className="fld" defaultValue={r[2]} />])} />
            <Bilingual label="Học bổng & ưu đãi" name="sch" values={v} onChange={set} textarea />
            <SaveBar what="bảng phí & học bổng" />
          </div>
        )}
        {tab === 'faq' && (
          <div className="space-y-4">{scopeSel}
            {FAQS.slice(0, 2).map(([q, a], i) => <div key={q} className="space-y-2 rounded-xl bg-brand-cream p-3"><Bilingual label={`Câu hỏi ${i + 1}`} name={`fq${i}`} values={{ [`fq${i}_vi`]: q }} onChange={() => {}} /><Bilingual label="Trả lời" name={`fa${i}`} values={{ [`fa${i}_vi`]: a }} onChange={() => {}} textarea /></div>)}
            <SaveBar what="FAQ" />
          </div>
        )}
      </Card>
    </>
  );
}

/* ===== Cấu hình form & kết nối CRM ===== */
export function AdmConfig() {
  const { db, isSystem, myCampus, update, audit } = useAdmin();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const crm = db.crm;
  const camps = Object.entries(CAMPUSES).filter(([k]) => isSystem || k === myCampus);
  const test = () => { const online = !crm.online; update('crm', (c) => ({ ...c, online, last: `${TODAY} 08:30` })); audit(`Kiểm tra kết nối CRM: ${online ? 'thành công' : 'Portal không phản hồi'}`); toast(online ? 'Kết nối CRM hoạt động' : 'Không kết nối được CRM.', online ? undefined : 'error'); };
  const rotate = () => { update('crm', (c) => ({ ...c, key: `ad_live_••••••••${Math.random().toString(16).slice(2, 6)}` })); audit('Đổi khóa API kết nối CRM'); toast('Đã đổi khóa API. Cập nhật khóa mới bên Portal.'); };
  return (
    <>
      <Card title="Kết nối CRM (Portal)">
        <div className="space-y-4">
          <p className="text-xs">Trạng thái: {crm.online ? <Badge tone="bg-green-100 text-brand-green">Đang hoạt động</Badge> : <Badge tone="bg-red-100 text-red-700">Chưa ổn định</Badge>} · Kiểm tra gần nhất {crm.last}</p>
          <Grid2><Input label="Địa chỉ API tạo lead" defaultValue={crm.url} disabled={!isSystem} hint="Gọi qua HTTPS" /><Input label="Khóa API" value={crm.key} readOnly disabled hint="Khóa lưu ở kho bí mật của máy chủ, chỉ hiển thị che." /></Grid2>
          <div className="flex flex-wrap gap-2"><Btn icon="fa-plug" onClick={test}>Kiểm tra kết nối</Btn>{isSystem && <Btn kind="danger" icon="fa-key" onClick={() => setConfirm(true)}>Đổi khóa API</Btn>}</div>
          {!isSystem && <p className="text-xs text-gray-500">Chỉ Quản trị hệ thống được sửa kết nối.</p>}
        </div>
      </Card>
      <Card title="Email nhận thông báo lead mới theo cơ sở"><Grid2>{camps.map(([k, c]) => <Input key={k} label={c.short} type="email" placeholder="tuyensinh@..." />)}</Grid2><p className="mt-3 text-xs text-gray-500">Thông báo gửi khi CRM nhận được lead mới của cơ sở.</p></Card>
      <Card title="Trường trên form đăng ký (website)">
        <ul className="grid gap-2 text-xs sm:grid-cols-2">{['Họ tên phụ huynh', 'Số điện thoại', 'Cơ sở', 'Tên và tuổi của bé'].map((f) => <li key={f} className="flex items-center justify-between rounded-xl bg-brand-cream px-3 py-2">{f}<span className="text-gray-500">Bắt buộc</span></li>)}</ul>
      </Card>
      {isSystem && <Card title="Chống spam"><div className="space-y-3 text-xs">{['Ô ẩn (honeypot)', 'Giới hạn 5 lần gửi / giờ / địa chỉ IP', 'reCAPTCHA / Cloudflare Turnstile'].map((s, i) => <label key={s} className="flex items-center gap-3"><input type="checkbox" defaultChecked={i < 2} className="h-5 w-5 accent-[#8E2424]" />{s}</label>)}</div></Card>}
      <SaveBar what="cấu hình form" />
      {confirm && <Confirm message="Đổi khóa API? Khóa cũ ngừng hiệu lực ngay, cần cập nhật bên Portal." onYes={rotate} onClose={() => setConfirm(false)} />}
    </>
  );
}

/* ===== Tuyển dụng ===== */
export function JobPosts() {
  const { db, scoped, isSystem, myCampus, update, audit } = useAdmin();
  const toast = useToast();
  const [edit, setEdit] = useState(null);
  const [v, setV] = useState({});
  const [errors, setErrors] = useState({});
  const open = (job) => { setEdit(job ? job.id : 0); setV(job ? { ...job } : { title: '', campus: isSystem ? 'phutho1' : myCampus, type: 'Toàn thời gian', deadline: '', status: 'draft' }); setErrors({}); };
  const save = (e) => {
    e.preventDefault();
    const errs = validate(v, { title: [rule.required('Vui lòng nhập vị trí.')], deadline: [rule.required('Vui lòng chọn hạn nộp.')] });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (edit) update('jobs', (a) => a.map((j) => (j.id === edit ? { ...j, ...v } : j)));
    else update('jobs', (a) => [...a, { ...v, id: Date.now() }]);
    audit(`Lưu tin tuyển dụng "${v.title}"`); setEdit(null); toast('Đã lưu tin tuyển dụng');
  };
  const list = scoped(db.jobs);
  return (
    <>
      <Card title="Tin tuyển dụng" actions={<Btn kind="primary" icon="fa-plus" onClick={() => open(null)}>Đăng tin</Btn>}>
        <Table heads={['Vị trí', 'Cơ sở', 'Loại hình', 'Hạn nộp', 'Trạng thái', '']} rows={list.map((j) => [<strong key="t">{j.title}</strong>, CAMPUSES[j.campus].short, j.type, fmtDate(j.deadline), <Badge key="s" tone={JOB_STATUS[j.status][1]}>{JOB_STATUS[j.status][0]}</Badge>, <Btn key="e" onClick={() => open(j)}>Sửa</Btn>])} empty="Chưa có tin tuyển dụng." />
      </Card>
      {edit !== null && (
        <Modal title={edit ? 'Sửa tin tuyển dụng' : 'Đăng tin tuyển dụng'} onClose={() => setEdit(null)}>
          <form onSubmit={save} noValidate className="space-y-4">
            <Input label="Vị trí *" value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} error={errors.title} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Cơ sở" value={v.campus} onChange={(e) => setV({ ...v, campus: e.target.value })} options={isSystem ? CAMPUS_OPTIONS : [[myCampus, CAMPUSES[myCampus].short]]} />
              <Select label="Loại hình" value={v.type} onChange={(e) => setV({ ...v, type: e.target.value })} options={['Toàn thời gian', 'Bán thời gian'].map((x) => [x, x])} />
              <Input label="Hạn nộp *" type="date" value={v.deadline} onChange={(e) => setV({ ...v, deadline: e.target.value })} error={errors.deadline} />
              <Select label="Trạng thái" value={v.status} onChange={(e) => setV({ ...v, status: e.target.value })} options={Object.entries(JOB_STATUS).map(([k, s]) => [k, s[0]])} />
            </div>
            <Textarea label="Mô tả & yêu cầu" rows={4} />
            <div className="flex justify-end gap-2"><Btn onClick={() => setEdit(null)}>Hủy</Btn><Btn kind="primary" type="submit">Lưu</Btn></div>
          </form>
        </Modal>
      )}
    </>
  );
}

export function JobApps() {
  const { db, scoped, update, audit } = useAdmin();
  const toast = useToast();
  const [cv, setCv] = useState(null);
  const list = scoped(db.apps);
  const setStatus = (a, status) => { update('apps', (x) => x.map((r) => (r.id === a.id ? { ...r, status, seen: true } : r))); audit(`Đổi trạng thái hồ sơ ${a.name}: ${status}`); toast('Đã cập nhật trạng thái'); };
  const view = (a) => { update('apps', (x) => x.map((r) => (r.id === a.id ? { ...r, seen: true } : r))); audit(`Xem CV của ${a.name}`); setCv(a); };
  const rows = list.map((a) => [
    <span key="n"><strong>{a.name}</strong>{!a.seen && <span className="ml-1 text-xs font-bold text-brand-blue">Mới</span>}<br /><span className="text-gray-500">{a.email}</span></span>,
    db.jobs.find((j) => j.id === a.job).title, CAMPUSES[a.campus].short, fmtDate(a.date),
    <select key="s" aria-label="Trạng thái" value={a.status} onChange={(e) => setStatus(a, e.target.value)} className="fld !w-auto">{APP_STATUS.map((s) => <option key={s}>{s}</option>)}</select>,
    <Btn key="c" icon="fa-file-pdf" onClick={() => view(a)}>Xem CV</Btn>,
  ]);
  return (
    <>
      <Card title="Hồ sơ ứng tuyển" actions={<Btn icon="fa-file-export" onClick={() => { audit(`Xuất danh sách hồ sơ ứng tuyển (${list.length} dòng)`); toast('Đã xuất danh sách và ghi nhật ký (demo)'); }}>Xuất danh sách</Btn>}>
        <Table heads={['Ứng viên', 'Vị trí', 'Cơ sở', 'Ngày nộp', 'Trạng thái', '']} rows={rows} empty="Chưa có hồ sơ." minWidth={760} />
      </Card>
      <p className="text-xs text-gray-500"><i className="fa-solid fa-shield-halved mr-1" />CV chứa dữ liệu cá nhân: xem và tải đều được ghi nhật ký; tự xóa sau 3 tháng.</p>
      {cv && (
        <Modal title={`CV - ${cv.name}`} onClose={() => setCv(null)}>
          <div className="flex aspect-[3/4] max-h-96 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-tint3 bg-brand-tint text-xs text-brand-primary"><i className="fa-solid fa-file-pdf text-4xl" />Xem trước CV (demo)</div>
          <p className="text-xs text-gray-600">SĐT: {cv.phone} · Email: {cv.email}</p>
          <div className="flex justify-end"><Btn onClick={() => setCv(null)}>Đóng</Btn></div>
        </Modal>
      )}
    </>
  );
}

/* ===== Bản tin & liên hệ ===== */
export function MailSubscribers() {
  const { db, update, audit } = useAdmin();
  const toast = useToast();
  const [target, setTarget] = useState(null);
  const unsub = (s) => { update('subs', (a) => a.map((x) => (x.id === s.id ? { ...x, active: false } : x))); audit(`Hủy đăng ký bản tin #${s.id}`); toast('Đã hủy đăng ký'); };
  const n = db.subs.filter((s) => s.active).length;
  return (
    <>
      <Card title="Người đăng ký bản tin" actions={<Btn icon="fa-file-export" onClick={() => { audit(`Xuất danh sách bản tin (${n} email)`); toast(`Đã xuất ${n} email và ghi nhật ký (demo)`); }}>Xuất danh sách</Btn>}>
        <Table heads={['Email', 'Ngày đăng ký', 'Trạng thái', '']} rows={db.subs.map((s) => [s.email, fmtDate(s.date), <Badge key="b" tone={s.active ? 'bg-green-100 text-brand-green' : 'bg-gray-200 text-gray-600'}>{s.active ? 'Đang nhận' : 'Đã hủy'}</Badge>, s.active ? <Btn key="u" kind="danger" onClick={() => setTarget(s)}>Hủy đăng ký</Btn> : ''])} />
      </Card>
      {target && <Confirm message={`Hủy đăng ký của ${target.email}?`} onYes={() => unsub(target)} onClose={() => setTarget(null)} />}
    </>
  );
}

export function MailCompose() {
  const { db, audit } = useAdmin();
  const toast = useToast();
  const [v, set] = useBilingual();
  return (
    <>
      <Note>Giai đoạn 1: soạn nội dung tại đây, xuất danh sách email để gửi qua dịch vụ ngoài (Mailchimp, Brevo...). Chưa gửi trực tiếp từ hệ thống.</Note>
      <Card title="Soạn bản tin"><div className="space-y-4"><Bilingual label="Tiêu đề" name="bt" values={v} onChange={set} /><Bilingual label="Nội dung" name="bb" values={v} onChange={set} textarea /></div></Card>
      <div className="flex flex-wrap justify-end gap-2">
        <Btn onClick={() => { audit('Lưu nháp bản tin'); toast('Đã lưu nháp (demo)'); }}>Lưu nháp</Btn>
        <Btn kind="primary" icon="fa-file-export" onClick={() => { const n = db.subs.filter((s) => s.active).length; audit(`Xuất danh sách bản tin (${n} email)`); toast(`Đã xuất ${n} email và ghi nhật ký (demo)`); }}>Xuất danh sách người nhận</Btn>
      </div>
    </>
  );
}

export function MailInbox() {
  const { db, update, audit } = useAdmin();
  const toast = useToast();
  const done = (m) => { update('msgs', (a) => a.map((x) => (x.id === m.id ? { ...x, done: true } : x))); audit(`Xử lý tin nhắn liên hệ #${m.id}`); toast('Đã đánh dấu xử lý'); };
  return (
    <Card title="Hộp thư liên hệ">
      <Table heads={['Người gửi', 'Cơ sở', 'Nội dung', 'Ngày', 'Xử lý']} rows={db.msgs.map((m) => [<span key="n"><strong>{m.name}</strong><br /><span className="text-gray-500">{m.phone}</span></span>, m.campus ? CAMPUSES[m.campus].short : 'Chung toàn hệ thống', m.text, fmtDate(m.date), m.done ? <Badge key="d" tone="bg-green-100 text-brand-green">Đã xử lý</Badge> : <Btn key="b" onClick={() => done(m)}>Đánh dấu đã xử lý</Btn>])} empty="Chưa có tin nhắn." />
    </Card>
  );
}

/* ===== Hệ thống ===== */
export function Users() {
  const { db, update, audit } = useAdmin();
  const toast = useToast();
  const [add, setAdd] = useState(false);
  const [reset, setReset] = useState(null);
  const [v, setV] = useState({ name: '', email: '', role: 'campus', campus: 'phutho1' });
  const [errors, setErrors] = useState({});
  const toggle = (u) => { update('users', (a) => a.map((x) => (x.id === u.id ? { ...x, locked: !x.locked } : x))); audit(`${u.locked ? 'Mở khóa' : 'Khóa'} tài khoản ${u.name}`); toast(u.locked ? 'Đã mở khóa' : 'Đã khóa tài khoản'); };
  const save = (e) => {
    e.preventDefault();
    const errs = validate(v, { name: [rule.required('Vui lòng nhập họ tên.')], email: [rule.email(), (x) => (db.users.some((u) => u.email === x) ? 'Email đã tồn tại.' : '')] });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    update('users', (a) => [...a, { ...v, id: Date.now(), campus: v.role === 'campus' ? v.campus : '', locked: false }]);
    audit(`Tạo tài khoản ${v.name}`); setAdd(false); setV({ ...v, name: '', email: '' }); toast('Đã tạo tài khoản và gửi email mời');
  };
  return (
    <>
      <Card title="Tài khoản quản trị" actions={<Btn kind="primary" icon="fa-user-plus" onClick={() => setAdd(true)}>Thêm tài khoản</Btn>}>
        <Table heads={['Người dùng', 'Vai trò', 'Phạm vi', 'Trạng thái', '']} rows={db.users.map((u) => [<span key="n"><strong>{u.name}</strong><br /><span className="text-gray-500">{u.email}</span></span>, ROLES[u.role].label.split(' - ')[0], u.campus ? CAMPUSES[u.campus].short : 'Chung toàn hệ thống', <Badge key="s" tone={u.locked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-brand-green'}>{u.locked ? 'Đã khóa' : 'Hoạt động'}</Badge>, <div key="a" className="flex flex-wrap gap-1">{u.id !== 1 && <Btn onClick={() => toggle(u)}>{u.locked ? 'Mở khóa' : 'Khóa'}</Btn>}<Btn onClick={() => setReset(u)}>Đặt lại mật khẩu</Btn></div>])} />
      </Card>
      <Card title="Quyền theo vai trò"><p className="text-xs leading-relaxed text-gray-600"><strong>Quản trị hệ thống:</strong> toàn bộ 4 cơ sở, nội dung chung, người dùng, cài đặt, nhật ký.<br /><strong>Quản trị cơ sở:</strong> chỉ dữ liệu cơ sở được gán; xem (không sửa) nội dung chung; bài viết cần được duyệt trước khi xuất bản; không có Bản tin, Người dùng, Cài đặt, Nhật ký.</p></Card>
      {add && (
        <Modal title="Thêm tài khoản" onClose={() => setAdd(false)}>
          <form onSubmit={save} noValidate className="space-y-4">
            <Input label="Họ tên *" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} error={errors.name} />
            <Input label="Email *" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} />
            <Select label="Vai trò" value={v.role} onChange={(e) => setV({ ...v, role: e.target.value })} options={[['system', 'Quản trị hệ thống'], ['campus', 'Quản trị cơ sở']]} />
            <Select label="Cơ sở được gán" value={v.campus} onChange={(e) => setV({ ...v, campus: e.target.value })} options={CAMPUS_OPTIONS} hint="Chỉ áp dụng cho Quản trị cơ sở" />
            <div className="flex justify-end gap-2"><Btn onClick={() => setAdd(false)}>Hủy</Btn><Btn kind="primary" type="submit">Tạo và gửi lời mời</Btn></div>
          </form>
        </Modal>
      )}
      {reset && <Confirm message={`Gửi email đặt lại mật khẩu cho ${reset.email}?`} onYes={() => { audit(`Đặt lại mật khẩu ${reset.email}`); toast('Đã gửi email đặt lại mật khẩu'); }} onClose={() => setReset(null)} />}
    </>
  );
}

export function Settings() {
  const [tab, setTab] = useState('contact');
  const [v, set] = useBilingual({ seot_vi: 'Hệ Thống Giáo Dục Mầm Non Ánh Dương' });
  const tabs = [['contact', 'Liên hệ chung'], ['campus', 'Liên hệ theo cơ sở'], ['portal', 'Liên kết cổng'], ['menu', 'Menu & Logo'], ['seo', 'SEO & mạng xã hội']];
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <Card title={tabs.find((t) => t[0] === tab)[1]}>
        {tab === 'contact' && <Grid2><Input label="Hotline" defaultValue="0965 284 866" /><Input label="Zalo" defaultValue="https://zalo.me/0965284866" /><Input label="Messenger" defaultValue="https://m.me/TruongMamnonAnhDuongVT" /><Input label="Email" type="email" defaultValue="tuyensinh@anhduongschool.edu.vn" /></Grid2>}
        {tab === 'campus' && <div className="space-y-4">{Object.entries(CAMPUSES).map(([k, c]) => <div key={k} className="grid items-end gap-3 md:grid-cols-3"><p className="text-xs font-bold">{c.short}</p><Input label="Hotline" /><Input label="Email" type="email" /></div>)}</div>}
        {tab === 'portal' && <><Grid2><Input label="Địa chỉ App Phụ huynh" type="url" placeholder="https://..." hint="Nút Đăng nhập App Sổ liên lạc trên website" /><Input label="Địa chỉ Portal Giáo viên/BGH" type="url" placeholder="https://..." hint="Nút Đăng nhập Portal cán bộ" /></Grid2><p className="mt-3 text-xs text-gray-500">SSO cho hai cổng này thuộc giai đoạn 2.</p></>}
        {tab === 'menu' && <><Grid2><Input label="Logo" type="file" /><Input label="Favicon" type="file" /></Grid2><div className="mt-4 space-y-2">{['Trang Chủ', 'Giới Thiệu', 'Hệ Thống Cơ Sở', 'Chương Trình Học', 'Dinh Dưỡng', 'Thông Tin'].map((m) => <Grid2 key={m}><Input label="Menu (VI)" defaultValue={m} /><Input label="Menu (EN)" /></Grid2>)}</div></>}
        {tab === 'seo' && <div className="space-y-4"><Bilingual label="Tiêu đề mặc định" name="seot" values={v} onChange={set} /><Bilingual label="Mô tả mặc định" name="seod" values={v} onChange={set} textarea /><Input label="Ảnh chia sẻ mạng xã hội (Open Graph)" type="file" /></div>}
      </Card>
      <SaveBar what="cài đặt" />
    </>
  );
}

export function AuditLog() {
  const { db } = useAdmin();
  const [q, setQ] = useState('');
  const list = db.audit.filter((a) => !q || `${a.user} ${a.action}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Card title="Ai sửa gì, lúc nào">
      <div className="mb-4"><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo người dùng hoặc hành động..." className="fld sm:max-w-sm" aria-label="Tìm nhật ký" /></div>
      <Table heads={['Thời gian', 'Người dùng', 'Hành động']} rows={list.map((a) => [a.t, a.user, a.action])} empty="Không có bản ghi." minWidth={420} />
    </Card>
  );
}

export function Profile() {
  const { user, isSystem, audit } = useAdmin();
  const toast = useToast();
  const [v, setV] = useState({ p0: '', p1: '', p2: '' });
  const [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const errs = validate(v, {
      p0: [rule.required('Vui lòng nhập mật khẩu hiện tại.')],
      p1: [(x) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(x) ? '' : 'Mật khẩu chưa đủ mạnh.')],
      p2: [(x, all) => (x === all.p1 ? '' : 'Mật khẩu nhập lại không khớp.')],
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setV({ p0: '', p1: '', p2: '' }); audit('Đổi mật khẩu'); toast('Đã đổi mật khẩu. Các phiên khác sẽ bị đăng xuất.');
  };
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Thông tin tài khoản"><form onSubmit={(e) => { e.preventDefault(); toast('Đã lưu hồ sơ (demo)'); }} className="space-y-4"><Input label="Họ tên" defaultValue={user.name} /><Input label="Vai trò" value={user.label} disabled readOnly /><Input label="Số điện thoại" /><Btn kind="primary" type="submit">Lưu</Btn></form></Card>
        <Card title="Đổi mật khẩu"><form onSubmit={submit} noValidate className="space-y-4"><Input label="Mật khẩu hiện tại" type="password" value={v.p0} onChange={set('p0')} error={errors.p0} /><Input label="Mật khẩu mới" type="password" value={v.p1} onChange={set('p1')} error={errors.p1} hint="Tối thiểu 10 ký tự, gồm chữ hoa, chữ thường và số." /><Input label="Nhập lại mật khẩu mới" type="password" value={v.p2} onChange={set('p2')} error={errors.p2} /><Btn kind="primary" type="submit">Đổi mật khẩu</Btn></form></Card>
      </div>
      {isSystem && <Card title="Xác thực hai bước (đề xuất cho Quản trị hệ thống)"><label className="flex items-center gap-3 text-xs"><input type="checkbox" className="h-5 w-5 accent-[#8E2424]" onChange={(e) => toast(e.target.checked ? 'Đã bật xác thực hai bước (demo)' : 'Đã tắt xác thực hai bước (demo)')} />Bật xác thực hai bước bằng ứng dụng Authenticator</label></Card>}
    </>
  );
}
