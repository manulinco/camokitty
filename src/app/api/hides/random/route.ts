import { NextResponse } from 'next/server';
import { getHides } from '@/lib/db';

export async function GET() {
  const hides = getHides();
  
  // In a real app, we filter by is_public and sort by some metric.
  // For MVP, we just pick any hide that has been played at least once, 
  // or any hide if none have been played yet.
  
  if (hides.length === 0) {
    return NextResponse.json({ success: false, error: 'No challenges available in the global pool yet!' }, { status: 404 });
  }

  // Simple random selection
  const randomIndex = Math.floor(Math.random() * hides.length);
  const randomHide = hides[randomIndex];

  return NextResponse.json({ success: true, hide: randomHide });
}
