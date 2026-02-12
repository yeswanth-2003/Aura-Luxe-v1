
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { OrderModel, ProductModel } from '@/lib/models';

export async function GET() {
  await dbConnect();
  try {
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { items, ...orderData } = body;
    
    // Decrement stock
    for (const item of items) {
      await ProductModel.findByIdAndUpdate(item.id || item._id, { $inc: { stock: -item.quantity } });
    }

    const order = await OrderModel.create({
      ...orderData,
      id: 'AL-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      items,
      status: 'Pending'
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to place order' }, { status: 400 });
  }
}
