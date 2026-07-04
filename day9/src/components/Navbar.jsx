import React from 'react';
import { Search, ShoppingCart, GraduationCap, Wallet, Sparkles } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  toggleCart,
  toggleBudget
}) {
  const categories = ["All", "Stationery", "Electronics", "Apparel", "Study Prep"];
  const categoryEmojis = { All: "🏪", Stationery: "✏️", Electronics: "💻", Apparel: "👕", "Study Prep": "📖" };

  return (
    <header className="student-navbar">
      <div className="navbar-top">
        <div className="navbar-logo" onClick={() => setSelectedCategory("All")} title="Back to all products">
          <GraduationCap className="logo-icon" size={26} />
          <span>CAMPUS<span>GRID</span></span>
        </div>

        <div className="search-bar-container">
          <Search className="search-icon" size={17} />
          <input
            type="text"
            placeholder="Search supplies, gadgets, apparel…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="navbar-actions">
          <button
            className="navbar-btn budget-nav-btn"
            onClick={toggleBudget}
            title="Manage Semester Budget"
          >
            <Wallet size={16} />
            <span className="btn-text">Budgeter</span>
          </button>

          <button onClick={toggleCart} className="cart-btn" title="Open Cart">
            <ShoppingCart size={19} />
            {cartCount > 0 && <span className="cart-badge animate-scale-in">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="navbar-categories">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
          >
            <span className="cat-emoji">{categoryEmojis[category]}</span>
            {category}
          </button>
        ))}
      </div>
    </header>
  );
}
