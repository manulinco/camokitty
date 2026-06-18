import { NextResponse, NextRequest } from 'next/server';
import { saveHide, getHideById, HideEntry, getHides } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { paintData, bgId, poseId, rotation, posLeft, posTop } = await request.json();
    
    if (!paintData) {
      return NextResponse.json({ success: false, error: 'Missing paintData' }, { status: 400 });
    }

    const newId = crypto.randomBytes(4).toString('hex'); // 8 chars ID
    
    const entry: HideEntry = {
      id: newId,
      paintData,
      bgId,
      poseId,
      rotation,
      posLeft,
      posTop,
      createdAt: Date.now(),
      timesPlayed: 0,
      averageSeekTime: 0
    };

    saveHide(entry);

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save hide' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  }

  const hide = getHideById(id);
  if (!hide) {
    return NextResponse.json({ success: false, error: 'Hide not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, hide });
}

export async function PUT(req: Request) {
  try {
    const { id, timeMs } = await req.json();
    if (!id || typeof timeMs !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    const { recordSeekAttempt } = await import('@/lib/db');
    recordSeekAttempt(id, timeMs);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update seek time' }, { status: 500 });
  }
}

