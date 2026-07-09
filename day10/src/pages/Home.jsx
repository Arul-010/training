import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import JerseyMockup from '../components/JerseyMockup';
import { products } from '../data/products';
import { Trophy, Flame, Zap, Star } from 'lucide-react';

const FEATURED_IDS = [9, 15, 18, 27, 29, 55];

export default function Home() {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    budgetItems,
    budgetLimit,
    addToCart,
    addToBudget,
    totalBudgetCost
  } = useContext(ShopContext);

  // Product Filtering & Sorting logic
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

  return (
    <div className="home-page-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-grid-doodle" />
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="hero-subtext">
            <Flame className="inline-block mr-1 animate-pulse" size={14} />
            India's No.1 Sports Jersey Store — Season 2025!
          </span>
          <h1>Your Game. Your Kit. 🏆</h1>
          <p className="hero-lead">
            Official replica jerseys for Football, Cricket, Basketball & more. Customize with your name and number on the back!
          </p>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="hero-stat-num">{products.length}+</span>
              <span className="hero-stat-label">Jerseys & Gear</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">Free</span>
              <span className="hero-stat-label">Custom Printing</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">4.8★</span>
              <span className="hero-stat-label">Avg. Rating</span>
            </div>
          </div>

          <div className="hero-interactive-row">
            <div className="budget-mini-indicator" onClick={() => navigate('/budget')}>
              <span className="dot" />
              <span>
                Budget Plan: <strong>₹{totalBudgetCost.toLocaleString('en-IN')}</strong> / ₹{budgetLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <button className="primary-action-btn" onClick={() => setSelectedCategory("Football")}>
              <Zap size={16} />
              Shop Football ⚽
            </button>
          </div>
        </div>
      </section>

      {/* Featured / Flash Deals Strip */}
      <section className="featured-strip">
        <div className="featured-strip-header">
          <div className="featured-strip-title">
            <Trophy size={18} className="featured-title-icon" />
            <span>Fan Favourites</span>
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
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {product.customType === 'jersey' && !product.image.startsWith('/jerseys/') ? (
                <JerseyMockup teamName={product.name} height="100px" />
              ) : (
                <img src={product.image} alt={product.name} className="featured-mini-img" loading="lazy" />
              )}
              <div className="featured-mini-info">
                <p className="featured-mini-name">{product.name}</p>
                <div className="featured-mini-bottom">
                  <span className="featured-mini-price">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="featured-mini-rating">
                    <Star size={11} fill="#f59e0b" color="#f59e0b" /> {product.rating}
                  </span>
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
              {selectedCategory === "All" ? "All Sports Products" : `${selectedCategory} Products`}
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
            <div className="no-results-emoji">⚽</div>
            <h3>No Products Match "{searchTerm}"</h3>
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
                onQuickView={() => navigate(`/product/${product.id}`)}
                onAddToCart={(p) => addToCart(p, 1, {})}
                onAddToBudget={addToBudget}
                isInBudget={budgetItems.some(item => item.id === product.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
