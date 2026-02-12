
'use client';
import React from 'react';
import { ProductWithPrice } from '../types';
import PriceDisplay from './PriceDisplay';
import Link from 'next/link';

interface ProductCardProps {
  product: ProductWithPrice;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const id = product.id || product._id;
  return (
    <Link 
      href={`/product/${id}`}
      className="group cursor-pointer bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-beige flex flex-col h-full text-left"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <img 
          src={product.images[0]?.url} 
          alt={product.images[0]?.alt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-gold border border-gold/20 shadow-sm">
          {product.purity} {product.metal}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow text-center">
        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-widest font-bold">{product.category}</p>
        <h3 className="text-gray-900 font-bold serif text-lg mb-3 line-clamp-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto border-t border-beige pt-4">
          <PriceDisplay pricing={product.pricing} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
