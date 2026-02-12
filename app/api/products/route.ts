
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ProductModel } from '@/lib/models';

export async function GET() {
  await dbConnect();
  try {
    const products = await ProductModel.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const product = await ProductModel.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 400 });
  }
}
