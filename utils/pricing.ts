
import { Product, MetalPrice, CalculatedPrice } from '../types';

/**
 * PRICING FORMULA (MANDATORY):
 * Base Price = metalPricePerGram × totalGrams
 * Wastage = Base Price × (wastagePercent / 100)
 * Subtotal = Base Price + Wastage + makingCharge + packagingCharge
 * GST = Subtotal × (gstPercent / 100)
 * Final Price = Subtotal + GST
 * Final price should be rounded to nearest rupee.
 */
export const calculateProductPrice = (product: Product, metalPrice: MetalPrice): CalculatedPrice => {
  const { totalGrams, charges } = product;
  const { pricePerGram } = metalPrice;

  const basePrice = pricePerGram * totalGrams;
  const wastage = basePrice * (charges.wastagePercent / 100);
  const subtotal = basePrice + wastage + charges.makingCharge + charges.packagingCharge;
  const gst = subtotal * (charges.gstPercent / 100);
  const finalPrice = Math.round(subtotal + gst);

  return {
    basePrice,
    wastage,
    subtotal,
    gst,
    finalPrice
  };
};
