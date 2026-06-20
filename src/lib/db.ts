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
};

// Row shape from D1 (snake_case)
interface HideRow {
  id: string;
  paint_data: string;
  bg_id: string | null;
  pose_id: string | null;
  rotation: number | null;
  rotation_x: number | null;
  rotation_y: number | null;
  scale: number | null;
  pos_left: number | null;
  pos_top: number | null;
  created_at: number;
  times_played: number;
  average_seek_time: number;
}

function rowToEntry(row: HideRow): HideEntry {
  return {
    id: row.id,
    paintData: row.paint_data,
    createdAt: row.created_at,
    timesPlayed: row.times_played,
    averageSeekTime: row.average_seek_time,
    bgId: row.bg_id ?? undefined,
    poseId: row.pose_id ?? undefined,
    rotation: row.rotation ?? undefined,
    rotationX: row.rotation_x ?? undefined,
    rotationY: row.rotation_y ?? undefined,
    scale: row.scale ?? undefined,
    posLeft: row.pos_left ?? undefined,
    posTop: row.pos_top ?? undefined,
  };
}

async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext();
  return (env as any).DB as D1Database;
}

export async function getHides(): Promise<HideEntry[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM hides ORDER BY created_at DESC")
    .all<HideRow>();
  return results.map(rowToEntry);
}

export async function getHidesByBgId(bgId: string): Promise<HideEntry[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM hides WHERE bg_id = ? ORDER BY created_at DESC")
    .bind(bgId)
    .all<HideRow>();
  return results.map(rowToEntry);
}

export async function saveHide(entry: HideEntry): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO hides (id, paint_data, bg_id, pose_id, rotation, rotation_x, rotation_y, scale, pos_left, pos_top, created_at, times_played, average_seek_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      entry.id,
      entry.paintData,
      entry.bgId ?? null,
      entry.poseId ?? null,
      entry.rotation ?? 0,
      entry.rotationX ?? 0,
      entry.rotationY ?? 0,
      entry.scale ?? 1,
      entry.posLeft ?? 50,
      entry.posTop ?? 50,
      entry.createdAt,
      entry.timesPlayed,
      entry.averageSeekTime
    )
    .run();
}

export async function getHideById(
  id: string
): Promise<HideEntry | undefined> {
  const db = await getDb();
  const row = await db
    .prepare("SELECT * FROM hides WHERE id = ?")
    .bind(id)
    .first<HideRow>();
  return row ? rowToEntry(row) : undefined;
}

export async function recordSeekAttempt(
  id: string,
  timeMs: number
): Promise<void> {
  const db = await getDb();
  // Atomic update: calculate new average in SQL
  await db
    .prepare(
      `UPDATE hides 
       SET average_seek_time = (average_seek_time * times_played + ?) / (times_played + 1),
           times_played = times_played + 1
       WHERE id = ?`
    )
    .bind(timeMs, id)
    .run();
}
