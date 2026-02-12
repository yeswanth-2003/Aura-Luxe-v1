
import dbConnect from '../lib/db';
import { MetalPriceModel } from '../lib/models';

export default async function handler(req: any, res: any) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        // Calling find() without an empty object literal to resolve environment-specific Query type mismatch
        const rates = await MetalPriceModel.find();
        res.status(200).json(rates);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const { metal, purity, pricePerGram } = req.body;
        // Cast filter to any to resolve issues where the environment expects a Query object instead of a filter object
        const rate = await MetalPriceModel.findOneAndUpdate(
          { metal, purity } as any,
          { pricePerGram, updatedAt: new Date() },
          { upsert: true, new: true }
        );
        res.status(200).json(rate);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
