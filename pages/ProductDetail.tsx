
import React, { useEffect, useState } from 'react';
import { ProductWithPrice } from '../types';
import { api } from '../services/api';
import ImageGallery from '../components/ImageGallery';
import PriceDisplay from '../components/PriceDisplay';

interface ProductDetailProps {
  productId: string;
  onAddToCart: (product: ProductWithPrice) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onAddToCart }) => {
  const [product, setProduct] = useState<ProductWithPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProductById(productId).then(data => {
      setProduct(data);
      setLoading(false);
    });
  }, [productId]);

  if (loading) return (
    <div className="p-20 text-center text-gold serif italic flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-6"></div>
      Accessing Product Vault...
    </div>
  );
  
  if (!product) return (
    <div className="p-20 text-center text-gray-500 serif italic flex flex-col items-center gap-6">
      <h2 className="text-3xl font-bold">Piece Not Found</h2>
      <p className="max-w-md">This specific creation is currently unavailable in our active ledger.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-20 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left: Gallery Section */}
        <div className="w-full">
          <ImageGallery images={product.images} />
        </div>

        {/* Right: Product Details Section */}
        <div className="flex flex-col">
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
            
            <div className="ml-auto sm:ml-0">
              {product.stock <= 0 ? (
                <span className="bg-red-50 text-red-500 text-[9px] font-black uppercase px-4 py-1.5 rounded-sm tracking-[0.2em] border border-red-100">Out of Stock</span>
              ) : product.stock < 5 ? (
                <span className="bg-amber-50 text-amber-600 text-[9px] font-black uppercase px-4 py-1.5 rounded-sm tracking-[0.2em] border border-amber-100 animate-pulse">Rare: Only {product.stock} Left!</span>
              ) : (
                <span className="text-green-600 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> In Stock
                </span>
              )}
            </div>
          </div>

          <div className="mb-12 p-8 md:p-12 bg-white border border-beige shadow-xl rounded-sm group transition-all hover:border-gold">
            <PriceDisplay pricing={product.pricing} />
            <div className="mt-8 text-[10px] text-gray-400 leading-relaxed font-black uppercase tracking-[0.3em] border-t border-beige pt-6">
              * Live valuation via real-time market index
            </div>
          </div>

          <div className="space-y-6 mb-16">
            <button 
              onClick={() => onAddToCart(product)}
              disabled={product.stock <= 0}
              className={`w-full py-6 rounded-sm font-black shadow-2xl tracking-[0.4em] uppercase text-[11px] transition-all duration-500 transform ${
                product.stock > 0 
                ? 'bg-gray-900 text-white hover:bg-black hover:scale-[1.02]' 
                : 'bg-stone-100 text-gray-400 cursor-not-allowed grayscale'
              }`}
            >
              {product.stock > 0 ? 'Reserve for Purchase' : 'Temporarily Vaulted'}
            </button>
            
            <div className="bg-[#FAF7F2] p-8 border-l-4 border-gold text-[10px] text-gray-700 leading-relaxed italic rounded-sm shadow-inner">
              <span className="font-black text-gray-900 uppercase tracking-widest block mb-2 not-italic">Delivery Ethics & Security</span>
              Every Aura Luxe creation is dispatched in a high-security tamper-proof seal. A continuous unboxing video starting from the sealed package is mandatory for transit-related claims.
            </div>
          </div>

          <div className="border-t border-beige pt-12 space-y-12">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gold mb-6">The Craftsmanship</h3>
              <p className="text-gray-600 leading-[2] text-sm font-medium">
                {product.description || "Designed for the sophisticated minimalist, this piece is meticulously handcrafted using age-old hallmarking techniques. Each curve is hand-polished to ensure a lifetime of brilliance and heirloom-quality durability."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 border border-beige bg-white text-center rounded-sm transition-colors hover:bg-luxury">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Purity Status</div>
                <div className="text-[11px] font-black text-gray-900 tracking-widest">{product.purity.includes('melting') ? product.purity : `${product.purity} BIS Hallmarked`}</div>
              </div>
              <div className="p-6 border border-beige bg-white text-center rounded-sm transition-colors hover:bg-luxury">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Transit Mode</div>
                <div className="text-[11px] font-black text-gray-900 tracking-widest">Insured Express</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
