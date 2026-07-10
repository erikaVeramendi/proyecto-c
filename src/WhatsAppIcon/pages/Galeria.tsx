export default function Galeria() {
  const items = [
    { src: '/galeria/fotoantigua1.jpeg', label: 'Foto Antigua 1', icon: '🖼️', tag: 'Historia', size: 'large' },
    { src: '/galeria/fotoantigua2.jpeg', label: 'Foto Antigua 2', icon: '🖼️', tag: 'Historia', size: 'normal' },
    { src: '/galeria/fotoantigua3.jpeg', label: 'Foto Antigua 3', icon: '🖼️', tag: 'Historia', size: 'normal' },
    { src: '/galeria/local0.jpeg',       label: 'El Dueño',        icon: '👨‍🍳', tag: 'Equipo',         size: 'normal' },
    { src: '/galeria/local1.jpeg',       label: 'El Local 1',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
    { src: '/galeria/local2.jpeg',       label: 'El Local 2',      icon: '🏪', tag: 'Instalaciones', size: 'large' },
    { src: '/galeria/local3.jpeg',       label: 'El Local 3',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
    { src: '/galeria/local4.jpeg',       label: 'El Local 4',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
    { src: '/galeria/local5.jpeg',       label: 'El Local 5',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
    { src: '/galeria/local6.jpeg',       label: 'El Local 6',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
    { src: '/galeria/local7.jpeg',       label: 'El Local 7',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
    { src: '/galeria/local8.jpeg',       label: 'El Local 8',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
  ]

  return (
    <main className="page-galeria">
      <div className="galeria-header">
        <span className="section-tag">Imágenes</span>
        <h1>Nuestra Galería</h1>
        <p>Un vistazo a nuestra carnicería, nuestra historia y nuestros productos</p>
      </div>
      <div className="galeria-grid">
        {items.map((item, i) => (
          <div key={i} className={`galeria-item ${item.size}`}>
            <img src={item.src} alt={item.label} className="galeria-real-img"
              onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
            <div className="galeria-placeholder" style={{display:'none'}}>
              <span className="galeria-icon">{item.icon}</span>
              <span className="galeria-label">{item.src}</span>
              <span className="galeria-tag">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}