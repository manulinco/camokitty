import GameContainer from '@/components/GameContainer';

export default function Create() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl mt-16 md:mt-0">
        <GameContainer />
      </div>
    </main>
  );
}
