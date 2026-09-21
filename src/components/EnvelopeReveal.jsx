import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function playUnfoldSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime

    // 1. Wax Seal Snap / Pop (crisp release sound)
    const snapOsc = ctx.createOscillator()
    const snapGain = ctx.createGain()
    snapOsc.type = 'triangle'
    snapOsc.frequency.setValueAtTime(320, now)
    snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.07)
    snapGain.gain.setValueAtTime(0.12, now)
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)
    snapOsc.connect(snapGain)
    snapGain.connect(ctx.destination)
    snapOsc.start(now)
    snapOsc.stop(now + 0.07)

    // 2. Paper Unfold Rustle (filtered noise)
    const bufferSize = Math.floor(ctx.sampleRate * 0.35)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, now)
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.35)
    filter.Q.value = 1.2

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.08, now + 0.02)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now + 0.02)

    // 3. Elegant Wedding Chime (Harmonic Dyad: A4 + E5)
    const playChimeNote = (freq, delay, dur, vol) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + delay)
      gain.gain.setValueAtTime(0.0001, now + delay)
      gain.gain.exponentialRampToValueAtTime(vol, now + delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + delay)
      osc.stop(now + delay + dur)
    }

    playChimeNote(554.37, 0.08, 0.65, 0.04) // C#5
    playChimeNote(830.61, 0.12, 0.75, 0.035) // G#5
  } catch {
    // audio failure is non-blocking
  }
}

export default function EnvelopeReveal({ onOpen }) {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'sealed'
    return new URLSearchParams(window.location.search).get('open') === 'true' ? 'done' : 'sealed'
  })
  const [flapZIndexBack, setFlapZIndexBack] = useState(false)
  const timers = useRef([])
  const hasFinished = useRef(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const finishReveal = () => {
    if (hasFinished.current) return
    hasFinished.current = true
    timers.current.forEach(window.clearTimeout)
    setPhase('done')
    onOpen()
  }

  const openInvitation = () => {
    // If already in motion, clicking again immediately reveals hero
    if (phase === 'opening' || phase === 'unfolded') {
      finishReveal()
      return
    }
    if (phase !== 'sealed') return
    playUnfoldSound()

    if (reduceMotion) {
      finishReveal()
      return
    }

    setPhase('opening')

    // Phase 1: Flap flips open - once past 90 deg, drop z-index behind card
    timers.current.push(window.setTimeout(() => setFlapZIndexBack(true), 200))

    // Phase 2: Flap opened, card begins rising out of envelope pocket
    timers.current.push(window.setTimeout(() => setPhase('unfolded'), 340))

    // Phase 3: Transition to hero after card has risen and can be read (~3s total, or click anytime to skip)
    timers.current.push(window.setTimeout(() => finishReveal(), 3000))
  }

  const isFlapOpen = phase !== 'sealed'
  const isCardOut = phase === 'unfolded'

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="invitation-gate"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img className="gate-floral gate-floral-left" src="/assets/florals/emerald-rose-corner.webp" alt="" />
          <img className="gate-floral gate-floral-right" src="/assets/florals/emerald-rose-corner.webp" alt="" />
          <img className="gate-wreath" src="/assets/florals/open-wreath.webp" alt="" />
          <img className="gate-silk" src="/assets/florals/silk-ribbon.webp" alt="" />

          <motion.header
            className="gate-intro"
            initial={reduceMotion ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: phase === 'sealed' ? 1 : 0, y: phase === 'sealed' ? 0 : -10 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <span>Betrothal invitation</span>
            <h1>Henna <em>&amp;</em> Ajay</h1>
            <p>28 · September · 2026</p>
          </motion.header>

          <div className="envelope-scene">
            <motion.button
              type="button"
              className={`envelope-realistic ${phase}`}
              onClick={openInvitation}
              aria-label="Open Henna and Ajay's royal betrothal invitation"
              initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: isFlapOpen ? 68 : 0,
                scale: 1,
              }}
              whileHover={phase === 'sealed' && !reduceMotion ? { scale: 1.018, y: -4 } : undefined}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Back Shell + Floral Liner */}
              <div className="envelope-back-wall">
                <div className="envelope-inner-liner" />
                <div className="envelope-pocket-shadow" />
              </div>

              {/* The Letter Card Inside (rises gracefully and reveals the royal betrothal invitation) */}
              <motion.div
                className="envelope-card"
                initial={false}
                animate={
                  isCardOut
                    ? { y: '-80%', scale: 1.025, rotateZ: -0.05 }
                    : { y: '0%', scale: 1, rotateZ: 0 }
                }
                transition={{
                  duration: 0.72,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div
                  className="envelope-letter-art"
                  role="img"
                  aria-label="Betrothal invitation for Henna Prathap and Ajay Babu, Monday, September 28, 2026"
                >
                  <img className="letter-floral letter-floral-tl" src="/assets/florals/emerald-rose-corner.webp" alt="" />
                  <img className="letter-floral letter-floral-br" src="/assets/florals/emerald-rose-corner.webp" alt="" />
                  <div className="letter-inner-frame">
                    <span className="letter-kicker">Betrothal invitation</span>
                    <div className="letter-flourish" aria-hidden="true"><i />❦<i /></div>
                    <p>Together with our family</p>
                    <h2><span>Henna Prathap</span><em>&amp;</em><span>Ajay Babu</span></h2>
                    <strong>Monday · 28 September · 2026</strong>
                  </div>
                </div>
              </motion.div>

              {/* Front Pocket Flaps (Left, Right, Bottom with rich paper grain & gold foil bevel) */}
              <svg className="envelope-pocket-svg" viewBox="0 0 540 350" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  {/* Subtle paper texture overlay */}
                  <pattern id="pocketPaperPattern" width="260" height="260" patternUnits="userSpaceOnUse">
                    <image href="/assets/decorations/parchment-texture.webp" width="260" height="260" preserveAspectRatio="none" opacity="0.32" />
                  </pattern>

                  {/* Gold Foil Crease Gradient */}
                  <linearGradient id="goldCrease" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="35%" stopColor="#f7e8b6" />
                    <stop offset="70%" stopColor="#c5a059" />
                    <stop offset="100%" stopColor="#8c6d2c" />
                  </linearGradient>

                  {/* Flap Shadows */}
                  <filter id="bottomFlapShadow" x="-10%" y="-25%" width="120%" height="160%">
                    <feDropShadow dx="0" dy="-5" stdDeviation="7" floodColor="#06294f" floodOpacity="0.18" />
                  </filter>
                  <filter id="sideFlapShadow" x="-20%" y="-10%" width="140%" height="120%">
                    <feDropShadow dx="2" dy="2" stdDeviation="6" floodColor="#06294f" floodOpacity="0.14" />
                  </filter>

                  {/* Rich Paper Gradients */}
                  <linearGradient id="paperGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffaf1" />
                    <stop offset="85%" stopColor="#f1e6d4" />
                    <stop offset="100%" stopColor="#e3d2b8" />
                  </linearGradient>
                  <linearGradient id="paperGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fffaf1" />
                    <stop offset="85%" stopColor="#efe3d0" />
                    <stop offset="100%" stopColor="#dfceb4" />
                  </linearGradient>
                  <linearGradient id="paperGradBottom" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#e2d2ba" />
                    <stop offset="60%" stopColor="#f1e7d8" />
                    <stop offset="100%" stopColor="#fffaf1" />
                  </linearGradient>
                </defs>

                {/* Left Side Flap */}
                <g filter="url(#sideFlapShadow)">
                  <path d="M 0,0 L 270,175 L 0,350 Z" fill="url(#paperGradLeft)" />
                  <path d="M 0,0 L 270,175 L 0,350 Z" fill="url(#pocketPaperPattern)" />
                  <path d="M 0,0 L 270,175 L 0,350" fill="none" stroke="rgba(197, 160, 89, 0.35)" strokeWidth="0.8" />
                </g>

                {/* Right Side Flap */}
                <g filter="url(#sideFlapShadow)">
                  <path d="M 540,0 L 270,175 L 540,350 Z" fill="url(#paperGradRight)" />
                  <path d="M 540,0 L 270,175 L 540,350 Z" fill="url(#pocketPaperPattern)" />
                  <path d="M 540,0 L 270,175 L 540,350" fill="none" stroke="rgba(197, 160, 89, 0.35)" strokeWidth="0.8" />
                </g>

                {/* Bottom Flap Overlapping */}
                <g filter="url(#bottomFlapShadow)">
                  <path d="M 0,350 L 270,158 L 540,350 Z" fill="url(#paperGradBottom)" />
                  <path d="M 0,350 L 270,158 L 540,350 Z" fill="url(#pocketPaperPattern)" />
                  {/* Subtle embossed fold ridge */}
                  <path d="M 0,350 L 270,158 L 540,350" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
                  <path d="M 0,350 L 270,158 L 540,350" fill="none" stroke="url(#goldCrease)" strokeWidth="1" />
                </g>
              </svg>

              {/* 3D Top Flap that smoothly uncurls and flips open */}
              <div
                className="envelope-top-flap-container"
                style={{ zIndex: flapZIndexBack ? 1 : 5 }}
              >
                <motion.div
                  className="envelope-top-flap-3d"
                  initial={false}
                  animate={{
                    rotateX: isFlapOpen ? -176 : 0,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.25, 1, 0.35, 1],
                  }}
                >
                  {/* Flap Outer Face (When closed) */}
                  <div className="flap-face flap-face-front">
                    <svg viewBox="0 0 540 200" preserveAspectRatio="none" className="flap-svg">
                      <defs>
                        <pattern id="topPaperPattern" width="260" height="260" patternUnits="userSpaceOnUse">
                          <image href="/assets/decorations/parchment-texture.webp" width="260" height="260" preserveAspectRatio="none" opacity="0.3" />
                        </pattern>
                        <linearGradient id="topFlapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                          <stop offset="0%" stopColor="#fffaf1" />
                          <stop offset="60%" stopColor="#f3eadc" />
                          <stop offset="100%" stopColor="#dfceb4" />
                        </linearGradient>
                        <filter id="topFlapDrop" x="-10%" y="-10%" width="120%" height="150%">
                          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#06294f" floodOpacity="0.24" />
                        </filter>
                      </defs>
                      <g filter="url(#topFlapDrop)">
                        <path d="M 0,0 L 270,192 L 540,0 Z" fill="url(#topFlapGrad)" />
                        <path d="M 0,0 L 270,192 L 540,0 Z" fill="url(#topPaperPattern)" />
                        {/* Embossed gold crease on top flap tip */}
                        <path d="M 0,0 L 270,192 L 540,0" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
                        <path d="M 0,0 L 270,192 L 540,0" fill="none" stroke="url(#goldCrease)" strokeWidth="1.1" />
                      </g>
                    </svg>
                  </div>

                  {/* Flap Inner Face (Lined with bespoke floral watercolor when open) */}
                  <div className="flap-face flap-face-back">
                    <svg viewBox="0 0 540 200" preserveAspectRatio="none" className="flap-svg-back">
                      <defs>
                        <pattern id="linerPattern" width="240" height="240" patternUnits="userSpaceOnUse">
                          <image href="/assets/florals/emerald-rose-corner.webp" width="240" height="240" preserveAspectRatio="xMidYMid slice" opacity="0.92" />
                        </pattern>
                      </defs>
                      {/* Back paper substrate */}
                      <path d="M 0,0 L 270,192 L 540,0 Z" fill="#0a3527" />
                      {/* Floral liner with 12px inset framing */}
                      <path d="M 16,3 L 270,183 L 524,3 Z" fill="url(#linerPattern)" />
                      {/* Gilded hairline border surrounding the liner */}
                      <path d="M 16,3 L 270,183 L 524,3 Z" fill="none" stroke="url(#goldCrease)" strokeWidth="1.2" />
                      <path d="M 0,0 L 270,192 L 540,0 Z" fill="none" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="0.8" />
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Photorealistic 3D Wax Seal Stamp (precisely centered on flap tip) */}
              <div className="wax-seal-anchor">
                <motion.div
                  className="wax-seal-wrapper"
                  initial={false}
                  animate={
                    isFlapOpen
                      ? { scale: 0.8, opacity: 0, y: -20, rotate: -8 }
                      : { scale: [1, 1.028, 1], opacity: 1, y: 0, rotate: 0 }
                  }
                  transition={
                    isFlapOpen
                      ? { duration: 0.35, ease: [0.4, 0, 1, 1] }
                      : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
                  }
                >
                  <div className="wax-seal-medallion" aria-hidden="true">
                    <span>H</span><i /><span>A</span>
                  </div>
                  <span className="wax-seal-shine" aria-hidden="true" />
                </motion.div>
              </div>
            </motion.button>
          </div>

          <motion.div
            className="gate-instruction-box"
            role="button"
            tabIndex={0}
            onClick={openInvitation}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openInvitation()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase === 'sealed' ? 1 : 0, y: phase === 'sealed' ? 0 : 10 }}
            transition={{ duration: 0.4 }}
          >
            <span className="gate-sparkle">✦</span>
            <p className="gate-instruction">Tap envelope to open</p>
            <span className="gate-sparkle">✦</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
