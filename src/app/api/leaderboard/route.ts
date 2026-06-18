import { NextResponse } from 'next/server';
import { getHides } from '@/lib/db';

export async function GET() {
  const hides = getHides();
  
  // Filter for hides that have been played at least once
  const validHides = hides.filter(h => h.timesPlayed > 0);
  
  // Sort by averageSeekTime descending (longest time to find = best hider)
  validHides.sort((a, b) => b.averageSeekTime - a.averageSeekTime);
  
  // Return top 10
  const top10 = validHides.slice(0, 10).map(h => ({
    id: h.id,
    timesPlayed: h.timesPlayed,
    averageSeekTime: h.averageSeekTime
  }));

  return NextResponse.json({ success: true, leaderboard: top10 });
}
