import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import BudgetPlanner from './components/BudgetPlanner';
import { products } from './data/products';
import { GraduationCap, Flame, Zap, TrendingUp, Star } from 'lucide-react';
import './App.css';

// Top-rated featured products for the flash deals row
const FEATURED_IDS = [1, 18, 22, 32, 24, 34];

function App() {
  // Navigation & Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Interaction States
  const [cartItems, setCartItems] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(100000);
  const [toasts, setToasts] = useState([]);

  // Modal / Drawer visibility
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#080c14';
    document.body.style.margin = '0';
  }, []);

  // Product Filtering logic
  const filteredProducts = products
    .filter(product => {
      const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const featuredProducts = products.filter(p => FEATURED_IDS.includes(p.id));

  // Toast helper
  const showToast = (message, icon = '✨') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Cart actions
  const handleAddToCart = (product, qty = 1, customs = {}) => {
    setCartItems(prev => {
      const duplicateIdx = prev.findIndex(
        item =>
          item.product.id === product.id &&
          JSON.stringify(item.customs) === JSON.stringify(customs)
      );
      if (duplicateIdx > -1) {
        const nextCart = [...prev];
        nextCart[duplicateIdx].quantity += qty;
        return nextCart;
      } else {
        return [...prev, { product, quantity: qty, customs }];
      }
    });
    showToast(`${product.name} added to cart!`, '🛒');
  };

  const handleUpdateQty = (index, nextQty) => {
    if (nextQty <= 0) return;
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = nextQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Budget Planner actions
  const handleAddToBudget = (product) => {
    setBudgetItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  const handleMoveAllBudgetToCart = () => {
    budgetItems.forEach(product => handleAddToCart(product, 1, {}));
    setBudgetItems([]);
    setIsBudgetOpen(false);
    showToast("All budget items moved to cart!", '🛒');
  };

  const totalBudgetCost = budgetItems.reduce((acc, item) => acc + item.price, 0);
  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="app-wrapper day-study">

      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartCount}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        toggleBudget={() => setIsBudgetOpen(true)}
      />

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-grid-doodle" />
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="hero-subtext">
            <Flame className="inline-block mr-1 animate-pulse" size={14} />
            Back-to-School 2026 — Shop Smart!
          </span>
          <h1>Equip Your Study Desk 📚</h1>
          <p className="hero-lead">
            From custom notebooks and ergonomic backpacks to noise-cancelling headphones — find everything for school and college life, right here.
          </p>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="hero-stat-num">{products.length}+</span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">₹49</span>
              <span className="hero-stat-label">Min. Shipping</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">4.5★</span>
              <span className="hero-stat-label">Avg. Rating</span>
            </div>
          </div>

          <div className="hero-interactive-row">
            <div className="budget-mini-indicator" onClick={() => setIsBudgetOpen(true)}>
              <span className="dot" />
              <span>
                Budget Plan: <strong>₹{totalBudgetCost.toLocaleString('en-IN')}</strong> / ₹{budgetLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <button className="primary-action-btn" onClick={() => setSelectedCategory("Electronics")}>
              <Zap size={16} />
              Shop Electronics
            </button>
          </div>
        </div>
      </section>

      {/* Featured / Flash Deals Strip */}
      <section className="featured-strip">
        <div className="featured-strip-header">
          <div className="featured-strip-title">
            <TrendingUp size={18} className="featured-title-icon" />
            <span>Top Picks</span>
          </div>
          <button
            className="view-all-btn"
            onClick={() => setSelectedCategory("All")}
          >
            View all →
          </button>
        </div>
        <div className="featured-scroll">
          {featuredProducts.map(product => (
            <div
              key={product.id}
              className="featured-mini-card"
              onClick={() => setSelectedProduct(product)}
            >
              <img src={product.image} alt={product.name} className="featured-mini-img" loading="lazy" />
              <div className="featured-mini-info">
                <p className="featured-mini-name">{product.name}</p>
                <div className="featured-mini-bottom">
                  <span className="featured-mini-price">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="featured-mini-rating"><Star size={11} fill="#f59e0b" color="#f59e0b" /> {product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Store Content */}
      <main className="store-main-container">

        {/* Toolbar */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <h2>
              {selectedCategory === "All" ? "All Supplies" : `${selectedCategory} Supplies`}
              <span className="results-count">({filteredProducts.length} items)</span>
            </h2>
          </div>
          <div className="toolbar-right">
            <label htmlFor="sort-select" className="mr-2 text-sm">Sort:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="toolbar-select"
            >
              <option value="default">Popularity</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-results-panel">
            <div className="no-results-emoji">🔍</div>
            <h3>No Supplies Match "{searchTerm}"</h3>
            <p>Try a different keyword, category, or clear the search.</p>
            <button className="reset-search-btn" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
              Show All Products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedProduct}
                onAddToCart={(p) => handleAddToCart(p, 1, {})}
                onAddToBudget={handleAddToBudget}
                isInBudget={budgetItems.some(item => item.id === product.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="student-footer">
        <div className="footer-notebook-decor" />
        <div className="footer-content">
          <div className="logo-footer">
            <GraduationCap className="mr-2" size={20} />
            <span>CAMPUSGRID STORE</span>
          </div>
          <div className="footer-links">
            <span>About Us</span>
            <span>•</span>
            <span>Returns & Refunds</span>
            <span>•</span>
            <span>Student Offers</span>
            <span>•</span>
            <span>Contact</span>
          </div>
          <p>© 2026 CampusGrid Supplies — Made in India 🇮🇳 for Students</p>
          <div className="student-tips-scroller">
            <span className="badge">STUDY TIP</span>
            <span className="tip-text">Study in 25-min Pomodoro sessions with 5-min breaks for maximum focus!</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        clearCart={() => setCartItems([])}
        budgetLimit={budgetLimit}
        budgetTotal={totalBudgetCost}
      />

      <BudgetPlanner
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        budgetItems={budgetItems}
        onRemoveFromBudget={(id) => setBudgetItems(prev => prev.filter(it => it.id !== id))}
        budgetLimit={budgetLimit}
        setBudgetLimit={setBudgetLimit}
        onMoveAllToCart={handleMoveAllBudgetToCart}
      />

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
