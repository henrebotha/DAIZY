import { WaveBackground } from "@/components/wave-background";

export default function HomePage() {
  return (
    <>
      <WaveBackground />
      <main className="page-shell">
        <div className="topbar">
          <div className="brand-chip">DAIZY</div>
        </div>
      </main>
    </>
  );
}
