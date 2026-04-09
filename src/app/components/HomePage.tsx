import imgControl1 from "figma:asset/5689f4eb3355c7a15d2241968b2137634b60922c.png";
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
      <section className="bg-[#f7fade] py-16 md:py-24 pl-4 md:pl-16">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          <div
            className="order-last md:order-1 mt-10 md:mt-0 md:flex-1 text-[#2d3142] pl-4 md:pl-12 pr-4 md:pr-0"
            style={{ fontFamily: "'Power Grotesk', sans-serif", fontWeight: 300 }}
          >
            <h2 className="text-4xl md:text-6xl mb-8 normal-case">PG-2 isn't a Guitar</h2>
            <p className="text-2xl md:text-3xl leading-relaxed mb-6 font-light">
              It's the feeling of a guitar — six strings, real chords, and a whole mood — packed into something that fits in your pocket.
            </p>
            <p className="text-2xl md:text-3xl leading-relaxed font-light">
              Strum it on the train. Strum it in bed. Strum it while your code compiles. You don't need to learn tabs or practice scales. Just pick a vibe, touch the strings, listen and feel.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-end md:flex-shrink-0">
            <img src="/media/frame90.png" alt="PG-2" className="max-w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="bg-[#061115] py-16 md:py-24 px-4 md:px-16 relative overflow-hidden">
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
        <div className="relative z-10 flex md:justify-between md:gap-12">
          <div className="flex-1 max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="rounded-2xl overflow-hidden mb-10 max-w-lg">
              <img src={imgControl1} alt="Controls" className="w-full object-cover" />
            </div>
            <div
              className="text-white"
              style={{ fontFamily: "'Power Grotesk', sans-serif", fontWeight: 300 }}
            >
              <h2 className="text-5xl md:text-7xl mb-8 normal-case">The Controls</h2>
              <p className="text-2xl md:text-3xl leading-relaxed font-light">
                A scroll wheel to twist through chords. A joystick, same as the Nintendo Switch, to bend pitch, shift octaves, and navigate. Together, they give you just enough control to be expressive, and not so much that you need a manual.
                <br />
                (We made one anyway. It's pretty short.)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <img src="/media/portable.png" alt="Portable" className="w-full block" />
      </section>

      <section>
        <img src="/media/chefs.png" alt="The Chefs" className="w-full block" />
      </section>
    </div>
  );
}