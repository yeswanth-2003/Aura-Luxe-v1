
import dbConnect from '../lib/db';
import { OrderModel, ProductModel } from '../lib/models';

export default async function handler(req: any, res: any) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        // Adjust find() call to resolve Query type mismatch error in current environment
        const orders = await OrderModel.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const { items, ...orderData } = req.body;
        
        // Atomic stock decrement
        for (const item of items) {
          // Provide 3 arguments to findByIdAndUpdate as required by the current TypeScript definitions
          await ProductModel.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } }, { new: true });
        }

        const order = await OrderModel.create({
          ...orderData,
          id: 'AL-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          items,
          status: 'Pending'
        });
        res.status(201).json(order);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
