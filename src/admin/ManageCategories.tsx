import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Category } from '../types';

export default function ManageCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '',
    color: '#000000'
  });

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({ id: '', name: '', icon: '', color: '#000000' });
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ id: cat.id, name: cat.name, icon: cat.icon, color: cat.color });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory({ ...formData, products: [] });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Error guardando categoría');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Gestionar Categorías</h1>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={18} /> Añadir Categoría
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Icono</th>
              <th>Nombre</th>
              <th>Color</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.icon}</td>
                <td>{cat.name}</td>
                <td>
                  <div style={{ width: '20px', height: '20px', backgroundColor: cat.color, borderRadius: '50%' }}></div>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" title="Editar" onClick={() => openEdit(cat)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="btn-delete" title="Eliminar" onClick={() => {
                      if(window.confirm('¿Eliminar categoría?')) deleteCategory(cat.id);
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
            <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <form onSubmit={handleSubmit}>
              {!editingCategory && (
                <div className="form-group">
                  <label>ID (sin espacios, ej: mi-categoria)</label>
                  <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required />
                </div>
              )}
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Icono (Emoji)</label>
                <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Color (Hex)</label>
                <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
