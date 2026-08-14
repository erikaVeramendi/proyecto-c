import { WhatsAppIcon } from '../../components/ui/SharedUI'
import { useStore } from '../../store/useStore'
import { useState } from 'react'
import EditStoreModal from '../../components/EditStoreModal'

export default function Contacto() {
  const { storeInfo, isAdmin } = useStore();
  const [isEditingStore, setIsEditingStore] = useState(false);
  
  return (
    <main className="page-contacto">
      {isEditingStore && <EditStoreModal onClose={() => setIsEditingStore(false)} />}
      
      <div className="contacto-header">
        <span className="section-tag">Estamos aquí</span>
        <h1>
          Contacto &amp; Ubicación
          {isAdmin && (
            <button className="wysiwyg-store-btn" onClick={() => setIsEditingStore(true)}>
              ⚙️ Editar Info
            </button>
          )}
        </h1>
      </div>

      <div className="contacto-grid">
        <div className="contacto-info">
          <div className="info-block">
            <span className="info-icon">📍</span>
            <div>
              <h3>Dirección</h3>
              <p>{storeInfo.address}<br />{storeInfo.city_zip}</p>
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
              <a href={`https://wa.me/${storeInfo.whatsapp_number}`} target="_blank" rel="noreferrer" className="whatsapp-link">
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
            src={storeInfo.map_embed_url}
            width="100%" height="100%"
            style={{ border: 0, minHeight: '380px', borderRadius: '12px', display: 'block' }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  )
}