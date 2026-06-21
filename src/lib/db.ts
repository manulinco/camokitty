import { getCloudflareContext } from "@opennextjs/cloudflare";

export type HideEntry = {
  id: string;
  paintData: string; // Base64 png
  createdAt: number;
  timesPlayed: number;
  averageSeekTime: number; // in milliseconds
  bgId?: string;
  poseId?: string;
  rotation?: number;
  rotationX?: number;
  rotationY?: number;
  scale?: number;
  posLeft?: number;
  posTop?: number;
  similarityScore?: number;
};

async function getR2(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext();
  return (env as any).CAMO_IMAGES as R2Bucket;
}

export async function getHides(): Promise<HideEntry[]> {
  const r2 = await getR2();
  const list = await r2.list({ prefix: 'hide_' });
  
  const entries: HideEntry[] = [];
  for (const obj of list.objects) {
    const file = await r2.get(obj.key);
    if (file) {
      const data = await file.text();
      try {
        entries.push(JSON.parse(data) as HideEntry);
      } catch(e) {}
    }
  }
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getHidesByBgId(bgId: string): Promise<HideEntry[]> {
  const hides = await getHides();
  return hides.filter(h => h.bgId === bgId);
}

export async function saveHide(entry: HideEntry): Promise<void> {
  const r2 = await getR2();
  const key = `hide_${entry.id}.json`;
  await r2.put(key, JSON.stringify(entry), {
    httpMetadata: { contentType: 'application/json' }
  });
}

export async function getHideById(id: string): Promise<HideEntry | undefined> {
  const r2 = await getR2();
  const key = `hide_${id}.json`;
  const file = await r2.get(key);
  if (!file) return undefined;
  
  const data = await file.text();
  try {
    return JSON.parse(data) as HideEntry;
  } catch(e) {
    return undefined;
  }
}

export async function recordSeekAttempt(id: string, timeMs: number): Promise<void> {
  const entry = await getHideById(id);
  if (!entry) return;
  
  entry.averageSeekTime = (entry.averageSeekTime * entry.timesPlayed + timeMs) / (entry.timesPlayed + 1);
  entry.timesPlayed += 1;
  
  await saveHide(entry);
}
