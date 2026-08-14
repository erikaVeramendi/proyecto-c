import { useState } from 'react';
import { useStore } from '../store/useStore';

interface EditStoreModalProps {
  onClose: () => void;
}

export default function EditStoreModal({ onClose }: EditStoreModalProps) {
  const { storeInfo, updateStoreInfo } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    store_name: storeInfo.store_name || '',
    whatsapp_number: storeInfo.whatsapp_number || '',
    address: storeInfo.address || '',
    city_zip: storeInfo.city_zip || '',
    map_embed_url: storeInfo.map_embed_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.store_name !== storeInfo.store_name) await updateStoreInfo('store_name', formData.store_name);
      if (formData.whatsapp_number !== storeInfo.whatsapp_number) await updateStoreInfo('whatsapp_number', formData.whatsapp_number);
      if (formData.address !== storeInfo.address) await updateStoreInfo('address', formData.address);
      if (formData.city_zip !== storeInfo.city_zip) await updateStoreInfo('city_zip', formData.city_zip);
      if (formData.map_embed_url !== storeInfo.map_embed_url) await updateStoreInfo('map_embed_url', formData.map_embed_url);
      
      onClose();
    } catch (err) {
      alert('Error guardando la configuración');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal store-edit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button">✕</button>
        <div className="store-edit-header">
          <span className="store-edit-icon">⚙️</span>
          <h2>Ajustes de la Tienda</h2>
          <p>Edita los datos de contacto y ubicación de tu negocio.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="store-edit-form">
          <div className="store-field-group">
            <label className="store-field-label">Nombre de la Tienda</label>
            <input className="store-field-input" type="text" value={formData.store_name} onChange={e => setFormData({...formData, store_name: e.target.value})} required />
          </div>
          
          <div className="store-field-group">
            <label className="store-field-label">📱 WhatsApp — Formato internacional (ej: +34600123456, +56912345678)</label>
            <input className="store-field-input" type="text" value={formData.whatsapp_number} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} placeholder="+34600123456" required />
            <span className="store-field-hint">Include el prefijo del país sin espacios ni guiones</span>
          </div>

          <div className="store-field-group">
            <label className="store-field-label">Dirección (Ej: C/ Mayor 12)</label>
            <input className="store-field-input" type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </div>

          <div className="store-field-group">
            <label className="store-field-label">Ciudad y Código Postal</label>
            <input className="store-field-input" type="text" value={formData.city_zip} onChange={e => setFormData({...formData, city_zip: e.target.value})} required />
          </div>

          <div className="store-field-group">
            <label className="store-field-label">URL del Mapa de Google Maps (iframe src=...)</label>
            <textarea 
              className="store-field-input"
              rows={3} 
              value={formData.map_embed_url} 
              onChange={e => setFormData({...formData, map_embed_url: e.target.value})}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>

          <button type="submit" className="btn-add-confirm" disabled={loading}>
            {loading ? 'Guardando cambios...' : '✓ Guardar y Publicar en Vivo'}
          </button>
        </form>
      </div>
    </div>
  );
}
