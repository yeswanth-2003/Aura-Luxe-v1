
'use client';
import React, { useState, useEffect } from 'react';
import Header from './Header';

export default function HeaderWrapper() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const saved = localStorage.getItem('aura_cart');
    if (saved) {
      const cart = JSON.parse(saved);
      setCount(cart.reduce((a: number, b: any) => a + b.quantity, 0));
    } else {
      setCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  return <Header cartCount={count} />;
}
