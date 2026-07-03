import React from 'react';
import { Wallet, Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BudgetPlanner({
  isOpen,
  onClose,
  budgetItems,
  onRemoveFromBudget,
  budgetLimit,
  setBudgetLimit,
  onMoveAllToCart
}) {
  if (!isOpen) return null;

  const totalCost = budgetItems.reduce((acc, item) => acc + item.price, 0);
  const percentage = budgetLimit > 0 ? Math.min(100, (totalCost / budgetLimit) * 100) : 0;
  
  let progressColor = "var(--accent)"; // violet
  let feedbackMessage = "You're doing great! Keep planning.";
  let feedbackIcon = <CheckCircle2 className="text-green-500" size={18} />;

  if (percentage >= 100) {
    progressColor = "#ef4444"; // red
    feedbackMessage = "Alert: You have exceeded your set semester budget! Consider removing non-essential tech.";
    feedbackIcon = <AlertCircle className="text-red-500 animate-bounce" size={18} />;
  } else if (percentage >= 80) {
    progressColor = "#f97316"; // orange
    feedbackMessage = "Warning: You're approaching your budget limit. Choose your next items carefully!";
    feedbackIcon = <AlertCircle className="text-orange-500" size={18} />;
  } else if (percentage > 0) {
    feedbackMessage = `Great! You still have ₹${(budgetLimit - totalCost).toLocaleString('en-IN')} remaining.`;
  }

  return (
    <div className="budget-widget-modal" onClick={onClose}>
      <div className="budget-widget-container animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="budget-widget-header">
          <div className="header-title-row">
            <Wallet className="header-icon" />
            <h3>Semester Supply Budgeter</h3>
          </div>
          <button className="budget-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="budget-widget-body">
          <p className="budget-intro-text">
            Add supplies from the store to your budget list to plan your semester expenses and check if they fit your goals.
          </p>

          {/* Slider Setting */}
          <div className="budget-slider-section">
            <div className="slider-labels">
              <span>Set Semester Limit:</span>
              <strong className="slider-value">₹{budgetLimit.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="budget-slider"
            />
            <div className="slider-ticks">
              <span>₹1,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Progress Bar Display */}
          <div className="budget-progress-section">
            <div className="progress-metrics">
              <span>Spent: <strong>₹{totalCost.toLocaleString('en-IN')}</strong></span>
              <span>{percentage.toFixed(0)}% of limit</span>
            </div>
            
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: progressColor
                }}
              />
            </div>

            <div className="budget-status-alert">
              {feedbackIcon}
              <span className="status-text">{feedbackMessage}</span>
            </div>
          </div>

          {/* Wishlisted items */}
          <div className="budget-items-list-container">
            <h4>My Planned Items ({budgetItems.length})</h4>
            {budgetItems.length === 0 ? (
              <div className="empty-budget-state">
                <p>No items added yet.</p>
                <small>Click "Budget" on any product card in the store to add it here!</small>
              </div>
            ) : (
              <div className="budget-items-list">
                {budgetItems.map((item) => (
                  <div key={item.id} className="budget-item-row">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-category">{item.category}</span>
                    </div>
                    <div className="item-actions">
                      <strong className="item-price">₹{item.price.toLocaleString('en-IN')}</strong>
                      <button 
                        onClick={() => onRemoveFromBudget(item.id)}
                        className="budget-item-remove-btn"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saving suggestions */}
          {percentage >= 80 && budgetItems.length > 0 && (
            <div className="saving-tips-card">
              <h5>💡 Pro Saving Tips:</h5>
              <ul>
                {totalCost > 5000 && (
                  <li>Swap premium headphones for stationery sets to save over ₹3,000.</li>
                )}
                <li>Use code <strong>STUDENT15</strong> at checkout for 15% off standard cart items.</li>
                <li>Bundle items through the "Find Vibe" quiz for automatic package discounts!</li>
              </ul>
            </div>
          )}
        </div>

        <div className="budget-widget-footer">
          {budgetItems.length > 0 && (
            <button className="move-to-cart-btn" onClick={onMoveAllToCart}>
              <span>Move All to Study Cart</span>
              <ArrowRight size={16} />
            </button>
          )}
          <button className="cancel-btn" onClick={onClose}>Done Planning</button>
        </div>
      </div>
    </div>
  );
}
