import { motion, useReducedMotion } from 'framer-motion'
import { COUPLE } from '../data'

export default function Hero() {
  const reduceMotion = useReducedMotion()
  return (
    <section className="hero invitation-hero" aria-labelledby="wedding-title">
      <div className="hero-frame" aria-hidden="true" />
      {['tl', 'tr', 'bl', 'br'].map(corner => (
        <img key={corner} className={`invitation-corner invitation-corner-${corner}`} src="/assets/florals/emerald-rose-corner.webp" alt="" aria-hidden="true" />
      ))}
      <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <div className="hero-top-quote">
          <p className="hero-top-quote-text">“I have found the one whom my soul loves.”</p>
          <p className="hero-top-quote-source">Song of Solomon 3:4</p>
          <div className="invitation-divider" aria-hidden="true"><span />❦<span /></div>
        </div>
        <motion.div
          className="crest-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="emerald-monogram" role="img" aria-label="Henna and Ajay floral monogram"><span>H</span><i /> <span>A</span></div>
        </motion.div>
        <p className="hero-kicker">With Love &amp; Joy</p>
        <h1 id="wedding-title">
          <span>{COUPLE.bride}</span>
          <span className="hero-names-divider"><i className="sprig" aria-hidden="true" /><em>&amp;</em><i className="sprig" aria-hidden="true" /></span>
          <span>{COUPLE.groom}</span>
        </h1>
        <div className="hero-rings-wrap">
          <span className="rings-glow-effect" aria-hidden="true" />
          <img className="hero-rings-img" src="/assets/decorations/wedding-rings.webp" alt="Two intertwined wedding rings" />
        </div>
        <p className="hero-invitation">
          <span className="hero-invitation-line">Together with our families,</span>
          <span className="hero-invitation-line">we invite you to witness our Sacrament of Matrimony</span>
          <span className="invitation-script">&amp;</span>
          <span className="hero-invitation-line">join us for our Wedding Reception.</span>
        </p>
        <div className="invitation-divider" aria-hidden="true"><span />❦<span /></div>
      </motion.div>
    </section>
  )
}
