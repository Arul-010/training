import React, { useState } from 'react';
import { Compass, BookOpen, Coffee, Trees, Laptop, PenTool, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function StudyVibeQuiz({ isOpen, onClose, products, onAddBundleToCart }) {
  const [step, setStep] = useState(0); // 0, 1, 2 = questions, 3 = recommendation
  const [answers, setAnswers] = useState({});

  if (!isOpen) return null;

  const questions = [
    {
      title: "Where is your absolute favorite study zone?",
      key: "zone",
      options: [
        { id: "library", label: "Quiet Library Corner", icon: <BookOpen className="opt-icon" /> },
        { id: "cafe", label: "Cozy Dorm or Cafe", icon: <Coffee className="opt-icon" /> },
        { id: "campus", label: "Campus Lawn or Outdoors", icon: <Trees className="opt-icon" /> }
      ]
    },
    {
      title: "What is your study format of choice?",
      key: "format",
      options: [
        { id: "digital", label: "Digital Apps & Reusable Notebooks", icon: <Laptop className="opt-icon" /> },
        { id: "paper", label: "Tactile Paper, Planners & Pencils", icon: <PenTool className="opt-icon" /> },
        { id: "quick", label: "Color-Coded Cards & Formula Sheets", icon: <Sparkles className="opt-icon" /> }
      ]
    },
    {
      title: "Choose your campus aesthetic color scheme:",
      key: "color",
      options: [
        { id: "dark", label: "Dark Academia & Cozy Amber", colorCircle: "#1e3a8a" },
        { id: "pastel", label: "Pastel Lavender & Mint Freshness", colorCircle: "#c084fc" },
        { id: "modern", label: "Minimalist Black, White & Steel", colorCircle: "#4b5563" }
      ]
    }
  ];

  const handleSelectOption = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(3); // Go to results
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
  };

  // Bundle Recommendation Logic based on quiz responses
  const getRecommendation = () => {
    let bundleProducts = [];
    let title = "";
    let desc = "";

    // 1. Digital & Tech focus
    if (answers.format === 'digital') {
      title = "Smart Tech Academic Pack";
      desc = "Perfect for the futuristic student. You love digitizing your study notes and setting precise lighting.";
      // Get Everlast Notebook (ID 1) and Aura Lamp (ID 5)
      bundleProducts = products.filter(p => p.id === 1 || p.id === 5);
    } 
    // 2. Tactile planner focus
    else if (answers.format === 'paper') {
      title = "Creative Planner & Writer Pack";
      desc = "You love physical layout organization and premium writing materials to draft essays.";
      // Get Notebook (ID 1) and Mechanical Pencil Set (ID 3)
      bundleProducts = products.filter(p => p.id === 1 || p.id === 3);
    } 
    // 3. Exam prep card focus or default
    else {
      title = "High-Score Exam Prep Kit";
      desc = "Focused on memorization, flash cards, and having cheat sheets ready for final exams.";
      // Get Flashcards (ID 9) and Cheat Sheets (ID 10)
      bundleProducts = products.filter(p => p.id === 9 || p.id === 10);
    }

    // Add extra campus gear based on study zone
    if (answers.zone === 'library' && !bundleProducts.some(p => p.id === 7)) {
      // Library: Add Headphones (ID 7)
      const headphones = products.find(p => p.id === 7);
      if (headphones) bundleProducts.push(headphones);
    } else if (answers.zone === 'campus' && !bundleProducts.some(p => p.id === 2)) {
      // Outdoor: Add Backpack (ID 2)
      const backpack = products.find(p => p.id === 2);
      if (backpack) bundleProducts.push(backpack);
    } else if (answers.zone === 'cafe' && !bundleProducts.some(p => p.id === 8)) {
      // Cafe: Add Insulated Bottle (ID 8)
      const bottle = products.find(p => p.id === 8);
      if (bottle) bundleProducts.push(bottle);
    }

    // Ensure we only have up to 3 items
    bundleProducts = bundleProducts.slice(0, 3);

    const normalTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0);
    const discountedTotal = normalTotal * 0.90; // 10% bundle discount

    return { title, desc, bundleProducts, normalTotal, discountedTotal };
  };

  const rec = step === 3 ? getRecommendation() : null;

  const handleAddBundle = () => {
    if (rec) {
      onAddBundleToCart(rec.bundleProducts);
      onClose();
    }
  };

  return (
    <div className="quiz-backdrop" onClick={onClose}>
      <div className="quiz-container animate-scale-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-header-title">
            <Compass className="quiz-header-icon animate-spin-slow" />
            <span>Find Your Study Vibe</span>
          </div>
          <button className="quiz-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Steps Tracker */}
        {step < 3 && (
          <div className="quiz-steps-dots">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              />
            ))}
          </div>
        )}

        <div className="quiz-body">
          {step < 3 ? (
            <div className="quiz-question-view animate-fade-in">
              <h2 className="question-title">{questions[step].title}</h2>
              
              <div className="quiz-options-grid">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(questions[step].key, opt.id)}
                    className="quiz-option-card"
                  >
                    {opt.icon && <div className="opt-icon-wrapper">{opt.icon}</div>}
                    {opt.colorCircle && (
                      <div className="opt-color-circle" style={{ backgroundColor: opt.colorCircle }} />
                    )}
                    <span className="opt-label">{opt.label}</span>
                    <ArrowRight className="opt-arrow" size={16} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="quiz-results-view animate-scale-in">
              <div className="badge-ribbon">
                <Sparkles size={16} />
                <span>MATCH COMPLETED</span>
              </div>
              
              <h2 className="result-bundle-title">{rec.title}</h2>
              <p className="result-bundle-desc">{rec.desc}</p>

              <div className="recommended-products-list">
                {rec.bundleProducts.map((p) => (
                  <div key={p.id} className="rec-product-row">
                    <img src={p.image} alt={p.name} className="rec-img" />
                    <div className="rec-info">
                      <h4>{p.name}</h4>
                      <span className="rec-category">{p.category}</span>
                    </div>
                    <div className="rec-price">₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              <div className="bundle-offer-card">
                <div className="bundle-offer-prices">
                  <div className="normal-price">Original: <span>₹{rec.normalTotal.toLocaleString('en-IN')}</span></div>
                  <div className="bundle-price">Bundle Offer (10% Off): <strong>₹{Math.round(rec.discountedTotal).toLocaleString('en-IN')}</strong></div>
                </div>
                <div className="discount-tag">
                  <ShieldCheck size={16} className="mr-1" />
                  <span>Promo BUNDLE10 will be applied</span>
                </div>
              </div>

              <div className="result-actions">
                <button className="add-bundle-cart-btn" onClick={handleAddBundle}>
                  Add Entire Bundle to Cart
                </button>
                <button className="retake-btn" onClick={resetQuiz}>
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
