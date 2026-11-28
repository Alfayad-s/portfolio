import DynamicIsland from "@/components/smoothui/dynamic-island";
import Landing from "@/components/home/landing";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="home-screen relative min-h-screen overflow-x-hidden lg:min-h-dvh">
      <div className="fixed top-0 left-1/2 z-50 -translate-x-1/2">
        <DynamicIsland />
      </div>
      <Landing />
    </main>
  );
}
