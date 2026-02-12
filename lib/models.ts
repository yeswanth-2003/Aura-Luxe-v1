
import mongoose, { Schema, model, models, Model } from 'mongoose';

// Metal Price Schema
const MetalPriceSchema = new Schema({
  metal: { type: String, enum: ['silver', 'gold', 'platinum'], required: true },
  purity: { type: String, required: true },
  pricePerGram: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  metal: { type: String, enum: ['silver', 'gold', 'platinum'], required: true },
  purity: { type: String, required: true },
  totalGrams: { type: Number, required: true },
  images: [{
    url: { type: String, required: true },
    alt: { type: String }
  }],
  charges: {
    makingCharge: { type: Number, default: 0 },
    wastagePercent: { type: Number, default: 0 },
    packagingCharge: { type: Number, default: 0 },
    gstPercent: { type: Number, default: 3 }
  },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Order Schema
const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [Schema.Types.Mixed], // Stores the product snapshots with price
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Packed', 'Out for Delivery', 'Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// Use explicit Model<any> typing to resolve TypeScript environment-specific method signature issues
export const MetalPriceModel: Model<any> = models.MetalPrice || model('MetalPrice', MetalPriceSchema);
export const ProductModel: Model<any> = models.Product || model('Product', ProductSchema);
export const OrderModel: Model<any> = models.Order || model('Order', OrderSchema);
