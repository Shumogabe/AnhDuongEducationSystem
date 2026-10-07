import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AMENITIES, CAMPUSES, FEE_ROWS, HOTLINE, HOTLINE_TEL, OFFICIAL_EMAIL, PROGRAMS, SCHOLARSHIPS, mapsDirectionsUrl, mapsEmbedUrl, unsplash } from '../shared/data.js';
import { Btn, Tabs } from '../shared/ui.jsx';
import NotFound from './NotFoundPage.jsx';
import { PageHead, PhotoSlot, usePageMeta, Wrap } from './parts.jsx';
import { useLang } from './i18n.jsx';

const TABS = [['overview', 'Tổng quan'], ['team', 'Đội ngũ'], ['contact', 'Liên hệ & Bản đồ'], ['fees', 'Học phí & Ưu đãi']];

function Overview() {
  return (
    <>
      <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
        {AMENITIES.map(([icon, tone, text]) => <div key={text} className="rounded-xl bg-brand-cream p-3"><i className={`fa-solid ${icon} ${tone} mr-1`} /> {text}</div>)}
      </div>
      <h3 className="mb-3 mt-6 text-sm font-bold">Hình ảnh cơ sở</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {['Phòng học', 'Sân chơi', 'Nhà ăn', 'Phòng ngủ', 'Khu vệ sinh', 'Góc sáng tạo'].map((n) => <PhotoSlot key={n} icon="fa-image" className="aspect-[4/3]">{n}</PhotoSlot>)}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-dashed border-brand-tint3 bg-brand-tint p-4 text-xs text-brand-primary"><i className="fa-solid fa-vr-cardboard text-2xl" />Tham quan ảo 360° (chưa có tư liệu)</div>
    </>
  );
}

function Team() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {['Hiệu trưởng', 'Phó hiệu trưởng chuyên môn'].map((r) => <div key={r} className="flex items-center gap-3 rounded-xl bg-brand-cream p-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint2 text-brand-primary"><i className="fa-solid fa-user" /></div><div><p className="text-xs font-bold">Họ tên đang cập nhật</p><p className="text-xs text-gray-500">{r}</p></div></div>)}
      </div>
      <h3 className="mb-3 mt-6 text-sm font-bold">Giáo viên các khối</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.values(PROGRAMS).map((p) => <div key={p.name} className="rounded-xl border border-gray-100 bg-white p-3 text-center text-xs"><div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-brand-tint3 bg-brand-tint text-brand-primary"><i className="fa-solid fa-chalkboard-user" /></div><p className="font-semibold">{p.name}</p><p className="text-gray-500">Ảnh và họ tên đang cập nhật</p></div>)}
      </div>
    </>
  );
}

function Contact({ c }) {
  const navigate = useNavigate();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3 text-xs">
        <p><i className="fa-solid fa-location-dot mr-2 text-brand-primary" />{c.addr}</p>
        <p><i className="fa-solid fa-phone mr-2 text-brand-green" />Hotline hệ thống: {HOTLINE}</p>
        <p className="break-words"><i className="fa-solid fa-envelope mr-2 text-brand-primary" />{OFFICIAL_EMAIL}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <a href={mapsDirectionsUrl(c.addr)} target="_blank" rel="noopener noreferrer" className="tap inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 font-semibold text-white transition hover:bg-brand-deep"><i className="fa-solid fa-diamond-turn-right" />Chỉ đường</a>
          <a href={HOTLINE_TEL} className="tap inline-flex items-center gap-2 rounded-full bg-brand-green px-4 font-semibold text-white"><i className="fa-solid fa-phone" />Gọi ngay</a>
          <Btn onClick={() => navigate('/admissions')}>Đặt lịch tham quan</Btn>
        </div>
      </div>
      <iframe title={`Bản đồ ${c.short}`} src={mapsEmbedUrl(c.addr)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full rounded-xl border border-gray-200" />
    </div>
  );
}

function Fees() {
  return (
    <>
      <p className="mb-3 text-xs text-gray-500">Số liệu minh họa, chờ xác nhận mức phí chính thức của cơ sở.</p>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full min-w-[460px] text-xs"><caption className="sr-only">Khung học phí</caption>
          <thead className="bg-brand-tint text-left text-brand-primary"><tr><th scope="col" className="p-3">Khối</th><th scope="col" className="p-3">Học phí / tháng</th><th scope="col" className="p-3">Tiền ăn / ngày</th></tr></thead>
          <tbody className="divide-y divide-gray-100">{FEE_ROWS.map((r) => <tr key={r[0]}><td className="p-3 font-semibold">{r[0]}</td><td className="p-3">{r[1]}</td><td className="p-3">{r[2]}</td></tr>)}</tbody>
        </table>
      </div>
      <h3 className="mb-3 mt-6 text-sm font-bold">Chính sách ưu đãi tại cơ sở</h3>
      <ul className="space-y-2 text-xs text-gray-600">{SCHOLARSHIPS.map(([i, t, d]) => <li key={t}><i className={`fa-solid ${i} mr-2 text-brand-gold`} /><strong>{t}:</strong> {d}</li>)}</ul>
    </>
  );
}

export function CampusList() {
  usePageMeta('campuses');
  return (
    <Wrap>
      <PageHead eyebrow="Mạng Lưới Trường Học" title="Danh Sách 4 Cơ Sở Trực Thuộc" sub="Chọn cơ sở gần bạn nhất để xem thông tin chi tiết" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(CAMPUSES).map(([k, c]) => (
          <div key={k} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <img src={unsplash(c.img)} alt="" loading="lazy" className="h-36 w-full rounded-xl object-cover" />
            <span className="rounded bg-brand-tint2 px-2 py-0.5 text-xs font-bold text-brand-primary">{c.province}</span>
            <h3 className="text-sm font-bold">{c.title}</h3>
            <p className="text-xs text-gray-600"><i className="fa-solid fa-location-dot mr-1 text-brand-primary" />{c.street}</p>
            <Link to={`/campuses/${k}`} className="tap flex w-full items-center justify-center rounded-xl bg-brand-tint text-xs font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white">Chi tiết cơ sở</Link>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

export function CampusDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [tab, setTab] = useState('overview');
  const c = CAMPUSES[key];
  usePageMeta('campuses', c?.short);
  if (!c) return <NotFound />;
  return (
    <Wrap className="max-w-5xl" space="space-y-6">
      <button onClick={() => navigate('/campuses')} className="tap inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"><i className="fa-solid fa-arrow-left" />{t('Hệ Thống Cơ Sở')}</button>
      <div className="space-y-5 rounded-2xl border-2 border-brand-primary/30 bg-white p-5 md:p-6">
        <div><h1 className="text-xl font-bold text-brand-primary">{c.name}</h1><p className="mt-1 text-xs text-gray-600">Địa chỉ: {c.addr}</p></div>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div role="tabpanel">
          {tab === 'overview' && <Overview />}
          {tab === 'team' && <Team />}
          {tab === 'contact' && <Contact c={c} />}
          {tab === 'fees' && <Fees />}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(CAMPUSES).filter(([k]) => k !== key).map(([k, o]) => <Btn key={k} onClick={() => { setTab('overview'); navigate(`/campuses/${k}`); }}>{o.short}</Btn>)}
      </div>
    </Wrap>
  );
}
