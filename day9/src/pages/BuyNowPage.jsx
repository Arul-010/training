import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, CreditCard, Building, MapPin,
  User, Hash, FileText, ShoppingBag, Sparkles, Loader2, Zap
} from 'lucide-react';
import JerseyMockup from '../components/JerseyMockup';

export default function BuyNowPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => p.id === parseInt(id));

  // Wizard Step: 'account' | 'bank' | 'location' | 'summary' | 'processing' | 'success'
  const [step, setStep] = useState('account');
  const [processingStatus, setProcessingStatus] = useState('');

  // Form state
  const [accountName, setAccountName]   = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName]         = useState('');
  const [ifscCode, setIfscCode]         = useState('');
  const [address, setAddress]           = useState('');
  const [city, setCity]                 = useState('');
  const [stateName, setStateName]       = useState('');
  const [pincode, setPincode]           = useState('');
  const [formErrors, setFormErrors]     = useState({});

  // Scroll to top on step change
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-main)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ fontSize: '20px', color: 'var(--text-title)' }}>Product not found.</h3>
        <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const price = product.price;
  const isMockupJersey = product.customType === 'jersey' && !product.image.startsWith('/jerseys/');

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (currentStep) => {
    const errors = {};
    if (currentStep === 'account') {
      if (!accountName.trim())  errors.accountName   = 'Account Holder Name is required';
      if (!accountNumber.trim()) errors.accountNumber = 'Account Number is required';
      else if (!/^\d{9,18}$/.test(accountNumber.trim()))
        errors.accountNumber = 'Must be 9 – 18 digits';
    }
    if (currentStep === 'bank') {
      if (!bankName.trim())  errors.bankName = 'Bank Name is required';
      if (!ifscCode.trim())  errors.ifscCode = 'IFSC Code is required';
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase()))
        errors.ifscCode = 'Invalid format — e.g. SBIN0001234';
    }
    if (currentStep === 'location') {
      if (!address.trim())   errors.address   = 'Delivery address is required';
      if (!city.trim())      errors.city      = 'City is required';
      if (!stateName.trim()) errors.stateName = 'State is required';
      if (!pincode.trim())   errors.pincode   = 'Pincode is required';
      else if (!/^\d{6}$/.test(pincode.trim()))
        errors.pincode = 'Must be exactly 6 digits';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goNext = (from, to) => {
    if (validate(from)) setStep(to);
  };

  // ── Final Submit ──────────────────────────────────────────────────────────
  const handleConfirm = () => {
    setStep('processing');
    setProcessingStatus('Verifying your payment credentials...');
    setTimeout(() => {
      setProcessingStatus('Validating account details with bank...');
      setTimeout(() => {
        setProcessingStatus('Generating order invoice...');
        setTimeout(() => {
          setProcessingStatus('Packing your sports gear for dispatch...');
          setTimeout(() => {
            setProcessingStatus('Ready for dispatch! 🚚');
            setTimeout(() => {
              setStep('success');
              confetti({ particleCount: 130, spread: 72, origin: { y: 0.6 } });
            }, 900);
          }, 1100);
        }, 900);
      }, 900);
    }, 900);
  };

  // ── Progress Tracker ──────────────────────────────────────────────────────
  const STEPS = [
    { id: 'account',  label: '1. Account' },
    { id: 'bank',     label: '2. Bank'    },
    { id: 'location', label: '3. Delivery'},
    { id: 'summary',  label: '4. Confirm' },
  ];

  const renderProgress = () => {
    const idx = STEPS.findIndex(s => s.id === step);
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto 32px', padding: '0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {/* Track */}
          <div style={{
            position: 'absolute', top: '20px', left: '30px', right: '30px',
            height: '4px', background: 'rgba(15,23,42,0.08)', borderRadius: '2px', zIndex: 1
          }} />
          {/* Fill */}
          <div style={{
            position: 'absolute', top: '20px', left: '30px',
            width: `${(idx / (STEPS.length - 1)) * 90}%`,
            height: '4px', background: 'linear-gradient(90deg,var(--accent),#3b82f6)',
            borderRadius: '2px', zIndex: 2, transition: 'width 0.4s ease'
          }} />
          {STEPS.map((s, i) => {
            const done   = i < idx;
            const active = i === idx;
            return (
              <div key={s.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:3, flex:1 }}>
                <div style={{
                  width:'40px', height:'40px', borderRadius:'50%',
                  background: done ? 'var(--accent)' : active ? '#fff' : '#f1f5f9',
                  border: done ? 'none' : active ? '2px solid var(--accent)' : '2px solid rgba(15,23,42,0.08)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: done ? '#fff' : active ? 'var(--accent)' : '#94a3b8',
                  fontWeight:'700', fontSize:'15px',
                  boxShadow: active ? '0 0 14px rgba(16,185,129,0.3)' : 'none',
                  transition:'all 0.3s ease'
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{
                  marginTop:'8px', fontSize:'12px', whiteSpace:'nowrap', textAlign:'center',
                  fontWeight: active ? '700' : '500',
                  color: active ? 'var(--accent)' : done ? 'var(--text-main)' : '#94a3b8'
                }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Shared Styles ─────────────────────────────────────────────────────────
  const cardStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-lg)'
  };
  const inputStyle = (hasErr) => ({
    width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px',
    border: hasErr ? '2px solid #ef4444' : '1px solid var(--border)',
    background: '#fff', color: 'var(--text-main)', outline: 'none',
    fontSize: '15px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)', boxSizing: 'border-box'
  });
  const plainInputStyle = (hasErr) => ({
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: hasErr ? '2px solid #ef4444' : '1px solid var(--border)',
    background: '#fff', color: 'var(--text-main)', outline: 'none',
    fontSize: '15px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)', boxSizing: 'border-box'
  });
  const labelStyle = { display:'block', fontSize:'14px', fontWeight:'600', color:'var(--text-title)', marginBottom:'8px' };
  const errStyle   = { color:'#ef4444', fontSize:'13px', marginTop:'5px', display:'block' };
  const iconAbsolute = { position:'absolute', left:'14px', top:'15px', color:'var(--text-muted)' };

  const backBtn = (onClick, label='Previous') => (
    <button onClick={onClick} style={{
      background:'#f1f5f9', color:'var(--text-title)', border:'1px solid var(--border)',
      padding:'12px 24px', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'14px'
    }}>{label}</button>
  );
  const nextBtn = (onClick, label='Continue →') => (
    <button onClick={onClick} style={{
      background:'linear-gradient(135deg,var(--accent),#059669)', color:'#fff',
      border:'none', padding:'12px 32px', borderRadius:'8px', cursor:'pointer',
      fontWeight:'700', fontSize:'14px', boxShadow:'0 4px 12px rgba(16,185,129,0.2)'
    }}>{label}</button>
  );

  // ── Product Mini Banner ───────────────────────────────────────────────────
  const productBanner = () => (
    <div style={{
      display:'flex', alignItems:'center', gap:'16px', background:'var(--bg-card)',
      border:'1px solid var(--border)', borderRadius:'12px', padding:'16px 20px',
      marginBottom:'24px', boxShadow:'var(--shadow-sm)'
    }}>
      <div style={{ width:'64px', height:'64px', borderRadius:'10px', overflow:'hidden', flexShrink:0 }}>
        {isMockupJersey
          ? <JerseyMockup teamName={product.name} height="100%" />
          : <img src={product.image} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        }
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'2px' }}>{product.category}</div>
        <div style={{ fontSize:'16px', fontWeight:'700', color:'var(--text-title)', marginBottom:'4px' }}>{product.name}</div>
        <div style={{ fontSize:'18px', fontWeight:'800', color:'var(--accent)' }}>₹{price.toLocaleString('en-IN')}</div>
      </div>
      <div style={{
        background:'rgba(16,185,129,0.1)', color:'var(--accent)', borderRadius:'8px',
        padding:'6px 12px', fontSize:'12px', fontWeight:'700', whiteSpace:'nowrap'
      }}>
        <Zap size={12} style={{ display:'inline', marginRight:'4px' }} />
        Buy Now
      </div>
    </div>
  );

  // ── Page wrapper ──────────────────────────────────────────────────────────
  const pageWrap = (children) => (
    <div style={{ maxWidth:'750px', margin:'40px auto', padding:'0 20px', color:'var(--text-main)' }}>
      {/* Back link */}
      <div style={{ marginBottom:'20px' }}>
        <Link to={`/product/${product.id}`} style={{
          display:'inline-flex', alignItems:'center', gap:'6px',
          color:'var(--text-muted)', textDecoration:'none', fontSize:'14px', fontWeight:'500'
        }}>
          <ArrowLeft size={15} /> Back to Product
        </Link>
      </div>

      <h2 style={{ textAlign:'center', fontSize:'26px', fontWeight:'800', marginBottom:'6px', color:'var(--text-title)' }}>
        Secure Buy Now
      </h2>
      <p style={{ textAlign:'center', color:'var(--text-muted)', marginBottom:'28px', fontSize:'14px' }}>
        Complete payment details to place your order instantly — no cart needed.
      </p>

      {renderProgress()}
      {productBanner()}
      {children}
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // STEP 1 — Account Details
  // ═══════════════════════════════════════════════════════
  if (step === 'account') {
    return pageWrap(
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px', borderBottom:'1px solid var(--border)', paddingBottom:'16px' }}>
          <CreditCard size={22} style={{ color:'var(--accent)' }} />
          <h3 style={{ margin:0, fontSize:'18px', fontWeight:'700', color:'var(--text-title)' }}>Account Details</h3>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          {/* Account Holder Name */}
          <div>
            <label style={labelStyle}>Account Holder Name</label>
            <div style={{ position:'relative' }}>
              <User size={17} style={iconAbsolute} />
              <input type="text" placeholder="Enter name as in bank records"
                value={accountName} onChange={e => setAccountName(e.target.value)}
                style={inputStyle(formErrors.accountName)} />
            </div>
            {formErrors.accountName && <span style={errStyle}>{formErrors.accountName}</span>}
          </div>

          {/* Account Number */}
          <div>
            <label style={labelStyle}>Account Number</label>
            <div style={{ position:'relative' }}>
              <Hash size={17} style={iconAbsolute} />
              <input type="text" placeholder="Enter your 9–18 digit account number"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                style={inputStyle(formErrors.accountNumber)} />
            </div>
            {formErrors.accountNumber && <span style={errStyle}>{formErrors.accountNumber}</span>}
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'36px' }}>
          {backBtn(() => navigate(`/product/${product.id}`), '← Back to Product')}
          {nextBtn(() => goNext('account', 'bank'))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // STEP 2 — Bank Details
  // ═══════════════════════════════════════════════════════
  if (step === 'bank') {
    return pageWrap(
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px', borderBottom:'1px solid var(--border)', paddingBottom:'16px' }}>
          <Building size={22} style={{ color:'var(--accent)' }} />
          <h3 style={{ margin:0, fontSize:'18px', fontWeight:'700', color:'var(--text-title)' }}>Bank Details</h3>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          {/* Bank Name */}
          <div>
            <label style={labelStyle}>Bank Name</label>
            <div style={{ position:'relative' }}>
              <Building size={17} style={iconAbsolute} />
              <input type="text" placeholder="e.g. State Bank of India, HDFC Bank"
                value={bankName} onChange={e => setBankName(e.target.value)}
                style={inputStyle(formErrors.bankName)} />
            </div>
            {formErrors.bankName && <span style={errStyle}>{formErrors.bankName}</span>}
          </div>

          {/* IFSC Code */}
          <div>
            <label style={labelStyle}>IFSC Code</label>
            <div style={{ position:'relative' }}>
              <Hash size={17} style={iconAbsolute} />
              <input type="text" placeholder="e.g. SBIN0001234" maxLength={11}
                value={ifscCode} onChange={e => setIfscCode(e.target.value.toUpperCase())}
                style={inputStyle(formErrors.ifscCode)} />
            </div>
            {formErrors.ifscCode && <span style={errStyle}>{formErrors.ifscCode}</span>}
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'36px' }}>
          {backBtn(() => setStep('account'))}
          {nextBtn(() => goNext('bank', 'location'))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // STEP 3 — Delivery Location
  // ═══════════════════════════════════════════════════════
  if (step === 'location') {
    return pageWrap(
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px', borderBottom:'1px solid var(--border)', paddingBottom:'16px' }}>
          <MapPin size={22} style={{ color:'var(--accent)' }} />
          <h3 style={{ margin:0, fontSize:'18px', fontWeight:'700', color:'var(--text-title)' }}>Delivery Location</h3>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          {/* Address */}
          <div>
            <label style={labelStyle}>Delivery Address</label>
            <div style={{ position:'relative' }}>
              <MapPin size={17} style={iconAbsolute} />
              <input type="text" placeholder="Street, Apartment / Block No."
                value={address} onChange={e => setAddress(e.target.value)}
                style={inputStyle(formErrors.address)} />
            </div>
            {formErrors.address && <span style={errStyle}>{formErrors.address}</span>}
          </div>

          {/* City / State / Pincode row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'16px' }}>
            <div>
              <label style={labelStyle}>City</label>
              <input type="text" placeholder="e.g. Chennai"
                value={city} onChange={e => setCity(e.target.value)}
                style={plainInputStyle(formErrors.city)} />
              {formErrors.city && <span style={errStyle}>{formErrors.city}</span>}
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input type="text" placeholder="e.g. Tamil Nadu"
                value={stateName} onChange={e => setStateName(e.target.value)}
                style={plainInputStyle(formErrors.stateName)} />
              {formErrors.stateName && <span style={errStyle}>{formErrors.stateName}</span>}
            </div>
            <div>
              <label style={labelStyle}>Pincode</label>
              <input type="text" placeholder="6 digits" maxLength={6}
                value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                style={plainInputStyle(formErrors.pincode)} />
              {formErrors.pincode && <span style={errStyle}>{formErrors.pincode}</span>}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'36px' }}>
          {backBtn(() => setStep('bank'))}
          {nextBtn(() => goNext('location', 'summary'))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // STEP 4 — Order Summary
  // ═══════════════════════════════════════════════════════
  if (step === 'summary') {
    const masked = accountNumber.length > 4
      ? '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4)
      : accountNumber;

    const sectionHead = (Icon, label) => (
      <h4 style={{ fontSize:'15px', fontWeight:'700', margin:'0 0 12px 0', color:'var(--text-title)',
        display:'flex', alignItems:'center', gap:'8px' }}>
        <Icon size={17} style={{ color:'var(--accent)' }} /> {label}
      </h4>
    );

    const infoBox = (children) => (
      <div style={{ background:'#f8fafc', border:'1px solid var(--border)', borderRadius:'12px', padding:'18px', marginBottom:'14px' }}>
        {children}
      </div>
    );

    return pageWrap(
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px', borderBottom:'1px solid var(--border)', paddingBottom:'16px' }}>
          <FileText size={22} style={{ color:'var(--accent)' }} />
          <h3 style={{ margin:0, fontSize:'18px', fontWeight:'700', color:'var(--text-title)' }}>Order Summary</h3>
        </div>

        {/* Billing */}
        {infoBox(<>
          {sectionHead(CreditCard, 'Billing Account')}
          <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', gap:'8px 12px', fontSize:'14px' }}>
            <span style={{ color:'var(--text-muted)' }}>Holder Name:</span><strong style={{ color:'var(--text-title)' }}>{accountName}</strong>
            <span style={{ color:'var(--text-muted)' }}>Account No:</span><strong style={{ color:'var(--text-title)' }}>{masked}</strong>
            <span style={{ color:'var(--text-muted)' }}>Bank:</span><strong style={{ color:'var(--text-title)' }}>{bankName}</strong>
            <span style={{ color:'var(--text-muted)' }}>IFSC:</span><strong style={{ color:'var(--text-title)' }}>{ifscCode}</strong>
          </div>
        </>)}

        {/* Delivery */}
        {infoBox(<>
          {sectionHead(MapPin, 'Delivery Address')}
          <div style={{ fontSize:'14px', color:'var(--text-title)', display:'flex', flexDirection:'column', gap:'3px' }}>
            <strong>{accountName}</strong>
            <span>{address}</span>
            <span>{city}, {stateName} — {pincode}</span>
          </div>
        </>)}

        {/* Price */}
        {infoBox(<>
          {sectionHead(ShoppingBag, 'Price Details')}
          <div style={{ fontSize:'14px', display:'flex', flexDirection:'column', gap:'8px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', color:'var(--text-muted)' }}>
              <span>Product Price</span><span>₹{price.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', color:'var(--text-muted)' }}>
              <span>Shipping</span><span style={{ color:'#10b981', fontWeight:'600' }}>FREE</span>
            </div>
            <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'4px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'17px', fontWeight:'800', color:'var(--text-title)' }}>
              <span>Total</span><span style={{ color:'var(--accent)' }}>₹{price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </>)}

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'28px' }}>
          {backBtn(() => setStep('location'))}
          <button onClick={handleConfirm} style={{
            background:'linear-gradient(135deg,var(--accent),#059669)', color:'#fff',
            border:'none', padding:'14px 36px', borderRadius:'8px', cursor:'pointer',
            fontWeight:'800', fontSize:'15px', boxShadow:'0 4px 16px rgba(16,185,129,0.3)',
            display:'flex', alignItems:'center', gap:'8px'
          }}>
            <Zap size={16} /> Confirm & Buy Now 🏆
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // PROCESSING
  // ═══════════════════════════════════════════════════════
  if (step === 'processing') {
    return (
      <div style={{
        minHeight:'60vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:'16px',
        color:'var(--text-main)', padding:'40px 20px'
      }}>
        <Loader2 size={52} style={{ color:'var(--accent)', animation:'spin 1s linear infinite' }} className="animate-spin" />
        <h3 style={{ fontSize:'22px', fontWeight:'700', margin:0, color:'var(--text-title)' }}>Processing Your Order…</h3>
        <p style={{ color:'var(--text-muted)', margin:0, fontSize:'15px' }}>{processingStatus}</p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // SUCCESS
  // ═══════════════════════════════════════════════════════
  if (step === 'success') {
    const masked = accountNumber.length > 4
      ? '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4)
      : accountNumber;

    return (
      <div style={{
        minHeight:'60vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'40px 20px',
        color:'var(--text-main)'
      }}>
        <div style={{
          background:'rgba(16,185,129,0.1)', color:'var(--accent)',
          padding:'20px', borderRadius:'50%', marginBottom:'20px'
        }}>
          <Sparkles size={52} />
        </div>

        <h3 style={{ fontSize:'30px', fontWeight:'800', marginBottom:'6px', color:'var(--text-title)' }}>
          Order Placed! 🎉
        </h3>
        <p style={{ color:'var(--text-muted)', textAlign:'center', maxWidth:'420px', marginBottom:'28px', fontSize:'15px' }}>
          Your order for <strong style={{ color:'var(--text-title)' }}>{product.name}</strong> is confirmed!
          Tracking details will be sent to your registered contact.
        </p>

        <div style={{
          background:'var(--bg-card)', border:'1px solid var(--border)',
          padding:'24px', borderRadius:'14px', width:'100%', maxWidth:'480px',
          display:'flex', flexDirection:'column', gap:'12px', marginBottom:'28px',
          fontSize:'14px', color:'var(--text-main)'
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'10px' }}>
            <span style={{ color:'var(--text-muted)' }}>Amount Paid</span>
            <strong style={{ color:'var(--text-title)', fontSize:'16px' }}>₹{price.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'10px' }}>
            <span style={{ color:'var(--text-muted)' }}>Account Used</span>
            <strong style={{ color:'var(--text-title)' }}>{bankName} ({masked})</strong>
          </div>
          <div style={{ borderBottom:'1px solid var(--border)', paddingBottom:'10px' }}>
            <span style={{ color:'var(--text-muted)', display:'block', marginBottom:'4px' }}>Delivery Address</span>
            <strong style={{ color:'var(--text-title)', display:'block' }}>{accountName}</strong>
            <span>{address}</span><br />
            <span>{city}, {stateName} — {pincode}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ color:'var(--text-muted)' }}>Est. Delivery</span>
            <strong style={{ color:'var(--text-title)' }}>2 – 4 Business Days 🚚</strong>
          </div>
        </div>

        <button onClick={() => navigate('/')} style={{
          background:'linear-gradient(135deg,var(--accent),#059669)', color:'#fff',
          border:'none', padding:'12px 28px', borderRadius:'8px', cursor:'pointer',
          fontWeight:'700', fontSize:'15px', boxShadow:'0 4px 12px rgba(16,185,129,0.2)'
        }}>
          Continue Shopping ⚽
        </button>
      </div>
    );
  }

  return null;
}
