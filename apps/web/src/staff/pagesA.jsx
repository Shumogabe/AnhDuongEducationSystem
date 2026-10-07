import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAMPUSES, DAY_LABELS, menuFor, BASE_MENU } from '../shared/data.js';
import { TODAY, fmtDate, isPhone, nowHM, rule, validate } from '../shared/format.js';
import { Badge, Btn, Card, Input, Modal, Note, Select, Table, Tabs, Textarea, useToast } from '../shared/ui.jsx';
import { CLASSES, useStaff } from './store.jsx';

const ro = (text) => <Note kind="lock">{text || 'Bạn chỉ có quyền xem mục này.'}</Note>;
const Stat = ({ icon, tone, value, label, to }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/portal/${to}`)} className="rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:shadow-md">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><i className={`fa-solid ${icon}`} /></div>
      <p className="text-2xl font-bold">{value}</p><p className="text-xs text-gray-500">{label}</p>
    </button>
  );
};

/* ===== Trang chủ ===== */
function Home() {
  const { role, R, db, update, audit, myStudents, inScope } = useStaff();
  const navigate = useNavigate();
  const toast = useToast();
  const kids = myStudents;
  const mine = db.checkins.find((c) => c.name === R.name);
  const money = (n) => `${n.toLocaleString('vi-VN')}đ`;
  const due = db.fees.filter((f) => f.status !== 'Đã đóng' && f.status !== 'Đã hủy' && inScope(db.students.find((s) => s.id === f.kid).campus));
  const grid = (children) => <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;
  const checkIn = () => { update('checkins', (a) => [...a, { id: Date.now(), name: R.name, in: nowHM(), out: '' }]); audit('Chấm công vào'); toast('Đã chấm công vào'); };
  const checkOut = () => { update('checkins', (a) => a.map((c) => (c.name === R.name ? { ...c, out: nowHM() } : c))); audit('Chấm công ra'); toast('Đã chấm công ra'); };

  let cards = null;
  if (role === 'gvcn' || role === 'gvnk') {
    cards = (
      <>
        {grid(<>
          <Stat icon="fa-clipboard-user" tone="bg-yellow-100 text-brand-gold" value={kids.filter((k) => !db.att[k.id]).length} label="Chưa điểm danh" to="class" />
          <Stat icon="fa-book-open" tone="bg-blue-100 text-brand-blue" value={kids.filter((k) => !db.diary[k.id]).length} label="Chưa nhập nhật ký" to="class" />
          <Stat icon="fa-pills" tone="bg-green-100 text-brand-green" value={db.meds.filter((m) => kids.some((k) => k.id === m.kid) && m.status !== 'Đã cho uống').length} label="Đơn thuốc chờ" to="class" />
          <Stat icon="fa-comments" tone="bg-brand-tint2 text-brand-primary" value={db.threads.filter((t) => t.cls === R.cls).reduce((s, t) => s + t.unread, 0)} label="Tin nhắn chưa đọc" to="comms" />
        </>)}
        <div className="flex flex-wrap gap-2"><Btn kind="primary" icon="fa-clipboard-user" onClick={() => navigate('/portal/class')}>Điểm danh lớp</Btn><Btn icon="fa-qrcode" onClick={() => navigate('/portal/pickup')}>Quét QR đón</Btn><Btn icon="fa-book" onClick={() => navigate('/portal/lessons')}>Nộp giáo án</Btn></div>
      </>
    );
  } else if (role === 'yte') cards = grid(<><Stat icon="fa-pills" tone="bg-green-100 text-brand-green" value={db.meds.filter((m) => m.status !== 'Đã cho uống').length} label="Đơn thuốc cần xử lý" to="health" /><Stat icon="fa-triangle-exclamation" tone="bg-yellow-100 text-brand-gold" value={db.students.filter((s) => s.allergy && inScope(s.campus)).length} label="Bé có dị ứng" to="health" /></>);
  else if (role === 'bep') cards = grid(<><Stat icon="fa-triangle-exclamation" tone="bg-yellow-100 text-brand-gold" value={db.students.filter((s) => s.allergy && inScope(s.campus)).length} label="Bé cần tránh món" to="menu" /><Stat icon="fa-utensils" tone="bg-green-100 text-brand-green" value="5" label="Ngày có thực đơn tuần này" to="menu" /></>);
  else if (role === 'ketoan') cards = grid(<><Stat icon="fa-triangle-exclamation" tone="bg-red-100 text-red-700" value={due.filter((f) => f.status === 'Quá hạn').length} label="Khoản quá hạn" to="fees" /><Stat icon="fa-wallet" tone="bg-yellow-100 text-brand-gold" value={money(due.reduce((s, f) => s + f.amount, 0))} label="Công nợ" to="fees" /><Stat icon="fa-receipt" tone="bg-green-100 text-brand-green" value={db.fees.filter((f) => f.receipt && f.status === 'Đã đóng').length} label="Biên lai đã xuất" to="fees" /></>);
  else if (role === 'vanphong') cards = grid(<><Stat icon="fa-user-plus" tone="bg-blue-100 text-brand-blue" value={db.leads.filter((l) => l.status === 'Mới' && inScope(l.campus)).length} label="Lead mới cần xử lý" to="crm" /><Stat icon="fa-children" tone="bg-green-100 text-brand-green" value={db.students.filter((s) => inScope(s.campus) && !s.account).length} label="Học sinh chưa có tài khoản App" to="students" /></>);
  else if (role === 'bgh') cards = grid(<><Stat icon="fa-people-group" tone="bg-green-100 text-brand-green" value={db.students.filter((s) => inScope(s.campus)).length} label="Học sinh đang học" to="students" /><Stat icon="fa-book" tone="bg-blue-100 text-brand-blue" value={db.plans.filter((p) => p.status === 'sent').length} label="Giáo án chờ duyệt" to="lessons" /><Stat icon="fa-user-clock" tone="bg-yellow-100 text-brand-gold" value={db.ots.filter((o) => o.status === 'Chờ duyệt').length} label="Tăng ca chờ duyệt" to="hr" /><Stat icon="fa-calendar-xmark" tone="bg-brand-tint2 text-brand-primary" value={db.leaves.filter((l) => l.status === 'Chờ xác nhận').length} label="Xin nghỉ chờ" to="class" /></>);
  else if (role === 'lanhdao') cards = <><Note>Bạn có quyền chỉ xem báo cáo toàn hệ thống, không sửa dữ liệu gốc.</Note><div><Btn kind="primary" icon="fa-chart-column" onClick={() => navigate('/portal/reports')}>Mở Dashboard HQ</Btn></div></>;
  else cards = grid(<Stat icon="fa-users-gear" tone="bg-blue-100 text-brand-blue" value={db.accounts.length} label="Tài khoản nhân sự" to="admin" />);

  return (
    <>
      <div><p className="text-xs text-gray-500">{fmtDate(TODAY)} · {R.label}</p><h2 className="text-xl font-bold">Xin chào, {R.name}</h2></div>
      {cards}
      {role !== 'lanhdao' && role !== 'admin' && (
        <Card title="Chấm công của tôi">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">{mine ? <>Đã chấm vào lúc <strong>{mine.in}</strong>{mine.out && <>, ra lúc <strong>{mine.out}</strong></>}</> : 'Hôm nay bạn chưa chấm công.'}</p>
            {mine ? (!mine.out && <Btn icon="fa-right-from-bracket" onClick={checkOut}>Chấm ra</Btn>) : <Btn kind="primary" icon="fa-fingerprint" onClick={checkIn}>Chấm vào</Btn>}
          </div>
        </Card>
      )}
    </>
  );
}

/* ===== Lớp của tôi ===== */
const eatOptions = ['', 'Ăn hết suất', 'Ăn 3/4 suất', 'Ăn nửa suất', 'Ăn ít', 'Không ăn'].map((x) => [x, x || 'Chưa ghi']);

function Attendance() {
  const { role, db, update, audit, myStudents, lvl } = useStaff();
  const toast = useToast();
  const readOnly = lvl('class') !== 'm';
  const kids = myStudents;
  const cnt = (v) => kids.filter((k) => db.att[k.id] === v).length;
  const set = (id, v) => update('att', (a) => ({ ...a, [id]: v }));
  const save = () => { const n = kids.filter((k) => !db.att[k.id]).length; if (n) { toast(`${n} bé chưa được điểm danh`, 'error'); return; } audit('Lưu điểm danh lớp'); toast('Đã lưu điểm danh. Phụ huynh sẽ thấy trên App.'); };
  const seg = (k, v, label, cls) => <button key={v} disabled={readOnly} aria-pressed={db.att[k.id] === v} onClick={() => set(k.id, v)} className={`seg ${db.att[k.id] === v ? cls : ''}`}>{label}</button>;
  return (
    <Card title={`Điểm danh ${fmtDate(TODAY)}`}>
      <div className="mb-3 flex flex-wrap gap-3 text-xs"><span className="font-bold text-brand-green">Có mặt {cnt('ok')}</span><span className="font-bold text-brand-gold">Vắng có phép {cnt('leave')}</span><span className="font-bold text-red-600">Vắng không phép {cnt('abs')}</span><span className="text-gray-500">Chưa điểm danh {kids.filter((k) => !db.att[k.id]).length}</span></div>
      <div className="space-y-2">
        {kids.map((k) => (
          <div key={k.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-cream p-2">
            <span className="flex items-center gap-2 text-sm font-semibold"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint2 text-xs text-brand-primary">{k.name.replace('Bé ', '')[0]}</span>{k.name}{k.allergy && <i className="fa-solid fa-triangle-exclamation text-xs text-brand-gold" title={`Dị ứng: ${k.allergy}`} />}</span>
            <span className="inline-flex">{seg(k, 'ok', 'Có mặt', 'on-ok')}{seg(k, 'leave', 'Có phép', 'on-leave')}{seg(k, 'abs', 'Không phép', 'on-abs')}</span>
          </div>
        ))}
      </div>
      {!readOnly && <div className="mt-4 flex flex-wrap justify-end gap-2"><Btn icon="fa-check-double" onClick={() => update('att', (a) => { const n = { ...a }; kids.forEach((k) => { if (!n[k.id]) n[k.id] = 'ok'; }); return n; })}>Đánh dấu cả lớp có mặt</Btn><Btn kind="primary" icon="fa-floppy-disk" onClick={save}>Lưu điểm danh</Btn></div>}
    </Card>
  );
}

const blankDiary = { breakfast: 'Ăn hết suất', lunch: 'Ăn hết suất', dinner: '', sleepFrom: '12:20', sleepTo: '14:20', wc: '2 lần, bình thường', mood: 'Vui vẻ', remark: '' };

function DiaryEntry() {
  const { db, update, audit, myStudents, lvl, kidName } = useStaff();
  const toast = useToast();
  const readOnly = lvl('class') !== 'm';
  const kids = myStudents;
  const [kidId, setKidId] = useState(kids[0]?.id || '');
  const k = kids.find((x) => x.id === kidId) || kids[0];
  const [form, setForm] = useState(() => db.diary[kids[0]?.id] || blankDiary);
  const [photoErr, setPhotoErr] = useState('');
  if (!k) return <Card title="Nhật ký"><p className="py-6 text-center text-sm text-gray-500">Chưa có học sinh.</p></Card>;
  const pick = (id) => { setKidId(id); setForm(db.diary[id] || blankDiary); setPhotoErr(''); };
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const save = (e) => {
    e.preventDefault();
    const file = e.target.elements.photo?.files[0];
    if (file) {
      const msg = rule.file({ exts: ['jpg', 'jpeg', 'png'], maxMb: 5 })(file);
      if (msg) { setPhotoErr(msg.replace('file', 'ảnh')); return; }
    }
    update('diary', (d) => ({ ...d, [k.id]: form }));
    audit(`Lưu nhật ký ${kidName(k.id)}`); toast(`Đã lưu nhật ký của ${k.name}`);
  };
  const applyAll = () => { update('diary', (d) => { const n = { ...d }; kids.forEach((x) => { n[x.id] = { ...(n[x.id] || form), breakfast: form.breakfast, lunch: form.lunch, dinner: form.dinner, sleepFrom: form.sleepFrom, sleepTo: form.sleepTo }; }); return n; }); audit('Áp dụng ăn/ngủ cho cả lớp'); toast('Đã áp dụng cho cả lớp. Nhận xét cần nhập riêng từng bé.'); };
  return (
    <Card title={`Nhật ký ngày ${fmtDate(TODAY)}`}>
      <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">{kids.map((x) => <button key={x.id} onClick={() => pick(x.id)} className={`tab-btn ${x.id === k.id ? 'active' : ''}`}>{x.name}{db.diary[x.id] ? ' ✓' : ''}</button>)}</div>
      <form onSubmit={save} noValidate className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3"><Select label="Bữa sáng" value={form.breakfast} onChange={set('breakfast')} options={eatOptions} disabled={readOnly} /><Select label="Bữa trưa" value={form.lunch} onChange={set('lunch')} options={eatOptions} disabled={readOnly} /><Select label="Bữa chiều" value={form.dinner} onChange={set('dinner')} options={eatOptions} disabled={readOnly} /></div>
        <div className="grid gap-3 sm:grid-cols-4"><Input label="Ngủ từ" type="time" value={form.sleepFrom} onChange={set('sleepFrom')} disabled={readOnly} /><Input label="Dậy lúc" type="time" value={form.sleepTo} onChange={set('sleepTo')} disabled={readOnly} /><Input label="Vệ sinh" value={form.wc} onChange={set('wc')} disabled={readOnly} /><Select label="Tâm trạng" value={form.mood} onChange={set('mood')} options={['Vui vẻ', 'Hào hứng', 'Hơi mệt', 'Quấy khóc', 'Trầm lặng'].map((x) => [x, x])} disabled={readOnly} /></div>
        <Textarea label="Nhận xét" placeholder="Nhận xét ngắn về bé hôm nay" value={form.remark} onChange={set('remark')} disabled={readOnly} />
        <Input label="Ảnh hoạt động" type="file" name="photo" accept="image/*" disabled={readOnly || !k.consent} error={photoErr} hint={k.consent ? 'Chỉ ảnh JPG/PNG, tối đa 5MB. Ảnh tự xóa sau 6 tháng.' : <span className="font-semibold text-red-600">Phụ huynh chưa đồng ý chụp và hiển thị ảnh của bé này. Không đăng ảnh.</span>} />
        {!readOnly && <div className="flex flex-wrap justify-end gap-2"><Btn icon="fa-copy" onClick={applyAll}>Áp dụng ăn/ngủ cho cả lớp</Btn><Btn kind="primary" type="submit">Lưu nhật ký</Btn></div>}
      </form>
    </Card>
  );
}

function LeaveReview() {
  const { db, update, audit, myStudents, kidName, lvl } = useStaff();
  const toast = useToast();
  const can = lvl('class') === 'm';
  const tone = { 'Chờ xác nhận': 'bg-yellow-100 text-brand-gold', 'Đã xác nhận': 'bg-green-100 text-brand-green', 'Từ chối': 'bg-red-100 text-red-700' };
  const list = db.leaves.filter((l) => myStudents.some((k) => k.id === l.kid));
  const set = (id, st) => { update('leaves', (a) => a.map((l) => (l.id === id ? { ...l, status: st } : l))); audit(`Đơn xin nghỉ #${id}: ${st}`); toast(st === 'Đã xác nhận' ? 'Đã xác nhận, phụ huynh sẽ thấy trạng thái' : 'Đã từ chối đơn'); };
  return (
    <Card title="Đơn xin nghỉ">
      <Table heads={['Bé', 'Thời gian', 'Lý do', 'Trạng thái', '']} rows={list.map((l) => [kidName(l.kid), fmtDate(l.from) + (l.to !== l.from ? ` - ${fmtDate(l.to)}` : ''), l.reason, <Badge key="b" tone={tone[l.status]}>{l.status}</Badge>, l.status === 'Chờ xác nhận' && can ? <div key="a" className="flex gap-1"><Btn kind="green" onClick={() => set(l.id, 'Đã xác nhận')}>Xác nhận</Btn><Btn kind="danger" onClick={() => set(l.id, 'Từ chối')}>Từ chối</Btn></div> : ''])} empty="Chưa có đơn xin nghỉ." />
    </Card>
  );
}

export function MedsTable({ kidIds, can }) {
  const { db, update, audit, kidName, R } = useStaff();
  const toast = useToast();
  const tone = { 'Đã gửi': 'bg-blue-100 text-brand-blue', 'Cô đã nhận': 'bg-yellow-100 text-brand-gold', 'Đã cho uống': 'bg-green-100 text-brand-green', 'Cần liên hệ': 'bg-red-100 text-red-700' };
  const set = (m, st) => { update('meds', (a) => a.map((x) => (x.id === m.id ? { ...x, status: st, by: st === 'Đã cho uống' ? `${R.name} lúc ${nowHM()}` : x.by } : x))); audit(`Đơn thuốc ${kidName(m.kid)}: ${st}`); toast('Đã cập nhật, phụ huynh sẽ thấy trạng thái'); };
  const act = (m) => { if (!can) return ''; if (m.status === 'Đã gửi') return <Btn onClick={() => set(m, 'Cô đã nhận')}>Xác nhận đã nhận</Btn>; if (m.status === 'Cô đã nhận') return <div className="flex gap-1"><Btn kind="green" onClick={() => set(m, 'Đã cho uống')}>Đã cho uống</Btn><Btn kind="danger" onClick={() => set(m, 'Cần liên hệ')}>Cần liên hệ</Btn></div>; return ''; };
  return (
    <Card title="Đơn dặn thuốc">
      <Table heads={['Bé', 'Thuốc', 'Liều', 'Giờ', 'Trạng thái', '']} minWidth={640} rows={db.meds.filter((m) => kidIds.includes(m.kid)).map((m) => [kidName(m.kid), m.drug, m.dose, m.time, <span key="s"><Badge tone={tone[m.status]}>{m.status}</Badge>{m.by && <div className="mt-1 text-gray-500">{m.by}</div>}</span>, act(m)])} empty="Không có đơn thuốc." />
    </Card>
  );
}

function Class() {
  const { role, myStudents, R } = useStaff();
  const [tab, setTab] = useState('att');
  const limited = role === 'gvnk';
  const tabs = [['att', 'Điểm danh'], ['diary', 'Nhật ký'], ['leave', 'Xin nghỉ'], ['meds', 'Đơn thuốc']].filter((t) => !limited || t[0] === 'att' || t[0] === 'diary');
  const cls = role === 'bgh' ? null : CLASSES[R.cls];
  return (
    <>
      <div><h2 className="font-bold">{cls ? cls.name : `Toàn cơ sở ${CAMPUSES[R.campus].short}`}</h2><p className="text-xs text-gray-500">{cls ? `${cls.teacher} · ` : ''}{myStudents.length} bé</p></div>
      {role === 'bgh' && ro('BGH xem toàn cơ sở, không nhập nhật ký thay giáo viên.')}
      {limited && ro('GV năng khiếu/bảo mẫu chỉ nhập điểm danh và nhật ký phần được giao.')}
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'att' && <Attendance />}
      {tab === 'diary' && <DiaryEntry />}
      {tab === 'leave' && <LeaveReview />}
      {tab === 'meds' && <MedsTable kidIds={myStudents.map((k) => k.id)} can={role !== 'bgh'} />}
    </>
  );
}

/* ===== Đón trả ===== */
function Pickup() {
  const { db, update, audit, myStudents, lvl, R, kidName } = useStaff();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [scan, setScan] = useState(null);
  const [exc, setExc] = useState(false);
  const manage = lvl('pickup') === 'm';
  const demo = (state) => {
    const kid = myStudents.find((k) => k.id === 'bin') || myStudents[0];
    setScan({ state, kid, who: state === 'proxy' ? 'Lê Thị Cúc (đón hộ, mã tạm)' : 'Nguyễn Thị Hoa (Mẹ)' });
  };
  const check = () => (/^AD-[A-Z2-9]{10}$/.test(code.trim()) ? demo('ok') : setScan({ state: 'bad' }));
  const confirm = () => {
    update('pickLog', (a) => [{ t: nowHM(), kid: scan.kid.id, who: scan.who, by: R.name, ok: true }, ...a]);
    update('att', (a) => ({ ...a, [scan.kid.id]: a[scan.kid.id] || 'ok' }));
    audit(`Quét QR đón: ${scan.kid.name}`); toast('Đã ghi nhận bàn giao. Phụ huynh thấy giờ về trên App.'); setScan(null);
  };
  const result = () => {
    if (!scan) return <div className="flex min-h-[140px] items-center justify-center text-center text-sm text-gray-400">Quét hoặc nhập mã để xem thông tin đón.</div>;
    if (scan.state !== 'ok' && scan.state !== 'proxy') return <div className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4"><p className="font-bold text-red-700"><i className="fa-solid fa-circle-xmark mr-2" />{{ expired: 'Mã đã hết hạn', used: 'Mã đã được sử dụng' }[scan.state] || 'Mã không hợp lệ'}</p><p className="text-xs text-red-700">Không bàn giao bé. Yêu cầu phụ huynh tạo mã mới trên App.</p></div>;
    return (
      <div className="space-y-3 rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="font-bold text-brand-green"><i className="fa-solid fa-circle-check mr-2" />Mã hợp lệ</p>
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-yellow font-bold text-brand-deep">{scan.kid.name.replace('Bé ', '')[0]}</span><span><span className="block font-bold">{scan.kid.name}</span><span className="text-xs text-gray-600">{CLASSES[scan.kid.cls].name}</span></span></div>
        <p className="text-sm">Người đón: <strong>{scan.who}</strong></p>
        {scan.state === 'proxy' && <p className="rounded-lg bg-yellow-100 p-2 text-xs text-yellow-800"><i className="fa-solid fa-id-card mr-1" />Người đón hộ: đối chiếu giấy tờ tùy thân trước khi bàn giao.</p>}
        <Btn kind="green" icon="fa-handshake" onClick={confirm}>Xác nhận bàn giao bé</Btn>
      </div>
    );
  };
  return (
    <>
      {!manage && ro()}
      {manage && (
        <Card title="Quét mã QR đón">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex aspect-video max-h-56 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-tint3 bg-brand-tint text-brand-primary"><i className="fa-solid fa-camera text-3xl" /><span className="text-xs">Khung camera quét QR (giả lập)</span></div>
              <Input label="Hoặc nhập mã" placeholder="AD-XXXXXXXXXX" value={code} onChange={(e) => setCode(e.target.value)} />
              <div className="flex flex-wrap gap-2"><Btn kind="primary" icon="fa-qrcode" onClick={check}>Kiểm tra mã</Btn><Btn onClick={() => demo('ok')}>Thử: mã hợp lệ</Btn><Btn onClick={() => demo('expired')}>Thử: hết hạn</Btn><Btn onClick={() => demo('used')}>Thử: đã dùng</Btn><Btn onClick={() => demo('proxy')}>Thử: đón hộ</Btn></div>
            </div>
            <div>{result()}</div>
          </div>
        </Card>
      )}
      <Card title="Nhật ký đón trả hôm nay"><Table heads={['Giờ', 'Bé', 'Người đón', 'Xác nhận bởi', 'Kết quả']} rows={db.pickLog.map((l) => [l.t, kidName(l.kid), l.who, l.by, <Badge key="b" tone={l.ok ? 'bg-green-100 text-brand-green' : 'bg-red-100 text-red-700'}>{l.ok ? 'Đã bàn giao' : 'Từ chối'}</Badge>])} empty="Chưa có lượt đón." /></Card>
      <Card title="Xử lý ngoại lệ">
        <ul className="list-disc space-y-2 pl-5 text-xs text-gray-600"><li><strong>Đón muộn:</strong> ghi giờ thực tế, hệ thống tính khoản đón muộn cho kế toán.</li><li><strong>Người lạ / không có mã:</strong> không bàn giao. Gọi phụ huynh chính, BGH xác nhận qua điện thoại rồi mới cho đón.</li><li><strong>Mã đã dùng hoặc hết hạn:</strong> yêu cầu phụ huynh tạo mã mới trên App.</li></ul>
        {manage && <div className="mt-3"><Btn icon="fa-triangle-exclamation" onClick={() => setExc(true)}>Báo cáo ngoại lệ cho BGH</Btn></div>}
      </Card>
      {exc && <Modal title="Báo cáo ngoại lệ" onClose={() => setExc(false)}><form onSubmit={(e) => { e.preventDefault(); setExc(false); audit('Báo cáo ngoại lệ đón trả'); toast('Đã gửi BGH'); }} className="space-y-4"><Select label="Loại" options={['Đón muộn', 'Người lạ / không có mã', 'Mã sai nhiều lần', 'Khác'].map((x) => [x, x])} /><Textarea label="Mô tả" /><div className="flex justify-end gap-2"><Btn onClick={() => setExc(false)}>Hủy</Btn><Btn kind="primary" type="submit">Gửi BGH</Btn></div></form></Modal>}
    </>
  );
}

/* ===== Học sinh & phụ huynh ===== */
function Students() {
  const { role, R, db, update, audit, lvl, inScope } = useStaff();
  const toast = useToast();
  const manage = lvl('students') === 'm';
  const [cls, setCls] = useState('');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [imp, setImp] = useState(false);
  const [impErr, setImpErr] = useState('');
  const showContact = role !== 'yte';
  const classOpts = Object.entries(CLASSES).filter(([, c]) => inScope(c.campus));
  const list = db.students.filter((s) => inScope(s.campus) && ((role !== 'gvcn' && role !== 'gvnk') || s.cls === R.cls) && (!cls || s.cls === cls) && (!q || (s.name + s.parent).toLowerCase().includes(q.toLowerCase())));
  const open = (s) => { setEdit(s ? s.id : 0); setForm(s ? { ...s } : { name: '', dob: '', cls: classOpts[0]?.[0], parent: '', phone: '', allergy: '', consent: false }); setErrors({}); };
  const save = (e) => {
    e.preventDefault();
    const dup = db.students.some((s) => s.id !== edit && s.name === form.name.trim() && s.phone === form.phone.replace(/\s/g, ''));
    const errs = validate(form, { name: [rule.required('Vui lòng nhập tên bé.')], dob: [(v) => (/^\d{2}\/\d{2}\/\d{4}$/.test(v) ? '' : 'Nhập ngày sinh dạng dd/mm/yyyy.')], parent: [rule.required('Vui lòng nhập họ tên phụ huynh.')], phone: [(v) => (!isPhone(v) ? 'Số điện thoại chưa đúng.' : dup ? 'Học sinh này đã tồn tại.' : '')] });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const data = { ...form, name: form.name.trim(), phone: form.phone.replace(/\s/g, ''), campus: CLASSES[form.cls].campus };
    if (edit) update('students', (a) => a.map((s) => (s.id === edit ? { ...s, ...data } : s)));
    else update('students', (a) => [...a, { ...data, id: `s${Date.now()}`, account: false }]);
    audit(`${edit ? 'Sửa' : 'Thêm'} học sinh ${data.name}`); setEdit(null); toast('Đã lưu học sinh');
  };
  const account = (s) => { update('students', (a) => a.map((x) => (x.id === s.id ? { ...x, account: true } : x))); audit(`Tạo tài khoản App cho phụ huynh ${s.parent}`); toast(`Đã tạo tài khoản App cho ${s.phone}. Phụ huynh đăng nhập bằng OTP.`); };
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const rows = list.map((s) => [
    <span key="n"><strong>{s.name}</strong><br /><span className="text-gray-500">{s.dob}</span></span>,
    <span key="c">{CLASSES[s.cls].name}<br /><span className="text-gray-500">{CAMPUSES[s.campus].short}</span></span>,
    showContact ? <span key="p">{s.parent}<br /><span className="text-gray-500">{s.phone}</span></span> : <span key="p" className="text-gray-400">Ẩn</span>,
    s.allergy ? <Badge key="a" tone="bg-yellow-100 text-brand-gold">{s.allergy}</Badge> : '-',
    <Badge key="o" tone={s.consent ? 'bg-green-100 text-brand-green' : 'bg-gray-200 text-gray-600'}>{s.consent ? 'Đồng ý' : 'Chưa'}</Badge>,
    showContact ? (s.account ? <Badge key="x" tone="bg-green-100 text-brand-green">Đã có</Badge> : manage ? <Btn key="x" onClick={() => account(s)}>Tạo tài khoản</Btn> : <Badge key="x">Chưa</Badge>) : '-',
    manage ? <Btn key="e" onClick={() => open(s)}>Sửa</Btn> : '',
  ]);
  return (
    <>
      {!manage && ro(role === 'yte' ? 'Y tế chỉ xem thông tin sức khỏe, dị ứng của bé; không xem thông tin liên hệ phụ huynh.' : undefined)}
      <Card title="Danh sách học sinh" actions={manage ? <div className="flex gap-2"><Btn icon="fa-file-import" onClick={() => setImp(true)}>Nhập từ file</Btn><Btn kind="primary" icon="fa-plus" onClick={() => open(null)}>Thêm học sinh</Btn></div> : null}>
        <div className="mb-4 flex flex-wrap gap-2"><input type="search" className="fld !w-auto" placeholder="Tìm bé hoặc phụ huynh" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm" /><select className="fld !w-auto" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Lớp"><option value="">Mọi lớp</option>{classOpts.map(([k, c]) => <option key={k} value={k}>{c.name}</option>)}</select></div>
        <Table heads={['Bé', 'Lớp', 'Phụ huynh', 'Dị ứng', 'Ảnh', 'App', '']} rows={rows} empty="Không có học sinh phù hợp." minWidth={720} />
      </Card>
      {edit !== null && (
        <Modal title={edit ? 'Sửa học sinh' : 'Thêm học sinh'} onClose={() => setEdit(null)}>
          <form onSubmit={save} noValidate className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Tên bé *" value={form.name} onChange={f('name')} error={errors.name} /><Input label="Ngày sinh *" placeholder="dd/mm/yyyy" value={form.dob} onChange={f('dob')} error={errors.dob} />
              <Select label="Lớp" value={form.cls} onChange={f('cls')} options={classOpts.map(([k, c]) => [k, `${c.name} - ${CAMPUSES[c.campus].short}`])} /><Input label="Dị ứng" value={form.allergy} onChange={f('allergy')} />
              <Input label="Họ tên phụ huynh chính *" value={form.parent} onChange={f('parent')} error={errors.parent} /><Input label="Số điện thoại phụ huynh *" type="tel" inputMode="tel" value={form.phone} onChange={f('phone')} error={errors.phone} hint="Dùng để đăng nhập App bằng OTP." />
            </div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="h-5 w-5 accent-[#8E2424]" />Phụ huynh đã đồng ý chụp và hiển thị ảnh của bé</label>
            <div className="flex justify-end gap-2"><Btn onClick={() => setEdit(null)}>Hủy</Btn><Btn kind="primary" type="submit">Lưu</Btn></div>
          </form>
        </Modal>
      )}
      {imp && (
        <Modal title="Nhập danh sách từ file" onClose={() => setImp(false)}>
          <Note>File CSV hoặc XLSX, tối đa 2MB. Hệ thống kiểm tra lỗi (số điện thoại, ngày sinh, lớp) và cho xem trước trước khi nhập.</Note>
          <Input label="Chọn file" type="file" accept=".csv,.xlsx" error={impErr} onChange={(e) => { const msg = rule.file({ exts: ['csv', 'xlsx'], maxMb: 2 })(e.target.files[0]); setImpErr(msg); if (!msg) { toast(`Đã kiểm tra ${e.target.files[0].name} (demo, chưa nhập dữ liệu)`); setImp(false); } }} />
        </Modal>
      )}
    </>
  );
}

/* ===== Y tế ===== */
function Health() {
  const { db, update, audit, lvl, myStudents, inScope, kidName, role } = useStaff();
  const toast = useToast();
  const manage = lvl('health') === 'm';
  const [tab, setTab] = useState('meds');
  const [grow, setGrow] = useState(null);
  const [g, setG] = useState({ w: '', h: '' });
  const [errors, setErrors] = useState({});
  const ids = (role === 'gvcn' ? myStudents : db.students.filter((s) => inScope(s.campus))).map((s) => s.id);
  const save = (e) => {
    e.preventDefault();
    const w = parseFloat(g.w.replace(',', '.')); const h = parseFloat(g.h.replace(',', '.'));
    const errs = {};
    if (!(w > 3 && w < 40)) errs.w = 'Cân nặng chưa hợp lý (3 - 40 kg).';
    if (!(h > 40 && h < 130)) errs.h = 'Chiều cao chưa hợp lý (40 - 130 cm).';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    update('growth', (a) => ({ ...a, [grow]: [...(a[grow] || []), ['T10', w, h]] }));
    audit(`Nhập chỉ số tăng trưởng ${kidName(grow)}`); setGrow(null); setG({ w: '', h: '' }); toast('Đã lưu chỉ số');
  };
  return (
    <>
      {!manage && ro()}
      <Tabs tabs={[['meds', 'Đơn dặn thuốc'], ['growth', 'Tăng trưởng'], ['vacc', 'Tiêm chủng'], ['allergy', 'Dị ứng']]} value={tab} onChange={setTab} />
      {tab === 'meds' && <MedsTable kidIds={ids} can={manage} />}
      {tab === 'growth' && <Card title="Chỉ số tăng trưởng"><Table heads={['Bé', 'Kỳ gần nhất', 'Cân nặng', 'Chiều cao', '']} rows={ids.map((id) => { const last = (db.growth[id] || []).slice(-1)[0]; return [kidName(id), last ? last[0] : '-', last ? `${last[1]} kg` : '-', last ? `${last[2]} cm` : '-', manage ? <Btn key="b" onClick={() => { setGrow(id); setErrors({}); }}>Nhập chỉ số</Btn> : '']; })} /></Card>}
      {tab === 'vacc' && <Card title="Tiêm chủng"><p className="mb-3 text-sm text-gray-600">Theo dõi lịch sử và mũi sắp tới của từng bé. Phụ huynh xem trong mục Sức khỏe của App.</p><Table heads={['Bé', 'Mũi gần nhất', 'Mũi tiếp theo']} rows={ids.map((id) => [kidName(id), 'MMR mũi 2 (06/2025)', 'Cúm mùa (05/11/2026)'])} /></Card>}
      {tab === 'allergy' && <Card title="Bé có dị ứng"><Table heads={['Bé', 'Lớp', 'Dị ứng', 'Cảnh báo']} rows={db.students.filter((s) => s.allergy && ids.includes(s.id)).map((s) => [s.name, CLASSES[s.cls].name, <Badge key="b" tone="bg-yellow-100 text-brand-gold">{s.allergy}</Badge>, 'Đã báo cho bếp và cô chủ nhiệm'])} empty="Chưa có bé nào khai báo dị ứng." /></Card>}
      {grow && (
        <Modal title={`Nhập chỉ số - ${kidName(grow)}`} onClose={() => setGrow(null)}>
          <form onSubmit={save} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3"><Input label="Cân nặng (kg)" inputMode="decimal" value={g.w} onChange={(e) => setG({ ...g, w: e.target.value })} error={errors.w} /><Input label="Chiều cao (cm)" inputMode="decimal" value={g.h} onChange={(e) => setG({ ...g, h: e.target.value })} error={errors.h} /></div>
            <p className="text-xs text-gray-500">Phụ huynh sẽ thấy trên biểu đồ tăng trưởng trong App.</p>
            <div className="flex justify-end gap-2"><Btn onClick={() => setGrow(null)}>Hủy</Btn><Btn kind="primary" type="submit">Lưu</Btn></div>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ===== Thực đơn ===== */
function Menu() {
  const { db, lvl, inScope, audit, R } = useStaff();
  const toast = useToast();
  const manage = lvl('menu') === 'm';
  const allergy = db.students.filter((s) => s.allergy && inScope(s.campus));
  return (
    <>
      {!manage && ro()}
      <Card title={`Thực đơn tuần 05/10 - 09/10 · ${CAMPUSES[R.campus || 'phutho1'].short}`} actions={manage ? <div className="flex gap-2"><Btn icon="fa-copy" onClick={() => toast('Đã sao chép thực đơn tuần trước (demo)')}>Sao chép từ tuần trước</Btn><Btn kind="primary" icon="fa-paper-plane" onClick={() => { audit('Đăng thực đơn tuần'); toast('Đã đăng thực đơn. Phụ huynh thấy trong App.'); }}>Đăng thực đơn</Btn></div> : null}>
        <Table heads={['Thứ', 'Bữa sáng', 'Bữa trưa', 'Bữa chiều']} minWidth={640} rows={BASE_MENU.map((d, i) => [<strong key="d">{DAY_LABELS[i]}</strong>, ...menuFor(R.campus || 'phutho1', i).map((m, j) => <input key={j} aria-label={`${DAY_LABELS[i]} bữa ${j + 1}`} className="fld" defaultValue={m} disabled={!manage} />)])} />
      </Card>
      <Card title="Dị ứng hôm nay"><Table heads={['Bé', 'Lớp', 'Món cần tránh']} rows={allergy.map((s) => [s.name, CLASSES[s.cls].name, <Badge key="b" tone="bg-yellow-100 text-brand-gold">{s.allergy}</Badge>])} empty="Không có bé dị ứng." /></Card>
      <p className="text-xs text-gray-500">Bếp chỉ thấy tên bé, lớp và món cần tránh; không thấy thông tin liên hệ phụ huynh.</p>
    </>
  );
}

/* ===== Thông báo & Tin nhắn ===== */
function Comms() {
  const { role, R, db, update, audit, sysWide, kidName } = useStaff();
  const toast = useToast();
  const [tab, setTab] = useState('notice');
  const [open, setOpen] = useState(false);
  const [n, setN] = useState({ scope: 'Lớp', title: '', body: '' });
  const [errors, setErrors] = useState({});
  const [tid, setTid] = useState(0);
  const [reply, setReply] = useState('');
  const canNotice = role === 'vanphong' || role === 'bgh';
  const canChat = role === 'gvcn';
  const opts = role === 'gvcn' ? [['Lớp', `Lớp ${CLASSES[R.cls].name}`]] : [['Cơ sở', 'Cả cơ sở'], ['Lớp', 'Một lớp'], ...(sysWide ? [['Toàn trường', 'Toàn trường']] : [])];
  const notices = db.notices.filter((x) => !x.target || x.target === R.campus || x.target === R.cls || sysWide);
  const threads = db.threads.filter((t) => !canChat || t.cls === R.cls);
  const th = threads.find((t) => t.id === tid);
  const send = (e) => {
    e.preventDefault();
    const errs = validate(n, { title: [rule.required('Vui lòng nhập tiêu đề.')], body: [rule.required('Vui lòng nhập nội dung.')] });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    update('notices', (a) => [{ id: Date.now(), scope: n.scope, target: n.scope === 'Lớp' ? R.cls || 'a1' : n.scope === 'Cơ sở' ? R.campus : '', title: n.title.trim(), date: TODAY, read: 0, total: n.scope === 'Lớp' ? 28 : n.scope === 'Cơ sở' ? 142 : 520, by: R.name }, ...a]);
    audit(`Gửi thông báo: ${n.title.trim()}`); setOpen(false); setN({ ...n, title: '', body: '' }); toast('Đã gửi thông báo');
  };
  const openThread = (t) => { setTid(t.id); if (role === 'bgh') audit(`Xem cuộc trò chuyện ${kidName(t.kid)}`); else update('threads', (a) => a.map((x) => (x.id === t.id ? { ...x, unread: 0 } : x))); };
  const doReply = (e) => { e.preventDefault(); const v = reply.trim(); if (!v) return; update('threads', (a) => a.map((t) => (t.id === tid ? { ...t, msgs: [...t.msgs, { f: 't', x: v, t: nowHM() }] } : t))); audit(`Trả lời phụ huynh ${th.parent}`); setReply(''); };
  return (
    <>
      <Tabs tabs={[['notice', 'Thông báo'], ['chat', 'Tin nhắn phụ huynh']]} value={tab} onChange={setTab} />
      {tab === 'notice' && (
        <>
          {!canNotice && ro('Giáo viên gửi thông báo cho lớp mình; thông báo toàn trường/cơ sở do Văn phòng và BGH gửi.')}
          <Card title="Thông báo đã gửi" actions={<Btn kind="primary" icon="fa-paper-plane" onClick={() => { setN({ scope: opts[0][0], title: '', body: '' }); setOpen(true); }}>Gửi thông báo</Btn>}>
            <Table heads={['Thông báo', 'Phạm vi', 'Ngày', 'Đã đọc']} rows={notices.map((x) => [<span key="t"><strong>{x.title}</strong><br /><span className="text-gray-500">{x.by}</span></span>, x.scope, fmtDate(x.date), <span key="r">{x.read}/{x.total} <span className="text-gray-500">({Math.round((x.read / x.total) * 100)}%)</span></span>])} empty="Chưa có thông báo." />
          </Card>
        </>
      )}
      {tab === 'chat' && (
        <>
          {role === 'bgh' ? <Note>BGH xem nội dung chat để kiểm soát chất lượng. Mỗi lần xem đều được ghi nhật ký.</Note> : !canChat && ro('Chỉ giáo viên chủ nhiệm trả lời phụ huynh.')}
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Cuộc trò chuyện">
              {threads.length ? <div className="space-y-1">{threads.map((t) => <button key={t.id} onClick={() => openThread(t)} className={`tap flex w-full items-center gap-3 rounded-xl p-3 text-left ${t.id === tid ? 'bg-brand-tint' : 'hover:bg-brand-cream'}`}><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{t.parent} <span className="font-normal text-gray-500">({kidName(t.kid)})</span></span><span className="block truncate text-xs text-gray-500">{t.msgs[t.msgs.length - 1].x}</span></span>{t.unread > 0 && <Badge tone="bg-brand-primary text-white">{t.unread}</Badge>}</button>)}</div> : <p className="py-6 text-center text-sm text-gray-500">Chưa có tin nhắn.</p>}
            </Card>
            <div className="md:col-span-2">
              {th ? (
                <Card title={`${th.parent} · ${kidName(th.kid)}`}>
                  <div className="mb-4 max-h-80 space-y-2 overflow-y-auto">{th.msgs.map((m, i) => <div key={i} className={`flex ${m.f === 't' ? 'justify-end' : ''}`}><div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.f === 't' ? 'bg-brand-primary text-white' : 'bg-brand-cream'}`}>{m.x}<div className="mt-1 text-[10px] opacity-70">{m.t}</div></div></div>)}</div>
                  {canChat && <><form onSubmit={doReply} className="flex gap-2"><input className="fld" placeholder="Trả lời phụ huynh..." maxLength={500} aria-label="Nội dung" autoComplete="off" value={reply} onChange={(e) => setReply(e.target.value)} /><button className="tap w-12 rounded-full bg-brand-primary text-white" aria-label="Gửi"><i className="fa-solid fa-paper-plane" /></button></form><p className="mt-2 text-xs text-gray-500">Giờ làm việc 7:00 - 17:00, thứ 2 đến thứ 6.</p></>}
                </Card>
              ) : <Card title="Chưa chọn"><p className="py-10 text-center text-sm text-gray-500">Chọn một cuộc trò chuyện.</p></Card>}
            </div>
          </div>
        </>
      )}
      {open && (
        <Modal title="Gửi thông báo" onClose={() => setOpen(false)}>
          <form onSubmit={send} noValidate className="space-y-4">
            <Select label="Đối tượng" value={n.scope} onChange={(e) => setN({ ...n, scope: e.target.value })} options={opts} />
            <Input label="Tiêu đề *" value={n.title} onChange={(e) => setN({ ...n, title: e.target.value })} error={errors.title} />
            <Textarea label="Nội dung *" value={n.body} onChange={(e) => setN({ ...n, body: e.target.value })} error={errors.body} />
            <Input label="Lên lịch gửi (không bắt buộc)" type="datetime-local" />
            <div className="flex justify-end gap-2"><Btn onClick={() => setOpen(false)}>Hủy</Btn><Btn kind="primary" type="submit">Gửi</Btn></div>
          </form>
        </Modal>
      )}
    </>
  );
}

export const PagesA = { Home, Class, Pickup, Students, Health, Menu, Comms };
