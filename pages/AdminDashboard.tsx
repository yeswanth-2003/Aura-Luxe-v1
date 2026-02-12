
import React, { useEffect, useState } from 'react';
import { ProductWithPrice, MetalPrice, MetalType, ProductImage, Order, OrderStatus } from '../types';
import { api } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [metalPrices, setMetalPrices] = useState<MetalPrice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'rates' | 'inventory' | 'orders'>('rates');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Rings',
    metal: 'silver' as MetalType,
    purity: '',
    totalGrams: 0,
    stock: 0,
    images: [] as ProductImage[],
    charges: {
      makingCharge: 200,
      wastagePercent: 3,
      packagingCharge: 50,
      gstPercent: 3
    }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, prices, ords] = await Promise.all([
        api.getAdminProducts(),
        api.getMetalPrices(),
        api.getOrders()
      ]);
      setProducts(prods);
      setMetalPrices(prices);
      setOrders(ords);
      
      // Sync initial purity
      if (!newProduct.purity && prices.length > 0) {
        const firstPurity = prices.find(p => p.metal === newProduct.metal)?.purity || prices[0].purity;
        setNewProduct(prev => ({ ...prev, purity: firstPurity }));
      }
    } catch (e) {
      console.error("Vault Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const defaultPuritiesFor = (metal: MetalType) => {
    if (metal === 'gold') return ['22kt', '18kt', '9kt'];
    if (metal === 'silver') return ['925 melting', '70 melting', '65 melting', '80 melting'];
    return ['Standard'];
  };

  const purityOptions: string[] = (() => {
    const found = metalPrices.filter(m => m.metal === newProduct.metal).map(p => p.purity);
    return found.length ? found : defaultPuritiesFor(newProduct.metal);
  })();

  const handleMetalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const metal = e.target.value as MetalType;
    const firstPurity = metalPrices.find(p => p.metal === metal)?.purity || defaultPuritiesFor(metal)[0] || '';
    setNewProduct({ ...newProduct, metal, purity: firstPurity });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.images.length === 0) return alert('At least one visual asset URL is mandatory.');
    if (!newProduct.purity) return alert('Select a hallmarked purity grade.');

    await api.addProduct(newProduct);
    
    setNewProduct({
      name: '', description: '', category: 'Rings', metal: 'silver', purity: '', totalGrams: 0, stock: 0, images: [],
      charges: { makingCharge: 200, wastagePercent: 3, packagingCharge: 50, gstPercent: 3 }
    });
    fetchData();
    alert('Boutique asset registered successfully.');
  };

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    await api.updateOrderStatus(id, status);
    fetchData();
  };

  if (loading) return (
    <div className="p-20 text-center font-bold serif text-gold flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-6"></div>
      Synchronizing Artisan Vault...
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFBF7]">
      {/* Mobile Control Bar */}
      <div className="md:hidden bg-gray-900 text-white p-5 flex justify-between items-center sticky top-16 z-30 border-t border-gray-800">
        <span className="serif font-bold text-gold tracking-widest text-sm">ADMIN COMMAND</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}/>
          </svg>
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:sticky top-0 md:top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-40 transition-transform duration-300
      `}>
        <div className="p-10 hidden md:block">
          <h1 className="text-xl font-bold serif text-gold">Aura Luxe</h1>
          <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mt-2 font-black">Management Suite</p>
        </div>
        
        <nav className="p-6 space-y-3 flex-grow overflow-y-auto">
          <button 
            onClick={() => { setActiveTab('rates'); setIsSidebarOpen(false); }} 
            className={`w-full text-left p-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] transition-all border-l-2 ${activeTab === 'rates' ? 'bg-gold/10 border-gold text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Market Bullion
          </button>
          <button 
            onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} 
            className={`w-full text-left p-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] transition-all border-l-2 ${activeTab === 'inventory' ? 'bg-gold/10 border-gold text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Catalogue Assets
          </button>
          <button 
            onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} 
            className={`w-full text-left p-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] transition-all border-l-2 ${activeTab === 'orders' ? 'bg-gold/10 border-gold text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Fulfillment Log
          </button>
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={() => { api.logout(); window.location.reload(); }} 
            className="w-full text-center p-4 text-[9px] font-bold uppercase tracking-widest text-red-400 bg-red-400/5 rounded-sm hover:bg-red-400/10"
          >
            Revoke Access
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-grow p-6 md:p-14 overflow-hidden">
        {activeTab === 'rates' && (
          <div className="bg-white p-8 md:p-12 border border-beige shadow-sm rounded-sm animate-fadeIn">
            <h2 className="text-3xl font-bold serif mb-6 text-gray-900 border-b border-beige pb-6">Daily Market Valuation</h2>

            <div className="mb-6 text-sm text-gray-500">Update market bullion prices here. Enter price per gram (INR) and tab out or click Update.</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {metalPrices.map((m, i) => (
                <div key={`${m.metal}-${m.purity}-${i}`} className="p-6 border border-beige bg-[#FDFBF7] shadow-sm">
                  <div className="text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-4 flex justify-between">
                    <span>{m.metal}</span>
                    <span className="opacity-50">{m.purity}</span>
                  </div>
                  <div className="flex items-center space-x-3 font-bold text-3xl text-gray-900">
                    <span className="text-gray-300 font-light text-xl">₹</span>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={m.pricePerGram}
                      onBlur={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v)) {
                          api.updateMetalPrice(m.metal as any, m.purity, v).then(() => fetchData());
                        }
                      }}
                      className="bg-transparent border-b border-transparent focus:border-gold outline-none w-full font-bold tracking-tight py-1"
                    />
                    <span className="text-[9px] text-gray-400 font-black tracking-widest uppercase">/gram</span>
                  </div>
                  <p className="mt-4 text-[10px] text-gray-400">Last updated: {m.updatedAt ? new Date(m.updatedAt).toLocaleString() : '—'}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#FBF9F4] p-6 border border-beige rounded-sm">
              <h3 className="text-lg font-bold mb-4">Add / Seed New Rate</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <select id="new-metal" className="p-3 border border-beige bg-white" defaultValue="gold">
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="platinum">Platinum</option>
                </select>
                <select id="new-purity" className="p-3 border border-beige bg-white" defaultValue="">
                  <option value="" disabled>Select purity</option>
                  <optgroup label="Gold (Hallmarked)">
                    <option value="22kt">22kt Hallmarked</option>
                    <option value="18kt">18kt Hallmarked</option>
                    <option value="9kt">9kt Hallmarked</option>
                  </optgroup>
                  <optgroup label="Silver (Melting)">
                    <option value="925 melting">925 melting</option>
                    <option value="70 melting">70 melting</option>
                    <option value="65 melting">65 melting</option>
                    <option value="80 melting">80 melting</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="custom">Other / Custom</option>
                  </optgroup>
                </select>
                <input id="new-price" type="number" step="0.1" placeholder="Price per gram" className="p-3 border border-beige bg-white" />
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    const metalEl = document.getElementById('new-metal') as HTMLSelectElement | null;
                    const purityEl = document.getElementById('new-purity') as HTMLInputElement | null;
                    const priceEl = document.getElementById('new-price') as HTMLInputElement | null;
                    const metal = metalEl?.value as any;
                    const purity = purityEl?.value?.trim();
                    const price = priceEl ? parseFloat(priceEl.value) : NaN;
                    if (!purity) return alert('Enter a purity label.');
                    if (isNaN(price)) return alert('Enter a valid price.');
                    api.updateMetalPrice(metal, purity, price).then(() => {
                      fetchData();
                      if (purityEl) purityEl.value = '';
                      if (priceEl) priceEl.value = '';
                    }).catch(() => alert('Failed to save rate'));
                  }}
                  className="mt-2 bg-gold text-white px-6 py-3 font-bold uppercase tracking-[0.2em] rounded-sm"
                >
                  Add / Update Rate
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="bg-white p-8 md:p-12 border border-beige shadow-sm rounded-sm">
              <h2 className="text-3xl font-bold serif mb-10 border-b border-beige pb-6">Asset Registration</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Design ID/Name</label>
                  <input className="p-4 border border-beige focus:border-gold outline-none bg-[#FDFBF7] text-sm" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required placeholder="e.g. Royal Lattice Ring" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Base Metal</label>
                  <select className="p-4 border border-beige focus:border-gold outline-none bg-[#FDFBF7] text-sm cursor-pointer" value={newProduct.metal} onChange={handleMetalChange}>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Purity Grade</label>
                  <select 
                    className="p-4 border border-beige focus:border-gold outline-none bg-[#FDFBF7] text-sm cursor-pointer" 
                    value={newProduct.purity} 
                    onChange={(e) => setNewProduct({...newProduct, purity: e.target.value})} 
                    required
                  >
                    {purityOptions.map((p) => (
                      <option key={p} value={p}>{p.includes('melting') ? p : `${p} Hallmarked`}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Initial Stock</label>
                  <input type="number" className="p-4 border border-beige focus:border-gold outline-none bg-[#FDFBF7] text-sm" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} required />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Net Gram Weight</label>
                  <input type="number" step="0.01" className="p-4 border border-beige focus:border-gold outline-none bg-[#FDFBF7] text-sm" value={newProduct.totalGrams} onChange={(e) => setNewProduct({...newProduct, totalGrams: parseFloat(e.target.value) || 0})} required />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Category Tag</label>
                  <input className="p-4 border border-beige focus:border-gold outline-none bg-[#FDFBF7] text-sm" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required />
                </div>
                <div className="md:col-span-3 flex flex-col gap-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Master Asset Image URL</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input className="flex-1 p-4 border border-beige outline-none bg-[#FDFBF7] text-sm" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="https://unsplash.com/..." />
                    <button type="button" onClick={() => { if(imageUrlInput.trim()){ setNewProduct({...newProduct, images: [...newProduct.images, { url: imageUrlInput, alt: newProduct.name }]}); setImageUrlInput(''); } }} className="bg-gold text-white px-10 py-4 font-bold uppercase text-[9px] tracking-[0.2em] shadow-lg">Attach Image</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {newProduct.images.map((img, i) => (
                      <div key={i} className="bg-gold/10 px-3 py-1 text-[8px] font-bold text-gold border border-gold/20 flex items-center gap-3">
                        Asset Link #{i+1}
                        <button type="button" className="text-red-400 text-lg leading-none" onClick={() => setNewProduct(p => ({...p, images: p.images.filter((_, idx) => idx !== i)}))}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="md:col-span-3 bg-gray-900 text-white py-6 font-bold uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:bg-black transition-all">Submit to Ledger</button>
              </form>
            </div>

            <div className="bg-white border border-beige shadow-sm overflow-x-auto rounded-sm">
              <table className="w-full text-left text-[11px] uppercase tracking-[0.2em] min-w-[800px]">
                <thead className="bg-[#F9F6F1] border-b border-beige">
                  <tr className="text-gray-400 font-black">
                    <th className="p-8">Asset Profile</th>
                    <th className="p-8">Purity</th>
                    <th className="p-8">Inventory</th>
                    <th className="p-8 text-right">Visibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige text-gray-700 font-bold">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-[#FDFBF7] transition-all group">
                      <td className="p-8 flex items-center gap-6">
                        <img src={p.images[0]?.url} className="w-14 h-14 object-cover rounded-sm border border-beige shadow-sm" /> 
                        <div>
                          <span className="font-bold serif normal-case text-lg text-gray-900 block mb-1">{p.name}</span>
                          <span className="text-[9px] text-gray-400">{p.totalGrams}g Weight</span>
                        </div>
                      </td>
                      <td className="p-8"><span className="text-gold">{p.purity}</span> {p.metal}</td>
                      <td className="p-8">
                        <input 
                          type="number" 
                          defaultValue={p.stock} 
                          onBlur={(e) => api.updateStock(p.id, parseInt(e.target.value)).then(fetchData)} 
                          className={`w-24 p-3 border focus:border-gold outline-none text-center ${p.stock < 5 ? 'border-red-300 bg-red-50 text-red-700 font-black' : 'border-beige bg-white'}`} 
                        />
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => api.toggleProduct(p.id).then(fetchData)} 
                          className={`px-6 py-2 border rounded-full font-black text-[8px] tracking-[0.3em] uppercase transition-all ${p.isActive ? 'border-green-100 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400 bg-gray-50'}`}
                        >
                          {p.isActive ? 'Live' : 'Archived'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-10 animate-fadeIn">
            <h2 className="text-3xl font-bold serif mb-10 border-b border-beige pb-6">Transactional Ledger</h2>
            {orders.length === 0 ? (
              <div className="bg-white p-32 text-center border-2 border-dashed border-beige text-gray-400 italic rounded-sm serif text-xl shadow-inner">
                The vault ledger is currently clean. No active orders.
              </div>
            ) : (
              <div className="space-y-10">
                {orders.slice().reverse().map(order => (
                  <div key={order.id} className="bg-white border border-beige p-8 md:p-14 shadow-sm rounded-sm transition-all hover:border-gold group">
                    <div className="flex flex-col lg:flex-row justify-between mb-12 gap-8 items-start">
                      <div>
                        <div className="flex items-center gap-6 mb-4">
                          <h3 className="text-2xl font-bold serif text-gray-900 tracking-tight">{order.id}</h3>
                          <span className={`text-[10px] font-black bg-gold/10 text-gold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-gold/20 shadow-sm`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-3">
                          {order.customerName} <span className="mx-2 text-beige">|</span> {order.phone}
                        </p>
                      </div>
                      <div className="text-left lg:text-right border-t lg:border-t-0 pt-8 lg:pt-0 border-beige w-full lg:w-auto">
                        <div className="text-4xl font-black text-gray-900 tracking-tighter mb-4">₹{order.total.toLocaleString('en-IN')}</div>
                        <div className="flex flex-wrap gap-4 lg:justify-end">
                          <button className="text-[10px] font-black text-gold uppercase underline tracking-[0.2em] flex items-center gap-2 group-hover:opacity-80">
                            Print Shipping Manifest
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pt-12 border-t border-beige">
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Delivery Coord</h4>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium italic bg-[#FDFBF7] p-5 border border-beige rounded-sm">
                          {order.address}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Cart Profile</h4>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] font-bold text-gray-800 border-b border-beige pb-3">
                            <span className="flex items-center gap-3">
                              <span className="text-gold font-black">x{item.quantity}</span> 
                              {item.name}
                            </span>
                            <span className="text-gray-400">₹{(item.pricing.finalPrice * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Asset Movement</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {(['Pending', 'Packed', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map(status => (
                            <button 
                              key={status} 
                              onClick={() => handleUpdateStatus(order.id, status)} 
                              className={`px-4 py-4 text-[9px] font-black uppercase tracking-[0.3em] border transition-all rounded-sm shadow-sm ${order.status === status ? 'bg-gray-900 text-white border-gray-900 scale-[1.02] shadow-xl' : 'bg-white text-gray-400 border-beige hover:border-gold hover:text-gold'}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
