import imgManual from "figma:asset/55739a416db6af05d0db251597f5c1129148c19f.png";

export function ManualPage() {
  return (
    <div className="bg-[#061115] min-h-screen pt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pl-8 md:pl-16 md:min-h-[calc(100vh-2.5rem)]">
        <div className="order-2 md:order-1 md:ml-32 mt-6 md:mt-0 w-full md:w-auto flex flex-col items-center relative z-10">
          <img
            src="/media/gunlun.gif"
            alt="Gunlun"
            className="w-1/2 max-w-xs md:w-auto md:max-w-none md:max-h-[calc(100vh-5rem)] object-contain rounded-2xl"
          />
          <p
            className="mt-4 text-white text-center text-sm md:text-base"
            style={{ fontFamily: "'Power Grotesk', sans-serif" }}
          >
            Rotate the wheel to switch apps, press to confirm.
          </p>
        </div>
        <img
          src={imgManual}
          alt="PG-2 Manual"
          className="order-1 md:order-2 max-h-[calc(100vh-5rem)] object-contain md:fixed md:top-10 md:right-0"
        />
      </div>
    </div>
  );
}
