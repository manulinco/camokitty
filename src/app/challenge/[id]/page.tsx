import { Metadata } from 'next';
import SeekerContainer from '@/components/SeekerContainer';
import { getHides } from '@/lib/db';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const hides = getHides();
  const hide = hides.find(h => h.id === id);

  if (!hide) {
    return {
      title: 'Challenge Not Found | Camo Kitty',
    };
  }

  return {
    title: `Can you spot the Camo Kitty? | Challenge ${id.substring(0, 6)}`,
    description: `A player has hidden a Camo Kitty. It has survived for ${(hide.averageSeekTime / 1000).toFixed(1)} seconds on average. Can you break the disguise?`,
    openGraph: {
      title: 'Camo Kitty - Spot the hidden cat!',
      description: `Can you beat the average seek time of ${(hide.averageSeekTime / 1000).toFixed(1)}s?`,
      images: ['https://images.unsplash.com/photo-1558244661-d248897f7bc4?q=80&w=1000&auto=format&fit=crop'], // In production, we could generate a dynamic OG image with the masked cat
    },
  };
}

export default async function ChallengePage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl mt-16 md:mt-0">
        <SeekerContainer challengeId={id} />
      </div>
    </main>
  );
}
