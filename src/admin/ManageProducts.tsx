import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types';

export default function ManageProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    emoji: '',
    image: '',
    description: '',
    category_id: categories[0]?.id || ''
  });

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ 
      id: '', name: '', price: 0, emoji: '', image: '', description: '', 
      category_id: categories[0]?.id || '' 
    });
    setIsModalOpen(true);
  };

  const openEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ 
      id: prod.id, name: prod.name, price: prod.price, emoji: prod.emoji, 
      image: prod.image || '', description: prod.description, category_id: prod.category_id || categories[0]?.id || '' 
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

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
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData as Product);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Error guardando producto');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Gestionar Productos</h1>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={18} /> Añadir Producto
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio (&euro;)</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="product-img-thumbnail" />
                  ) : <ImageIcon size={30} color="#ccc" />}
                </td>
                <td>{prod.name} {prod.emoji}</td>
                <td>{prod.price.toFixed(2)}</td>
                <td>{categories.find(c => c.id === prod.category_id)?.name || prod.category_id}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => openEdit(prod)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="btn-delete" onClick={() => {
                      if(window.confirm('¿Eliminar producto?')) deleteProduct(prod.id);
                    }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit}>
              {!editingProduct && (
                <div className="form-group">
                  <label>ID (sin espacios)</label>
                  <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required />
                </div>
              )}
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={formData.category_id} 
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  required
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Precio</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Emoji</label>
                  <input type="text" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  rows={2} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Imagen</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {formData.image && <img src={formData.image} alt="preview" style={{width: 50, height: 50, objectFit: 'cover'}}/>}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  {uploadingImage && <span>Subiendo...</span>}
                </div>
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  O ingresa URL directa:
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={uploadingImage}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
