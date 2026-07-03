import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import BudgetPlanner from './components/BudgetPlanner';
import StudyVibeQuiz from './components/StudyVibeQuiz';
import { products } from './data/products';
import { GraduationCap, Flame, ArrowRight } from 'lucide-react';
import './App.css';

function App() {
  // Navigation & Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Interaction States
  const [cartItems, setCartItems] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(15000);

  // Modal / Drawer visibility
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#faf9f6';
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
    setIsCartOpen(true);
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
    setIsCartOpen(true);
  };

  const handleAddBundleToCart = (bundleList) => {
    bundleList.forEach(product => handleAddToCart(product, 1, {}));
    setIsCartOpen(true);
  };

  const totalBudgetCost = budgetItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="app-wrapper day-study">

      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        toggleQuiz={() => setIsQuizOpen(true)}
        toggleBudget={() => setIsBudgetOpen(true)}
      />

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-grid-doodle" />
        <div className="hero-content">
          <span className="hero-subtext">
            <Flame className="inline-block text-orange-400 mr-1 animate-pulse" size={16} />
            Back-to-School 2026 — Shop Smart!
          </span>
          <h1>Equip Your Study Desk 📚</h1>
          <p className="hero-lead">
            From custom notebooks and ergonomic backpacks to noise-cancelling headphones — find everything for school and college life, right here.
          </p>

          <div className="hero-interactive-row">
            <button className="primary-action-btn" onClick={() => setIsQuizOpen(true)}>
              <span>Find My Vibe Quiz 🎯</span>
              <ArrowRight size={18} />
            </button>
            <div className="budget-mini-indicator" onClick={() => setIsBudgetOpen(true)}>
              <span className="dot animate-ping" />
              <span>
                Budget Plan: <strong>₹{totalBudgetCost.toLocaleString('en-IN')}</strong> / ₹{budgetLimit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Store Content */}
      <main className="store-main-container">

        {/* Toolbar */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <h2>
              {selectedCategory === "All" ? "All Supplies" : `${selectedCategory} Supplies`}
              <span className="results-count">({filteredProducts.length} items found)</span>
            </h2>
          </div>
          <div className="toolbar-right">
            <label htmlFor="sort-select" className="mr-2 text-sm">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="toolbar-select"
            >
              <option value="default">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-results-panel">
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
            <GraduationCap className="mr-2" />
            <span>CAMPUSGRID STORE</span>
          </div>
          <p>© 2026 CampusGrid Supplies — Made in India 🇮🇳 for Students</p>
          <div className="student-tips-scroller">
            <span className="badge">STUDY LIFE HACK</span>
            <span className="tip-text">Tip: Study in 25-min Pomodoro sessions with 5-min breaks for maximum focus!</span>
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

      <StudyVibeQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        products={products}
        onAddBundleToCart={handleAddBundleToCart}
      />

    </div>
  );
}

export default App;
