import { NextResponse } from 'next/server';
import { listObjects } from '../../../../lib/oracle/bucket/config';

// Método GET
export async function GET() {
  const response = await listObjects();
  return NextResponse.json({ message: response });
}
