
'use client';
import React, { useState, useEffect } from 'react';
import GiftConcierge from './GiftConcierge';
import { api } from '@/services/api';
import { ProductWithPrice } from '@/types';
import { useRouter } from 'next/navigation';

export default function GiftConciergeWrapper() {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.getAllProducts().then(setProducts);
  }, []);

  return <GiftConcierge 
    products={products} 
    onNavigateToProduct={(id) => router.push(`/product/${id}`)} 
  />;
}
