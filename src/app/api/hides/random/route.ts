import { NextResponse } from 'next/server';
import { getHides, getHidesByBgId } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bgId = searchParams.get('bgId');
  
  let hides;
  if (bgId) {
    hides = await getHidesByBgId(bgId);
  } else {
    hides = await getHides();
  }
  
  // Filter out low quality hides (similarity < 30)
  const validHides = hides.filter(h => (h.similarityScore || 0) >= 30);
  
  if (validHides.length === 0) {
    return NextResponse.json({ success: false, error: 'No challenges available for this scene yet!' }, { status: 404 });
  }

  // Simple random selection
  const randomIndex = Math.floor(Math.random() * validHides.length);
  const randomHide = validHides[randomIndex];

  return NextResponse.json({ success: true, hide: randomHide });
}
