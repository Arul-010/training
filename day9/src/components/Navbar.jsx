import React from 'react';
import { Search, Moon, Sun, ShoppingCart, GraduationCap, Compass, Wallet } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  toggleCart,
  toggleQuiz,
  toggleBudget,
  isDarkMode,
  toggleTheme
}) {
  const categories = ["All", "Stationery", "Electronics", "Apparel", "Study Prep"];

  return (
    <header className="student-navbar">
      <div className="navbar-top">
        <div className="navbar-logo" onClick={() => setSelectedCategory("All")}>
          <GraduationCap className="logo-icon animate-pulse" />
          <span>CAMPUS<span>GRID</span></span>
        </div>

        <div className="search-bar-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search school & college supplies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="navbar-actions">
          <button 
            className="navbar-btn pulse-secondary" 
            onClick={toggleQuiz}
            title="Take Study Vibe Quiz"
          >
            <Compass size={18} />
            <span className="btn-text">Find Vibe</span>
          </button>

          <button 
            className="navbar-btn pulse-secondary" 
            onClick={toggleBudget}
            title="Manage Semester Budget"
          >
            <Wallet size={18} />
            <span className="btn-text">Budgeter</span>
          </button>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={isDarkMode ? "Switch to Day Study" : "Switch to Late Night Library"}
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-900" />}
          </button>

          <button onClick={toggleCart} className="cart-btn" title="Open Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
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
            {category}
          </button>
        ))}
      </div>
    </header>
  );
}
