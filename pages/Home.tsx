
import React, { useEffect, useState } from 'react';
import { ProductWithPrice } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  onNavigate: (path: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithPrice[]>([]);

  useEffect(() => {
    api.getAllProducts().then(data => setFeaturedProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Primary Hero Section */}
      <section className="relative min-h-[70vh] md:h-[85vh] bg-[#F9F6F1] flex items-center overflow-hidden py-16 md:py-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            alt="Jewellery Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl text-left">
            <span className="text-[11px] font-black tracking-[0.4em] text-gold uppercase mb-6 block drop-shadow-sm">Spring Equinox 2024</span>
            <h1 className="text-5xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight serif tracking-tighter">
              Timeless <br /> <span className="italic text-gold">Radiance</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-600 mb-12 max-w-md leading-relaxed font-medium">
              Discover ethically sourced silver and gold masterpieces, handcrafted for those who appreciate the finer details of heritage artistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('shop')}
                className="btn-gold px-12 py-5 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all"
              >
                Enter Boutique
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banners */}
      <section className="bg-white py-16 border-b border-beige">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-gold font-bold serif text-2xl">Purity Assurance</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Gold: 22kt / 18kt / 9kt — Silver: 925 / 80 / 70 / 65 melting</p>
          </div>
          <div className="space-y-2 md:border-x md:border-beige px-4">
            <div className="text-gold font-bold serif text-2xl">Live Valuation</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Gram-weight Market Index</p>
          </div>
          <div className="space-y-2 sm:col-span-2 md:col-span-1">
            <div className="text-gold font-bold serif text-2xl">Verified Bullion</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">BIS Certified Fine Gold</p>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-[10px] font-black tracking-[0.3em] text-gold uppercase mb-2 block">Curation</span>
            <h2 className="text-4xl md:text-5xl font-bold serif text-gray-900">The Editor's Vault</h2>
          </div>
          <button onClick={() => onNavigate('shop')} className="text-[10px] font-black border-b-2 border-gold pb-1 text-gold uppercase tracking-[0.3em] hover:opacity-70 transition-all">Explore Entire Ledger</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promotional Split Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 max-w-7xl mx-auto mb-24">
        <div className="relative h-[400px] md:h-[600px] group overflow-hidden cursor-pointer rounded-sm shadow-xl">
          <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Silver Collection" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8 text-center">
            <h3 className="text-4xl md:text-5xl font-bold serif mb-4">Silver Heritage</h3>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] mb-10 opacity-90">Artisanal Melting Tech</p>
            <button className="border-2 border-white/80 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-lg" onClick={() => onNavigate('shop')}>Explore Silver</button>
          </div>
        </div>
        <div className="relative h-[400px] md:h-[600px] group overflow-hidden cursor-pointer rounded-sm shadow-xl">
          <img src="https://images.unsplash.com/photo-1599643478123-55d410724810?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Gold Collection" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8 text-center">
            <h3 className="text-4xl md:text-5xl font-bold serif mb-4">The Gold Gallery</h3>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] mb-10 opacity-90">Investment Grade Fine Gold</p>
            <button className="border-2 border-white/80 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-lg" onClick={() => onNavigate('shop')}>Discover Gold</button>
          </div>
        </div>
      </section>

      {/* Security Protocol Banner */}
      <section className="bg-stone-100 py-24 mb-24 text-center px-4 border-y border-beige">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block p-6 rounded-full bg-white mb-8 shadow-inner border border-beige">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold serif mb-6 text-gray-900">Security & Authenticity Protocol</h2>
          <p className="text-gray-500 text-sm md:text-base leading-loose mb-10 font-medium max-w-2xl mx-auto italic">
            "We prioritize the integrity of our craftsmanship. To ensure the highest standard of delivery verification, an <strong>uncut unboxing video</strong> starting from the sealed outer package is mandatory for all claims."
          </p>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold underline underline-offset-8 cursor-pointer hover:opacity-70 transition-all">Read Fulfillment Ethics</div>
        </div>
      </section>
    </div>
  );
};

export default Home;