import { useEffect, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import BudgetPage from './pages/BudgetPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import CustomizationGuide from './pages/CustomizationGuide';
import ContactPage from './pages/ContactPage';
import BuyNowPage from './pages/BuyNowPage';
import { ShopContext } from './context/ShopContext';
import { Zap } from 'lucide-react';
import './App.css';

function App() {
  const { toasts } = useContext(ShopContext);
  const location = useLocation();

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--bg-app)';
    document.body.style.margin = '0';
  }, []);

  // Scroll to top on route change to guarantee professional page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-wrapper day-study">
      {/* Navbar */}
      <Navbar />

      {/* Main Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/customization" element={<CustomizationGuide />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/buynow/:id" element={<BuyNowPage />} />
      </Routes>

      {/* Footer */}
      <footer className="student-footer">
        <div className="footer-notebook-decor" />
        <div className="footer-content">
          <div className="logo-footer">
            <Zap className="mr-2" size={20} />
            <span>SPORTZONE STORE</span>
          </div>
          <div className="footer-links">
            <Link to="/about" className="footer-nav-link">About Us</Link>
            <span>•</span>
            <Link to="/support" className="footer-nav-link">Returns &amp; Refunds</Link>
            <span>•</span>
            <Link to="/customization" className="footer-nav-link">Jersey Customization</Link>
            <span>•</span>
            <Link to="/contact" className="footer-nav-link">Contact</Link>
          </div>
          <p>© 2026 SportZone — Made in India 🇮🇳 for Sports Fans</p>
          <div className="student-tips-scroller">
            <span className="badge">SPORT TIP</span>
            <span className="tip-text">Use code <strong>SPORT15</strong> for 15% off! Free shipping on orders above ₹999 🚚</span>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast-alert animate-fade-in">
            <span className="toast-icon">{t.icon}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
