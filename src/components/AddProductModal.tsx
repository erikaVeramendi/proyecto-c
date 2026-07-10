import { useState } from 'react'
import type { Product, Category } from '../types'
import GramSelector from './GramSelector'

interface AddProductModalProps {
  product: Product
  category: Category
  onAdd: (grams: number) => void
  onClose: () => void
}

export default function AddProductModal({ product, category, onAdd, onClose }: AddProductModalProps) {
  const [grams, setGrams] = useState(500)
  const totalEstimado = (product.price * grams) / 1000

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-product">
          <div className="modal-img-wrap">
            {product.image ? (
              <img src={product.image} alt={product.name} className="modal-product-img" />
            ) : (
              <div className="modal-emoji-fallback" style={{ display: 'flex' }}>
                <span className="modal-emoji">{product.emoji}</span>
              </div>
            )}
          </div>
          <div className="modal-info">
            <span className="modal-cat">{category.name}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="modal-price">
              <strong>{product.price.toFixed(2)}€</strong>
              <span>/kg</span>
            </div>
          </div>
        </div>

        <GramSelector grams={grams} onChange={setGrams} />

        <div className="modal-total">
          <span>Subtotal estimado</span>
          <strong>{totalEstimado.toFixed(2)}€</strong>
        </div>

        <button className="btn-add-confirm" onClick={() => onAdd(grams)}>
          Añadir al pedido
        </button>
      </div>
    </div>
  )
}