import SeekerContainer from '@/components/SeekerContainer';

export default async function PlayPage({ searchParams }: { searchParams: Promise<{ challenge?: string }> }) {
  const params = await searchParams;
  const challengeId = params.challenge;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#1a1a2e]" style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #2a2a4a, #1a1a2e)' }}>
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
            SEEKER MODE
          </h1>
          <p className="text-slate-400 font-medium mt-2">
            Spot the Camo Kitty. 3-Hit Combo to shatter the disguise. Don't miss!
          </p>
        </div>
        <SeekerContainer challengeId={challengeId} />
      </div>
    </main>
  );
}
