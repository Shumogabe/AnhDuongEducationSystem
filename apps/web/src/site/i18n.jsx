import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSessionState } from '../shared/ui.jsx';

/** Từ điển VI → EN cho khung giao diện (nội dung bài viết sẽ song ngữ từ CMS). */
const EN = {
  'Trang Chủ': 'Home', 'Giới Thiệu': 'About', 'Hệ Thống Cơ Sở': 'Campuses', 'Chương Trình Học': 'Programs',
  'Dinh Dưỡng': 'Nutrition', 'Thông Tin': 'Information', 'Tin Tức': 'News', 'Tuyển Sinh': 'Admissions',
  'Tuyển Dụng': 'Careers', 'Liên Hệ': 'Contact', 'Thư Viện Ảnh': 'Gallery', 'Đặt Lịch Tham Quan': 'Book a School Tour',
  'Đăng ký tư vấn': 'Get advice', 'App Phụ Huynh': 'Parent App', 'Phụ Huynh': 'Parents',
  'Portal Nội Bộ (GV/BGH)': 'Staff Portal', 'Nội Bộ': 'Staff', 'Danh Mục': 'Menu',
  'Liên Kết Tiện Ích': 'Quick Links', 'Liên Hệ Ban Quản Trị': 'Contact Management', 'Trang chủ': 'Home',
  'Giới thiệu hệ thống': 'About us', 'Hệ thống cơ sở': 'Campuses', 'Chương trình học': 'Programs',
  'Cổng Giáo Viên & BGH': 'Staff & Management Portal', 'Chọn cơ sở': 'Campuses', 'Đặt lịch tour': 'Book a tour',
  'Sổ liên lạc': 'Parent link', 'Chính sách bảo mật': 'Privacy policy', 'Cơ Hội Nghề Nghiệp': 'Careers',
  'Tin Tức & Hoạt Động Nổi Bật': 'News & Highlights', 'Đăng Ký Tham Quan & Nhập Học': 'Book a Tour & Enroll',
  'Quy Trình Đăng Ký Nhập Học': 'Enrollment Process', 'Bảng Phí & Học Bổng': 'Fees & Scholarships',
  'Câu Hỏi Thường Gặp': 'FAQ', 'Thư Viện Ảnh & Video': 'Photo & Video Gallery',
  'Chương Trình Học Theo Độ Tuổi': 'Programs by Age', 'Chế Độ Dinh Dưỡng & Y Tế': 'Nutrition & Health',
  'Danh Sách 4 Cơ Sở Trực Thuộc': 'Our 4 Campuses', 'Không tìm thấy trang': 'Page not found', 'Về trang chủ': 'Back to home',
  'Hệ Thống Mầm Non Ánh Dương - Ươm Mầm Tương Lai': 'Anh Duong Kindergarten System - Nurturing the Future',
  '3 Trụ Cột Giáo Dục Cốt Lõi': '3 Core Education Pillars', '4 Bước Đón Bé Đến Với Ánh Dương': '4 Steps to Welcome Your Child',
  'Đội Ngũ Giáo Viên Của Chúng Tôi': 'Our Teachers', 'Chia Sẻ Của Phụ Huynh Về Chúng Tôi': 'What Parents Say',
  'Đơn Vị Đồng Hành': 'Our Partners', 'Đăng ký ngay': 'Register now', 'Đăng ký': 'Subscribe', 'Gửi liên hệ': 'Send message',
};

const LangContext = createContext({ lang: 'vi', t: (s) => s, toggle: () => {} });
export const useLang = () => useContext(LangContext);

export function LangProvider({ children }) {
  const [lang, setLang] = useSessionState('site-lang', 'vi');
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const t = useCallback((vi) => (lang === 'en' && EN[vi]) || vi, [lang]);
  const value = useMemo(() => ({ lang, t, toggle: () => setLang(lang === 'vi' ? 'en' : 'vi') }), [lang, t, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
