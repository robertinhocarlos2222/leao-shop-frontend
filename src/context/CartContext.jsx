import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('leao-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('leao-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, flavor = null) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && item.flavor === flavor
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.flavor === flavor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        flavor,
        quantity
      }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId, flavor = null) => {
    setCartItems(prev => 
      prev.filter(item => !(item.id === productId && item.flavor === flavor))
    );
  };

  const updateQuantity = (productId, flavor, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, flavor);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.flavor === flavor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}