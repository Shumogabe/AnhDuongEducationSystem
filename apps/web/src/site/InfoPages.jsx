import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ALBUMS, CAMPUS_OPTIONS, CAMPUSES, DAY_LABELS, DAY_SCHEDULE, PROGRAMS, TALENTS, menuFor, NEWS, NEWS_CATS, unsplash } from '../shared/data.js';
import { BackLink, Btn, Select, Tabs } from '../shared/ui.jsx';
import NotFound from './NotFoundPage.jsx';
import { PageHead, PhotoSlot, usePageMeta, Wrap } from './parts.jsx';
import { useLang } from './i18n.jsx';

export function About() {
  usePageMeta('about');
  const navigate = useNavigate();
  const person = (init, name, role, tone) => (
    <div className="flex items-center space-x-3 rounded-xl bg-white p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${tone}`}>{init}</div>
      <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-xs text-gray-500">{role}</p></div>
    </div>
  );
  return (
    <Wrap space="space-y-12">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase text-brand-primary">Về Ánh Dương Education</span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Sứ Mệnh &amp; Tầm Nhìn Hệ Thống</h1>
        <p className="mt-3 text-sm text-gray-600">Hệ thống Giáo dục Mầm non Ánh Dương được thành lập với mục tiêu xây dựng mạng lưới trường mầm non chuẩn mực, kết nối tình yêu thương và tri thức tại nhiều tỉnh thành trên toàn quốc.</p>
      </div>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-brand-tint2 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-brand-primary"><i className="fa-solid fa-eye mr-2" />Tầm Nhìn &amp; Sứ Mệnh</h2>
          <p className="text-xs leading-relaxed text-gray-600">Trở thành hệ thống mầm non uy tín hàng đầu tại các tỉnh Phú Thọ, Gia Lai và Khánh Hòa, nơi mỗi em bé đều được tôn trọng, yêu thương và chuẩn bị nền tảng vững chắc để tự tin bước vào cấp tiểu học.</p>
          <h2 className="pt-2 text-xl font-bold text-brand-green"><i className="fa-solid fa-gem mr-2" />Giá Trị Cốt Lõi</h2>
          <ul className="space-y-2 text-xs text-gray-600">
            <li>• <strong>Yêu Thương (Love):</strong> Đặt sự an toàn và hạnh phúc của trẻ lên hàng đầu.</li>
            <li>• <strong>Tôn Trọng (Respect):</strong> Tôn trọng sự khác biệt và thiên hướng của mỗi bé.</li>
            <li>• <strong>Sáng Tạo (Innovation):</strong> Đổi mới phương pháp dạy học theo xu hướng hiện đại.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-brand-tint3 bg-brand-tint p-6">
          <h3 className="mb-4 text-base font-bold text-gray-800"><i className="fa-solid fa-users mr-2 text-brand-primary" />Ban Quản Trị Hệ Thống</h3>
          <div className="space-y-4">
            {person('TS', 'ThS. Nguyễn Thị Lan', 'Giám đốc Hội đồng Giáo dục Hệ thống', 'bg-brand-primary/20 text-brand-primary')}
            {person('HG', 'Cô Hoàng Thị Nga', 'Trưởng Ban Chuyên môn Mầm non', 'bg-brand-green/20 text-brand-green')}
          </div>
        </div>
      </div>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <PhotoSlot className="h-64">Ảnh thương hiệu: khoảnh khắc thật của bé và cô giáo</PhotoSlot>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Câu Chuyện Thương Hiệu</h2>
          <p className="text-sm leading-relaxed text-gray-600">Ánh Dương bắt đầu từ mong muốn tạo ra một ngôi nhà thứ hai ấm áp, nơi mỗi bé được lớn lên trong yêu thương và tôn trọng. Từ một trường tại Phú Thọ, hệ thống mở rộng thành 4 cơ sở tại Phú Thọ, Gia Lai và Khánh Hòa.</p>
          <p className="text-sm leading-relaxed text-gray-600">Triết lý xuyên suốt: <strong>lấy trẻ làm trung tâm, lấy yêu thương làm cốt lõi, lấy trải nghiệm làm phương thức</strong>.</p>
          <p className="text-xs text-gray-500">Nội dung mẫu, cần thay bằng câu chuyện thương hiệu chính thức.</p>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-center text-2xl font-bold text-gray-900">Hội Đồng Chuyên Môn</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[['fa-user-graduate', 'bg-brand-tint2 text-brand-primary', 'Chuyên gia giáo dục mầm non'], ['fa-heart-pulse', 'bg-green-100 text-brand-green', 'Chuyên gia dinh dưỡng và y tế'], ['fa-language', 'bg-blue-100 text-brand-blue', 'Cố vấn chương trình Tiếng Anh']].map(([i, tone, role]) => (
            <div key={role} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><div className={`flex h-12 w-12 items-center justify-center rounded-full ${tone}`}><i className={`fa-solid ${i}`} /></div><div><p className="text-xs font-bold">Họ tên đang cập nhật</p><p className="text-xs text-gray-500">{role}</p></div></div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-center text-2xl font-bold text-gray-900">Hệ Thống 4 Cơ Sở</h2>
        <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(CAMPUSES).map(([k, c]) => <button key={k} onClick={() => navigate(`/campuses/${k}`)} className="tap rounded-xl border border-gray-100 bg-white p-4 text-left font-semibold shadow-sm hover:border-brand-primary"><i className="fa-solid fa-location-dot mr-2 text-brand-primary" />{c.short}</button>)}
        </div>
      </div>
    </Wrap>
  );
}

export function Programs() {
  usePageMeta('programs');
  return (
    <Wrap space="space-y-12">
      <PageHead eyebrow="Lộ Trình Phát Triển" title="Chương Trình Học Theo Độ Tuổi" sub="Khung chương trình thiết kế chuẩn Bộ GD&ĐT kết hợp giáo dục kỹ năng" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(PROGRAMS).map(([k, p]) => (
          <Link key={k} to={`/programs/${k}`} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-brand-tint3 hover:shadow-md">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${p.tone}`}>{p.code}</div>
            <h3 className="text-base font-bold">{p.name}</h3>
            <p className="text-xs font-semibold text-brand-primary">({p.age})</p>
            <p className="text-xs leading-relaxed text-gray-600">{p.summary}</p>
            <span className="text-xs font-semibold text-brand-primary">Xem chi tiết <i className="fa-solid fa-arrow-right ml-1" /></span>
          </Link>
        ))}
      </div>
      <div className="space-y-6">
        <div className="mx-auto max-w-2xl text-center"><span className="text-xs font-semibold uppercase text-brand-gold">Phát Triển Năng Khiếu</span><h2 className="mt-2 text-2xl font-bold text-gray-900">Năng Khiếu &amp; Tiếng Anh</h2><p className="mt-1 text-sm text-gray-500">Các môn tự chọn, học ngoài giờ chính khóa, đăng ký theo từng cơ sở</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TALENTS.map((t) => <div key={t.name} className="space-y-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><i className={`fa-solid ${t.icon} text-2xl ${t.tone}`} /><h3 className="text-sm font-bold">{t.name}</h3><p className="text-xs leading-relaxed text-gray-600">{t.desc}</p></div>)}
        </div>
      </div>
    </Wrap>
  );
}

export function ProgramDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const p = PROGRAMS[key];
  usePageMeta('programs', p ? `${p.name} (${p.age})` : undefined);
  if (!p) return <NotFound />;
  const keys = Object.keys(PROGRAMS);
  const idx = keys.indexOf(key);
  return (
    <Wrap className="max-w-5xl" space="space-y-8">
      <BackLink onClick={() => navigate('/programs')}>Tất cả chương trình</BackLink>
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl font-bold ${p.tone}`}>{p.code}</div>
        <div><h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{p.name}</h1><p className="text-sm font-semibold text-brand-primary">{p.age}</p></div>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{p.summary}</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-3 text-base font-bold text-brand-primary"><i className="fa-solid fa-bullseye mr-2" />Mục tiêu phát triển</h2><ul className="space-y-2 text-xs text-gray-600">{p.goals.map((g) => <li key={g}><i className="fa-solid fa-check mr-2 text-brand-green" />{g}</li>)}</ul></div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h2 className="mb-3 text-base font-bold text-brand-primary"><i className="fa-solid fa-puzzle-piece mr-2" />Hoạt động tiêu biểu</h2><div className="flex flex-wrap gap-2 text-xs">{p.activities.map((a) => <span key={a} className="rounded-full bg-brand-tint px-3 py-1.5 font-medium text-brand-primary">{a}</span>)}</div></div>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-brand-primary"><i className="fa-regular fa-clock mr-2" />Lịch sinh hoạt mẫu trong ngày</h2>
        <ul className="divide-y divide-gray-100 text-xs">{DAY_SCHEDULE.map(([time, act]) => <li key={time} className="flex gap-4 py-2"><span className="w-28 shrink-0 font-semibold text-gray-700">{time}</span><span className="text-gray-600">{act}</span></li>)}</ul>
        <p className="mt-3 text-xs text-gray-500">Lịch mẫu, có thể khác nhau theo cơ sở.</p>
      </div>
      <div className="flex flex-wrap justify-between gap-3">
        <Btn kind="primary" onClick={() => navigate('/admissions')} className="px-6 text-sm">Đặt lịch tham quan</Btn>
        <div className="flex gap-2">
          {idx > 0 && <Btn onClick={() => navigate(`/programs/${keys[idx - 1]}`)} icon="fa-arrow-left">{PROGRAMS[keys[idx - 1]].name}</Btn>}
          {idx < keys.length - 1 && <Btn onClick={() => navigate(`/programs/${keys[idx + 1]}`)}>{PROGRAMS[keys[idx + 1]].name}<i className="fa-solid fa-arrow-right" /></Btn>}
        </div>
      </div>
    </Wrap>
  );
}

export function Nutrition() {
  usePageMeta('nutrition');
  const [campus, setCampus] = useState('phutho1');
  const dow = new Date('2026-10-07T00:00:00').getDay();
  const [day, setDay] = useState(Math.min(Math.max(dow - 1, 0), 4));
  const meals = menuFor(campus, day);
  const steps = [['Đăng ký người đón', 'phụ huynh khai báo tối đa 3 người được phép đón bé.'], ['Xác thực khi đón', 'quét mã QR trên App Phụ huynh hoặc xuất trình giấy tờ.'], ['Bàn giao tại cổng', 'cô giáo chỉ trao bé cho người đã xác thực, ghi nhận giờ đón.'], ['Đón muộn / người lạ', 'liên hệ phụ huynh trước, không bàn giao khi chưa xác nhận.']];
  return (
    <Wrap space="space-y-12">
      <PageHead eyebrow="Sức Khỏe Học Đường" title="Chế Độ Dinh Dưỡng & Y Tế" sub="Đảm bảo calo và vi chất dinh dưỡng theo độ tuổi" />
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-base font-bold text-brand-primary"><i className="fa-solid fa-utensils mr-2" />Thực Đơn Tuần</h2>
          <Select label="Cơ sở" value={campus} onChange={(e) => setCampus(e.target.value)} options={CAMPUS_OPTIONS} />
        </div>
        <Tabs tabs={DAY_LABELS.map((d, i) => [i, d])} value={day} onChange={setDay} />
        <div className="grid gap-3 text-xs md:grid-cols-3">
          {['Bữa sáng', 'Bữa trưa', 'Bữa chiều'].map((l, i) => <div key={l} className="rounded-xl bg-brand-cream p-4"><p className="mb-1 font-bold text-gray-700">{l}</p><p className="text-gray-600">{meals[i]}</p></div>)}
        </div>
        <p className="text-xs text-gray-500">Thực đơn mẫu, cập nhật hằng tuần theo từng cơ sở. Có thể điều chỉnh theo dị ứng của bé khi phụ huynh báo trước.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-green"><i className="fa-solid fa-notes-medical mr-2" />Theo Dõi Y Tế</h2>
          <ul className="space-y-2 text-xs text-gray-600">{['Khám sức khỏe định kỳ 2 lần/năm (Răng hàm mặt, Mắt, Cân đo).', 'Cập nhật biểu đồ tăng trưởng WHO trên App Phụ huynh hàng tháng.', 'Quy trình nhận và cho uống thuốc an toàn qua ứng dụng.', 'Theo dõi dị ứng thực phẩm của từng bé.'].map((t) => <li key={t}><i className="fa-solid fa-check mr-2 text-brand-green" />{t}</li>)}</ul>
        </div>
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-primary"><i className="fa-solid fa-shield-heart mr-2" />Quy Trình An Toàn &amp; Đón Trả Trẻ</h2>
          <ol className="space-y-3 text-xs text-gray-600">{steps.map(([b, t], i) => <li key={b} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-tint2 font-bold text-brand-primary">{i + 1}</span><span><strong>{b}:</strong> {t}</span></li>)}</ol>
          <p className="text-xs text-gray-500">Camera 24/7 tại cổng và phòng học. Giờ đón trả cụ thể theo từng cơ sở.</p>
        </div>
      </div>
    </Wrap>
  );
}

const PAGE_SIZE = 3;
function NewsCard({ n }) {
  const cat = NEWS_CATS[n.cat];
  return (
    <Link to={`/news/${n.id}`} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:shadow-md">
      <div className="h-40 overflow-hidden rounded-xl bg-gray-200"><img src={unsplash(n.img)} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
      <span className={`rounded px-2 py-0.5 text-xs font-bold ${cat.tone}`}>{cat.label}</span>
      <h3 className="text-sm font-bold leading-snug">{n.title}</h3>
      <p className="text-xs text-gray-500">{n.date}</p>
    </Link>
  );
}

export function News() {
  usePageMeta('news');
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const items = NEWS.filter((n) => filter === 'all' || n.cat === filter);
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const cur = Math.min(page, pages);
  const slice = items.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);
  const chips = [['all', 'Tất cả'], ...Object.entries(NEWS_CATS).map(([k, v]) => [k, v.label])];
  return (
    <Wrap>
      <PageHead eyebrow="Bản Tin Ánh Dương" title="Tin Tức & Hoạt Động Nổi Bật" />
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Lọc theo danh mục">
        {chips.map(([k, l]) => <button key={k} aria-pressed={filter === k} onClick={() => { setFilter(k); setPage(1); }} className={`tab-btn tap ${filter === k ? 'active' : ''}`}>{l}</button>)}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slice.length ? slice.map((n) => <NewsCard key={n.id} n={n} />) : <p className="col-span-full py-10 text-center text-sm text-gray-500">Chưa có bài viết trong danh mục này.</p>}
      </div>
      {pages > 1 && <div className="flex items-center justify-center gap-2">{Array.from({ length: pages }, (_, i) => <button key={i} aria-label={`Trang ${i + 1}`} aria-current={cur === i + 1} onClick={() => setPage(i + 1)} className={`tab-btn h-11 w-11 !px-0 text-sm ${cur === i + 1 ? 'active' : ''}`}>{i + 1}</button>)}</div>}
      <div className="text-center"><Link to="/gallery" className="tap inline-flex items-center gap-2 rounded-full border-2 border-brand-primary px-5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white"><i className="fa-regular fa-images" /> {t('Thư Viện Ảnh & Video')}</Link></div>
    </Wrap>
  );
}

export function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const n = NEWS.find((x) => x.id === id);
  usePageMeta('news', n?.title);
  if (!n) return <NotFound />;
  const cat = NEWS_CATS[n.cat];
  const related = [...NEWS.filter((x) => x.id !== id && x.cat === n.cat), ...NEWS.filter((x) => x.id !== id && x.cat !== n.cat)].slice(0, 2);
  return (
    <Wrap className="max-w-3xl" space="space-y-6">
      <BackLink onClick={() => navigate('/news')}>Tất cả tin tức</BackLink>
      <div className="space-y-3">
        <span className={`rounded px-2 py-0.5 text-xs font-bold ${cat.tone}`}>{cat.label}</span>
        <h1 className="text-2xl font-bold leading-snug text-gray-900 md:text-3xl">{n.title}</h1>
        <p className="text-xs text-gray-500"><i className="fa-regular fa-calendar mr-1" />{n.date}</p>
      </div>
      <img src={unsplash(n.img, 1000)} alt="" className="max-h-96 w-full rounded-2xl object-cover" />
      <div className="space-y-4 text-sm leading-relaxed text-gray-700">{n.body.map((p) => <p key={p}>{p}</p>)}</div>
      <div className="space-y-4 border-t border-gray-100 pt-6"><h2 className="text-base font-bold text-brand-primary">Bài viết liên quan</h2><div className="grid gap-4 sm:grid-cols-2">{related.map((r) => <NewsCard key={r.id} n={r} />)}</div></div>
    </Wrap>
  );
}

export function Gallery() {
  usePageMeta('gallery');
  const [filter, setFilter] = useState('all');
  const chips = [['all', 'Tất cả'], ...Object.entries(CAMPUSES).map(([k, c]) => [k, c.short])];
  return (
    <Wrap>
      <PageHead eyebrow="Khoảnh Khắc Ánh Dương" title="Thư Viện Ảnh & Video" sub="Album hoạt động theo từng cơ sở" />
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Lọc album theo cơ sở">
        {chips.map(([k, l]) => <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)} className={`tab-btn tap ${filter === k ? 'active' : ''}`}>{l}</button>)}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {ALBUMS.filter((a) => filter === 'all' || a.campus === filter).map((a) => (
          <div key={a.title} className="space-y-2"><PhotoSlot icon="fa-images" className="aspect-[4/3]">{a.count} ảnh</PhotoSlot><p className="text-xs font-bold">{a.title}</p><p className="text-xs text-gray-500">{CAMPUSES[a.campus].short}</p></div>
        ))}
      </div>
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="text-base font-bold text-brand-primary"><i className="fa-solid fa-circle-play mr-2" />Video Giới Thiệu</h2><PhotoSlot icon="fa-film" className="aspect-video">Video giới thiệu hệ thống 1-2 phút (chưa có tư liệu)</PhotoSlot></div>
    </Wrap>
  );
}
