import { useEffect, useState } from 'react'
import { StarRating, ReviewsCarousel, WhatsAppIcon } from '../../../src/components/ui/SharedUI'
import { WHATSAPP_NUMBER, horarioConcurrencia } from '../../data/constants'

interface InicioProps {
  onGoToShop: () => void
  onGoToHistoria: () => void
}

export default function Inicio({ onGoToShop, onGoToHistoria }: InicioProps) {
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="page-inicio">
      {/* ── Hero ── */}
      <section className={`hero ${heroLoaded ? 'loaded' : ''}`}>
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-vignette" />
        <div className="hero-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
        </div>
        <div className="hero-sparks">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="spark" style={{ '--i': i, '--x': `${10+(i*37+13)%80}%`, '--delay': `${(i*0.37)%4}s`, '--dur': `${3+(i*0.6)%4}s` } as React.CSSProperties} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-logo-stage">
            <div className="hero-logo-glow" />
            <img src="/galeria/logo.png" alt="Carnicería Hermanos Gómez" className="hero-logo" />
          </div>
          <div className="hero-ornament">
            <span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" />
          </div>
          <div className="hero-tagline">
            <span className="tagline-top">Tres generaciones</span>
            <span className="tagline-middle">de pasión &amp; tradición</span>
            <span className="tagline-sub">Desde hace décadas, el mismo compromiso con la calidad</span>
          </div>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={onGoToShop} type="button">
              <span>Ver Nuestros Productos</span>
              <svg viewBox="0 0 20 20" width="16" fill="currentColor"><path d="M10 3l7 7-7 7M3 10h14"/></svg>
            </button>
            <a className="btn-whatsapp-hero" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              <WhatsAppIcon width={18} height={18} />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="stats-strip">
        <div className="stat"><span className="stat-num">70+</span><span className="stat-label">Años de tradición</span></div>
        <div className="stat-divider" />
        <div className="stat"><span className="stat-num">3ª</span><span className="stat-label">Generación familiar</span></div>
        <div className="stat-divider" />
        <div className="stat"><span className="stat-num">8</span><span className="stat-label">Categorías de carne</span></div>
        <div className="stat-divider" />
        <div className="stat"><span className="stat-num">★ 5.0</span><span className="stat-label">Valoración media</span></div>
      </section>

      {/* ── CTA Tienda ── */}
      <section className="cta-tienda">
        <div className="cta-content">
          <h2>¿Listo para hacer tu pedido?</h2>
          <p>Selecciona los gramos exactos que necesitas, indica tus datos una sola vez y recibe tu pedido directo por WhatsApp con tu ubicación incluida.</p>
          <button className="btn-primary large" onClick={onGoToShop} type="button">Ir a la Tienda Online</button>
        </div>
      </section>

      {/* ── Historia Preview ── */}
      <section className="home-historia">
        <div className="historia-left">
          <div className="vintage-frame owner-frame">
            <img src="/galeria/fotodueno.jpeg" alt="El dueño" className="owner-real-img"
              onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
            <div className="vintage-placeholder owner-placeholder" style={{display:'none'}}>
              <span>📸</span><small>fotodueño.png</small>
            </div>
          </div>
        </div>
        <div className="historia-right">
          <span className="section-tag">Nuestra Esencia</span>
          <h2>Un legado que<br /><em>trasciende generaciones</em></h2>
          <p>Bienvenidos a Carnicería Hermanos Gómez, donde nuestra historia comienza hace varias décadas. Nuestros abuelos sembraron la semilla de esta pasión por el buen corte de carne, y hoy somos la tercera generación que honra ese legado con orgullo.</p>
          <p>Cada pieza que ofrecemos tiene una historia detrás, forjada con el paso del tiempo y el mismo objetivo de siempre: <strong>ofrecer lo mejor de la carne.</strong></p>
          <button className="btn-secondary" onClick={onGoToHistoria} type="button">Leer nuestra historia completa →</button>
        </div>
      </section>

      {/* ── Horario ── */}
      <section className="horario-section">
        <div className="horario-card">
          <span className="section-tag">Estamos aquí para ti</span>
          <h2>Horario del Negocio</h2>
          <div className="horario-grid">
            <div className="horario-row"><span>Lunes – Viernes</span><span className="horario-time">8:00 – 14:30 / 17:00 – 20:30</span></div>
            <div className="horario-row"><span>Sábado</span><span className="horario-time">8:00 – 15:00</span></div>
            <div className="horario-row closed"><span>Domingo</span><span className="horario-time">Cerrado</span></div>
          </div>
        </div>
        <div className="concurrencia-card">
          <span className="section-tag">Planifica tu visita</span>
          <h2>Concurrencia por día</h2>
          <div className="concurrencia-bars">
            {horarioConcurrencia.map(d => (
              <div key={d.day} className="bar-item">
                <div className="bar-track">
                  <div className={`bar-fill level-${d.level}`} style={{ height: `${d.level === 1 ? 10 : d.level * 18}%` }} />
                </div>
                <span className="bar-day">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="concurrencia-legend">
            <span className="legend-item"><span className="dot dot-low" />Tranquilo</span>
            <span className="legend-item"><span className="dot dot-mid" />Moderado</span>
            <span className="legend-item"><span className="dot dot-high" />Concurrido</span>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="reviews-section">
        <span className="section-tag">Lo que dicen nuestros clientes</span>
        <h2>Opiniones &amp; Reseñas</h2>
        <ReviewsCarousel />
        <div className="google-rating">
          <StarRating stars={5} />
          <span>5.0 en Google · Más de 200 reseñas</span>
        </div>
      </section>
    </main>
  )
}