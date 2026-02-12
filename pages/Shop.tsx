
import React, { useEffect, useState } from 'react';
import { ProductWithPrice } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

interface ShopProps {
  onProductClick: (id: string) => void;
}

const Shop: React.FC<ShopProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase mb-2 block">Our Boutique</span>
          <h1 className="text-5xl font-bold text-gray-900 serif">The Collection</h1>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white border border-beige px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Live Market Bullion Rates Applied</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-32 bg-white border-2 border-dashed border-beige">
          <p className="text-gray-400 serif text-xl italic">Our vault is currently being replenished. Please return soon.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;