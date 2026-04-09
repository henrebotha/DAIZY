import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const scenes = [
  {
    id: "night-lake",
    name: "Midnight Lake",
    mood: "Calm & Reflective",
    image: "https://images.unsplash.com/photo-1601913526284-38235d032b61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG5pZ2h0JTIwc2t5JTIwbGFrZSUyMHdpbmRtaWxsJTIwYmx1ZXxlbnwxfHx8fDE3NzU2NzgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chords: ["Am7", "Dm7", "G7", "Cmaj7", "Fmaj7", "Bm7♭5"],
  },
  {
    id: "green-meadow",
    name: "Summer Meadow",
    mood: "Bright & Playful",
    image: "https://images.unsplash.com/photo-1757697338572-cd30151195b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG1lYWRvdyUyMG1vdW50YWluJTIwc3VtbWVyJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzc1Njc4MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chords: ["C", "G", "Am", "F", "Dm", "Em"],
  },
  {
    id: "sunset-ocean",
    name: "Dusk Harbor",
    mood: "Melancholic & Warm",
    image: "https://images.unsplash.com/photo-1727097728757-f52bd1648b0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbiUyMGNhbG0lMjBwaW5rJTIwcHVycGxlfGVufDF8fHx8MTc3NTY3ODA1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chords: ["Em", "Cadd9", "G", "D/F#", "Am", "B7"],
  },
  {
    id: "aurora",
    name: "Northern Lights",
    mood: "Ethereal & Dreamy",
    image: "https://images.unsplash.com/photo-1763116147062-75192261497b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYSUyMGNhYmluJTIwc25vd3xlbnwxfHx8fDE3NzU2NzgwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chords: ["Fmaj7", "Am/D", "Asus2/C", "Cmaj7", "Fmaj7", "Am/E"],
  },
];

const pianoKeys = ["C", "D", "E", "F", "G", "A", "B"];

export function PlaygroundPage() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [showPiano, setShowPiano] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const playNote = (note: string) => {
    setActiveKey(note);
    // In a real app, this would send MIDI or play audio
    setTimeout(() => setActiveKey(null), 200);
  };

  return (
    <div className="bg-[#f7fade] min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Scene Cards */}
        <div className="space-y-6 mt-6">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedScene === scene.id ? "ring-4 ring-black/30 shadow-2xl" : "shadow-md hover:shadow-xl"
              }`}
              onClick={() => setSelectedScene(selectedScene === scene.id ? null : scene.id)}
            >
              <div className="relative aspect-[2.2/1]">
                <ImageWithFallback src={scene.image} alt={scene.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl md:text-2xl">{scene.name}</h3>
                  <p className="text-sm opacity-75">{scene.mood}</p>
                </div>
                {/* Chord tags on cover */}
                <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                  {scene.chords.map((chord, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs border border-white/20 font-['Space_Grotesk']"
                    >
                      {chord}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chord Group - shown when selected */}
              {selectedScene === scene.id && (
                <div className="bg-black/80 px-4 py-4">
                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    {scene.chords.map((chord, i) => (
                      <button
                        key={i}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer border-none text-base"
                      >
                        {chord}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-white/40 text-xs mt-3">Select a chord group to send via USB</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Piano Toggle */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowPiano(!showPiano)}
            className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg cursor-pointer border-none text-2xl"
          >
            🎹
          </button>
        </div>

        {/* Mini Piano */}
        {showPiano && (
          <div className="fixed bottom-24 right-6 z-40 bg-white rounded-2xl shadow-2xl p-4 w-72">
            <p className="text-xs text-gray-500 mb-3 text-center">MIDI Piano — Click to play</p>
            <div className="flex gap-1 justify-center">
              {pianoKeys.map((key) => (
                <button
                  key={key}
                  onMouseDown={() => playNote(key)}
                  className={`w-8 h-20 rounded-b-md border border-gray-300 cursor-pointer text-xs transition-colors ${
                    activeKey === key ? "bg-gray-300" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}