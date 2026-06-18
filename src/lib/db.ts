import fs from 'fs';
import path from 'path';

// Local JSON DB for MVP
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

type ColorState = { h: number; s: number; b: number };
export type HideEntry = {
  id: string;
  paintData: string; // Base64 png
  createdAt: number;
  timesPlayed: number;
  averageSeekTime: number; // in milliseconds
  bgId?: string; // Background ID
  poseId?: string; // Pose SVG ID
  rotation?: number; // 0-359 degrees
  posLeft?: number; // percentage 0-100
  posTop?: number; // percentage 0-100
};

// Ensure data dir and db file exist
function initDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ hides: [] }));
  }
}

export function getHides(): HideEntry[] {
  initDb();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data).hides;
}

export function saveHide(entry: HideEntry) {
  const hides = getHides();
  hides.push(entry);
  fs.writeFileSync(DB_PATH, JSON.stringify({ hides }, null, 2));
}

export function getHideById(id: string): HideEntry | undefined {
  return getHides().find(h => h.id === id);
}

export function recordSeekAttempt(id: string, timeMs: number) {
  const hides = getHides();
  const hideIndex = hides.findIndex(h => h.id === id);
  if (hideIndex === -1) return;

  const hide = hides[hideIndex];
  const newTotalTime = (hide.averageSeekTime * hide.timesPlayed) + timeMs;
  hide.timesPlayed += 1;
  hide.averageSeekTime = newTotalTime / hide.timesPlayed;

  fs.writeFileSync(DB_PATH, JSON.stringify({ hides }, null, 2));
}

