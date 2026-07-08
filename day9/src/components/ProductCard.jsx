import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Eye, ShoppingCart, Plus, Heart, Zap } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import JerseyMockup from './JerseyMockup';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, addToBudget, budgetItems } = useContext(ShopContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const isInBudget = budgetItems.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, {});
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 600);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const isMockupJersey = product.customType === 'jersey' && !product.image.startsWith('/jerseys/');

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
      <div className="product-image-container" style={{ padding: isMockupJersey ? '0' : 'inherit' }}>
        {isMockupJersey ? (
          <JerseyMockup teamName={product.name} height="100%" />
        ) : (
          <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        )}
        
        {/* Top overlays */}
        <div className="card-image-overlays">
          <span className="product-category-tag">{product.category}</span>
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            title="Add to Wishlist"
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Quick View overlay */}
        <button
          className="quick-view-overlay-btn"
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          title="Quick View & Customize"
        >
          <Eye size={16} />
          <span>View Details</span>
        </button>
      </div>

      <div className="product-card-info">
        {/* Rating row */}
        <div className="product-rating">
          {[1,2,3,4,5].map(s => (
            <Star
              key={s}
              size={12}
              className={s <= Math.round(product.rating) ? 'star-icon filled' : 'star-icon'}
              fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
            />
          ))}
          <span className="rating-val">{product.rating}</span>
          <span className="rating-count">({product.reviewsCount.toLocaleString()})</span>
        </div>

        <h3 className="product-title">{product.name}</h3>

        <p className="product-desc-short">
          {product.description.length > 75
            ? `${product.description.substring(0, 75)}…`
            : product.description}
        </p>

        <div className="product-card-tags">
          {product.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag-pill">{tag}</span>
          ))}
        </div>

        <div className="product-card-footer">
          <div className="product-price">
            <span className="price-symbol">₹</span>
            {product.price.toLocaleString('en-IN')}
          </div>

          <div className="card-actions">
            <button
              className={`budget-action-btn ${isInBudget ? 'in-budget' : ''}`}
              onClick={(e) => { e.stopPropagation(); addToBudget(product); }}
              title={isInBudget ? "Remove from Budget Wishlist" : "Add to Budget Wishlist"}
            >
              <Plus size={14} />
              <span>{isInBudget ? 'Saved' : 'Plan'}</span>
            </button>

            <button
              className={`add-to-cart-btn ${addedAnim ? 'added' : ''}`}
              onClick={handleAddToCart}
              title="Add to Cart"
            >
              <ShoppingCart size={14} />
              <span>{addedAnim ? '✓' : 'Add'}</span>
            </button>

            <button
              className="buy-now-card-btn"
              onClick={(e) => { e.stopPropagation(); navigate(`/buynow/${product.id}`); }}
              title="Buy Now — instant checkout"
            >
              <Zap size={14} />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
