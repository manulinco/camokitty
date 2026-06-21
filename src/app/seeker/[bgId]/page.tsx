"use client";

import { Suspense } from 'react';
import SeekerContainer from '@/components/SeekerContainer';
import { useSearchParams, useParams } from 'next/navigation';

function SeekerPageContent() {
  const params = useParams<{ bgId: string }>();
  const bgId = params?.bgId;

  const searchParams = useSearchParams();
  const challengeId = searchParams?.get('id') || undefined;

  return <SeekerContainer bgId={bgId} challengeId={challengeId} />;
}

export default function SeekerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl mt-16 md:mt-0">
        <Suspense fallback={<div className="text-cyan-400 font-bold animate-pulse text-center">Loading Matrix...</div>}>
          <SeekerPageContent />
        </Suspense>
      </div>
    </main>
  );
}
