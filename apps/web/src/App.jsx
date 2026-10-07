import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './shared/ui.jsx';
import { Careers, Admissions, Contact, JobDetail, Privacy, Thanks } from './site/Forms.jsx';
import { CampusDetail, CampusList } from './site/Campuses.jsx';
import Home from './site/Home.jsx';
import { About, Article, Gallery, News, Nutrition, ProgramDetail, Programs } from './site/InfoPages.jsx';
import { LangProvider } from './site/i18n.jsx';
import NotFound from './site/NotFoundPage.jsx';
import SiteLayout from './site/SiteLayout.jsx';
import DemoHub from './DemoHub.jsx';

// CMS và Portal tải khi cần để website công khai nhẹ hơn
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
const StaffApp = lazy(() => import('./staff/StaffApp.jsx'));

const Loading = () => <div className="p-10 text-center text-sm text-gray-500">Đang tải...</div>;

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/demo" element={<DemoHub />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/portal/*" element={<StaffApp />} />
            <Route element={<LangProvider><SiteLayout /></LangProvider>}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="campuses" element={<CampusList />} />
              <Route path="campuses/:key" element={<CampusDetail />} />
              <Route path="programs" element={<Programs />} />
              <Route path="programs/:key" element={<ProgramDetail />} />
              <Route path="nutrition" element={<Nutrition />} />
              <Route path="news" element={<News />} />
              <Route path="news/:id" element={<Article />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="admissions" element={<Admissions />} />
              <Route path="careers" element={<Careers />} />
              <Route path="careers/:id" element={<JobDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="thanks" element={<Thanks />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </HashRouter>
  );
}
