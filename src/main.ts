import './style.css'

interface Chord {
  abbr: string
  full: string
}

function generateChordWheel(): string {
  const cx = 100, cy = 100
  const outerR = 90
  const innerR = 56
  const midR = (outerR + innerR) / 2
  const segments = 8
  const gapDeg = 3.5
  const segDeg = 360 / segments
  const toRad = (deg: number) => (deg - 90) * Math.PI / 180

  const chords: Chord[] = [
    { abbr: 'Am', full: 'A minor' },
    { abbr: 'C',  full: 'C major' },
    { abbr: 'F',  full: 'F major' },
    { abbr: 'G',  full: 'G major' },
    { abbr: 'Em', full: 'E minor' },
    { abbr: 'D',  full: 'D major' },
    { abbr: 'Dm', full: 'D minor' },
    { abbr: 'E',  full: 'E major' },
  ]

  const segColors: Record<number, string> = {
    0: '#3c4260',
    2: '#474e6a',
    5: '#474e6a',
  }
  const baseColor = '#282d3e'
  const ff = (n: number) => n.toFixed(2)

  let arcs = ''
  let labels = ''

  for (let i = 0; i < segments; i++) {
    const a1 = i * segDeg + gapDeg / 2
    const a2 = (i + 1) * segDeg - gapDeg / 2
    const aMid = (i + 0.5) * segDeg

    const ox1 = cx + outerR * Math.cos(toRad(a1))
    const oy1 = cy + outerR * Math.sin(toRad(a1))
    const ox2 = cx + outerR * Math.cos(toRad(a2))
    const oy2 = cy + outerR * Math.sin(toRad(a2))
    const ix1 = cx + innerR * Math.cos(toRad(a1))
    const iy1 = cy + innerR * Math.sin(toRad(a1))
    const ix2 = cx + innerR * Math.cos(toRad(a2))
    const iy2 = cy + innerR * Math.sin(toRad(a2))

    arcs += `<path d="M${ff(ox1)} ${ff(oy1)} A${outerR} ${outerR} 0 0 1 ${ff(ox2)} ${ff(oy2)} L${ff(ix2)} ${ff(iy2)} A${innerR} ${innerR} 0 0 0 ${ff(ix1)} ${ff(iy1)}Z" fill="${segColors[i] ?? baseColor}"/>`

    const dotR = outerR - 5
    const dx = cx + dotR * Math.cos(toRad(aMid))
    const dy = cy + dotR * Math.sin(toRad(aMid))
    arcs += `<circle cx="${ff(dx)}" cy="${ff(dy)}" r="${i === 0 ? 2.8 : 2}" fill="${i === 0 ? '#e0e4f0' : '#4a5068'}"/>`

    const tx = cx + midR * Math.cos(toRad(aMid))
    const ty = cy + midR * Math.sin(toRad(aMid))
    const flip = aMid > 90 && aMid < 270
    const rot = flip ? aMid + 180 : aMid

    const abbrFill = i === 0 ? '#ffffff' : '#c0c6de'
    const fullFill = i === 0 ? '#8890b0' : '#555c78'
    const abbrDy = flip ? 3.5 : -3.5
    const fullDy = flip ? -6 : 7

    labels += `<text x="${ff(tx)}" y="${ff(ty)}" dy="${abbrDy}" text-anchor="middle" dominant-baseline="central" transform="rotate(${ff(rot)},${ff(tx)},${ff(ty)})" fill="${abbrFill}" font-size="9.5" font-weight="700" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif">${chords[i].abbr}</text>`
    labels += `<text x="${ff(tx)}" y="${ff(ty)}" dy="${fullDy}" text-anchor="middle" dominant-baseline="central" transform="rotate(${ff(rot)},${ff(tx)},${ff(ty)})" fill="${fullFill}" font-size="4" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif">${chords[i].full}</text>`
  }

  return `
    <svg viewBox="0 0 200 200" class="chord-wheel" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${innerR - 2}" fill="#1a1f2a"/>
      ${arcs}
      ${labels}
      <circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#272c3e" stroke-width="0.7"/>
      <circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="#272c3e" stroke-width="0.5"/>
      <circle cx="${cx}" cy="${cy}" r="1.8" fill="#2a3048"/>
    </svg>`
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="card">
    <div class="sidebar-strip">
      <span class="label">PG-2</span>
      <span class="dot"></span>
      <div class="slider-track"></div>
    </div>

    <div class="left-panel">
      <div class="screen">
        ${generateChordWheel()}
      </div>
      <div class="knob-area">
        <div class="knob"></div>
      </div>
    </div>

    <div class="right-panel">
      <div class="blue-panel">
        <div class="blue-row"><span class="tick"></span></div>
        <div class="blue-row"><span class="tick"></span></div>
        <div class="blue-row"><span class="tick"></span></div>
        <div class="blue-row"><span class="tick"></span></div>
        <div class="blue-row"><span class="tick"></span></div>
        <div class="blue-row"><span class="tick"></span></div>
        <div class="blue-row"><span class="tick"></span></div>
      </div>
    </div>
  </div>
`
