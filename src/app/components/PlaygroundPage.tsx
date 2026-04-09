import { useRef, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { connectPG2, uploadCW, activateCW, type CWChord } from "../lib/pg2";

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

// Library of chord shapes (low E → high E, 0 = mute)
const CHORD_LIB: Record<string, number[]> = {
  "Daizy":   [40, 45, 50, 55, 59, 64],
  "C":       [0,  48, 52, 55, 60, 64],
  "G":       [43, 47, 50, 55, 59, 67],
  "Am":      [0,  45, 52, 57, 60, 64],
  "F":       [41, 48, 53, 57, 60, 65],
  "Dm":      [0,  0,  50, 57, 62, 65],
  "Em":      [40, 47, 52, 55, 59, 64],
  "Am7":     [0,  45, 52, 55, 60, 64],
  "Dm7":     [0,  0,  50, 57, 60, 65],
  "G7":      [43, 47, 50, 55, 59, 65],
  "Cmaj7":   [0,  48, 52, 55, 59, 64],
  "Fmaj7":   [0,  0,  53, 57, 60, 64],
  "Bm7b5":   [0,  47, 53, 57, 62, 0],
  "Cadd9":   [0,  48, 52, 55, 62, 64],
  "D/F#":    [42, 0,  50, 57, 62, 66],
  "B7":      [0,  47, 51, 57, 59, 66],
  "Am/D":    [0,  0,  50, 57, 60, 64],
  "Asus2/C": [0,  48, 52, 57, 59, 64],
  "Am/E":    [40, 45, 52, 57, 60, 64],
};

// PG-2 short-name (≤7 chars). For symbols PG-2 can't show, use ASCII fallback.
const PG_NAME: Record<string, string> = {
  "Bm7♭5": "Bm7b5",
};

const sceneToCW = (chordNames: string[]): CWChord[] => {
  const slots: CWChord[] = [{ name: "Daizy", notes: CHORD_LIB["Daizy"] }];
  for (let i = 0; i < 8; i++) {
    const raw = chordNames[i % chordNames.length];
    const key = PG_NAME[raw] ?? raw;
    const notes = CHORD_LIB[key] ?? CHORD_LIB["Daizy"];
    slots.push({ name: key, notes });
  }
  return slots;
};

// Slot order: 0=Center, 1=Up, 2=NE, 3=Right, 4=SE, 5=Down, 6=SW, 7=Left, 8=NW
// 9 chords, names ≤ 7 chars practical
const SHARED_CHORDS: CWChord[] = [
  { name: "Daizy", notes: [40, 45, 50, 55, 59, 64] },
  { name: "C",    notes: [0,  48, 52, 55, 60, 64] },
  { name: "Em",   notes: [40, 47, 52, 55, 59, 64] },
  { name: "G",    notes: [43, 47, 50, 55, 59, 67] },
  { name: "Dm",   notes: [0,  0,  50, 57, 62, 65] },
  { name: "Am",   notes: [0,  45, 52, 57, 60, 64] },
  { name: "G7",   notes: [43, 47, 50, 55, 59, 65] },
  { name: "F",    notes: [41, 48, 53, 57, 60, 65] },
  { name: "E7",   notes: [40, 47, 50, 56, 59, 64] },
];

// Aurora: slot 0 = Daizy open, slots 1-8 = Em-key family
const AURORA_CHORDS: CWChord[] = [
  { name: "Daizy", notes: [40, 47, 52, 55, 59, 64] }, // 0 center (Em open)
  { name: "Em",    notes: [40, 47, 52, 55, 59, 64] }, // 1
  { name: "G",     notes: [43, 47, 50, 55, 59, 67] }, // 2
  { name: "Am",    notes: [0,  45, 52, 57, 60, 64] }, // 3
  { name: "C",     notes: [0,  48, 52, 55, 60, 64] }, // 4
  { name: "D",     notes: [0,  0,  50, 57, 62, 66] }, // 5
  { name: "Bm",    notes: [0,  0,  49, 54, 59, 66] }, // 6
  { name: "Em7",   notes: [40, 47, 50, 55, 59, 62] }, // 7
  { name: "Cmaj7", notes: [0,  48, 52, 55, 59, 64] }, // 8
];

type Experience = {
  id: string;
  name: string;
  mood: string;
  image: string;
  href: string;
  ambience: string;
  chords: CWChord[];
  capo: number;
  instrument?: 0 | 1 | 2 | 3;
};

const experiences: Experience[] = [
  {
    id: "playwithdaizy",
    name: "原野",
    mood: "Ambient Jam",
    image: "/playground/bg.jpg",
    href: "/playground/playwithdaizy.html",
    ambience: "/playground/ambienceloop.mp3",
    chords: SHARED_CHORDS,
    capo: 0,
  },
  {
    id: "aurora",
    name: "Aurora",
    mood: "Northern Lights Edition",
    image: "/playground/aurorabg2.jpg",
    href: "/playground/playwithdaizyunteraurora.html",
    ambience: "/playground/auroraambientloop.mp3",
    chords: AURORA_CHORDS,
    capo: 11,
    instrument: 1,
  },
];

type ExpStatus = "idle" | "loading" | "ready" | "error";

const pianoKeys = ["C", "D", "E", "F", "G", "A", "B"];

export function PlaygroundPage() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [showPiano, setShowPiano] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [expStatus, setExpStatus] = useState<Record<string, ExpStatus>>({});
  const [expError, setExpError] = useState<Record<string, string>>({});
  const [activeExp, setActiveExp] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const voicesRef = useRef<Map<number, { osc: OscillatorNode; gain: GainNode }>>(new Map());
  const midiInputsRef = useRef<any[]>([]);
  const capoRef = useRef(0);
  const instrumentRef = useRef<0 | 1 | 2 | 3>(0);

  const stopAllVoices = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    voicesRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.stop(now + 0.06);
      } catch {}
    });
    voicesRef.current.clear();
  };

  const handleMIDI = (msg: any) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const [status, data1, data2] = msg.data;
    const cmd = status & 0xf0;
    if (cmd === 0x90 && data2 > 0) {
      // note on
      if (voicesRef.current.has(data1)) return;
      const note = data1 + capoRef.current;
      const freq = 440 * Math.pow(2, (note - 69) / 12);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const inst = instrumentRef.current;
      // 镜像 HTML 里 4 种乐器的包络
      let attackTime = 0.015;
      let targetVol = (data2 / 127) * 0.35;
      let sustainLevel = targetVol * 0.4 + 0.0001;
      const decayTime = 1.0;
      if (inst === 0) {
        osc.type = "triangle";
      } else if (inst === 1) {
        osc.type = "sine";
        attackTime = 0.01;
        targetVol *= 1.2;
        sustainLevel = targetVol * 0.2 + 0.0001;
      } else if (inst === 2) {
        osc.type = "sine";
        attackTime = 0.4;
        targetVol *= 0.8;
        sustainLevel = targetVol * 0.8 + 0.0001;
      } else if (inst === 3) {
        osc.type = "square";
        attackTime = 0.005;
        targetVol *= 0.15;
        sustainLevel = targetVol * 0.3 + 0.0001;
      }
      osc.frequency.value = freq;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(targetVol, now + attackTime);
      gain.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      voicesRef.current.set(data1, { osc, gain });
    } else if (cmd === 0x80 || (cmd === 0x90 && data2 === 0)) {
      // note off
      const v = voicesRef.current.get(data1);
      if (!v) return;
      const now = ctx.currentTime;
      try {
        v.gain.gain.cancelScheduledValues(now);
        v.gain.gain.setValueAtTime(v.gain.gain.value, now);
        v.gain.gain.linearRampToValueAtTime(0, now + 0.15);
        v.osc.stop(now + 0.16);
      } catch {}
      voicesRef.current.delete(data1);
    }
  };

  const stopExperience = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    midiInputsRef.current.forEach((inp) => {
      try { inp.onmidimessage = null; } catch {}
    });
    midiInputsRef.current = [];
    stopAllVoices();
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    setActiveExp(null);
  };

  const handleExperienceClick = async (exp: Experience) => {
    // Toggle off if clicking the active card
    if (activeExp === exp.id) {
      stopExperience();
      setExpStatus((s) => ({ ...s, [exp.id]: "idle" }));
      return;
    }
    // Stop previous experience first
    if (activeExp) {
      const prev = activeExp;
      stopExperience();
      setExpStatus((s) => ({ ...s, [prev]: "idle" }));
    }

    setExpStatus((s) => ({ ...s, [exp.id]: "loading" }));
    setExpError((e) => ({ ...e, [exp.id]: "" }));
    try {
      await connectPG2();
      // 设备 capo 永远写 0，所有移调都在 web 合成器里做，避免和 HTML 页面共享设备状态
      uploadCW(exp.chords, 0);
      activateCW();

      // start audio context + subscribe to MIDI inputs
      const access = await (navigator as any).requestMIDIAccess({ sysex: true });
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      capoRef.current = exp.capo;
      instrumentRef.current = exp.instrument ?? 0;
      const inputs: any[] = [...access.inputs.values()];
      inputs.forEach((inp) => { inp.onmidimessage = handleMIDI; });
      midiInputsRef.current = inputs;

      const audio = new Audio(exp.ambience);
      audio.loop = true;
      audio.volume = 0.6;
      await audio.play();
      audioRef.current = audio;

      setActiveExp(exp.id);
      setExpStatus((s) => ({ ...s, [exp.id]: "ready" }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setExpStatus((s) => ({ ...s, [exp.id]: "error" }));
      setExpError((e) => ({ ...e, [exp.id]: msg }));
    }
  };

  const handleSceneClick = async (sceneId: string, chordNames: string[]) => {
    const next = selectedScene === sceneId ? null : sceneId;
    setSelectedScene(next);
    if (!next) return;
    try {
      await connectPG2();
      uploadCW(sceneToCW(chordNames), 0);
      activateCW();
    } catch (err) {
      // 静默失败：场景卡片只发和弦，不影响 UI
      console.warn("PG-2 upload failed:", err);
    }
  };

  const playNote = (note: string) => {
    setActiveKey(note);
    // In a real app, this would send MIDI or play audio
    setTimeout(() => setActiveKey(null), 200);
  };

  return (
    <div className="bg-[#f7fade] min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Interactive Experiences */}
        <div className="space-y-6 mt-6 mb-6">
          {experiences.map((exp) => {
            const status = expStatus[exp.id] ?? "idle";
            const isActive = activeExp === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => handleExperienceClick(exp)}
                className={`block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  isActive ? "ring-4 ring-black/30" : ""
                }`}
              >
                <div className="relative aspect-[2.2/1]">
                  <ImageWithFallback src={exp.image} alt={exp.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl md:text-2xl">{exp.name}</h3>
                    <p className="text-sm opacity-75">{exp.mood}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 text-right text-xs">
                    {status === "loading" && (
                      <span className="text-white/80">Connecting PG-2…</span>
                    )}
                    {status === "ready" && (
                      <span className="text-green-300">✓ Loaded — play your PG-2</span>
                    )}
                    {status === "error" && (
                      <span className="text-red-300">{expError[exp.id]}</span>
                    )}
                  </div>
                  <a
                    href={exp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs border border-white/30 font-['Space_Grotesk'] hover:bg-white/30"
                  >
                    Open ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scene Cards */}
        <div className="space-y-6 mt-6">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedScene === scene.id ? "ring-4 ring-black/30 shadow-2xl" : "shadow-md hover:shadow-xl"
              }`}
              onClick={() => handleSceneClick(scene.id, scene.chords)}
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