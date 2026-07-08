import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Wallet, Trash2, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function BudgetPage() {
  const navigate = useNavigate();
  const {
    budgetItems,
    removeFromBudget,
    budgetLimit,
    setBudgetLimit,
    moveAllBudgetToCart,
    totalBudgetCost
  } = useContext(ShopContext);

  const totalCost = totalBudgetCost;
  const percentage = budgetLimit > 0 ? Math.min(100, (totalCost / budgetLimit) * 100) : 0;
  
  let progressColor = "var(--accent)"; // violet/primary
  if (progressColor === "var(--accent)") {
    // Fallback if var(--accent) is not set/interpreted
    progressColor = "#a855f7"; 
  }
  let feedbackMessage = "You're doing great! Keep planning.";
  let feedbackIcon = <CheckCircle2 className="text-green-500" size={18} />;

  if (percentage >= 100) {
    progressColor = "#ef4444"; // red
    feedbackMessage = "Alert: You have exceeded your sports budget! Consider removing some gear.";;
    feedbackIcon = <AlertCircle className="text-red-500 animate-bounce" size={18} />;
  } else if (percentage >= 80) {
    progressColor = "#f97316"; // orange
    feedbackMessage = "Warning: You're approaching your budget limit. Choose your next items carefully!";
    feedbackIcon = <AlertCircle className="text-orange-500" size={18} />;
  } else if (percentage > 0) {
    feedbackMessage = `Great! You still have ₹${(budgetLimit - totalCost).toLocaleString('en-IN')} remaining.`;
  }

  const handleMoveAllToCart = () => {
    moveAllBudgetToCart();
    navigate('/cart');
  };

  return (
    <div className="budget-page-container container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet size={28} style={{ color: '#38bdf8' }} />
          <span>Sports Budget Planner</span>
        </h2>
        <Link to="/" className="view-all-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Left: Configuration & Progress Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Budget Limit Slider */}
          <div className="budget-slider-section" style={{ background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '16px', padding: '24px' }}>
            <div className="slider-labels" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', color: '#64748b' }}>Set Sports Budget:</span>
              <strong className="slider-value" style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>₹{budgetLimit.toLocaleString('en-IN')}</strong>
            </div>
            
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="budget-slider"
              style={{ width: '100%', cursor: 'pointer', height: '6px', borderRadius: '4px' }}
            />
            
            <div className="slider-ticks" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              <span>₹1,000</span>
              <span>₹50,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Progress Bar & Feedback */}
          <div className="budget-progress-section" style={{ background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '16px', padding: '24px' }}>
            <div className="progress-metrics" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Total Planned: <strong style={{ color: '#0f172a', fontSize: '16px' }}>₹{totalCost.toLocaleString('en-IN')}</strong></span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: percentage >= 80 ? (percentage >= 100 ? '#ef4444' : '#f97316') : '#38bdf8' }}>{percentage.toFixed(0)}% of limit</span>
            </div>
            
            <div className="progress-bar-track" style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ 
                  height: '100%',
                  width: `${percentage}%`,
                  backgroundColor: progressColor,
                  borderRadius: '6px',
                  transition: 'width 0.3s ease, background-color 0.3s ease'
                }}
              />
            </div>

            <div className="budget-status-alert" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15,23,42,0.03)', padding: '12px', borderRadius: '8px' }}>
              {feedbackIcon}
              <span className="status-text" style={{ fontSize: '13px', color: '#334155' }}>{feedbackMessage}</span>
            </div>
          </div>

          {/* Saving suggestions */}
          {percentage >= 80 && budgetItems.length > 0 && (
            <div className="saving-tips-card" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', padding: '20px', borderRadius: '16px' }}>
              <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#f59e0b', margin: '0 0 10px 0' }}>💡 Money Saving Tips:</h5>
              <ul style={{ margin: '0', paddingLeft: '20px', color: '#475569', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {totalCost > 5000 && (
                  <li>Consider replica jerseys instead of authentic ones — save ₹2,000+.</li>
                )}
                <li>Use code <strong>SPORT15</strong> at checkout for 15% off sports cart items.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Right: Wishlisted Items & Actions */}
        <div style={{ background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0', borderBottom: '1px solid rgba(15,23,42,0.06)', paddingBottom: '12px' }}>My Planned Gear ({budgetItems.length})</h4>
          
          {budgetItems.length === 0 ? (
            <div className="empty-budget-state" style={{ textAlign: 'center', padding: '40px 10px', color: '#64748b' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}>No items added yet.</p>
              <small>Click "Plan" on any product card in the store to add it here!</small>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="budget-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                {budgetItems.map((item) => (
                  <div key={item.id} className="budget-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.03)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(15,23,42,0.06)' }}>
                    <div className="item-details" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="item-name" style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{item.name}</span>
                      <span className="item-category" style={{ fontSize: '11px', color: '#64748b' }}>{item.category}</span>
                    </div>
                    <div className="item-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <strong className="item-price" style={{ color: '#38bdf8', fontSize: '14px' }}>₹{item.price.toLocaleString('en-IN')}</strong>
                      <button 
                        onClick={() => removeFromBudget(item.id)}
                        className="budget-item-remove-btn"
                        style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', display: 'flex', padding: '4px' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px', borderTop: '1px solid rgba(15,23,42,0.06)', paddingTop: '20px' }}>
                <button className="move-to-cart-btn" onClick={handleMoveAllToCart} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '10px' }}>
                  <span>Move All to Sports Cart</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
