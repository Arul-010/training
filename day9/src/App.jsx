import { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import BudgetPage from './pages/BudgetPage';
import { ShopContext } from './context/ShopContext';
import { Zap } from 'lucide-react';
import './App.css';

function App() {
  const { toasts } = useContext(ShopContext);

  useEffect(() => {
    document.body.style.backgroundColor = '#060a0f';
    document.body.style.margin = '0';
  }, []);

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
            <span>About Us</span>
            <span>•</span>
            <span>Returns &amp; Refunds</span>
            <span>•</span>
            <span>Jersey Customization</span>
            <span>•</span>
            <span>Contact</span>
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
