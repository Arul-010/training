import React, { useState } from 'react';
import { X, Trash2, Tag, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  clearCart,
  budgetLimit,
  budgetTotal
}) {
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null); // { code: string, discount: number }
  const [checkoutStep, setCheckoutStep] = useState(null); // 'processing' | 'success' | null
  const [checkoutStatus, setCheckoutStatus] = useState("");

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (activeCoupon?.code === "STUDENT15") {
    discountAmount = subtotal * 0.15;
  } else if (activeCoupon?.code === "BUNDLE10") {
    discountAmount = subtotal * 0.10;
  }

  let shippingCost = subtotal > 999 || (activeCoupon?.code === "FREESHIP") ? 0 : 49;
  if (subtotal === 0) shippingCost = 0;

  const total = subtotal - discountAmount + shippingCost;

  // Budget comparison
  const isOverBudget = budgetLimit > 0 && (budgetTotal + total) > budgetLimit;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "STUDENT15") {
      setActiveCoupon({ code, discount: 0.15, text: "15% Student Discount Applied" });
      setCouponCode("");
    } else if (code === "FREESHIP") {
      setActiveCoupon({ code, discount: 0, text: "Free Shipping Applied" });
      setCouponCode("");
    } else if (code === "BUNDLE10") {
      setActiveCoupon({ code, discount: 0.10, text: "10% Bundle Discount Applied" });
      setCouponCode("");
    } else {
      alert("Invalid coupon code! Try STUDENT15 or FREESHIP");
    }
  };

  const triggerCheckout = () => {
    if (cartItems.length === 0) return;

    setCheckoutStep('processing');
    setCheckoutStatus("Verifying student credentials...");

    setTimeout(() => {
      setCheckoutStatus("Generating digital student invoice...");
      setTimeout(() => {
        setCheckoutStatus("Packing study supplies in reusable carton...");
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
    onClose();
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-header">
          <h3>Study Cart ({cartItems.length})</h3>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {checkoutStep === 'processing' && (
          <div className="checkout-overlay">
            <Loader2 className="animate-spin text-accent" size={48} />
            <h3 className="mt-4 font-semibold text-lg text-text-h">Checkout in Progress</h3>
            <p className="text-sm mt-2 text-center max-w-xs">{checkoutStatus}</p>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="checkout-overlay success">
            <div className="success-icon-badge">
              <Sparkles size={32} />
            </div>
            <h3 className="mt-4 font-bold text-2xl text-text-h">Order Placed! 🎉</h3>
            <p className="text-sm mt-2 text-center text-text">
              Your academic supplies are locked in! A confirmation study pack details has been sent to your student email.
            </p>
            <div className="summary-sticker">
              <div>Total Paid: <strong>₹{total.toLocaleString('en-IN')}</strong></div>
              <div>Est. Delivery: <strong>Next Study Day (2-3 days)</strong></div>
            </div>
            <button className="success-btn" onClick={handleCloseSuccess}>
              Continue Studying
            </button>
          </div>
        )}

        {/* Item List */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon-outline">📚</div>
              <p>Your cart is empty.</p>
              <small>Add custom notebooks, study guides, and campus apparel to get started!</small>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="cart-item-img" 
                />
                
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.product.name}</h4>
                  
                  {/* Customizations display */}
                  {item.customs && Object.keys(item.customs).length > 0 && (
                    <div className="cart-item-customs">
                      {item.customs.cover && <span>Cover: {item.customs.cover}</span>}
                      {item.customs.badges && <span>Badges: {item.customs.badges.join(', ')}</span>}
                      {item.customs.engraving && <span>Engraving: "{item.customs.engraving}"</span>}
                      {item.customs.color && <span>Color: {item.customs.color} ({item.customs.size})</span>}
                      {item.customs.baseColor && <span>Base: {item.customs.baseColor}</span>}
                    </div>
                  )}

                  <div className="cart-item-price">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                  
                  <div className="cart-item-controls">
                    <div className="cart-qty-selector">
                      <button 
                        onClick={() => onUpdateQty(idx, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQty(idx, item.quantity + 1)}>+</button>
                    </div>

                    <button 
                      className="remove-item-btn" 
                      onClick={() => onRemoveItem(idx)}
                      title="Remove product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Pricing Details */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Budget Warning */}
            {isOverBudget && (
              <div className="budget-alert-card animate-pulse">
                <span>⚠️ Adding this cart to your semester wishlist exceeds your current budget allocation!</span>
              </div>
            )}

            {/* Coupons */}
            <div className="coupon-container">
              <input
                type="text"
                placeholder="PROMO CODE (STUDENT15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
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
              <div className="active-coupon-badge">
                <Tag size={12} className="mr-1" />
                <span>{activeCoupon.text}</span>
                <button onClick={() => setActiveCoupon(null)} className="ml-auto font-bold">×</button>
              </div>
            )}

            {/* Price breakdown */}
            <div className="price-summary">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="price-row discount text-green-600">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="price-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
              </div>

              <hr className="price-divider" />

              <div className="price-row total">
                <span>Total Due</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={triggerCheckout}>
              Checkout Supplies
            </button>
            
            <p className="footer-notice">Secured checkout for all university campuses.</p>
          </div>
        )}

      </div>
    </div>
  );
}
