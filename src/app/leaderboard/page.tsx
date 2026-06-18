import { getHides } from '@/lib/db';

export default async function LeaderboardPage() {
  let leaderboard: Array<any> = [];
  try {
    const hides = getHides();
    leaderboard = hides
      .filter(h => h.timesPlayed > 0)
      .sort((a, b) => b.averageSeekTime - a.averageSeekTime)
      .slice(0, 10);
  } catch (e) {
    console.error(e);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-3xl mt-24">
        <h1 className="text-4xl font-black text-amber-500 mb-2 text-center tracking-widest">GLOBAL RANKING</h1>
        <p className="text-slate-400 text-center mb-12">The most deceptive camouflages, ranked by average survival time.</p>

        {leaderboard.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-2xl">
            No data yet. Be the first to deploy a camouflage!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {leaderboard.map((hide, index) => (
              <div 
                key={hide.id} 
                className={`flex items-center justify-between p-6 rounded-2xl border ${index === 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`text-2xl font-black ${index === 0 ? 'text-amber-500' : 'text-slate-500'}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">Hide-{hide.id.substring(0, 8)}</div>
                    <div className="text-sm text-slate-400">Foiled {hide.timesPlayed} seekers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">Avg Survival</div>
                  <div className={`font-mono font-black text-2xl ${index === 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {(hide.averageSeekTime / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
