import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Trash2, Tag, Loader2, Sparkles, ArrowLeft, ShoppingBag, CreditCard, Building, MapPin, User, Hash, FileText } from 'lucide-react';
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
  const [checkoutStep, setCheckoutStep] = useState(null); // null | 'account' | 'bank' | 'location' | 'summary' | 'processing' | 'success'
  const [checkoutStatus, setCheckoutStatus] = useState("");

  // Checkout Wizard Details
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [formErrors, setFormErrors] = useState({});

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
    setCheckoutStep('account');
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 'account') {
      if (!accountName.trim()) {
        errors.accountName = "Account Holder Name is required";
      }
      if (!accountNumber.trim()) {
        errors.accountNumber = "Account Number is required";
      } else if (!/^\d{9,18}$/.test(accountNumber.trim())) {
        errors.accountNumber = "Account Number must be between 9 and 18 digits";
      }
    } else if (step === 'bank') {
      if (!bankName.trim()) {
        errors.bankName = "Bank Name is required";
      }
      if (!ifscCode.trim()) {
        errors.ifscCode = "IFSC Code is required";
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase())) {
        errors.ifscCode = "Invalid IFSC Code format (e.g. SBIN0001234)";
      }
    } else if (step === 'location') {
      if (!address.trim()) {
        errors.address = "Delivery Address is required";
      }
      if (!city.trim()) {
        errors.city = "City is required";
      }
      if (!stateName.trim()) {
        errors.stateName = "State is required";
      }
      if (!pincode.trim()) {
        errors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(pincode.trim())) {
        errors.pincode = "Pincode must be exactly 6 digits";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (currentStep, nextStep) => {
    if (validateStep(currentStep)) {
      setCheckoutStep(nextStep);
    }
  };

  const handleFinalSubmit = () => {
    setCheckoutStep('processing');
    setCheckoutStatus("Verifying your payment credentials...");

    setTimeout(() => {
      setCheckoutStatus("Validating account details with bank...");
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
    }, 1000);
  };

  const renderProgressTracker = (currentStep) => {
    const steps = [
      { id: 'account', label: '1. Account' },
      { id: 'bank', label: '2. Bank' },
      { id: 'location', label: '3. Delivery' },
      { id: 'summary', label: '4. Confirm' }
    ];

    const currentIdx = steps.findIndex(s => s.id === currentStep);

    return (
      <div className="checkout-stepper-container" style={{ width: '100%', maxWidth: '600px', margin: '0 auto 30px auto', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '4px',
            background: 'rgba(15, 23, 42, 0.08)',
            zIndex: 1,
            borderRadius: '2px'
          }} />
          
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            width: `${(currentIdx / (steps.length - 1)) * 90}%`,
            height: '4px',
            background: 'linear-gradient(90deg, var(--accent), #3b82f6)',
            zIndex: 2,
            transition: 'width 0.4s ease',
            borderRadius: '2px'
          }} />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;
            return (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--accent)' : isActive ? '#fff' : '#f1f5f9',
                  border: isCompleted ? 'none' : isActive ? '2px solid var(--accent)' : '2px solid rgba(15, 23, 42, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted ? '#fff' : isActive ? 'var(--accent)' : '#94a3b8',
                  fontWeight: '700',
                  boxShadow: isActive ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--accent)' : isCompleted ? 'var(--text-main)' : '#94a3b8',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleCloseSuccess = () => {
    setCheckoutStep(null);
    clearCart();
    navigate('/');
  };

  if (checkoutStep === 'processing') {
    return (
      <div className="checkout-overlay-page" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: '#38bdf8' }} />
        <h3 className="mt-4" style={{ fontSize: '24px', fontWeight: '600' }}>Checkout in Progress</h3>
        <p style={{ color: '#64748b', marginTop: '10px' }}>{checkoutStatus}</p>
      </div>
    );
  }

  if (checkoutStep === 'account') {
    return (
      <div className="checkout-wizard-page container" style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-title)' }}>Secure Checkout</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '15px' }}>
          Please complete the payment verification steps below to place your order.
        </p>
        
        {renderProgressTracker('account')}

        <div className="checkout-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <CreditCard size={24} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: 'var(--text-title)' }}>1. Account Details</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>Account Holder Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Enter name as in bank records"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '8px',
                    border: formErrors.accountName ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              {formErrors.accountName && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.accountName}</span>}
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>Account Number</label>
              <div style={{ position: 'relative' }}>
                <Hash size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Enter 9 to 18-digit bank account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '8px',
                    border: formErrors.accountNumber ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              {formErrors.accountNumber && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.accountNumber}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <button 
              className="view-all-btn"
              onClick={() => setCheckoutStep(null)}
              style={{
                background: '#f1f5f9',
                color: 'var(--text-title)',
                border: '1px solid var(--border)',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
            >
              Back to Cart
            </button>
            <button 
              className="primary-action-btn"
              onClick={() => handleNextStep('account', 'bank')}
              style={{
                background: 'linear-gradient(135deg, var(--accent), #059669)',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                transition: 'transform 0.2s'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'bank') {
    return (
      <div className="checkout-wizard-page container" style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-title)' }}>Secure Checkout</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '15px' }}>
          Please enter your bank credentials for verification.
        </p>
        
        {renderProgressTracker('bank')}

        <div className="checkout-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <Building size={24} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: 'var(--text-title)' }}>2. Bank Details</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>Bank Name</label>
              <div style={{ position: 'relative' }}>
                <Building size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. State Bank of India, HDFC Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '8px',
                    border: formErrors.bankName ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              {formErrors.bankName && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.bankName}</span>}
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>IFSC Code</label>
              <div style={{ position: 'relative' }}>
                <Hash size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  maxLength={11}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '8px',
                    border: formErrors.ifscCode ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              {formErrors.ifscCode && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.ifscCode}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <button 
              className="view-all-btn"
              onClick={() => setCheckoutStep('account')}
              style={{
                background: '#f1f5f9',
                color: 'var(--text-title)',
                border: '1px solid var(--border)',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
            >
              Previous
            </button>
            <button 
              className="primary-action-btn"
              onClick={() => handleNextStep('bank', 'location')}
              style={{
                background: 'linear-gradient(135deg, var(--accent), #059669)',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                transition: 'transform 0.2s'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'location') {
    return (
      <div className="checkout-wizard-page container" style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-title)' }}>Secure Checkout</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '15px' }}>
          Please specify the delivery address for your sports gear.
        </p>
        
        {renderProgressTracker('location')}

        <div className="checkout-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <MapPin size={24} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: 'var(--text-title)' }}>3. Delivery Location</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>Delivery Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Street Address, Apartment, Suite, Block No."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '8px',
                    border: formErrors.address ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              {formErrors.address && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.address}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>City</label>
                <input
                  type="text"
                  placeholder="e.g. Chennai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: formErrors.city ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
                {formErrors.city && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.city}</span>}
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>State</label>
                <input
                  type="text"
                  placeholder="e.g. Tamil Nadu"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: formErrors.stateName ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
                {formErrors.stateName && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.stateName}</span>}
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', marginBottom: '8px' }}>Pincode</label>
                <input
                  type="text"
                  placeholder="6 digits code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: formErrors.pincode ? '2px solid #ef4444' : '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '15px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
                {formErrors.pincode && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>{formErrors.pincode}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <button 
              className="view-all-btn"
              onClick={() => setCheckoutStep('bank')}
              style={{
                background: '#f1f5f9',
                color: 'var(--text-title)',
                border: '1px solid var(--border)',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
            >
              Previous
            </button>
            <button 
              className="primary-action-btn"
              onClick={() => handleNextStep('location', 'summary')}
              style={{
                background: 'linear-gradient(135deg, var(--accent), #059669)',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                transition: 'transform 0.2s'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'summary') {
    const maskedAccount = accountNumber.length > 4 
      ? '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4)
      : accountNumber;

    return (
      <div className="checkout-wizard-page container" style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-title)' }}>Secure Checkout</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '15px' }}>
          Please review your details and click Confirm to complete your purchase.
        </p>
        
        {renderProgressTracker('summary')}

        <div className="checkout-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <FileText size={24} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: 'var(--text-title)' }}>4. Order Summary & Details</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Payment & Bank info block */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} style={{ color: 'var(--accent)' }} /> Billing Account
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px 16px', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Holder Name:</span>
                <strong style={{ color: 'var(--text-title)' }}>{accountName}</strong>

                <span style={{ color: 'var(--text-muted)' }}>Account Number:</span>
                <strong style={{ color: 'var(--text-title)' }}>{maskedAccount}</strong>

                <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span>
                <strong style={{ color: 'var(--text-title)' }}>{bankName}</strong>

                <span style={{ color: 'var(--text-muted)' }}>IFSC Code:</span>
                <strong style={{ color: 'var(--text-title)' }}>{ifscCode}</strong>
              </div>
            </div>

            {/* Shipping details block */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} style={{ color: 'var(--accent)' }} /> Delivery Address
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: 'var(--text-title)' }}>
                <strong>{accountName}</strong>
                <span>{address}</span>
                <span>{city}, {stateName} - {pincode}</span>
              </div>
            </div>

            {/* Order Price summary block */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} style={{ color: 'var(--accent)' }} /> Price Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Items Total ({cartItems.length})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Shipping Cost</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', color: 'var(--text-title)' }}>
                  <span>Total Amount Due</span>
                  <span style={{ color: 'var(--accent)' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <button 
              className="view-all-btn"
              onClick={() => setCheckoutStep('location')}
              style={{
                background: '#f1f5f9',
                color: 'var(--text-title)',
                border: '1px solid var(--border)',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
            >
              Previous
            </button>
            <button 
              className="primary-action-btn"
              onClick={handleFinalSubmit}
              style={{
                background: 'linear-gradient(135deg, var(--accent), #059669)',
                color: '#fff',
                border: 'none',
                padding: '16px 36px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '16px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Confirm & Place Order 🏆</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'success') {
    return (
      <div className="checkout-overlay-page success" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', padding: '20px' }}>
        <div className="success-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
          <Sparkles size={48} />
        </div>
        <h3 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-title)' }}>Order Placed! 🎉</h3>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '450px', marginBottom: '30px' }}>
          Your order is confirmed! Kit details and tracking have been sent to your email.
        </p>
        <div className="summary-sticker" style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', fontSize: '14px', color: 'var(--text-main)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <span>Total Paid:</span>
            <strong style={{ color: 'var(--text-title)', fontSize: '16px' }}>₹{total.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <span>Account Used:</span>
            <strong style={{ color: 'var(--text-title)' }}>{bankName} (****{accountNumber.slice(-4)})</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', textAlign: 'left' }}>
            <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
            <strong style={{ color: 'var(--text-title)' }}>{accountName}</strong>
            <span>{address}</span>
            <span>{city}, {stateName} - {pincode}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Est. Delivery:</span>
            <strong style={{ color: 'var(--text-title)' }}>2-4 Business Days 🚚</strong>
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
    <div className="cart-page-container container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0' }}>Your Shopping Cart ({cartItems.length})</h2>
        <Link to="/" className="view-all-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart" style={{ background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)', padding: '60px 20px', borderRadius: '16px', textAlign: 'center' }}>
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
          <div className="cart-items-list" style={{ background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} className="cart-item" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(15,23,42,0.06)', paddingBottom: '20px' }}>
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
                    <div className="cart-item-customs" style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
          <div className="cart-footer" style={{ background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '16px', padding: '24px' }}>
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
              <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="price-row discount text-green-600" style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
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
