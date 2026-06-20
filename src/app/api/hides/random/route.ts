import { NextResponse } from 'next/server';
import { getHides } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bgId = searchParams.get('bgId');
  
  let hides = getHides();
  
  if (bgId) {
    hides = hides.filter(h => h.bgId === bgId);
  }
  
  if (hides.length === 0) {
    return NextResponse.json({ success: false, error: 'No challenges available for this scene yet!' }, { status: 404 });
  }

  // Simple random selection
  const randomIndex = Math.floor(Math.random() * hides.length);
  const randomHide = hides[randomIndex];

  return NextResponse.json({ success: true, hide: randomHide });
}
