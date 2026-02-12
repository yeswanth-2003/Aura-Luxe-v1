
import dbConnect from '../lib/db';
import { ProductModel } from '../lib/models';

export default async function handler(req: any, res: any) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        // Calling find() without an empty object literal to bypass Query type mismatch errors in strict environments
        const products = await ProductModel.find();
        res.status(200).json(products);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const product = await ProductModel.create(req.body);
        res.status(201).json(product);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
