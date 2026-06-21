import { NextResponse } from 'next/server';
import { getHides, getHidesByBgId } from '@/lib/db';
import { BACKGROUNDS } from '@/lib/levels';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bgId = searchParams.get('bgId');
  
  let hides;
  if (bgId) {
    hides = await getHidesByBgId(bgId);
  } else {
    hides = await getHides();
  }
  
  // Filter out low quality hides (similarity < 30) and ensure the background still exists in our active list
  const validBgIds = BACKGROUNDS.map(b => b.id);
  const validHides = hides.filter(h => (h.similarityScore || 0) >= 30 && validBgIds.includes(h.bgId || ''));
  
  if (validHides.length === 0) {
    return NextResponse.json({ success: false, error: 'No challenges available for this scene yet!' }, { status: 404 });
  }

  // Simple random selection
  const randomIndex = Math.floor(Math.random() * validHides.length);
  const randomHide = validHides[randomIndex];

  return NextResponse.json({ success: true, hide: randomHide });
}
