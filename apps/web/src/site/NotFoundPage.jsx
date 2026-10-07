import { Link } from 'react-router-dom';
import { useLang } from './i18n.jsx';
import { usePageMeta } from './parts.jsx';

export default function NotFound() {
  usePageMeta('notfound');
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-20 text-center">
      <p className="text-7xl font-bold text-brand-primary">404</p>
      <h1 className="text-2xl font-bold text-gray-900">{t('Không tìm thấy trang')}</h1>
      <p className="text-sm text-gray-600">Đường dẫn có thể đã thay đổi hoặc không tồn tại. Hãy quay lại trang chủ hoặc liên hệ chúng tôi.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="tap inline-flex items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-white transition hover:bg-brand-deep">{t('Về trang chủ')}</Link>
        <Link to="/contact" className="tap inline-flex items-center rounded-full border-2 border-brand-primary px-6 text-sm font-semibold text-brand-primary transition hover:bg-brand-tint">{t('Liên Hệ')}</Link>
      </div>
    </div>
  );
}
