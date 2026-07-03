import React from 'react';
import { Star, Eye, ShoppingCart, Plus } from 'lucide-react';

export default function ProductCard({ product, onQuickView, onAddToCart, onAddToBudget, isInBudget }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="product-category-tag">{product.category}</span>
        <button 
          className="quick-view-overlay-btn" 
          onClick={() => onQuickView(product)}
          title="Quick View & Customize"
        >
          <Eye size={18} />
          <span>Quick View</span>
        </button>
      </div>

      <div className="product-card-info">
        <div className="product-rating">
          <Star className="star-icon filled" size={14} />
          <span className="rating-val">{product.rating}</span>
          <span className="rating-count">({product.reviewsCount})</span>
        </div>

        <h3 className="product-title" onClick={() => onQuickView(product)}>
          {product.name}
        </h3>

        <p className="product-desc-short">
          {product.description.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description}
        </p>

        <div className="product-card-tags">
          {product.tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">{tag}</span>
          ))}
        </div>

        <div className="product-card-footer">
          <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
          
          <div className="card-actions">
            <button 
              className={`budget-action-btn ${isInBudget ? 'in-budget' : ''}`}
              onClick={() => onAddToBudget(product)}
              title={isInBudget ? "Remove from Budget Wishlist" : "Add to Budget Wishlist"}
            >
              <Plus size={16} />
              <span>{isInBudget ? 'Wishlisted' : 'Budget'}</span>
            </button>

            <button 
              className="add-to-cart-btn" 
              onClick={() => onAddToCart(product)}
              title="Add Standard to Cart"
            >
              <ShoppingCart size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
