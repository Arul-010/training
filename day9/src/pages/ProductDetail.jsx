import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import { Star, Check, Award, ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import JerseyMockup from '../components/JerseyMockup';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToBudget, budgetItems } = useContext(ShopContext);

  const product = products.find(p => p.id === parseInt(id));

  // Quantity State
  const [quantity, setQuantity] = useState(1);

  // Customization States
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [engravingText, setEngravingText] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedBase, setSelectedBase] = useState(null);
  
  // Jersey-specific customization
  const [jerseySize, setJerseySize] = useState("M");
  const [jerseyName, setJerseyName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");

  // Check if product is in budget
  const isInBudget = product ? budgetItems.some(item => item.id === product.id) : false;

  // Initialize defaults when product changes
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
      setJerseySize("M");
      setJerseyName("");
      setJerseyNumber("");
    }
  }, [product]);

  if (!product) {
    return (
      <div className="no-results-panel" style={{ margin: '80px auto', maxWidth: '600px' }}>
        <div className="no-results-emoji">⚠️</div>
        <h3>Product Not Found</h3>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="reset-search-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleBadgeToggle = (badge) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badge));
    } else {
      if (selectedBadges.length < 3) {
        setSelectedBadges([...selectedBadges, badge]);
      } else {
        alert("You can add up to 3 badges!");
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
    } else if (product.customType === 'jersey') {
      customDetails = {
        size: jerseySize,
        ...(jerseyName.trim() ? { jerseyName: jerseyName.trim().toUpperCase() } : {}),
        ...(jerseyNumber ? { jerseyNumber } : {})
      };
    }

    addToCart(product, quantity, customDetails);
  };

  return (
    <div className="product-detail-page container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', color: '#f8fafc' }}>
      {/* Back navigation */}
      <button onClick={() => navigate(-1)} className="view-all-btn" style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
        <ArrowLeft size={16} />
        <span>Go Back</span>
      </button>

      <div className="modal-content-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', background: '#0d1520', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Left Column: Visual Mockup / Image */}
        <div className="modal-visual-column">
          {product.customType === 'badges' ? (
            <>
              <img src={product.image} alt={product.name} className="modal-product-img" style={{ maxHeight: '350px', objectFit: 'contain', width: '100%' }} />
              <div className="backpack-customizer-canvas">
                <div className="backpack-svg-mockup">
                  <div className="backpack-body">
                    <div className="backpack-pocket">
                      <span className="backpack-brand">APEX</span>
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
              <img src={product.image} alt={product.name} className="modal-product-img" style={{ maxHeight: '350px', objectFit: 'contain', width: '100%' }} />
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
              <img src={product.image} alt={product.name} className="modal-product-img" style={{ maxHeight: '350px', objectFit: 'contain', width: '100%' }} />
              {engravingText.trim() && (
                <div className="engraving-preview-overlay">
                  <span className="engraving-text-glow">{engravingText}</span>
                </div>
              )}
            </div>
          ) : product.customType === 'jersey' ? (
            <div className="jersey-customizer-canvas" style={{ width: '100%', padding: '0' }}>
              <JerseyMockup teamName={product.name} customName={jerseyName} customNumber={jerseyNumber} height="360px" />
            </div>
          ) : (
            <div className="standard-image-container">
              <img 
                src={product.image} 
                alt={product.name} 
                className="modal-product-img" 
                style={{
                  maxHeight: '350px',
                  objectFit: 'contain',
                  width: '100%',
                  borderRadius: '12px',
                  border: product.customType === 'color-size' && selectedColor 
                    ? `6px solid ${selectedColor.code}` 
                    : 'none'
                }}
              />
            </div>
          )}

          <div className="specs-box" style={{ marginTop: '24px' }}>
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
          <span className="modal-category" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            {product.category}
          </span>
          <h2 className="modal-title" style={{ fontSize: '28px', marginTop: '12px', marginBottom: '8px' }}>{product.name}</h2>

          <div className="modal-rating-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div className="stars-row" style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : ''}`} 
                  size={16} 
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="rating-value" style={{ fontWeight: '600' }}>{product.rating} / 5.0</span>
            <span className="rating-count" style={{ color: '#64748b' }}>({product.reviewsCount} customer reviews)</span>
          </div>

          <div className="modal-price-tag" style={{ fontSize: '32px', fontWeight: '800', color: '#38bdf8', marginBottom: '20px' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          
          <p className="modal-description" style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>{product.description}</p>

          {/* Customization Options */}
          <div className="customization-panel" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginBottom: '30px' }}>
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
                <small className="help-text">Live preview shown on the product image overlay.</small>
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

            {product.customType === 'jersey' && (
              <div className="custom-group flex-col">
                <div>
                  <label className="custom-label">Select Size</label>
                  <div className="size-selector-row">
                    {product.options.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setJerseySize(size)}
                        className={`size-btn ${jerseySize === size ? 'active' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="custom-label">Player Name on Back <span className="optional-label">(optional)</span></label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. RONALDO, DHONI"
                    value={jerseyName}
                    onChange={(e) => setJerseyName(e.target.value)}
                    className="engraving-input"
                  />
                </div>

                <div className="mt-4">
                  <label className="custom-label">Number on Back <span className="optional-label">(optional, 1-99)</span></label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    placeholder="e.g. 7, 10, 45"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    className="engraving-input"
                    style={{ width: '120px' }}
                  />
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
          <div className="modal-purchase-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="qty-selector-container" style={{ margin: '0' }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                className={`budget-action-btn ${isInBudget ? 'in-budget' : ''}`}
                onClick={() => addToBudget(product)}
                style={{ padding: '12px 20px', height: 'auto', display: 'flex', alignItems: 'center', gap: '8px', flexGrow: '1', justifyContent: 'center' }}
              >
                <Plus size={16} />
                <span>{isInBudget ? 'Remove Budget Plan' : 'Add to Budget Plan'}</span>
              </button>
            </div>

            <button 
              className="modal-add-cart-btn" 
              onClick={handleAddToCart}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '16px' }}
            >
              <ShoppingCart size={18} />
              <span>Add {quantity} to Cart — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
