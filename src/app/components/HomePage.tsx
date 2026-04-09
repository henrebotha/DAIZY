import imgControl1 from "figma:asset/5689f4eb3355c7a15d2241968b2137634b60922c.png";
import imgControl2 from "figma:asset/8084d5e342d7dafc18c2350a78de6f5ca24d161b.png";
import imgHeroText from "figma:asset/7b0a6cde5f566682f68fc71b9be8045eb3fc7c96.png";
import imgPG2Section from "figma:asset/4dcabf491f9a1e2fab7a9cc4d72e7103f8a07b9f.png";

export function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <img src={imgHeroText} alt="Pocket Guitar" className="w-full h-full object-cover" />
      </section>

      {/* PG-2 Product Section */}
      <section className="relative bg-black">
        <img src={imgPG2Section} alt="PG-2 Product" className="w-auto h-auto max-h-screen ml-auto block object-contain" />
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