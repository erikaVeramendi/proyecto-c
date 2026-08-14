import { useState } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabaseClient';
import type { Product, Category } from '../types';

interface EditProductModalProps {
  product: Product | null; // null if adding new
  category: Category;      // default category for new product
  onClose: () => void;
}

export default function EditProductModal({ product, category, onClose }: EditProductModalProps) {
  const { categories, addProduct, updateProduct } = useStore();
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    price: product?.price || 0,
    emoji: product?.emoji || '',
    image: product?.image || '',
    description: product?.description || '',
    category_id: product?.category_id || category.id
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error subiendo imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await addProduct(formData as Product);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error guardando producto');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e => e.stopPropagation()} style={{ padding: '20px' }}>
        <button className="modal-close" onClick={onClose} type="button">✕</button>
        <h2 style={{ marginBottom: '20px' }}>{product ? '✏️ Editar Producto' : '➕ Añadir Producto'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!product && (
            <div className="form-group wysiwyg-form">
              <label>ID (sin espacios ej. costilla-cerdo)</label>
              <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required />
            </div>
          )}
          
          <div className="form-group wysiwyg-form">
            <label>Nombre del Producto</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group wysiwyg-form" style={{ flex: 1 }}>
              <label>Precio por kg (€)</label>
              <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
            </div>
            <div className="form-group wysiwyg-form" style={{ flex: 1 }}>
              <label>Categoría</label>
              <select 
                value={formData.category_id} 
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                required
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group wysiwyg-form">
            <label>Descripción corta</label>
            <textarea 
              rows={2} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="form-group wysiwyg-form">
            <label>Imagen del Producto</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               {formData.image && <img src={formData.image} alt="prev" style={{width: 50, height: 50, borderRadius: 4, objectFit: 'cover'}} />}
               <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
               {uploadingImage && <span style={{fontSize: 12}}>Subiendo...</span>}
            </div>
          </div>

          <div className="form-group wysiwyg-form">
            <label>O un Emoji (si no hay foto)</label>
            <input type="text" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} />
          </div>

          <button type="submit" className="btn-add-confirm" disabled={uploadingImage}>
            {uploadingImage ? 'Guardando...' : (product ? 'Guardar Cambios' : 'Añadir Producto')}
          </button>
        </form>
      </div>
    </div>
  );
}
