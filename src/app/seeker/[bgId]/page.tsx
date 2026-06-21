"use client";

import SeekerContainer from '@/components/SeekerContainer';
import { BACKGROUNDS } from '@/lib/levels';
import { notFound, useSearchParams, useParams } from 'next/navigation';

export default function SeekerPage() {
  const params = useParams<{ bgId: string }>();
  const bgId = params.bgId;

  const searchParams = useSearchParams();
  const challengeId = searchParams.get('id') || undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl mt-16 md:mt-0">
        <SeekerContainer bgId={bgId} challengeId={challengeId} />
      </div>
    </main>
  );
}
