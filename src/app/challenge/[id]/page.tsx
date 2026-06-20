import SeekerContainer from '@/components/SeekerContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Camo Kitty - Seeker Challenge',
  description: 'Can you find the hidden kitty? Play the ultimate next-gen hide and seek challenge.',
  openGraph: {
    title: 'Camo Kitty - Seeker Challenge',
    description: 'Can you find the hidden kitty? Play the ultimate next-gen hide and seek challenge.',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'Camo Kitty Logo' }]
  }
};

export default async function ChallengePage({ params }: { params: { id: string } }) {
  // Await params per Next.js 15+ dynamic route requirements
  const { id } = await Promise.resolve(params);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl mt-16 md:mt-0">
        <SeekerContainer challengeId={id} />
      </div>
    </main>
  );
}
