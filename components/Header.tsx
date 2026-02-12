
'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  cartCount: number;
  onNavigate?: (path: string) => void; // Added optional prop to fix TS mismatch
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-beige shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight serif">
          Aura<span className="text-gold">Luxe</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-widest font-bold text-gray-500">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-gold transition-colors">Collections</Link>
          <Link href="/admin" className="px-3 py-1 border border-beige rounded-full text-[9px] hover:border-gold hover:text-gold transition-all">Admin Panel</Link>
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;