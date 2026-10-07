import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ADMISSION_STEPS, BENEFITS, CAMPUS_OPTIONS, CAMPUSES, FAQS, FEE_ROWS, HOTLINE, JOBS, OFFICIAL_EMAIL, SCHOLARSHIPS } from '../shared/data.js';
import { rule, validate } from '../shared/format.js';
import { BackLink, Input, Select, Textarea } from '../shared/ui.jsx';
import NotFound from './NotFoundPage.jsx';
import { PageHead, usePageMeta, Wrap } from './parts.jsx';

const SubmitBtn = ({ children }) => <button type="submit" className="tap w-full rounded-xl bg-brand-primary text-xs font-bold text-white shadow-md transition hover:bg-brand-deep">{children}</button>;

/** Ô ẩn chống spam: người thật không thấy, bot thường điền vào. */
const Honeypot = ({ value, onChange }) => <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={value} onChange={onChange} name="website" />;

function useSubmit(initial, rules, kind) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ ...initial, website: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.type === 'file' ? e.target.files[0] : e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (values.website) { navigate('/thanks', { state: { kind } }); return; }
    const errs = validate(values, rules);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Demo: chưa gửi về backend
    navigate('/thanks', { state: { kind } });
  };
  return { values, errors, set, submit };
}

function AdmissionForm() {
  const f = useSubmit({ parent: '', phone: '', campus: 'phutho1', child: '' }, { parent: [rule.required()], phone: [rule.required(), rule.phone()], child: [rule.required()] }, 'admission');
  return (
    <form onSubmit={f.submit} noValidate className="grid gap-4 text-left md:grid-cols-2">
      <Input label="Họ tên Phụ huynh *" value={f.values.parent} onChange={f.set('parent')} error={f.errors.parent} placeholder="Nguyễn Văn A" autoComplete="name" />
      <Input label="Số điện thoại *" type="tel" inputMode="tel" value={f.values.phone} onChange={f.set('phone')} error={f.errors.phone} placeholder="0905 xxx xxx" autoComplete="tel" />
      <Select label="Cơ sở đăng ký *" value={f.values.campus} onChange={f.set('campus')} options={CAMPUS_OPTIONS} />
      <Input label="Tên & tuổi của bé *" value={f.values.child} onChange={f.set('child')} error={f.errors.child} placeholder="Bé Bin - 3 tuổi" />
      <Honeypot value={f.values.website} onChange={f.set('website')} />
      <div className="pt-2 md:col-span-2">
        <SubmitBtn>GỬI THÔNG TIN ĐĂNG KÝ</SubmitBtn>
        <p className="mt-3 text-center text-xs text-gray-500">Bằng việc gửi form, bạn đồng ý với <Link to="/privacy" className="text-brand-primary underline">Chính sách bảo mật</Link>.</p>
      </div>
    </form>
  );
}

export function Admissions() {
  usePageMeta('admissions');
  return (
    <Wrap className="max-w-5xl" space="space-y-12">
      <PageHead eyebrow="Tuyển Sinh Năm Học 2026 - 2027" title="Đăng Ký Tham Quan & Nhập Học" />
      <div className="space-y-6 rounded-2xl border border-brand-tint3 bg-white p-6 shadow-soft md:p-10">
        <h2 className="text-center text-xl font-bold text-gray-900">Đặt Lịch Tham Quan Trường</h2>
        <AdmissionForm />
      </div>
      <div className="space-y-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">Quy Trình Đăng Ký Nhập Học</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADMISSION_STEPS.map(([icon, title, text], i) => (
            <li key={title} className="space-y-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">{i + 1}</span><i className={`fa-solid ${icon} text-lg text-brand-gold`} /></div><h3 className="text-sm font-bold">{title}</h3><p className="text-xs leading-relaxed text-gray-600">{text}</p></li>
          ))}
        </ol>
      </div>
      <div className="space-y-6">
        <div className="text-center"><h2 className="text-2xl font-bold text-gray-900">Bảng Phí &amp; Học Bổng</h2><p className="mt-1 text-sm text-gray-500">Số liệu minh họa, chờ xác nhận mức phí chính thức từng cơ sở</p></div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[520px] text-xs"><caption className="sr-only">Bảng phí theo khối</caption>
            <thead className="bg-brand-tint text-left text-brand-primary"><tr>{['Khối', 'Học phí / tháng', 'Tiền ăn / ngày', 'Ghi chú'].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100">{FEE_ROWS.map((r) => <tr key={r[0]}><td className="p-3 font-semibold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td><td className="p-3 text-gray-500">{r[3]}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SCHOLARSHIPS.map(([icon, title, text]) => <div key={title} className="space-y-2 rounded-2xl border border-brand-tint2 bg-brand-cream p-5"><i className={`fa-solid ${icon} text-xl text-brand-gold`} /><h3 className="text-sm font-bold">{title}</h3><p className="text-xs leading-relaxed text-gray-600">{text}</p></div>)}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-center text-2xl font-bold text-gray-900">Câu Hỏi Thường Gặp</h2>
        <div className="mx-auto max-w-3xl space-y-2">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group rounded-xl border border-gray-100 bg-white shadow-sm">
              <summary className="tap flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold">{q}<i className="fa-solid fa-chevron-down text-xs text-brand-primary transition group-open:rotate-180" /></summary>
              <p className="px-4 pb-4 text-xs leading-relaxed text-gray-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

export function Careers() {
  usePageMeta('careers');
  return (
    <Wrap space="space-y-8">
      <PageHead eyebrow="Gia Nhập Đội Ngũ Ánh Dương" title="Cơ Hội Nghề Nghiệp" sub="Nơi bạn được phát triển chuyên môn trong môi trường giáo dục văn minh" />
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {JOBS.map((j) => (
          <Link key={j.id} to={`/careers/${j.id}`} className="space-y-2 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-brand-tint3 hover:shadow-md">
            <span className="rounded bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">{j.type}</span>
            <h3 className="text-sm font-bold">{j.title}</h3>
            <p className="text-xs text-gray-500"><i className="fa-solid fa-location-dot mr-1" />{j.campus}</p>
            <p className="text-xs font-semibold text-brand-green">Mức lương: {j.salary}</p>
            <p className="text-xs text-gray-500">Hạn nộp: {j.deadline}</p>
            <span className="text-xs font-semibold text-brand-primary">Xem chi tiết &amp; ứng tuyển <i className="fa-solid fa-arrow-right ml-1" /></span>
          </Link>
        ))}
      </div>
    </Wrap>
  );
}

const CV_RULE = rule.file({ exts: ['pdf', 'doc', 'docx'], maxMb: 5 });

function ApplyForm() {
  const f = useSubmit({ name: '', phone: '', email: '', campus: '', message: '', cv: null }, { name: [rule.required()], phone: [rule.required(), rule.phone()], email: [rule.required(), rule.email()], cv: [CV_RULE] }, 'job');
  return (
    <form onSubmit={f.submit} noValidate className="grid gap-4 rounded-2xl border border-brand-tint3 bg-white p-6 text-left shadow-soft md:grid-cols-2 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 md:col-span-2">Ứng tuyển vị trí này</h2>
      <Input label="Họ tên *" value={f.values.name} onChange={f.set('name')} error={f.errors.name} autoComplete="name" />
      <Input label="Số điện thoại *" type="tel" inputMode="tel" value={f.values.phone} onChange={f.set('phone')} error={f.errors.phone} autoComplete="tel" />
      <Input label="Email *" type="email" value={f.values.email} onChange={f.set('email')} error={f.errors.email} autoComplete="email" />
      <Select label="Cơ sở mong muốn" value={f.values.campus} onChange={f.set('campus')} options={[['', 'Chưa xác định'], ...CAMPUS_OPTIONS]} />
      <Input className="md:col-span-2" label="Tải CV (PDF, DOC, DOCX, tối đa 5MB) *" type="file" accept=".pdf,.doc,.docx" onChange={f.set('cv')} error={f.errors.cv} />
      <Textarea className="md:col-span-2" label="Giới thiệu ngắn" maxLength={1000} value={f.values.message} onChange={f.set('message')} />
      <Honeypot value={f.values.website} onChange={f.set('website')} />
      <div className="md:col-span-2"><SubmitBtn>GỬI HỒ SƠ ỨNG TUYỂN</SubmitBtn><p className="mt-3 text-center text-xs text-gray-500">Hồ sơ được lưu tối đa 3 tháng. Xem <Link to="/privacy" className="text-brand-primary underline">Chính sách bảo mật</Link>.</p></div>
    </form>
  );
}

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const j = JOBS.find((x) => x.id === id);
  usePageMeta('careers', j?.title);
  if (!j) return <NotFound />;
  const list = (items) => items.map((i) => <li key={i}><i className="fa-solid fa-check mr-2 text-brand-green" />{i}</li>);
  const box = (title, items) => <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-2 text-sm font-bold text-brand-primary">{title}</h2><ul className="space-y-2 text-gray-600">{list(items)}</ul></div>;
  return (
    <Wrap className="max-w-4xl" space="space-y-8">
      <BackLink onClick={() => navigate('/careers')}>Tất cả vị trí</BackLink>
      <div className="space-y-2">
        <span className="rounded bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">{j.type}</span>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{j.title}</h1>
        <p className="text-xs text-gray-500"><i className="fa-solid fa-location-dot mr-1" />{j.campus} · Hạn nộp: {j.deadline}</p>
        <p className="text-sm font-semibold text-brand-green">Mức lương: {j.salary}</p>
      </div>
      <div className="grid gap-4 text-xs md:grid-cols-3">{box('Mô tả công việc', j.desc)}{box('Yêu cầu', j.req)}{box('Quyền lợi', BENEFITS)}</div>
      <ApplyForm />
    </Wrap>
  );
}

export function Contact() {
  usePageMeta('contact');
  const f = useSubmit({ name: '', phone: '', email: '', campus: '', message: '' }, { name: [rule.required()], phone: [rule.required(), rule.phone()], message: [rule.required()], email: [(v) => (v ? rule.email()(v) : '')] }, 'contact');
  const navigate = useNavigate();
  return (
    <Wrap className="max-w-5xl" space="space-y-10">
      <PageHead eyebrow="Kết Nối Với Chúng Tôi" title="Liên Hệ" sub="Gửi câu hỏi, góp ý hoặc đề nghị hợp tác. Chúng tôi phản hồi trong 1 ngày làm việc." />
      <div className="grid gap-6 md:grid-cols-5">
        <form onSubmit={f.submit} noValidate className="space-y-4 rounded-2xl border border-brand-tint3 bg-white p-6 shadow-soft md:col-span-3">
          <Input label="Họ tên *" value={f.values.name} onChange={f.set('name')} error={f.errors.name} autoComplete="name" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Số điện thoại *" type="tel" inputMode="tel" value={f.values.phone} onChange={f.set('phone')} error={f.errors.phone} autoComplete="tel" />
            <Input label="Email" type="email" value={f.values.email} onChange={f.set('email')} error={f.errors.email} autoComplete="email" />
          </div>
          <Select label="Cơ sở liên quan" value={f.values.campus} onChange={f.set('campus')} options={[['', 'Chưa xác định'], ...CAMPUS_OPTIONS]} />
          <Textarea label="Nội dung *" rows={4} maxLength={1000} value={f.values.message} onChange={f.set('message')} error={f.errors.message} />
          <Honeypot value={f.values.website} onChange={f.set('website')} />
          <SubmitBtn>GỬI LIÊN HỆ</SubmitBtn>
        </form>
        <aside className="space-y-4 md:col-span-2">
          <div className="space-y-2 rounded-2xl border border-gray-100 bg-white p-5 text-xs shadow-sm"><h2 className="text-sm font-bold text-brand-primary">Ban Quản Trị Hệ Thống</h2><p><i className="fa-solid fa-phone mr-2 text-brand-green" />Hotline: {HOTLINE}</p><p className="break-words"><i className="fa-solid fa-envelope mr-2 text-brand-primary" />{OFFICIAL_EMAIL}</p></div>
          {Object.entries(CAMPUSES).map(([k, c]) => (
            <div key={k} className="space-y-1 rounded-2xl border border-gray-100 bg-white p-4 text-xs shadow-sm"><h3 className="text-sm font-bold text-brand-primary">{c.short}</h3><p><i className="fa-solid fa-location-dot mr-2 text-gray-400" />{c.addr}</p><button onClick={() => navigate(`/campuses/${k}`)} className="font-semibold text-brand-primary hover:underline">Xem chi tiết &amp; bản đồ</button></div>
          ))}
        </aside>
      </div>
    </Wrap>
  );
}

export function Privacy() {
  usePageMeta('privacy');
  const sections = [
    ['1. Dữ liệu chúng tôi thu thập', 'Họ tên, số điện thoại, email phụ huynh; tên và tuổi của bé; hồ sơ ứng tuyển (CV) khi bạn gửi form trên website.'],
    ['2. Mục đích sử dụng', 'Liên hệ tư vấn tuyển sinh, sắp xếp lịch tham quan, xử lý hồ sơ ứng tuyển và gửi bản tin khi bạn đăng ký.'],
    ['3. Thời gian lưu trữ', 'Đăng ký tuyển sinh và hồ sơ ứng tuyển được lưu tối đa 3 tháng, sau đó xóa.'],
    ['4. Chia sẻ dữ liệu', 'Chúng tôi không bán dữ liệu cá nhân. Chỉ bộ phận tuyển sinh/nhân sự của cơ sở liên quan được xem thông tin bạn gửi.'],
    ['5. Quyền của bạn', 'Bạn có thể yêu cầu xem, sửa hoặc xóa dữ liệu, hoặc hủy nhận bản tin, bằng cách liên hệ qua trang Liên hệ.'],
  ];
  return (
    <Wrap className="max-w-3xl" space="space-y-6 text-sm leading-relaxed text-gray-700">
      <div className="text-center"><h1 className="text-3xl font-bold text-gray-900">Chính Sách Bảo Mật</h1><p className="mt-1 text-xs text-gray-500">Bản nháp, cần rà soát pháp lý trước khi công bố</p></div>
      {sections.map(([h, t]) => <div key={h}><h2 className="mb-1 text-base font-bold text-brand-primary">{h}</h2><p>{t}</p></div>)}
    </Wrap>
  );
}

const THANKS = {
  admission: ['Cảm ơn Phụ huynh đã đăng ký!', 'Bộ phận tuyển sinh cơ sở sẽ liên hệ lại trong vòng 24 giờ để xác nhận lịch tham quan.'],
  job: ['Đã nhận hồ sơ ứng tuyển', 'Bộ phận nhân sự sẽ xem hồ sơ và liên hệ nếu hồ sơ phù hợp.'],
  contact: ['Đã nhận tin nhắn của bạn', 'Chúng tôi sẽ phản hồi trong 1 ngày làm việc.'],
};

export function Thanks() {
  usePageMeta('thanks');
  const { state } = useLocation();
  const [title, text] = THANKS[state?.kind] || THANKS.contact;
  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-brand-green"><i className="fa-solid fa-circle-check" /></div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-600">{text}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="tap inline-flex items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-white transition hover:bg-brand-deep">Về trang chủ</Link>
        <Link to="/news" className="tap inline-flex items-center rounded-full border-2 border-brand-primary px-6 text-sm font-semibold text-brand-primary transition hover:bg-brand-tint">Xem tin tức</Link>
      </div>
    </div>
  );
}
