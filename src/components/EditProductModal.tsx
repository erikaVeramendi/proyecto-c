import { useState } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabaseClient';
import type { Product, Category } from '../types';

interface EditProductModalProps {
  product: Product | null;
  category: Category;
  onClose: () => void;
}

function generateId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `${slug}-${suffix}`;
}

export default function EditProductModal({ product, category, onClose }: EditProductModalProps) {
  const { addProduct, updateProduct } = useStore();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
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
      const { error: uploadError } = await supabase.storage.from('product_images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('product_images').getPublicUrl(fileName);
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
    setSaving(true);
    setErrorMsg('');
    try {
      if (product) {
        // Update directo en Supabase para asegurar que funciona
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            price: formData.price,
            emoji: formData.emoji,
            image: formData.image,
            description: formData.description,
            category_id: formData.category_id,
          })
          .eq('id', product.id);
        
        if (error) throw error;
        
        // Refreshar datos en el store
        await updateProduct(product.id, {});
      } else {
        const newId = generateId(formData.name);
        await addProduct({ ...formData, id: newId } as Product);
      }
      onClose();
    } catch (error: any) {
      console.error('Error guardando:', error);
      setErrorMsg(`Error: ${error?.message || 'No se pudo guardar'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e => e.stopPropagation()} style={{ padding: '20px' }}>
        <button className="modal-close" onClick={onClose} type="button">✕</button>
        <h2 style={{ marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
          {product ? '✏️ Editar Producto' : '➕ Añadir Producto'}
        </h2>

        {errorMsg && (
          <div style={{
            background: '#ffebee', color: '#c62828', padding: '10px 14px',
            borderRadius: '5px', marginBottom: '15px', fontSize: '0.85rem',
            border: '1px solid #ef9a9a'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group wysiwyg-form">
            <label>Nombre del Producto</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Precio */}
          <div className="form-group wysiwyg-form">
            <label>Precio por kg (€)</label>
            <input
              type="number" step="0.01"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>

          {/* Descripción */}
          <div className="form-group wysiwyg-form">
            <label>Descripción corta</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Imagen */}
          <div className="form-group wysiwyg-form">
            <label>Imagen del Producto</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {formData.image && <img src={formData.image} alt="prev" style={{ width: 50, height: 50, borderRadius: 4, objectFit: 'cover' }} />}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
              {uploadingImage && <span style={{ fontSize: 12 }}>Subiendo...</span>}
            </div>
          </div>

          {/* Emoji */}
          <div className="form-group wysiwyg-form">
            <label>O un Emoji (si no hay foto)</label>
            <input
              type="text"
              value={formData.emoji}
              onChange={e => setFormData({ ...formData, emoji: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-add-confirm" disabled={uploadingImage || saving}>
            {saving ? '⏳ Guardando...' : uploadingImage ? 'Subiendo imagen...' : (product ? 'Guardar Cambios' : 'Añadir Producto')}
          </button>
        </form>
      </div>
    </div>
  );
}
