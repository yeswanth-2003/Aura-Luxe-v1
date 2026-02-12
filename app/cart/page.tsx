
'use client';
import React, { useState } from 'react';
import { useCart } from '@/lib/useCart';
import { api } from '@/services/api';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '' });
  const [isOrdering, setIsOrdering] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + (item.pricing.finalPrice * item.quantity), 0);

  const handleCheckout = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      return alert('Fill shipping details.');
    }

    setIsOrdering(true);
    try {
      await api.placeOrder({
        customerName: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        items: cart,
        total: total
      });
      alert('Order Confirmed!');
      clearCart();
      window.location.href = '/';
    } catch (e) {
      alert('Failed.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (cart.length === 0) return <div className="p-20 text-center serif italic">Bag is Empty. <Link href="/shop" className="text-gold underline">Shop Collections</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-left">
      <h1 className="text-5xl font-bold serif mb-16">Shopping Bag</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-10">
          {cart.map(item => (
            <div key={item.id || item._id} className="flex gap-8 border-b border-beige pb-10">
              <img src={item.images[0]?.url} className="w-40 h-48 object-cover border border-beige" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold serif">{item.name}</h3>
                <p className="text-gold text-[10px] font-black uppercase tracking-widest mt-2">{item.purity} {item.metal}</p>
                <div className="flex justify-between items-end mt-12">
                   <div className="flex items-center space-x-6 border border-beige px-4 py-2">
                     <button onClick={() => { const id = item.id ?? item._id; if (id) updateQty(id, -1); }}>-</button>
                     <span>{item.quantity}</span>
                     <button onClick={() => { const id = item.id ?? item._id; if (id) updateQty(id, 1); }}>+</button>
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-black">₹{(item.pricing.finalPrice * item.quantity).toLocaleString()}</div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-12 border border-beige h-fit sticky top-24">
          <h2 className="text-2xl font-bold serif border-b border-beige pb-6">Summary</h2>
          <div className="space-y-6 pt-6">
            <div className="flex justify-between font-black text-3xl serif border-t border-beige pt-8">
              <span>Payable</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} disabled={isOrdering} className="btn-gold w-full py-6 font-black uppercase tracking-widest text-[11px] shadow-2xl">
              {isOrdering ? 'Ordering...' : 'Confirm COD Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
