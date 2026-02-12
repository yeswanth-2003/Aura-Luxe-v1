
'use client';
import React, { useEffect, useState } from 'react';
import { ProductWithPrice } from '@/types';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithPrice[]>([]);

  useEffect(() => {
    api.getAllProducts().then(data => setFeaturedProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="flex flex-col">
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
            <span className="text-[11px] font-black tracking-[0.4em] text-gold uppercase mb-6 block">Spring Equinox 2024</span>
            <h1 className="text-5xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight serif tracking-tighter">
              Timeless <br /> <span className="italic text-gold">Radiance</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-600 mb-12 max-w-md leading-relaxed font-medium">
              Handcrafted ethically sourced silver and gold masterpieces for heritage artistry lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/shop"
                className="btn-gold px-12 py-5 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all text-center"
              >
                Enter Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-[10px] font-black tracking-[0.3em] text-gold uppercase mb-2 block">Curation</span>
            <h2 className="text-4xl md:text-5xl font-bold serif text-gray-900">The Editor's Vault</h2>
          </div>
          <Link href="/shop" className="text-[10px] font-black border-b-2 border-gold pb-1 text-gold uppercase tracking-[0.3em] hover:opacity-70 transition-all">Explore Entire Ledger</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.map(p => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
