
'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductWithPrice } from '@/types';
import { api } from '@/services/api';
import ImageGallery from '@/components/ImageGallery';
import PriceDisplay from '@/components/PriceDisplay';
import { useCart } from '@/lib/useCart';

export default function ProductDetailPage() {
  const params = useParams() as { id?: string | string[] } | null;
  const id = params ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
  const [product, setProduct] = useState<ProductWithPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      api.getProductById(id as string).then(data => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return (
    <div className="p-20 text-center text-gold serif italic flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-6"></div>
      Accessing Product Vault...
    </div>
  );
  
  if (!product) return <div className="p-20 text-center serif italic">Piece Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <ImageGallery images={product.images} />
        <div className="flex flex-col text-left">
          <nav className="text-[10px] text-gray-400 mb-8 uppercase tracking-[0.4em] font-black flex items-center gap-2 border-b border-beige pb-4 w-fit">
            Boutique / {product.category} / {product.name}
          </nav>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] serif tracking-tight">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold bg-gold/5 px-5 py-2 border border-gold/20 rounded-full shadow-sm">
              {product.purity} {product.metal}
            </span>
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-l border-beige pl-4">
              {product.totalGrams}g Gram Weight
            </span>
          </div>

          <div className="mb-12 p-8 md:p-12 bg-white border border-beige shadow-xl rounded-sm">
            <PriceDisplay pricing={product.pricing} />
            <div className="mt-8 text-[10px] text-gray-400 leading-relaxed font-black uppercase tracking-[0.3em] border-t border-beige pt-6">
              * Live valuation via real-time market index
            </div>
          </div>

          <button 
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className={`w-full py-6 rounded-sm font-black shadow-2xl tracking-[0.4em] uppercase text-[11px] transition-all duration-500 ${
              product.stock > 0 
              ? 'bg-gray-900 text-white hover:bg-black hover:scale-[1.02]' 
              : 'bg-stone-100 text-gray-400 cursor-not-allowed grayscale'
            }`}
          >
            {product.stock > 0 ? 'Reserve for Purchase' : 'Temporarily Vaulted'}
          </button>
        </div>
      </div>
    </div>
  );
}
