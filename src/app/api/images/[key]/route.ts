import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    if (!key) {
      return new NextResponse('Missing key', { status: 400 });
    }

    const { env } = await getCloudflareContext();
    const r2 = (env as any).CAMO_IMAGES as R2Bucket;

    const object = await r2.get(key);

    if (object === null) {
      return new NextResponse('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers as any);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(object.body as any, {
      headers,
    });
  } catch (error) {
    console.error('Error fetching image from R2:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
