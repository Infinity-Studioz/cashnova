// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('cashnova_db');
    
    await db.command({ ping: 1 });

    return NextResponse.json({ message: 'Connected to MongoDB!' });
  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}
