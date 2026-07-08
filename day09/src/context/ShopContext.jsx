import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

export default function ShopProvider({ children }) {
  // Navigation & Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Interaction States
  const [cartItems, setCartItems] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(100000);
  const [toasts, setToasts] = useState([]);

  // Load from local storage or defaults on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sportzone_cart');
    const savedBudget = localStorage.getItem('sportzone_budget');
    const savedLimit = localStorage.getItem('sportzone_limit');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedBudget) {
      try {
        setBudgetItems(JSON.parse(savedBudget));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedLimit) {
      setBudgetLimit(Number(savedLimit));
    }
  }, []);

  // Save state to local storage when changed
  useEffect(() => {
    localStorage.setItem('sportzone_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('sportzone_budget', JSON.stringify(budgetItems));
  }, [budgetItems]);

  useEffect(() => {
    localStorage.setItem('sportzone_limit', String(budgetLimit));
  }, [budgetLimit]);

  // Toast helper
  const showToast = (message, icon = '✨') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Cart actions
  const addToCart = (product, qty = 1, customs = {}) => {
    setCartItems(prev => {
      const duplicateIdx = prev.findIndex(
        item =>
          item.product.id === product.id &&
          JSON.stringify(item.customs) === JSON.stringify(customs)
      );
      if (duplicateIdx > -1) {
        const nextCart = [...prev];
        nextCart[duplicateIdx].quantity += qty;
        return nextCart;
      } else {
        return [...prev, { product, quantity: qty, customs }];
      }
    });
    showToast(`${product.name} added to cart!`, '🛒');
  };

  const updateCartQty = (index, nextQty) => {
    if (nextQty <= 0) return;
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = nextQty;
      return updated;
    });
  };

  const removeFromCartItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Budget Planner actions
  const addToBudget = (product) => {
    let message = "";
    let icon = "✨";
    setBudgetItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        message = `${product.name} removed from budget plan.`;
        icon = "🗑️";
        return prev.filter(item => item.id !== product.id);
      } else {
        message = `${product.name} added to budget plan!`;
        icon = "💼";
        return [...prev, product];
      }
    });
    setTimeout(() => {
      if (message) showToast(message, icon);
    }, 50);
  };

  const removeFromBudget = (id) => {
    setBudgetItems(prev => prev.filter(it => it.id !== id));
  };

  const moveAllBudgetToCart = () => {
    if (budgetItems.length === 0) return;
    budgetItems.forEach(product => addToCart(product, 1, {}));
    setBudgetItems([]);
    showToast("All budget items moved to cart!", '🛒');
  };

  const totalBudgetCost = budgetItems.reduce((acc, item) => acc + item.price, 0);
  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <ShopContext.Provider value={{
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      sortBy,
      setSortBy,
      cartItems,
      setCartItems,
      budgetItems,
      setBudgetItems,
      budgetLimit,
      setBudgetLimit,
      toasts,
      showToast,
      addToCart,
      updateCartQty,
      removeFromCartItem,
      clearCart,
      addToBudget,
      removeFromBudget,
      moveAllBudgetToCart,
      totalBudgetCost,
      cartCount
    }}>
      {children}
    </ShopContext.Provider>
  );
}
