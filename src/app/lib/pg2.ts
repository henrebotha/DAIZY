// PocketGuitar 2 SysEx client (v1)
// See protocol doc in repo notes.

type MIDIOutputLike = {
  name?: string | null;
  send: (data: number[]) => void;
};

declare global {
  interface Navigator {
    requestMIDIAccess?: (opts?: { sysex?: boolean }) => Promise<{
      outputs: Map<string, MIDIOutputLike>;
    }>;
  }
}

const PG2_HEADER = [0xf0, 0x7d, 0x50, 0x47, 0x32];

let pg2: MIDIOutputLike | null = null;

export async function connectPG2(): Promise<MIDIOutputLike> {
  if (pg2) return pg2;
  if (!navigator.requestMIDIAccess) {
    throw new Error("Web MIDI not supported in this browser");
  }
  const access = await navigator.requestMIDIAccess({ sysex: true });
  const outputs = [...access.outputs.values()];
  const match = (n: string) =>
    /pocketguitar|pg-?2|daizy|daziy/i.test(n);
  let port = outputs.find((o) => match(o.name ?? ""));
  // fallback: if only one output exists, just use it
  if (!port && outputs.length === 1) port = outputs[0];
  if (!port) {
    const names = outputs.map((o) => o.name ?? "(unnamed)").join(", ") || "none";
    throw new Error(`PG-2 output not found. Visible outputs: ${names}`);
  }
  pg2 = port;
  return port;
}

function send(cmd: number, ...args: (number | number[])[]) {
  if (!pg2) throw new Error("call connectPG2() first");
  const body = args.flat().map((b) => b & 0x7f);
  pg2.send([...PG2_HEADER, cmd, ...body, 0xf7]);
}

export const setGroup = (idx: number) => send(0x01, idx);
export const setSustain = (level: number) => send(0x02, level);

export function cwSetChord(chordIdx: number, notes: number[]) {
  if (notes.length !== 6) throw new Error("need 6 notes");
  send(0x10, chordIdx, notes);
}

export function cwSetName(chordIdx: number, name: string) {
  const ascii = [...name].map((c) => c.charCodeAt(0)).slice(0, 11);
  send(0x11, chordIdx, ascii.length, ascii);
}

export function cwSetOffset(semitones: number) {
  send(0x12, (semitones + 64) & 0x7f);
}

export type CWChord = { name: string; notes: number[] };

export function uploadCW(chords: CWChord[], offset = 0) {
  if (chords.length !== 9) throw new Error("need 9 chord slots");
  cwSetOffset(offset);
  chords.forEach((c, i) => {
    cwSetChord(i, c.notes);
    cwSetName(i, c.name);
  });
}

export const activateCW = () => setGroup(3);
