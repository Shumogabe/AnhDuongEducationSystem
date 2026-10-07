import { useState } from 'react';
import { CAMPUSES, CAMPUS_OPTIONS } from '../shared/data.js';
import { TODAY, fmtDate, isEmail, money, rule, validate } from '../shared/format.js';
import { Badge, Btn, Card, Confirm, Input, Modal, Note, Select, Table, Tabs, Textarea, useToast } from '../shared/ui.jsx';
import { CLASSES, FEE_TONE, LEAD_ALL, LEAD_FLOW, LEAD_TONE, PLAN_STATUS, ROLE_DEF, STAFF, useStaff } from './store.jsx';

const ro = (text) => <Note kind="lock">{text || 'Bạn chỉ có quyền xem.'}</Note>;

/* ===== Thu phí ===== */
function Fees() {
  const { role, db, update, audit, lvl, inScope, kidName } = useStaff();
  const toast = useToast();
  const manage = lvl('fees') === 'm';
  const [filter, setFilter] = useState('');
  const [pay, setPay] = useState(null);
  const [payForm, setPayForm] = useState({ method: 'Tiền mặt', date: TODAY });
  const [payErr, setPayErr] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [reason, setReason] = useState('');
  const [reasonErr, setReasonErr] = useState('');
  const [bulk, setBulk] = useState(false);
  const [b, setB] = useState({ cls: '', type: 'Học phí', name: '', amount: '', due: '' });
  const [bErr, setBErr] = useState({});
  const campusOf = (f) => db.students.find((s) => s.id === f.kid).campus;
  const all = db.fees.filter((f) => inScope(campusOf(f)));
  const list = all.filter((f) => !filter || f.status === filter);
  const sum = (st) => all.filter((f) => f.status === st).reduce((s, f) => s + f.amount, 0);
  const classOpts = Object.entries(CLASSES).filter(([, c]) => inScope(c.campus));

  const doPay = (e) => {
    e.preventDefault();
    if (!payForm.date || payForm.date > TODAY) { setPayErr('Ngày thu không hợp lệ.'); return; }
    const receiptNo = `BL-2026-${1003 + db.fees.filter((x) => x.receipt).length}`;
    update('fees', (a) => a.map((x) => (x.id === pay.id ? { ...x, status: 'Đã đóng', paidDate: payForm.date, method: payForm.method, receipt: receiptNo } : x)));
    audit(`Ghi nhận thu ${receiptNo}: ${kidName(pay.kid)} ${money(pay.amount)}`); setPay(null); setPayErr(''); toast(`Đã xuất biên lai ${receiptNo}. Phụ huynh xem trên App.`);
  };
  const doCancel = (e) => {
    e.preventDefault();
    if (reason.trim().length < 5) { setReasonErr('Vui lòng nhập lý do (ít nhất 5 ký tự).'); return; }
    update('fees', (a) => a.map((x) => (x.id === cancel.id ? { ...x, status: 'Đã hủy' } : x)));
    audit(`Hủy biên lai ${cancel.receipt}: ${reason.trim()}`); setCancel(null); setReason(''); setReasonErr(''); toast('Đã hủy biên lai và ghi lý do');
  };
  const doBulk = (e) => {
    e.preventDefault();
    const amt = parseInt(b.amount.replace(/\D/g, ''), 10);
    const errs = {};
    if (!b.name.trim()) errs.name = 'Vui lòng nhập tên khoản.';
    if (!(amt > 0)) errs.amount = 'Số tiền chưa hợp lệ.';
    if (!b.due) errs.due = 'Vui lòng chọn hạn đóng.';
    setBErr(errs);
    if (Object.keys(errs).length) return;
    const cls = b.cls || classOpts[0][0];
    const kids = db.students.filter((s) => s.cls === cls);
    update('fees', (a) => [...a, ...kids.map((k, i) => ({ id: Date.now() + i, kid: k.id, title: b.name.trim(), type: b.type, amount: amt, due: b.due, status: 'Chưa đóng' }))]);
    audit(`Tạo khoản thu "${b.name.trim()}" cho ${kids.length} bé`); setBulk(false); toast(`Đã tạo khoản thu cho ${kids.length} bé`);
  };
  const actions = (f) => {
    if (f.status === 'Đã đóng') return <div className="flex gap-1"><Btn onClick={() => setReceipt(f)}>Biên lai</Btn><Btn kind="danger" onClick={() => setCancel(f)}>Hủy</Btn></div>;
    if (f.status === 'Đã hủy') return '';
    return <Btn kind="green" onClick={() => { setPay(f); setPayForm({ method: 'Tiền mặt', date: TODAY }); }}>Ghi nhận đã thu</Btn>;
  };
  const debtRows = classOpts.map(([k, c]) => {
    const d = all.filter((f) => f.status !== 'Đã đóng' && f.status !== 'Đã hủy' && db.students.find((s) => s.id === f.kid).cls === k);
    return [c.name, d.length, money(d.reduce((s, f) => s + f.amount, 0)), manage && d.length ? <Btn key="b" icon="fa-bell" onClick={() => { audit(`Nhắc đóng phí lớp ${c.name}`); toast(`Đã gửi thông báo nhắc đóng phí cho phụ huynh lớp ${c.name}`); }}>Nhắc đóng</Btn> : ''];
  });
  const stat = (label, v, tone) => <div className="rounded-2xl border border-gray-100 bg-white p-4"><p className="text-xs text-gray-500">{label}</p><p className={`text-xl font-bold ${tone}`}>{money(v)}</p></div>;
  return (
    <>
      {!manage && ro(role === 'lanhdao' ? 'Lãnh đạo hệ thống chỉ xem báo cáo.' : undefined)}
      <div className="grid gap-3 sm:grid-cols-3">{stat('Đã thu', sum('Đã đóng'), 'text-brand-green')}{stat('Chưa đóng', sum('Chưa đóng'), 'text-brand-gold')}{stat('Quá hạn', sum('Quá hạn'), 'text-red-600')}</div>
      <Card title="Khoản phải thu & biên lai" actions={manage ? <div className="flex gap-2"><Btn icon="fa-file-export" onClick={() => { audit(`Xuất báo cáo thu (${list.length} dòng)`); toast(`Đã xuất ${list.length} dòng và ghi nhật ký (demo)`); }}>Xuất báo cáo thu</Btn><Btn kind="primary" icon="fa-plus" onClick={() => { setB({ cls: classOpts[0][0], type: 'Học phí', name: '', amount: '', due: '' }); setBErr({}); setBulk(true); }}>Tạo khoản thu</Btn></div> : null}>
        <div className="mb-4"><select className="fld !w-auto" aria-label="Trạng thái" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">Mọi trạng thái</option>{Object.keys(FEE_TONE).map((s) => <option key={s}>{s}</option>)}</select></div>
        <Table heads={['Bé', 'Khoản', 'Số tiền', 'Hạn', 'Trạng thái', '']} minWidth={680} rows={list.map((f) => [kidName(f.kid), f.title, money(f.amount), fmtDate(f.due), <span key="s"><Badge tone={FEE_TONE[f.status]}>{f.status}</Badge>{f.receipt && <div className="mt-1 text-gray-500">{f.receipt}</div>}</span>, manage ? actions(f) : f.receipt ? <Btn key="r" onClick={() => setReceipt(f)}>Xem biên lai</Btn> : ''])} empty="Không có khoản nào." />
      </Card>
      <Card title="Công nợ theo lớp"><Table heads={['Lớp', 'Số khoản chưa đóng', 'Tổng nợ', '']} rows={debtRows} /></Card>
      {pay && (
        <Modal title="Ghi nhận đã thu" onClose={() => setPay(null)}>
          <form onSubmit={doPay} noValidate className="space-y-4">
            <p className="text-sm"><strong>{kidName(pay.kid)}</strong> · {pay.title} · {money(pay.amount)}</p>
            <div className="grid grid-cols-2 gap-3"><Select label="Hình thức" value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })} options={['Tiền mặt', 'Chuyển khoản'].map((x) => [x, x])} /><Input label="Ngày thu" type="date" value={payForm.date} onChange={(e) => setPayForm({ ...payForm, date: e.target.value })} error={payErr} /></div>
            <div className="flex justify-end gap-2"><Btn onClick={() => setPay(null)}>Hủy</Btn><Btn kind="primary" type="submit">Ghi nhận và xuất biên lai</Btn></div>
          </form>
        </Modal>
      )}
      {receipt && (
        <Modal title={`Biên lai ${receipt.receipt}`} onClose={() => setReceipt(null)}>
          <div className="space-y-2 rounded-2xl border border-dashed border-gray-300 p-4 text-sm">
            <p className="text-center font-bold text-brand-primary">BIÊN LAI THU TIỀN</p>
            <dl className="space-y-1.5">{[['Số', receipt.receipt], ['Ngày', fmtDate(receipt.paidDate)], ['Học sinh', kidName(receipt.kid)], ['Nội dung', receipt.title], ['Hình thức', receipt.method]].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-gray-500">{k}</dt><dd className="text-right">{v}</dd></div>)}<div className="flex justify-between font-bold"><dt>Số tiền</dt><dd>{money(receipt.amount)}</dd></div></dl>
            <p className="text-xs text-gray-500">Biên lai nội bộ, không phải hóa đơn VAT.</p>
          </div>
          <div className="flex justify-end gap-2"><Btn kind="primary" icon="fa-download" onClick={() => toast('Đã tải biên lai (demo)')}>Tải PDF</Btn><Btn onClick={() => setReceipt(null)}>Đóng</Btn></div>
        </Modal>
      )}
      {cancel && (
        <Modal title="Hủy biên lai" onClose={() => setCancel(null)}>
          <form onSubmit={doCancel} noValidate className="space-y-4">
            <p className="text-xs text-gray-600">Không xóa cứng dữ liệu tài chính. Biên lai bị hủy vẫn lưu lịch sử kèm lý do.</p>
            <Textarea label="Lý do hủy *" value={reason} onChange={(e) => setReason(e.target.value)} error={reasonErr} />
            <div className="flex justify-end gap-2"><Btn onClick={() => setCancel(null)}>Không hủy</Btn><button className="tap rounded-full bg-red-600 px-5 text-xs font-semibold text-white">Hủy biên lai</button></div>
          </form>
        </Modal>
      )}
      {bulk && (
        <Modal title="Tạo khoản thu hàng loạt" onClose={() => setBulk(false)}>
          <form onSubmit={doBulk} noValidate className="space-y-4">
            <Select label="Áp dụng cho" value={b.cls} onChange={(e) => setB({ ...b, cls: e.target.value })} options={classOpts.map(([k, c]) => [k, `Lớp ${c.name}`])} />
            <Select label="Loại khoản" value={b.type} onChange={(e) => setB({ ...b, type: e.target.value })} options={['Học phí', 'Tiền ăn', 'Ngoại khóa', 'Đón muộn'].map((x) => [x, x])} />
            <Input label="Tên khoản *" placeholder="Học phí tháng 11/2026" value={b.name} onChange={(e) => setB({ ...b, name: e.target.value })} error={bErr.name} />
            <div className="grid grid-cols-2 gap-3"><Input label="Số tiền (đ) *" inputMode="numeric" value={b.amount} onChange={(e) => setB({ ...b, amount: e.target.value })} error={bErr.amount} /><Input label="Hạn đóng *" type="date" value={b.due} onChange={(e) => setB({ ...b, due: e.target.value })} error={bErr.due} /></div>
            <div className="flex justify-end gap-2"><Btn onClick={() => setBulk(false)}>Hủy</Btn><Btn kind="primary" type="submit">Tạo khoản thu</Btn></div>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ===== CRM ===== */
function Crm() {
  const { db, update, audit, lvl, inScope } = useStaff();
  const toast = useToast();
  const manage = lvl('crm') === 'm';
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(null);
  const [f, setF] = useState({});
  const all = db.leads.filter((l) => inScope(l.campus));
  const list = all.filter((l) => !filter || l.status === filter);
  const view = (l) => { setOpen(l.id); setF({ status: l.status, owner: l.owner, note: l.note }); };
  const lead = db.leads.find((l) => l.id === open);
  const save = (e) => { e.preventDefault(); const old = lead.status; update('leads', (a) => a.map((l) => (l.id === open ? { ...l, ...f } : l))); audit(old !== f.status ? `Lead #${open}: ${old} → ${f.status}` : `Cập nhật lead #${open}`); setOpen(null); toast('Đã cập nhật lead'); };
  const enroll = () => {
    update('leads', (a) => a.map((l) => (l.id === open ? { ...l, status: 'Nhập học' } : l)));
    update('students', (a) => [...a, { id: `s${Date.now()}`, name: lead.child.split(' - ')[0], cls: Object.keys(CLASSES).find((k) => CLASSES[k].campus === lead.campus), campus: lead.campus, dob: '', parent: lead.parent, phone: lead.phone, allergy: '', consent: false, account: true }]);
    audit(`Nhập học lead #${open}: tạo học sinh và tài khoản App`); setOpen(null); toast(`Đã tạo học sinh và tài khoản App cho ${lead.phone}. Bổ sung ngày sinh, lớp ở mục Học sinh.`);
  };
  const idx = lead ? LEAD_FLOW.indexOf(lead.status) : -1;
  return (
    <>
      {!manage && ro()}
      <Note>Từ đợt 2, lead từ website chuyển vào đây để xử lý. Bấm &quot;Nhập học&quot; sẽ tạo học sinh và tài khoản phụ huynh.</Note>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Danh sách lead">
            <div className="mb-4"><select className="fld !w-auto" aria-label="Trạng thái" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">Mọi trạng thái</option>{LEAD_ALL.map((s) => <option key={s}>{s}</option>)}</select></div>
            <Table heads={['Phụ huynh', 'Bé', 'Nguồn', 'Trạng thái', 'Phụ trách', '']} minWidth={680} rows={list.map((l) => [<span key="p"><strong>{l.parent}</strong><br /><span className="text-gray-500">{l.phone} · {fmtDate(l.date)}</span></span>, l.child, l.source, <Badge key="s" tone={LEAD_TONE[l.status]}>{l.status}</Badge>, l.owner || '-', <Btn key="o" onClick={() => view(l)}>Mở</Btn>])} empty="Không có lead." />
          </Card>
        </div>
        <Card title="Phễu tuyển sinh"><div className="space-y-3">{LEAD_ALL.map((s) => { const n = all.filter((l) => l.status === s).length; return <div key={s} className="flex items-center gap-3 text-xs"><span className="w-36 shrink-0">{s}</span><div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-3 rounded-full bg-brand-primary" style={{ width: `${all.length ? (n / all.length) * 100 : 0}%` }} /></div><span className="w-5 text-right font-semibold">{n}</span></div>; })}</div></Card>
      </div>
      {lead && (
        <Modal title={`Lead #${lead.id}`} onClose={() => setOpen(null)}>
          <form onSubmit={save} className="space-y-4">
            <dl className="grid gap-3 text-xs sm:grid-cols-2">{[['Phụ huynh', lead.parent], ['Điện thoại', lead.phone], ['Bé', lead.child], ['Cơ sở / Nguồn', `${CAMPUSES[lead.campus].short} · ${lead.source}`]].map(([k, v]) => <div key={k}><dt className="text-gray-500">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
            <ol className="flex flex-wrap gap-2 text-xs">{LEAD_FLOW.map((s, i) => <li key={s} className={`rounded-full px-3 py-1.5 ${i <= idx ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'}`}>{s}</li>)}</ol>
            <Select label="Trạng thái" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} options={LEAD_ALL.map((x) => [x, x])} disabled={!manage} />
            <Input label="Người phụ trách" value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })} disabled={!manage} />
            <Textarea label="Ghi chú liên hệ" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} disabled={!manage} />
            <div className="flex flex-wrap justify-end gap-2"><Btn onClick={() => setOpen(null)}>Đóng</Btn>{manage && lead.status === 'Đã nộp hồ sơ' && <Btn kind="green" icon="fa-user-check" onClick={enroll}>Nhập học: tạo học sinh</Btn>}{manage && <Btn kind="primary" type="submit">Lưu</Btn>}</div>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ===== Báo cáo ===== */
const RATE = { phutho1: 96.4, phutho2: 94.8, quynhon: 95.5, nhatrang: 97.1 };
function Reports() {
  const { db, audit, sysWide, R, inScope } = useStaff();
  const toast = useToast();
  const [campus, setCampus] = useState('');
  const camps = Object.keys(CAMPUSES).filter((c) => inScope(c) && (!campus || c === campus));
  const stu = db.students.filter((s) => camps.includes(s.campus));
  const campusOf = (f) => db.students.find((s) => s.id === f.kid).campus;
  const fees = db.fees.filter((f) => camps.includes(campusOf(f)));
  const leads = db.leads.filter((l) => camps.includes(l.campus));
  const enrolled = leads.filter((l) => l.status === 'Nhập học').length;
  const sumF = (sts) => fees.filter((f) => sts.includes(f.status)).reduce((s, f) => s + f.amount, 0);
  const avg = camps.length ? (camps.reduce((s, c) => s + RATE[c], 0) / camps.length).toFixed(1) : '-';
  const m = (label, v, sub) => <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{v}</p><p className="mt-1 text-xs text-gray-500">{sub}</p></div>;
  const h = (t) => <h2 className="text-sm font-bold text-brand-primary">{t}</h2>;
  const grid = (c) => <div className="grid gap-3 sm:grid-cols-3">{c}</div>;
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {sysWide ? <select className="fld !w-auto" aria-label="Cơ sở" value={campus} onChange={(e) => setCampus(e.target.value)}><option value="">Toàn hệ thống</option>{CAMPUS_OPTIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select> : <p className="text-sm font-semibold">{CAMPUSES[R.campus].short}</p>}
        <Btn icon="fa-file-export" onClick={() => { audit('Xuất báo cáo Dashboard'); toast('Đã xuất báo cáo và ghi nhật ký (demo)'); }}>Xuất báo cáo</Btn>
      </div>
      {h('Sĩ số và chuyên cần')}{grid(<>{m('Sĩ số đang học', stu.length, 'bé')}{m('Có mặt hôm nay', Object.values(db.att).filter((v) => v === 'ok').length, 'bé (lớp đã điểm danh)')}{m('Chuyên cần tháng', `${avg}%`, 'có mặt / ngày học theo lịch')}</>)}
      {h('Học phí')}{grid(<>{m('Phải thu', money(sumF(['Đã đóng', 'Chưa đóng', 'Quá hạn'])), 'tháng 10/2026')}{m('Đã thu', money(sumF(['Đã đóng'])), '')}{m('Còn nợ', money(sumF(['Chưa đóng', 'Quá hạn'])), `gồm quá hạn ${money(sumF(['Quá hạn']))}`)}</>)}
      {h('Nhân sự')}{grid(<>{m('Sĩ số giáo viên, nhân viên', STAFF.length, 'đang làm việc')}{m('Đi làm hôm nay', `${db.checkins.length}/${STAFF.length}`, 'đã chấm công')}{m('Tăng ca tháng', `${db.ots.reduce((s, o) => s + o.hours, 0)} giờ`, 'gồm chờ duyệt')}</>)}
      {h('Tuyển sinh')}{grid(<>{m('Số lead', leads.length, 'trong kỳ')}{m('Nhập học', enrolled, '')}{m('Tỷ lệ chuyển đổi', `${leads.length ? Math.round((enrolled / leads.length) * 100) : 0}%`, 'nhập học / lead tạo trong kỳ')}</>)}
      <Card title="Theo cơ sở">
        <Table heads={['Cơ sở', 'Sĩ số', 'Chuyên cần', 'Đã thu', 'Còn nợ', 'Lead']} rows={camps.map((c) => [CAMPUSES[c].short, db.students.filter((s) => s.campus === c).length, `${RATE[c]}%`, money(db.fees.filter((f) => campusOf(f) === c && f.status === 'Đã đóng').reduce((s, f) => s + f.amount, 0)), money(db.fees.filter((f) => campusOf(f) === c && (f.status === 'Chưa đóng' || f.status === 'Quá hạn')).reduce((s, f) => s + f.amount, 0)), db.leads.filter((l) => l.campus === c).length])} />
      </Card>
    </>
  );
}

/* ===== Giáo án ===== */
const RESOURCES = [['Bộ bài hát thiếu nhi (20 bài)', 'Âm nhạc'], ['Trò chơi vận động trong lớp', 'Vận động'], ['Video hướng dẫn gấp giấy', 'Mỹ thuật'], ['Khung chương trình MG Bé', 'Chương trình']];
function Lessons() {
  const { role, R, db, update, audit } = useStaff();
  const toast = useToast();
  const manage = role === 'bgh';
  const submit = role === 'gvcn' || role === 'gvnk';
  const [upload, setUpload] = useState(false);
  const [period, setPeriod] = useState('Tuần 42 (12/10 - 16/10)');
  const [fileErr, setFileErr] = useState('');
  const [ret, setRet] = useState(null);
  const [note, setNote] = useState('');
  const [noteErr, setNoteErr] = useState('');
  const list = db.plans.filter((p) => (submit ? p.teacher === R.name : true));
  const doSubmit = (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    const msg = rule.file({ exts: ['pdf', 'doc', 'docx'], maxMb: 10 })(file);
    setFileErr(msg);
    if (msg) return;
    update('plans', (a) => [{ id: Date.now(), teacher: R.name, cls: R.cls, period, file: file.name, status: 'sent', note: '' }, ...a]);
    audit(`Nộp giáo án ${file.name}`); setUpload(false); toast('Đã nộp giáo án, chờ BGH duyệt');
  };
  const approve = (p) => { update('plans', (a) => a.map((x) => (x.id === p.id ? { ...x, status: 'ok' } : x))); audit(`Duyệt giáo án ${p.file}`); toast('Đã duyệt giáo án'); };
  const doReturn = (e) => {
    e.preventDefault();
    if (!note.trim()) { setNoteErr('Vui lòng nhập nhận xét.'); return; }
    update('plans', (a) => a.map((x) => (x.id === ret.id ? { ...x, status: 'fix', note: note.trim() } : x)));
    audit(`Trả lại giáo án ${ret.file}`); setRet(null); setNote(''); setNoteErr(''); toast('Đã trả lại giáo viên');
  };
  return (
    <>
      {!submit && !manage && ro()}
      <Card title={manage ? 'Giáo án chờ duyệt và đã duyệt' : 'Giáo án của tôi'} actions={submit ? <Btn kind="primary" icon="fa-upload" onClick={() => { setUpload(true); setFileErr(''); }}>Nộp giáo án</Btn> : null}>
        <Table heads={['Giáo viên', 'Lớp', 'Kỳ', 'File', 'Trạng thái', '']} minWidth={720} rows={list.map((p) => [p.teacher, CLASSES[p.cls].name, p.period, <span key="f" className="text-brand-primary"><i className="fa-regular fa-file-lines mr-1" />{p.file}</span>, <span key="s"><Badge tone={PLAN_STATUS[p.status][1]}>{PLAN_STATUS[p.status][0]}</Badge>{p.note && <div className="mt-1 text-gray-500">{p.note}</div>}</span>, manage && p.status === 'sent' ? <div key="a" className="flex gap-1"><Btn kind="green" onClick={() => approve(p)}>Duyệt</Btn><Btn kind="danger" onClick={() => { setRet(p); setNote(''); setNoteErr(''); }}>Trả lại</Btn></div> : submit && p.status === 'fix' ? <Btn key="r" onClick={() => setUpload(true)}>Nộp lại</Btn> : ''])} empty="Chưa có giáo án." />
      </Card>
      <Card title="Khung chương trình theo khối tuổi"><div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">{['Nhà trẻ (12 - 36 tháng)', 'Mẫu giáo Bé (3 - 4 tuổi)', 'Mẫu giáo Nhỡ (4 - 5 tuổi)', 'Mẫu giáo Lớn (5 - 6 tuổi)'].map((x) => <div key={x} className="rounded-xl bg-brand-cream p-3 font-semibold"><i className="fa-solid fa-book-open mr-2 text-brand-primary" />{x}</div>)}</div></Card>
      <Card title="Kho tài nguyên giảng dạy"><Table heads={['Tài nguyên', 'Chủ đề', '']} rows={RESOURCES.map((r) => [r[0], r[1], <Btn key="d" icon="fa-download" onClick={() => toast('Đã tải (demo)')}>Tải về</Btn>])} /></Card>
      {upload && (
        <Modal title="Nộp giáo án" onClose={() => setUpload(false)}>
          <form onSubmit={doSubmit} noValidate className="space-y-4">
            <Select label="Kỳ" value={period} onChange={(e) => setPeriod(e.target.value)} options={['Tuần 42 (12/10 - 16/10)', 'Tuần 43 (19/10 - 23/10)', 'Tháng 11/2026'].map((x) => [x, x])} />
            <Input label="File giáo án * (PDF, DOC, DOCX, tối đa 10MB)" type="file" name="file" accept=".pdf,.doc,.docx" error={fileErr} />
            <Textarea label="Ghi chú" />
            <div className="flex justify-end gap-2"><Btn onClick={() => setUpload(false)}>Hủy</Btn><Btn kind="primary" type="submit">Nộp</Btn></div>
          </form>
        </Modal>
      )}
      {ret && (
        <Modal title="Trả lại giáo án" onClose={() => setRet(null)}>
          <form onSubmit={doReturn} noValidate className="space-y-4">
            <Textarea label="Nhận xét cần sửa *" value={note} onChange={(e) => setNote(e.target.value)} error={noteErr} />
            <div className="flex justify-end gap-2"><Btn onClick={() => setRet(null)}>Hủy</Btn><button className="tap rounded-full bg-red-600 px-5 text-xs font-semibold text-white">Trả lại</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ===== Nhân sự ===== */
function Hr() {
  const { role, R, db, update, audit } = useStaff();
  const toast = useToast();
  const manage = role === 'bgh';
  const view = role === 'vanphong' || role === 'lanhdao';
  const [tab, setTab] = useState('check');
  const [ot, setOt] = useState(false);
  const [o, setO] = useState({ date: TODAY, hours: '1', reason: '' });
  const [oErr, setOErr] = useState({});
  const [lock, setLock] = useState(false);
  const [exc, setExc] = useState(false);
  const seeAll = manage || view;
  const setStatus = (id, status) => { update('ots', (a) => a.map((x) => (x.id === id ? { ...x, status } : x))); audit(`Tăng ca #${id}: ${status}`); toast(`Đã ${status.toLowerCase()}`); };
  const saveOt = (e) => {
    e.preventDefault();
    const hv = parseFloat(o.hours.replace(',', '.'));
    const errs = {};
    if (!(hv > 0 && hv <= 6)) errs.hours = 'Số giờ từ 0.5 đến 6.';
    if (!o.reason.trim()) errs.reason = 'Vui lòng nhập lý do.';
    setOErr(errs);
    if (Object.keys(errs).length) return;
    update('ots', (a) => [{ id: Date.now(), name: R.name, date: o.date, hours: hv, reason: o.reason.trim(), status: 'Chờ duyệt' }, ...a]);
    audit(`Đăng ký tăng ca ${hv} giờ`); setOt(false); toast('Đã gửi BGH duyệt');
  };
  const otTone = (s) => (s === 'Đã duyệt' ? 'bg-green-100 text-brand-green' : s === 'Từ chối' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-brand-gold');
  const approved = (name) => db.ots.filter((x) => x.name === name && x.status === 'Đã duyệt').reduce((a, x) => a + x.hours, 0);
  return (
    <>
      <Tabs tabs={[['check', 'Chấm công'], ['ot', 'Tăng ca'], ['assign', 'Phân công'], ['sheet', 'Bảng công tháng']]} value={tab} onChange={setTab} />
      {tab === 'check' && (
        <>
          <Card title="Chấm công hôm nay" actions={manage ? <Btn icon="fa-user-pen" onClick={() => setExc(true)}>Thêm xác nhận ngoại lệ</Btn> : null}>
            <Table heads={['Nhân viên', 'Vào', 'Ra', 'Trạng thái']} rows={(seeAll ? db.checkins : db.checkins.filter((c) => c.name === R.name)).map((c) => [c.name, c.in, c.out || '-', <Badge key="b" tone="bg-green-100 text-brand-green">Đã chấm</Badge>])} empty="Chưa có lượt chấm công." minWidth={420} />
          </Card>
          <Note>Nhân viên tự chấm tại cơ sở (QR cơ sở đổi theo ngày). BGH xác nhận trường hợp quên chấm hoặc lỗi.</Note>
        </>
      )}
      {tab === 'ot' && (
        <Card title="Tăng ca" actions={role === 'lanhdao' ? null : <Btn kind="primary" icon="fa-plus" onClick={() => { setO({ date: TODAY, hours: '1', reason: '' }); setOErr({}); setOt(true); }}>Đăng ký tăng ca</Btn>}>
          <Table heads={['Nhân viên', 'Ngày', 'Giờ', 'Lý do', 'Trạng thái', '']} minWidth={680} rows={(seeAll ? db.ots : db.ots.filter((x) => x.name === R.name)).map((x) => [x.name, fmtDate(x.date), x.hours, x.reason, <Badge key="b" tone={otTone(x.status)}>{x.status}</Badge>, manage && x.status === 'Chờ duyệt' ? <div key="a" className="flex gap-1"><Btn kind="green" onClick={() => setStatus(x.id, 'Đã duyệt')}>Duyệt</Btn><Btn kind="danger" onClick={() => setStatus(x.id, 'Từ chối')}>Từ chối</Btn></div> : ''])} empty="Chưa có đăng ký tăng ca." />
        </Card>
      )}
      {tab === 'assign' && <>{!manage && ro()}<Card title="Phân công lớp và ca" actions={manage ? <Btn icon="fa-pen" onClick={() => toast('Đã mở chỉnh sửa phân công (demo)')}>Sửa phân công</Btn> : null}><Table heads={['Nhân sự', 'Vai trò', 'Lớp', 'Ca']} rows={STAFF.map((s) => [s.name, s.role, s.cls ? CLASSES[s.cls].name : '-', s.shift])} /></Card></>}
      {tab === 'sheet' && (
        <>
          <Card title="Bảng công tháng 10/2026" actions={<div className="flex items-center gap-2"><Badge tone={db.sheetLocked ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-brand-green'}>{db.sheetLocked ? 'Đã khóa sổ' : 'Đang ghi'}</Badge>{manage && !db.sheetLocked && <Btn kind="danger" icon="fa-lock" onClick={() => setLock(true)}>Khóa sổ</Btn>}{(manage || view) && <Btn icon="fa-file-export" onClick={() => { audit('Xuất bảng công tháng 10'); toast('Đã xuất bảng công và ghi nhật ký (demo)'); }}>Xuất cho kế toán</Btn>}</div>}>
            <Table heads={['Nhân viên', 'Ngày công', 'Vắng', 'Tăng ca (giờ)']} rows={STAFF.map((s, i) => [s.name, 5 - (i === 2 ? 1 : 0), i === 2 ? 1 : 0, approved(s.name)])} minWidth={420} />
          </Card>
          <Note>Portal không tính lương. Bảng công xuất cuối tháng để kế toán tính lương bên ngoài.</Note>
        </>
      )}
      {ot && (
        <Modal title="Đăng ký tăng ca" onClose={() => setOt(false)}>
          <form onSubmit={saveOt} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3"><Input label="Ngày" type="date" value={o.date} onChange={(e) => setO({ ...o, date: e.target.value })} /><Input label="Số giờ" inputMode="decimal" value={o.hours} onChange={(e) => setO({ ...o, hours: e.target.value })} error={oErr.hours} /></div>
            <Textarea label="Lý do *" value={o.reason} onChange={(e) => setO({ ...o, reason: e.target.value })} error={oErr.reason} />
            <div className="flex justify-end gap-2"><Btn onClick={() => setOt(false)}>Hủy</Btn><Btn kind="primary" type="submit">Gửi BGH duyệt</Btn></div>
          </form>
        </Modal>
      )}
      {exc && (
        <Modal title="Xác nhận chấm công ngoại lệ" onClose={() => setExc(false)}>
          <form onSubmit={(e) => { e.preventDefault(); setExc(false); audit('Xác nhận chấm công ngoại lệ'); toast('Đã ghi nhận'); }} className="space-y-4">
            <Select label="Nhân viên" options={STAFF.map((s) => [s.name, s.name])} />
            <div className="grid grid-cols-2 gap-3"><Input label="Giờ vào" type="time" defaultValue="07:30" /><Input label="Giờ ra" type="time" defaultValue="16:30" /></div>
            <Input label="Lý do" defaultValue="Quên chấm công" />
            <div className="flex justify-end gap-2"><Btn onClick={() => setExc(false)}>Hủy</Btn><Btn kind="primary" type="submit">Ghi nhận</Btn></div>
          </form>
        </Modal>
      )}
      {lock && <Confirm message="Khóa sổ bảng công tháng 10? Sau khi khóa không sửa được." onYes={() => { update('sheetLocked', true); audit('Khóa sổ bảng công tháng 10'); toast('Đã khóa sổ'); }} onClose={() => setLock(false)} />}
    </>
  );
}

/* ===== Quản trị ===== */
function Admin() {
  const { role, db, update, audit, inScope } = useStaff();
  const toast = useToast();
  const full = role === 'admin';
  const [tab, setTab] = useState('acc');
  const [q, setQ] = useState('');
  const [add, setAdd] = useState(false);
  const [a, setA] = useState({ name: '', email: '', role: 'gvcn', campus: 'phutho1' });
  const [aErr, setAErr] = useState({});
  const [reset, setReset] = useState(null);
  const tabs = [['acc', 'Tài khoản nhân sự'], ['cat', 'Danh mục'], ['cfg', 'Cấu hình'], ...(full ? [['audit', 'Nhật ký hoạt động']] : [])];
  const list = db.accounts.filter((x) => inScope(x.campus) || x.campus === '');
  const toggle = (x) => { update('accounts', (l) => l.map((y) => (y.id === x.id ? { ...y, locked: !y.locked } : y))); audit(`${x.locked ? 'Mở khóa' : 'Khóa'} ${x.name}`); toast(x.locked ? 'Đã mở khóa' : 'Đã khóa tài khoản'); };
  const save = (e) => {
    e.preventDefault();
    const errs = validate(a, { name: [rule.required('Vui lòng nhập họ tên.')], email: [(v) => (!isEmail(v) ? 'Email chưa đúng định dạng.' : db.accounts.some((x) => x.email === v) ? 'Email đã tồn tại.' : '')] });
    setAErr(errs);
    if (Object.keys(errs).length) return;
    update('accounts', (l) => [...l, { ...a, id: Date.now(), campus: a.role === 'lanhdao' || a.role === 'admin' ? '' : a.campus, locked: false }]);
    audit(`Tạo tài khoản ${a.name}`); setAdd(false); toast('Đã tạo tài khoản và gửi email mời');
  };
  const audits = db.audit.filter((x) => !q || `${x.user} ${x.action}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'acc' && (
        <>
          {!full && ro('BGH cơ sở chỉ khóa/mở tài khoản và gán lớp trong cơ sở mình; Quản trị hệ thống tạo tài khoản mới.')}
          <Card title="Tài khoản" actions={full ? <Btn kind="primary" icon="fa-user-plus" onClick={() => { setA({ name: '', email: '', role: 'gvcn', campus: 'phutho1' }); setAErr({}); setAdd(true); }}>Thêm tài khoản</Btn> : null}>
            <Table heads={['Người dùng', 'Vai trò', 'Phạm vi', 'Trạng thái', '']} minWidth={640} rows={list.map((x) => [<span key="n"><strong>{x.name}</strong><br /><span className="text-gray-500">{x.email}</span></span>, ROLE_DEF[x.role].label, x.campus ? CAMPUSES[x.campus].short : 'Toàn hệ thống', <Badge key="s" tone={x.locked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-brand-green'}>{x.locked ? 'Đã khóa' : 'Hoạt động'}</Badge>, x.role === 'admin' ? '' : <div key="a" className="flex flex-wrap gap-1"><Btn onClick={() => toggle(x)}>{x.locked ? 'Mở khóa' : 'Khóa'}</Btn>{full && <Btn onClick={() => setReset(x)}>Đặt lại MK</Btn>}</div>])} />
          </Card>
        </>
      )}
      {tab === 'cat' && <>{!full && ro()}<Card title="Danh mục"><div className="grid gap-4 text-xs md:grid-cols-2">{[['Cơ sở', Object.values(CAMPUSES).map((c) => c.short)], ['Lớp', Object.values(CLASSES).map((c) => c.name)], ['Ca làm việc', ['Sáng (7:00 - 11:30)', 'Chiều (13:30 - 17:30)', 'Cả ngày']], ['Loại khoản thu', ['Học phí', 'Tiền ăn', 'Ngoại khóa', 'Đón muộn']]].map(([t, items]) => <div key={t} className="rounded-xl bg-brand-cream p-3"><p className="mb-2 font-bold text-brand-primary">{t}</p><ul className="space-y-1">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div></Card></>}
      {tab === 'cfg' && <Card title="Cấu hình hệ thống"><div className="grid gap-4 md:grid-cols-2"><Input label="Giờ làm việc của chat" defaultValue="07:00 - 17:00, thứ 2 đến thứ 6" disabled={!full} /><Input label="Hạn nộp giáo án" defaultValue="17:00 thứ 6 hằng tuần" disabled={!full} /><Input label="Thời gian lưu ảnh (tháng)" defaultValue="6" disabled={!full} /><Input label="Nhà cung cấp OTP" defaultValue="SMS / Zalo OA" disabled={!full} /></div>{full && <div className="mt-4 flex justify-end"><Btn kind="primary" onClick={() => { audit('Lưu cấu hình'); toast('Đã lưu cấu hình (demo)'); }}>Lưu cấu hình</Btn></div>}</Card>}
      {tab === 'audit' && <Card title="Nhật ký hoạt động"><div className="mb-4"><input type="search" className="fld sm:max-w-sm" placeholder="Tìm theo người hoặc hành động" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm" /></div><Table heads={['Thời gian', 'Người dùng', 'Hành động']} rows={audits.map((x) => [x.t, x.user, x.action])} empty="Không có bản ghi." minWidth={420} /></Card>}
      {add && (
        <Modal title="Thêm tài khoản" onClose={() => setAdd(false)}>
          <form onSubmit={save} noValidate className="space-y-4">
            <Input label="Họ tên *" value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} error={aErr.name} />
            <Input label="Email *" type="email" value={a.email} onChange={(e) => setA({ ...a, email: e.target.value })} error={aErr.email} />
            <Select label="Vai trò" value={a.role} onChange={(e) => setA({ ...a, role: e.target.value })} options={Object.entries(ROLE_DEF).map(([k, r]) => [k, r.label])} />
            <Select label="Cơ sở" value={a.campus} onChange={(e) => setA({ ...a, campus: e.target.value })} options={CAMPUS_OPTIONS} />
            <div className="flex justify-end gap-2"><Btn onClick={() => setAdd(false)}>Hủy</Btn><Btn kind="primary" type="submit">Tạo và gửi lời mời</Btn></div>
          </form>
        </Modal>
      )}
      {reset && <Confirm message={`Gửi email đặt lại mật khẩu cho ${reset.email}?`} onYes={() => { audit(`Đặt lại mật khẩu ${reset.email}`); toast('Đã gửi email đặt lại mật khẩu'); }} onClose={() => setReset(null)} />}
    </>
  );
}

/* ===== Hồ sơ ===== */
function Profile() {
  const { R, audit } = useStaff();
  const toast = useToast();
  const [v, setV] = useState({ p0: '', p1: '', p2: '' });
  const [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const errs = validate(v, { p0: [rule.required('Vui lòng nhập mật khẩu hiện tại.')], p1: [(x) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(x) ? '' : 'Mật khẩu chưa đủ mạnh.')], p2: [(x, all) => (x === all.p1 ? '' : 'Mật khẩu nhập lại không khớp.')] });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setV({ p0: '', p1: '', p2: '' }); audit('Đổi mật khẩu'); toast('Đã đổi mật khẩu. Các phiên khác bị đăng xuất.');
  };
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Thông tin tài khoản"><form onSubmit={(e) => { e.preventDefault(); toast('Đã lưu hồ sơ (demo)'); }} className="space-y-4"><Input label="Họ tên" defaultValue={R.name} /><Input label="Vai trò" value={R.label} disabled readOnly /><Input label="Số điện thoại" /><Btn kind="primary" type="submit">Lưu</Btn></form></Card>
        <Card title="Đổi mật khẩu"><form onSubmit={submit} noValidate className="space-y-4"><Input label="Mật khẩu hiện tại" type="password" value={v.p0} onChange={set('p0')} error={errors.p0} /><Input label="Mật khẩu mới" type="password" value={v.p1} onChange={set('p1')} error={errors.p1} hint="Tối thiểu 10 ký tự, gồm chữ hoa, chữ thường và số." /><Input label="Nhập lại mật khẩu mới" type="password" value={v.p2} onChange={set('p2')} error={errors.p2} /><Btn kind="primary" type="submit">Đổi mật khẩu</Btn></form></Card>
      </div>
      <Card title="Xác thực hai bước"><p className="text-sm">{R.tfa ? <Badge tone="bg-green-100 text-brand-green">Bắt buộc và đang bật</Badge> : <Badge tone="bg-yellow-100 text-brand-gold">Khuyến nghị</Badge>}</p><p className="mt-2 text-xs text-gray-500">Bắt buộc cho BGH, kế toán, lãnh đạo hệ thống và quản trị.</p></Card>
    </>
  );
}

export const PagesB = { Fees, Crm, Reports, Lessons, Hr, Admin, Profile };
