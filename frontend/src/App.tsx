import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import CourseGallery from './pages/CourseGallery';
import CourseDetail from './pages/CourseDetail';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import LandingPageRenderer from './pages/LandingPageRenderer';
import LandingPageEditor from './pages/admin/LandingPageEditor';

// Protected Route for admin
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('valcollect_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen selection:bg-[#16c66c]/20">
      <ScrollToTop />

      {/* Global SEO defaults */}
      <Helmet>
        <html lang="ar" dir="rtl" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Valcollect | التدريب والتعليم المتميز</title>
        <meta name="description" content="Valcollect للتدريب المهني المعتمد - دورات عملية في التحليل الفني، التسويق الرقمي، الإدارة المالية، والبرمجة." />
        <meta name="keywords" content="Valcollect, تدريب, دورات, شهادات معتمدة, تحليل فني, تسويق رقمي, إدارة مالية, برمجة, البحرين, السعودية" />
        <meta name="author" content="Valcollect" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Valcollect" />
        <meta property="og:title" content="Valcollect | التدريب والتعليم المتميز" />
        <meta property="og:description" content="مركز تدريبي متقدم يقدم دورات عملية معتمدة في مجالات التحليل الفني والتسويق الرقمي والبرمجة." />
        <meta property="og:locale" content="ar_SA" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Valcollect" />
        <meta name="twitter:description" content="التدريب المهني المعتمد - دورات عملية بشهادات معتمدة" />

        {/* Canonical */}
        <link rel="canonical" href="https://valcollect.com" />
      </Helmet>

      {!isAdmin && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Helmet>
                <title>الرئيسية | Valcollect</title>
                <meta name="description" content="Valcollect - مركز تدريبي متقدم في البحرين والسعودية. دورات في التحليل الفني، التسويق الرقمي، الإدارة المالية والبرمجة بشهادات معتمدة." />
              </Helmet>
              <Home />
            </>
          } />
          <Route path="/courses" element={
            <>
              <Helmet>
                <title>الدورات التدريبية | Valcollect</title>
                <meta name="description" content="اكتشف مجموعتنا الشاملة من الدورات المعتمدة: التحليل الفني، التسويق الرقمي، إدارة الموارد البشرية، البرمجة وغيرها." />
              </Helmet>
              <CourseGallery />
            </>
          } />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/landing/:slug" element={<LandingPageRenderer />} />

          {/* Admin Protected Editor Routes */}
          <Route path="/admin/landing-pages/new" element={<ProtectedRoute><LandingPageEditor /></ProtectedRoute>} />
          <Route path="/admin/landing-pages/edit/:id" element={<ProtectedRoute><LandingPageEditor /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppLayout />
      </Router>
    </HelmetProvider>
  );
};

export default App;
