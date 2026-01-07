import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Strength from './pages/Strength';
import Mentorship from './pages/Mentorship';
import Goalkeeper from './pages/Goalkeeper';
import BookingPolicy from './pages/BookingPolicy';
import ApexPrivacy from './pages/ApexPrivacy';
import Contact from './pages/Contact';
import PaymentSuccess from './pages/PaymentSuccess';
import Services from './pages/Services';
import WelcomeAthlete from './pages/WelcomeAthlete';

import { DataProvider } from './context/DataContext';
import AdminUpload from './pages/Admin/AdminUpload';
import AthleteDashboard from './pages/Portal/AthleteDashboard';
import TeamDashboard from './pages/Portal/TeamDashboard';
import PortalLogin from './pages/Portal/PortalLogin';
import ErrorBoundary from './components/ErrorBoundary';

// Wrapper to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const InnerLayout: React.FC = () => {
  const location = useLocation();
  // Hide Navbar/Footer only on Dashboard routes (e.g. /portal/123, /portal/team), show on Login (/portal)
  const isDashboard = /^\/portal\/.+/.test(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/strength" element={<Strength />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/goalkeeper" element={<Goalkeeper />} />
          <Route path="/booking-policy" element={<BookingPolicy />} />
          <Route path="/privacy-policy" element={<ApexPrivacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/welcome-athlete" element={<WelcomeAthlete />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />


          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/portal/team" element={<ErrorBoundary><TeamDashboard /></ErrorBoundary>} />
          <Route path="/portal/:athleteId" element={<ErrorBoundary><AthleteDashboard /></ErrorBoundary>} />
          <Route path="/admin-upload" element={<AdminUpload />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <InnerLayout />
      </Router>
    </DataProvider>
  );
};

export default App;