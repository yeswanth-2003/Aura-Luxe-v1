
'use client';
import { useState, useEffect } from 'react';
import { CartItem, ProductWithPrice } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aura_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    // Dispatch custom event for Header synchronization
    window.dispatchEvent(new Event('cart-updated'));
  }, [cart]);

  const addToCart = (product: ProductWithPrice) => {
    setCart(prev => {
      const existing = prev.find(item => (item.id || item._id) === (product.id || product._id));
      if (existing) return prev.map(item => (item.id || item._id) === (product.id || product._id) ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => (item.id || item._id) !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      (item.id || item._id) === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const clearCart = () => setCart([]);

  return { cart, addToCart, removeFromCart, updateQty, clearCart };
}
