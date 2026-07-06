import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Trash2, Tag, Loader2, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import JerseyMockup from '../components/JerseyMockup';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateCartQty,
    removeFromCartItem,
    clearCart,
    budgetLimit,
    totalBudgetCost
  } = useContext(ShopContext);

  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null); // { code: string, discount: number }
  const [checkoutStep, setCheckoutStep] = useState(null); // 'processing' | 'success' | null
  const [checkoutStatus, setCheckoutStatus] = useState("");

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (activeCoupon?.code === "SPORT15") {
    discountAmount = subtotal * 0.15;
  } else if (activeCoupon?.code === "BUNDLE10") {
    discountAmount = subtotal * 0.10;
  }

  let shippingCost = subtotal > 999 || (activeCoupon?.code === "FREESHIP") ? 0 : 49;
  if (subtotal === 0) shippingCost = 0;

  const total = subtotal - discountAmount + shippingCost;

  // Budget comparison
  const isOverBudget = budgetLimit > 0 && (totalBudgetCost + total) > budgetLimit;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "SPORT15") {
      setActiveCoupon({ code, discount: 0.15, text: "15% Sports Fan Discount Applied" });
      setCouponCode("");
    } else if (code === "FREESHIP") {
      setActiveCoupon({ code, discount: 0, text: "Free Shipping Applied" });
      setCouponCode("");
    } else if (code === "BUNDLE10") {
      setActiveCoupon({ code, discount: 0.10, text: "10% Bundle Discount Applied" });
      setCouponCode("");
    } else {
      alert("Invalid coupon code! Try SPORT15 or FREESHIP");
    }
  };

  const triggerCheckout = () => {
    if (cartItems.length === 0) return;

    setCheckoutStep('processing');
    setCheckoutStatus("Verifying your order details...");

    setTimeout(() => {
      setCheckoutStatus("Generating order invoice...");
      setTimeout(() => {
        setCheckoutStatus("Packing your sports gear for dispatch...");
        setTimeout(() => {
          setCheckoutStatus("Ready for dispatch! 🚚");
          setTimeout(() => {
            setCheckoutStep('success');
            // Trigger Confetti!
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          }, 1000);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const handleCloseSuccess = () => {
    setCheckoutStep(null);
    clearCart();
    navigate('/');
  };

  if (checkoutStep === 'processing') {
    return (
      <div className="checkout-overlay-page" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: '#38bdf8' }} />
        <h3 className="mt-4" style={{ fontSize: '24px', fontWeight: '600' }}>Checkout in Progress</h3>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>{checkoutStatus}</p>
      </div>
    );
  }

  if (checkoutStep === 'success') {
    return (
      <div className="checkout-overlay-page success" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', padding: '20px' }}>
        <div className="success-icon-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
          <Sparkles size={48} />
        </div>
        <h3 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Order Placed! 🎉</h3>
        <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '450px', marginBottom: '30px' }}>
          Your order is confirmed! Kit details and tracking have been sent to your email.
        </p>
        <div className="summary-sticker" style={{ background: '#0d1520', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Paid:</span>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Est. Delivery:</span>
            <strong>2-4 Business Days 🚚</strong>
          </div>
        </div>
        <button 
          className="modal-add-cart-btn" 
          onClick={handleCloseSuccess}
          style={{ width: '100%', maxWidth: '280px', padding: '12px 24px', borderRadius: '8px', fontSize: '16px' }}
        >
          Continue Shopping ⚽
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-container container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0' }}>Your Shopping Cart ({cartItems.length})</h2>
        <Link to="/" className="view-all-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart" style={{ background: '#0d1520', border: '1px solid rgba(255,255,255,0.05)', padding: '60px 20px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎒</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Your cart is empty.</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Add jerseys, boots, and sports gear to get started!</p>
          <Link to="/" className="primary-action-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <ShoppingBag size={16} />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {/* Left: Cart Items List */}
          <div className="cart-items-list" style={{ background: '#0d1520', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} className="cart-item" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                {item.product.customType === 'jersey' && !item.product.image.startsWith('/jerseys/') ? (
                  <div className="cart-item-img-mockup" style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <JerseyMockup 
                      teamName={item.product.name} 
                      customName={item.customs.jerseyName} 
                      customNumber={item.customs.jerseyNumber} 
                      height="100%" 
                    />
                  </div>
                ) : (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="cart-item-img" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                )}
                
                <div className="cart-item-info" style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
                  <h4 className="cart-item-title" style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px 0', color: '#f1f5f9' }}>{item.product.name}</h4>
                  
                  {/* Customizations display */}
                  {item.customs && Object.keys(item.customs).length > 0 && (
                    <div className="cart-item-customs" style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {item.customs.jerseyName && <span>Print: <strong>{item.customs.jerseyName}</strong> | Number: <strong>#{item.customs.jerseyNumber || '00'}</strong></span>}
                      {item.customs.cover && <span>Cover Theme: <strong>{item.customs.cover}</strong></span>}
                      {item.customs.badges && <span>Badges: <strong>{item.customs.badges.join(', ')}</strong></span>}
                      {item.customs.engraving && <span>Engraving: <strong>"{item.customs.engraving}"</strong></span>}
                      {item.customs.color && <span>Color: <strong>{item.customs.color}</strong> ({item.customs.size})</span>}
                      {item.customs.size && !item.customs.color && !item.customs.jerseyName && <span>Size: <strong>{item.customs.size}</strong></span>}
                      {item.customs.baseColor && <span>Base Finish: <strong>{item.customs.baseColor}</strong></span>}
                    </div>
                  )}

                  <div className="cart-item-price" style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8', marginBottom: '12px' }}>
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  
                  <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="cart-qty-selector" style={{ margin: '0' }}>
                      <button 
                        onClick={() => updateCartQty(idx, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQty(idx, item.quantity + 1)}>+</button>
                    </div>

                    <button 
                      className="remove-item-btn" 
                      onClick={() => removeFromCartItem(idx)}
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Checkout & Price Summary */}
          <div className="cart-footer" style={{ background: '#0d1520', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
            {/* Budget Warning */}
            {isOverBudget && (
              <div className="budget-alert-card animate-pulse" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                <span>⚠️ Warning: Adding this cart to your plan will exceed your set budget limit of ₹{budgetLimit.toLocaleString('en-IN')}!</span>
              </div>
            )}

            {/* Coupons */}
            <div className="coupon-container" style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="PROMO CODE (SPORT15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
                style={{ flexGrow: '1' }}
                disabled={activeCoupon !== null}
              />
              <button 
                onClick={handleApplyCoupon}
                className="coupon-apply-btn"
                disabled={activeCoupon !== null || !couponCode}
              >
                Apply
              </button>
            </div>

            {activeCoupon && (
              <div className="active-coupon-badge" style={{ display: 'flex', alignItems: 'center', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '8px 12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                <Tag size={12} className="mr-1" />
                <span>{activeCoupon.text}</span>
                <button onClick={() => setActiveCoupon(null)} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontWeight: 'bold', marginLeft: 'auto' }}>×</button>
              </div>
            )}

            {/* Price breakdown */}
            <div className="price-summary" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="price-row discount text-green-600" style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
              </div>

              <hr className="price-divider" style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />

              <div className="price-row total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800' }}>
                <span>Total Due</span>
                <span style={{ color: '#38bdf8' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={triggerCheckout} style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700' }}>
              Checkout Gear 🏆
            </button>
            
            <p className="footer-notice" style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '16px', marginBottom: '0' }}>
              Secured checkout. Fast delivery across India. 🇮🇳
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
