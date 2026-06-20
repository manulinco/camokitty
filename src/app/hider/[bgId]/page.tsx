import GameContainer from '@/components/GameContainer';
import { BACKGROUNDS } from '@/lib/levels';
import { notFound } from 'next/navigation';

export default async function HiderPage({ params }: { params: Promise<{ bgId: string }> }) {
  const { bgId } = await params;
  const bgExists = BACKGROUNDS.some(b => b.id === bgId);
  if (!bgExists) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl mt-16 md:mt-0">
        <GameContainer initialBgId={bgId} />
      </div>
    </main>
  );
}
