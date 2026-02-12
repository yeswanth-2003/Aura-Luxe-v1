
/**
 * REUSABLE MONGODB SCHEMAS (Mongoose)
 * These can be moved to your server/models folder
 */

// Metal Price Schema
/*
const MetalPriceSchema = new mongoose.Schema({
  metal: { type: String, enum: ['silver', 'gold', 'platinum'], required: true },
  purity: { type: String, required: true },
  pricePerGram: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});
*/

// Product Schema
/*
const ProductSchema = new mongoose.Schema({
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
*/
