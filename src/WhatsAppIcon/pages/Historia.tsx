export default function Historia() {
  const timelineItems = [
    {
      year: 'Los Inicios',
      src: '/galeria/fotoantigua1.jpeg',
      text: 'Nuestra historia comienza hace varias décadas, cuando nuestros abuelos decidieron seguir la tradición de ofrecer carnes frescas y de calidad a su comunidad. Con apenas un mostrador y mucha ilusión, abrieron las puertas de lo que se convertiría en un referente de la ciudad.',
      right: false,
    },
    {
      year: 'La Tradición',
      src: '/galeria/fotoantigua2.jpeg',
      text: 'Esa pasión por el buen corte de carne se fue transmitiendo de padres a hijos. Cada generación aportó su sello: nuevas técnicas, mejores cortes, mayor variedad. Pero siempre con la misma esencia: calidad y trato cercano al cliente.',
      right: true,
    },
    {
      year: 'Hoy',
      src: '/galeria/fotoantigua3.jpeg',
      text: 'Hoy somos una familia que sigue con orgullo el legado que nos dejaron. Cada pieza que ofrecemos tiene una historia detrás, forjada de generación en generación, siempre con el mismo objetivo: ofrecer lo mejor de la carne.',
      right: false,
    },
  ]

  return (
    <main className="page-historia">
      <div className="historia-hero">
        <div className="historia-hero-overlay" />
        <div className="historia-hero-content">
          <span className="section-tag light">Desde siempre</span>
          <h1>Nuestra Historia</h1>
          <p>Tres generaciones, una sola pasión</p>
        </div>
      </div>

      <div className="historia-body">
        <div className="historia-timeline">
          {timelineItems.map((item, i) => (
            <div key={i} className={`timeline-item ${item.right ? 'right' : ''}`}>
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-content">
                <div className="vintage-frame small">
                  <img src={item.src} alt={item.year} className="frame-real-img"
                    onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
                  <div className="vintage-placeholder" style={{display:'none'}}><span>🖼️</span><small>{item.src}</small></div>
                </div>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dueno-section">
          <div className="vintage-frame owner-frame large">
            <img src="/galeria/fotodueno2.jpeg" alt="El dueño" className="owner-real-img"
              onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
            <div className="vintage-placeholder owner-placeholder large" style={{display:'none'}}><span>📸</span><small>fotodueño.png</small></div>
          </div>
          <div className="dueno-text">
            <span className="section-tag">El maestro carnicero</span>
            <h2>El corazón del negocio</h2>
            <p>Detrás de cada corte hay una persona que ha dedicado su vida a este oficio. Aprendió de su padre, que aprendió del suyo, y hoy comparte esa sabiduría con orgullo en cada producto que ofrece.</p>
            <p>Ubicados en General Díaz Porlier, 21 – Madrid, somos especialistas en ternera, pollería, cordero, cerdo y cerdo ibérico, con el mismo compromiso y cuidado de siempre.</p>
          </div>
        </div>
      </div>
    </main>
  )
}