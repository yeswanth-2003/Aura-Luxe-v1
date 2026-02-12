
import React, { useState } from 'react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onNavigate: (path: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQty, onNavigate }) => {
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '' });
  const [isOrdering, setIsOrdering] = useState(false);
  
  const total = items.reduce((sum, item) => sum + (item.pricing.finalPrice * item.quantity), 0);

  const handleCheckout = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      return alert('Please provide your name, phone number, and delivery address to complete your order.');
    }

    // Check stock availability before finalizing
    for (const item of items) {
      if (item.stock < item.quantity) {
        return alert(`Apologies, only ${item.stock} units of "${item.name}" are available in our vault.`);
      }
    }

    setIsOrdering(true);
    try {
      await api.placeOrder({
        customerName: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        items: items,
        total: total
      });

      alert('Order Confirmed! Your handcrafted masterpiece is being prepared for secure transit.');
      window.location.reload(); 
    } catch (e) {
      alert('Vault synchronization failed. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center animate-fadeIn">
        <div className="mb-10 inline-block p-12 bg-white rounded-full shadow-inner border border-beige">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gold opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold serif mb-6">Your Bag is Empty</h2>
        <p className="text-gray-500 mb-12 font-medium leading-relaxed max-w-sm mx-auto italic">True elegance is found in the choices we make. Begin your personal collection today.</p>
        <button 
          onClick={() => onNavigate('shop')}
          className="btn-gold px-14 py-5 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-bold serif mb-12 md:mb-16 text-gray-900">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20 items-start">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-8">
            {items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-8 border-b border-beige pb-10 transition-all hover:opacity-90">
                <div className="w-full sm:w-40 h-48 sm:h-40 rounded-sm overflow-hidden flex-shrink-0 border border-beige shadow-sm">
                  <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-2xl serif text-gray-900 tracking-tight">{item.name}</h3>
                    <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-6 inline-flex items-center gap-2">
                    <span className="bg-gold/10 px-2 py-0.5 rounded-sm">{item.purity} {item.metal}</span>
                    <span className="text-gray-300">•</span>
                    <span>{item.totalGrams}g Weight</span>
                  </p>
                  <div className="flex flex-wrap justify-between items-end gap-6 mt-auto">
                    <div className="flex items-center space-x-8 border border-beige rounded-sm px-6 py-3 bg-white shadow-sm">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="text-gray-400 hover:text-gold font-black text-lg transition-colors">-</button>
                      <span className="font-black text-sm w-6 text-center text-gray-900">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="text-gray-400 hover:text-gold font-black text-lg transition-colors">+</button>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900 tracking-tighter">₹{(item.pricing.finalPrice * item.quantity).toLocaleString('en-IN')}</div>
                      <div className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-1">Valuation Total</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Specification Form */}
          <div className="bg-white p-6 md:p-12 border border-beige shadow-sm rounded-sm mt-12 animate-slideUp">
            <h2 className="text-2xl font-bold serif border-b border-beige pb-6 mb-8">Delivery Specification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Full Name</label>
                <input 
                  type="text" 
                  className="p-4 border border-beige focus:border-gold outline-none bg-luxury transition-all text-sm font-medium" 
                  value={shippingInfo.name} 
                  onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})} 
                  placeholder="e.g. Aditi Sharma"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Contact Tel</label>
                <input 
                  type="tel" 
                  className="p-4 border border-beige focus:border-gold outline-none bg-luxury transition-all text-sm font-medium" 
                  value={shippingInfo.phone} 
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} 
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-3">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Secure Shipping Address</label>
                <textarea 
                  className="p-4 border border-beige focus:border-gold outline-none bg-luxury transition-all text-sm font-medium h-32 resize-none" 
                  value={shippingInfo.address} 
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} 
                  placeholder="Building No, Street, Landmark, Pincode"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Order Summary */}
        <div className="bg-white p-8 md:p-12 border border-beige shadow-2xl h-fit space-y-10 sticky top-24 rounded-sm animate-slideUp">
          <h2 className="text-2xl font-bold serif border-b border-beige pb-6">Final Summary</h2>
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Collection Total</span>
              <span className="font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Boutique Shipping</span>
              <span className="text-gold font-black tracking-widest uppercase text-[10px]">Complimentary</span>
            </div>
            <div className="flex justify-between text-3xl font-black pt-8 border-t border-beige text-gray-900 serif tracking-tighter">
              <span>Payable</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className="bg-[#FAF7F2] p-6 border-l-4 border-gold text-[10px] text-gray-600 leading-relaxed italic space-y-3 rounded-sm">
            <p className="font-black uppercase tracking-widest text-gray-900 not-italic">Payment & Security</p>
            <p><strong>Method:</strong> Cash on Delivery (COD) Only.</p>
            <p><strong>Integrity:</strong> By finalizing this order, you acknowledge the mandatory unboxing video requirement for all transit-related claims.</p>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isOrdering}
            className={`btn-gold w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all duration-500 ${isOrdering ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
          >
            {isOrdering ? 'Processing Order...' : 'Confirm COD Checkout'}
          </button>
          
          <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest font-bold">Secure SSL Encryption applied</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
