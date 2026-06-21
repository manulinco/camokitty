import { NextResponse, NextRequest } from 'next/server';
import { saveHide, getHideById, HideEntry, recordSeekAttempt } from '@/lib/db';
import crypto from 'crypto';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const { paintData, bgId, poseId, rotation, rotationX, rotationY, scale, posLeft, posTop, simScore } = body;
    
    if (!paintData) {
      return NextResponse.json({ success: false, error: 'Missing paintData' }, { status: 400 });
    }

    const shortCode = crypto.randomBytes(2).toString('hex'); // 4 chars
    const bgName = bgId ? bgId.replace('bg-', '') : 'camo';
    const newId = `${bgName}-${shortCode}`;
    
    // Upload paintData to R2
    const { env } = await getCloudflareContext();
    const r2 = (env as any).CAMO_IMAGES as R2Bucket;
    
    // paintData is base64 like "data:image/png;base64,iVBORw0KGgo..."
    const base64Data = paintData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const r2Key = `${newId}.png`;
    await r2.put(r2Key, buffer, {
      httpMetadata: { contentType: 'image/png' },
    });

    const imageUrl = `/api/images/${r2Key}`;

    const entry: HideEntry = {
      id: newId,
      paintData: imageUrl,
      bgId,
      poseId,
      rotation,
      rotationX,
      rotationY,
      scale,
      posLeft,
      posTop,
      createdAt: Date.now(),
      timesPlayed: 0,
      averageSeekTime: 0,
      similarityScore: simScore || 0
    };

    await saveHide(entry);

    return NextResponse.json({ success: true, id: newId });
  } catch (error: any) {
    console.error('POST /api/hides error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to save hide' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  }

  const hide = await getHideById(id);
  if (!hide) {
    return NextResponse.json({ success: false, error: 'Hide not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, hide });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json() as any;
    const { id, timeMs } = body;
    if (!id || typeof timeMs !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    await recordSeekAttempt(id, timeMs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/hides error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update seek time' }, { status: 500 });
  }
}
