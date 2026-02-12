
"use client";
import React from 'react';

interface FooterProps {
  onNavigate?: (path: string) => void; // Made optional to support layouts without path state
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-beige pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold serif text-gray-900">Aura<span className="text-gold">Luxe</span></h3>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Curating high-end jewellery collections with absolute transparency and unmatched craftsmanship. Based in the heart of Indian tradition.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Navigation</h4>
            <ul className="text-xs text-gray-500 space-y-4 font-medium uppercase tracking-widest">
              <li className="hover:text-gold cursor-pointer transition-colors" onClick={() => onNavigate?.('shop')}>All Collections</li>
              <li className="hover:text-gold cursor-pointer transition-colors" onClick={() => onNavigate?.('home')}>Our Heritage</li>
              <li className="hover:text-gold cursor-pointer transition-colors" onClick={() => onNavigate?.('admin')}>Secure Vault Access</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Concierge</h4>
            <ul className="text-xs text-gray-500 space-y-4 font-medium uppercase tracking-widest">
              <li className="hover:text-gold cursor-pointer transition-colors">Shipping Policy</li>
              <li className="hover:text-gold cursor-pointer transition-colors font-bold text-gray-700 underline underline-offset-4 decoration-gold">Unboxing Video Requirement</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Purity Certifications</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Insider Access</h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Join our private circle for early access to limited edition drops.</p>
            <div className="flex border-b border-beige">
              <input suppressHydrationWarning type="email" placeholder="YOUR EMAIL" className="bg-transparent py-2 w-full text-[10px] tracking-widest focus:outline-none" />
              <button suppressHydrationWarning className="text-gold font-bold text-[10px] tracking-widest uppercase">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-beige flex flex-col md:flex-row justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          <p>© 2024 Aura Luxe Fine Jewellery Pvt. Ltd.</p>
          <div className="flex space-x-12 mt-6 md:mt-0">
            <span className="text-gold">Hallmarked Brilliance</span>
            <span>Ethically Sourced</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;