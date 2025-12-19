import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Strength from './pages/Strength';
import Mentorship from './pages/Mentorship';
import Goalkeeper from './pages/Goalkeeper';
import Checkout from './pages/Checkout';
import BookingPolicy from './pages/BookingPolicy';
import ApexPrivacy from './pages/ApexPrivacy';
import Contact from './pages/Contact';
import { CartProvider } from './context/CartContext';

// Wrapper to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = React.useMemo(() => new URL(window.location.href), [window.location.href]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/strength" element={<Strength />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/goalkeeper" element={<Goalkeeper />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/booking-policy" element={<BookingPolicy />} />
              <Route path="/privacy-policy" element={<ApexPrivacy />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;