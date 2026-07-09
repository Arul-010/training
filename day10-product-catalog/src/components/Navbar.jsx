import React, { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, ShoppingCart, Wallet, Zap } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    cartCount
  } = useContext(ShopContext);

  const categories = ["All", "Football", "Cricket", "Basketball", "Athletics", "Accessories"];
  const categoryEmojis = {
    All: "🏆",
    Football: "⚽",
    Cricket: "🏏",
    Basketball: "🏀",
    Athletics: "🏃",
    Accessories: "🎒"
  };

  const handleLogoClick = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <header className="student-navbar">
      <div className="navbar-top">
        <div className="navbar-logo" onClick={handleLogoClick} title="Back to all products" style={{ cursor: 'pointer' }}>
          <Zap className="logo-icon" size={24} />
          <span>SPORT<span>ZONE</span></span>
        </div>

        <div className="search-bar-container">
          <Search className="search-icon" size={17} />
          <input
            type="text"
            placeholder="Search jerseys, boots, cricket gear…"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={handleClearSearch}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="navbar-actions">
          <button
            className={`navbar-btn budget-nav-btn ${location.pathname === '/budget' ? 'active' : ''}`}
            onClick={() => navigate('/budget')}
            title="Manage Sports Budget"
          >
            <Wallet size={16} />
            <span className="btn-text">Budget</span>
          </button>

          <button 
            onClick={() => navigate('/cart')} 
            className={`cart-btn ${location.pathname === '/cart' ? 'active' : ''}`} 
            title="Open Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && <span className="cart-badge animate-scale-in">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="navbar-categories">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
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
