"use client";

import SeekerContainer from '@/components/SeekerContainer';
import { BACKGROUNDS } from '@/lib/levels';
import { notFound, useSearchParams } from 'next/navigation';

export default function SeekerPage({ params }: { params: { bgId: string } }) {
  const bgExists = BACKGROUNDS.some(b => b.id === params.bgId);
  if (!bgExists) {
    notFound();
  }

  const searchParams = useSearchParams();
  const challengeId = searchParams.get('id') || undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl mt-16 md:mt-0">
        <SeekerContainer bgId={params.bgId} challengeId={challengeId} />
      </div>
    </main>
  );
}
