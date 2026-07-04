import React, { useState, useEffect } from 'react';
import { X, Star, Check, Award } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  
  // Customization States
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [engravingText, setEngravingText] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedBase, setSelectedBase] = useState(null);

  // Initialize defaults
  useEffect(() => {
    if (product) {
      setQuantity(1);
      if (product.options?.covers) {
        setSelectedCover(product.options.covers[0]);
      }
      if (product.options?.colors) {
        setSelectedColor(product.options.colors[0]);
      }
      if (product.options?.bases) {
        setSelectedBase(product.options.bases[0]);
      }
      setSelectedBadges([]);
      setEngravingText("");
      setSelectedSize("M");
    }
  }, [product]);

  if (!product) return null;

  const handleBadgeToggle = (badge) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badge));
    } else {
      if (selectedBadges.length < 3) {
        setSelectedBadges([...selectedBadges, badge]);
      } else {
        alert("You can add up to 3 badges to your backpack!");
      }
    }
  };

  const handleAddToCart = () => {
    let customDetails = {};

    if (product.customType === 'cover' && selectedCover) {
      customDetails = { cover: selectedCover.name };
    } else if (product.customType === 'badges') {
      customDetails = { badges: selectedBadges };
    } else if (product.customType === 'engraving' && engravingText.trim()) {
      customDetails = { engraving: engravingText.trim() };
    } else if (product.customType === 'color-size') {
      customDetails = { 
        color: selectedColor?.name,
        size: selectedSize
      };
    } else if (product.customType === 'base-color') {
      customDetails = { baseColor: selectedBase?.name };
    }

    onAddToCart(product, quantity, customDetails);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container animate-scale-in">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-content-grid">
          {/* Left Column: Visual Mockup / Image */}
          <div className="modal-visual-column">
            {product.customType === 'badges' ? (
              <>
                <img src={product.image} alt={product.name} className="modal-product-img" />
                <div className="backpack-customizer-canvas">
                  <div className="backpack-svg-mockup">
                    {/* Styled Backpack container */}
                    <div className="backpack-body">
                      <div className="backpack-pocket">
                        <span className="backpack-brand">APEX</span>
                        {/* Render badges inside the pocket area */}
                        <div className="backpack-badge-slots">
                          {selectedBadges.map((badge, idx) => (
                            <div key={idx} className="pin-badge animate-bounce-slow">
                              <Award size={14} className="mr-0.5" />
                              <span>{badge}</span>
                            </div>
                          ))}
                          {selectedBadges.length === 0 && (
                            <div className="no-badges-placeholder">
                              Pin up to 3 badges below!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : product.customType === 'cover' ? (
              <>
                <img src={product.image} alt={product.name} className="modal-product-img" />
                <div className="cover-customizer-canvas">
                  <div 
                    className="notebook-mockup"
                    style={{ backgroundColor: selectedCover?.color || '#4f46e5' }}
                  >
                    <div className="notebook-spine" />
                    <div className="notebook-label">
                      <span className="label-title">JOURNAL</span>
                      <span className="label-sub">{selectedCover?.name || 'Smart Edition'}</span>
                    </div>
                    <div className="notebook-grid-lines" />
                  </div>
                </div>
              </>
            ) : product.customType === 'engraving' ? (
              <div className="engraving-customizer-canvas">
                <img src={product.image} alt={product.name} className="modal-product-img" />
                {engravingText.trim() && (
                  <div className="engraving-preview-overlay">
                    <span className="engraving-text-glow">{engravingText}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="standard-image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="modal-product-img" 
                  style={{
                    border: product.customType === 'color-size' && selectedColor 
                      ? `6px solid ${selectedColor.code}` 
                      : 'none'
                  }}
                />
              </div>
            )}

            <div className="specs-box">
              <h4>Product Specifications</h4>
              <ul>
                {product.specs.map((spec, i) => (
                  <li key={i}>
                    <Check size={14} className="text-green-500 mr-2 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Information & Controls */}
          <div className="modal-info-column">
            <span className="modal-category">{product.category}</span>
            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-rating-row">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : ''}`} 
                    size={16} 
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating} / 5.0</span>
              <span className="rating-count">({product.reviewsCount} customer reviews)</span>
            </div>

            <div className="modal-price-tag">₹{product.price.toLocaleString('en-IN')}</div>
            
            <p className="modal-description">{product.description}</p>

            {/* Customization Options Render */}
            <div className="customization-panel">
              {product.customType === 'cover' && (
                <div className="custom-group">
                  <label className="custom-label">Select Cover Theme</label>
                  <div className="cover-theme-grid">
                    {product.options.covers.map((cov) => (
                      <button
                        key={cov.id}
                        onClick={() => setSelectedCover(cov)}
                        className={`cover-option-btn ${selectedCover?.id === cov.id ? 'active' : ''}`}
                        style={{ borderLeft: `8px solid ${cov.color}` }}
                      >
                        {cov.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customType === 'badges' && (
                <div className="custom-group">
                  <label className="custom-label">Choose Badges (Max 3)</label>
                  <div className="badges-selection-grid">
                    {product.options.badges.map((badge) => {
                      const isSelected = selectedBadges.includes(badge);
                      return (
                        <button
                          key={badge}
                          onClick={() => handleBadgeToggle(badge)}
                          className={`badge-toggle-btn ${isSelected ? 'active' : ''}`}
                        >
                          <Check size={12} className={`check-icon ${isSelected ? 'visible' : ''}`} />
                          <span>{badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.customType === 'engraving' && (
                <div className="custom-group">
                  <label className="custom-label">Add Personalized Engraving</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Enter engraving text (e.g. Name)"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value)}
                    className="engraving-input"
                  />
                  <small className="help-text">Live preview shown on product card visual left!</small>
                </div>
              )}

              {product.customType === 'color-size' && (
                <div className="custom-group flex-col">
                  <div>
                    <label className="custom-label">Select Color</label>
                    <div className="color-swatch-row">
                      {product.options.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color)}
                          className={`color-swatch-btn ${selectedColor?.id === color.id ? 'active' : ''}`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="custom-label">Select Size</label>
                    <div className="size-selector-row">
                      {product.options.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {product.customType === 'base-color' && (
                <div className="custom-group">
                  <label className="custom-label">Select Base Finish</label>
                  <div className="base-color-swatch-row">
                    {product.options.bases.map((base) => (
                      <button
                        key={base.id}
                        onClick={() => setSelectedBase(base)}
                        className={`base-finish-btn ${selectedBase?.id === base.id ? 'active' : ''}`}
                      >
                        <span className="base-color-dot" style={{ backgroundColor: base.code }} />
                        <span>{base.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="modal-purchase-section">
              <div className="qty-selector-container">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button className="modal-add-cart-btn" onClick={handleAddToCart}>
                Add {quantity} to Cart — ₹{(product.price * quantity).toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
