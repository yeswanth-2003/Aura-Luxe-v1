
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { MetalPriceModel } from '@/lib/models';

export async function GET() {
  await dbConnect();
  try {
    const rates = await MetalPriceModel.find({});
    return NextResponse.json(rates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { metal, purity, pricePerGram } = await request.json();
    const rate = await MetalPriceModel.findOneAndUpdate(
      { metal, purity } as any,
      { pricePerGram, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json(rate);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rates' }, { status: 400 });
  }
}
