import imgControl1 from "figma:asset/5689f4eb3355c7a15d2241968b2137634b60922c.png";
import imgControl2 from "figma:asset/8084d5e342d7dafc18c2350a78de6f5ca24d161b.png";
import imgHeroText from "figma:asset/7b0a6cde5f566682f68fc71b9be8045eb3fc7c96.png";
import imgPG2Section from "../../assets/pg-2.png";
import { WaveBackground } from "./WaveBackground";

export function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <img src={imgHeroText} alt="Pocket Guitar" className="w-full h-full object-cover" />
      </section>

      {/* PG-2 Product Section */}
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-black">
        <WaveBackground />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.5px)",
            backgroundSize: "120px 120px",
            backgroundAttachment: "fixed",
            mixBlendMode: "difference",
          }}
        />
        <img
          src={imgPG2Section}
          alt="PG-2 Product"
          className="relative z-10 block max-w-full max-h-[90vh] w-auto h-auto object-contain mx-auto"
        />
      </section>

      {/* Description Section */}
      <section className="bg-[#f7fade] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Text removed — awaiting image replacement */}
        </div>
      </section>

      {/* Controls Section */}
      <section className="bg-[#061115] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col gap-4 md:w-1/2">
            <div className="rounded-2xl overflow-hidden border-4 border-[#dbdbdb]">
              <img src={imgControl1} alt="Control view 1" className="w-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden border-4 border-[#dbdbdb]">
              <img src={imgControl2} alt="Control view 2" className="w-full object-cover" />
            </div>
          </div>
          <div className="md:w-1/2 text-white">
            {/* Text removed — awaiting image replacement */}
          </div>
        </div>
      </section>
    </div>
  );
}