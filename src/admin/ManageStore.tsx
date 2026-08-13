import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Save } from 'lucide-react';

export default function ManageStore() {
  const { storeInfo, updateStoreInfo } = useStore();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(storeInfo);
  }, [storeInfo]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Guardar todos los campos iterativamente (o crear en Zustand un updateStoreInfoBulk)
      for (const [key, value] of Object.entries(formData)) {
        if (value !== storeInfo[key]) {
          await updateStoreInfo(key, value);
        }
      }
      alert('Cambios guardados con éxito');
    } catch (error) {
      console.error(error);
      alert('Error guardando la información');
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Información de la Tienda</h1>
      </div>
      
      <div className="admin-table-container" style={{ padding: '30px' }}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Nombre de la Tienda</label>
            <input 
              type="text" 
              value={formData.store_name || ''} 
              onChange={e => handleChange('store_name', e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Número de WhatsApp (ej: 59176446793)</label>
            <input 
              type="text" 
              value={formData.whatsapp_number || ''} 
              onChange={e => handleChange('whatsapp_number', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              value={formData.address || ''} 
              onChange={e => handleChange('address', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Ciudad y Código Postal</label>
            <input 
              type="text" 
              value={formData.city_zip || ''} 
              onChange={e => handleChange('city_zip', e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>URL Embed de Google Maps (src="")</label>
            <textarea 
              rows={4}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              value={formData.map_embed_url || ''} 
              onChange={e => handleChange('map_embed_url', e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
