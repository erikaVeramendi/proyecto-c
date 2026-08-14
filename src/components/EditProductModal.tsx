import { useState, useRef, useEffect } from 'react';
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
  const { categories, addProduct, updateProduct } = useStore();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    emoji: product?.emoji || '',
    image: product?.image || '',
    description: product?.description || '',
    category_id: product?.category_id || category.id
  });

  // Cierra el desplegable al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedCat = categories.find(c => c.id === formData.category_id);

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
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        const newId = generateId(formData.name);
        await addProduct({ ...formData, id: newId } as Product);
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
        <h2 style={{ marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
          {product ? '✏️ Editar Producto' : '➕ Añadir Producto'}
        </h2>

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

          {/* Precio + Categoría */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group wysiwyg-form" style={{ flex: 1 }}>
              <label>Precio por kg (€)</label>
              <input
                type="number" step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>

            {/* Custom category picker */}
            <div className="form-group wysiwyg-form" style={{ flex: 1, position: 'relative' }} ref={catRef}>
              <label>Categoría</label>
              <button
                type="button"
                onClick={() => setCatOpen(o => !o)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '5px',
                  border: '1.5px solid var(--beige-dark)', fontFamily: 'Lato, sans-serif',
                  fontSize: '0.9rem', color: 'var(--text)', background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span>{selectedCat ? `${selectedCat.icon} ${selectedCat.name}` : 'Seleccionar...'}</span>
                <span style={{ fontSize: '0.7rem' }}>{catOpen ? '▲' : '▼'}</span>
              </button>

              {catOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
                  background: 'white', border: '1.5px solid var(--beige-dark)',
                  borderRadius: '5px', marginTop: '4px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  maxHeight: '220px', overflowY: 'auto',
                }}>
                  {categories.map(c => (
                    <div
                      key={c.id}
                      onClick={() => { setFormData(f => ({ ...f, category_id: c.id })); setCatOpen(false); }}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', fontSize: '0.88rem',
                        fontFamily: 'Lato, sans-serif', color: 'var(--text)',
                        background: formData.category_id === c.id ? 'var(--beige)' : 'white',
                        fontWeight: formData.category_id === c.id ? 700 : 400,
                        borderBottom: '1px solid var(--beige)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--beige)')}
                      onMouseLeave={e => (e.currentTarget.style.background = formData.category_id === c.id ? 'var(--beige)' : 'white')}
                    >
                      {c.icon} {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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

          <button type="submit" className="btn-add-confirm" disabled={uploadingImage}>
            {uploadingImage ? 'Guardando...' : (product ? 'Guardar Cambios' : 'Añadir Producto')}
          </button>
        </form>
      </div>
    </div>
  );
}
