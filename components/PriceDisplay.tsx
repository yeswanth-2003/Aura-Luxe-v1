
import React from 'react';
import { CalculatedPrice } from '../types';

interface PriceDisplayProps {
  pricing: CalculatedPrice;
  isAdminView?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ pricing, isAdminView = false }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          ₹{pricing.finalPrice.toLocaleString('en-IN')}
        </span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">
          (Includes GST and all charges)
        </span>
      </div>
      
      {isAdminView && (
        <div className="text-[11px] text-gray-400 mt-2 grid grid-cols-2 gap-x-4 border-t border-dashed pt-2">
          <span>Metal: ₹{Math.round(pricing.basePrice)}</span>
          <span>Wastage: ₹{Math.round(pricing.wastage)}</span>
          <span>GST: ₹{Math.round(pricing.gst)}</span>
          <span>Sub: ₹{Math.round(pricing.subtotal)}</span>
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
