import { motion, useReducedMotion } from 'framer-motion'
import { COUPLE } from '../data'
import HeroDateBadge from './HeroDateBadge'

export default function Hero() {
  const reduceMotion = useReducedMotion()
  return (
    <section className="hero invitation-hero" aria-labelledby="betrothal-title">
      <div className="hero-frame" aria-hidden="true" />
      {['tl', 'tr', 'bl', 'br'].map(corner => (
        <img key={corner} className={`invitation-corner invitation-corner-${corner}`} src="/assets/florals/emerald-rose-corner.webp" alt="" aria-hidden="true" />
      ))}
      <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <div className="hero-top-quote">
          <p className="hero-top-quote-text">“He has made everything beautiful in its time.”</p>
          <p className="hero-top-quote-source">Ecclesiastes 3:11</p>
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
        <p className="hero-kicker">With the blessings of God,</p>
        <h1 id="betrothal-title">
          <span>{COUPLE.bride}</span>
          <span className="hero-names-divider"><i className="sprig" aria-hidden="true" /><em>&amp;</em><i className="sprig" aria-hidden="true" /></span>
          <span>{COUPLE.groom}</span>
        </h1>
        <div className="hero-rings-wrap">
          <span className="rings-glow-effect" aria-hidden="true" />
          <img className="hero-rings-img" src="/assets/decorations/wedding-rings.webp" alt="Two intertwined wedding rings" />
        </div>
        <p className="hero-invitation">
          <span className="hero-invitation-line">Together with our family</span>
          <span className="hero-invitation-line">we invite you and your family to grace</span>
          <span className="hero-invitation-line">the Betrothal ceremony</span>
        </p>
        <div className="hero-solemnized">
          <span className="hero-solemnized-label">will be solemnized by</span>
          <strong className="hero-solemnized-name">His Excellency Mar Bosco Puthur</strong>
          <span className="hero-solemnized-title">Bishop Emeritus, Melbourne</span>
        </div>
        <div className="invitation-divider" aria-hidden="true"><span />❦<span /></div>
        <div className="hero-badges-wrapper"><HeroDateBadge /></div>
        <a href="#details" className="invitation-explore"><span aria-hidden="true">◇</span>Kindly scroll to discover<br />the ceremony, reception, and more<span aria-hidden="true">↓</span></a>
      </motion.div>
    </section>
  )
}
