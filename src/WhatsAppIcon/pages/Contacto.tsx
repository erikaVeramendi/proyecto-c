import { WhatsAppIcon } from '../../components/ui/SharedUI'
import { WHATSAPP_NUMBER } from '../../data/constants'

export default function Contacto() {
  return (
    <main className="page-contacto">
      <div className="contacto-header">
        <span className="section-tag">Estamos aquí</span>
        <h1>Contacto &amp; Ubicación</h1>
      </div>

      <div className="contacto-grid">
        <div className="contacto-info">
          <div className="info-block">
            <span className="info-icon">📍</span>
            <div>
              <h3>Dirección</h3>
              <p>General Díaz Porlier, 21<br />28001 Madrid, España</p>
              <a href="https://maps.app.goo.gl/errBca6jxHiszWHU6" target="_blank" rel="noreferrer" className="map-link">
                Ver en Google Maps →
              </a>
            </div>
          </div>

          <div className="info-block">
            <span className="info-icon">📞</span>
            <div>
              <h3>Teléfono</h3>
              <p>91 402 59 92</p>
            </div>
          </div>

          <div className="info-block">
            <span className="info-icon">💬</span>
            <div>
              <h3>WhatsApp Pedidos</h3>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="whatsapp-link">
                <WhatsAppIcon width={16} height={16} />
                Escribir por WhatsApp
              </a>
            </div>
          </div>

          <div className="info-block">
            <span className="info-icon">🕐</span>
            <div>
              <h3>Horario</h3>
              <p>Lun–Vie: 8:00–14:30 / 17:00–20:30<br />Sábado: 8:00–15:00<br />Domingo: Cerrado</p>
            </div>
          </div>
        </div>

        <div className="mapa-embed">
          <iframe
            title="Ubicación Carnicería Hermanos Gómez"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.754!2d-3.6742!3d40.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42288f00000001%3A0x0!2sGeneral+D%C3%ADaz+Porlier%2C+21%2C+28001+Madrid%2C+Spain!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
            width="100%" height="100%"
            style={{ border: 0, minHeight: '380px', borderRadius: '12px', display: 'block' }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  )
}