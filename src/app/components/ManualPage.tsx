import imgManual from "figma:asset/55739a416db6af05d0db251597f5c1129148c19f.png";

export function ManualPage() {
  return (
    <div className="bg-[#061115] min-h-screen pt-20">
      <div className="flex justify-end">
        <img src={imgManual} alt="PG-2 Manual" className="max-h-[calc(100vh-5rem)] object-contain" />
      </div>
    </div>
  );
}