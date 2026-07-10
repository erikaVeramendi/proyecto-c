import type { CartItem, CustomerForm, CartView } from '../types'
import { calcItemTotal, formatGrams } from '../utils/helpers'
import { WHATSAPP_NUMBER } from '../data/constants'
import { WhatsAppIcon } from './ui/SharedUI'
import LocationPicker from './LocationPicker'

interface CartSidebarProps {
  cart: CartItem[]
  onRemove: (id: string) => void
  onClose: () => void
  onGramsChange: (id: string, grams: number) => void
  onContinueShopping: () => void
  customerForm: CustomerForm
  onFormChange: (f: CustomerForm) => void
  formSubmitted: boolean
  onFormSubmit: () => void
  view: CartView
  setView: (v: CartView) => void
}

export default function CartSidebar({
  cart, onRemove, onClose, onGramsChange, onContinueShopping,
  customerForm, onFormChange, formSubmitted, onFormSubmit,
  view, setView,
}: CartSidebarProps) {
  const total = cart.reduce((s, i) => s + calcItemTotal(i), 0)

  const isFormValid = (): boolean => {
    if (!customerForm.name.trim()) return false
    if (!customerForm.phone.trim()) return false
    if (!customerForm.time) return false
    if (customerForm.delivery === 'delivery' && !customerForm.address.trim()) return false
    return true
  }

  const handleFormSave = () => {
    if (!isFormValid()) return
    onFormSubmit()
    setView('cart')
  }

  const sendWhatsApp = () => {
    const f = customerForm
    const modalidad = f.delivery === 'pickup' ? 'Recogida en tienda' : 'Envío a domicilio'
    let msg = `🥩 *PEDIDO — Carnicería Hermanos Gómez*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `👤 *Cliente:* ${f.name}\n`
    msg += `📱 *Teléfono:* ${f.phone}\n`
    msg += `🕐 *Hora deseada:* ${f.time}\n`
    msg += `📦 *Modalidad:* ${modalidad}\n`
    if (f.delivery === 'delivery') {
      msg += `📍 *Dirección:* ${f.address}\n`
      if (f.locationLink) msg += `🗺️ *Ubicación en mapa:* ${f.locationLink}\n`
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `🛒 *PRODUCTOS*\n\n`
    cart.forEach(item => {
      const subtotal = calcItemTotal(item)
      msg += `${item.emoji} *${item.name}*\n`
      msg += `   ${formatGrams(item.grams)} × ${item.price.toFixed(2)}€/kg = *${subtotal.toFixed(2)}€*\n\n`
    })
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `💰 *TOTAL ESTIMADO:* ${total.toFixed(2)}€\n`
    msg += `_(El precio final se confirmará tras el corte exacto)_`
    if (f.notes) msg += `\n\n📝 *Notas:* ${f.notes}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // ── Vista carrito vacío ──
  if (cart.length === 0 && view === 'cart') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Tu Pedido</h3>
          <button className="close-btn" onClick={onClose} type="button">✕</button>
        </div>
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <p>Tu carrito está vacío</p>
          <small>Añade productos para comenzar tu pedido</small>
          <button className="btn-primary" onClick={onContinueShopping} style={{marginTop: '1.5rem'}} type="button">
            Ir a la Tienda
          </button>
        </div>
      </div>
    )
  }

  // ── Vista formulario ──
  if (view === 'form') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Tus Datos</h3>
          <button className="close-btn" onClick={onClose} type="button">✕</button>
        </div>
        <div className="order-form">
          <p className="form-intro">📋 Rellena tus datos una vez. Después podrás seguir añadiendo productos sin perder esta información.</p>

          <div className="form-group">
            <label>Nombre completo *</label>
            <input
              value={customerForm.name}
              onChange={e => onFormChange({...customerForm, name: e.target.value})}
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label>Teléfono *</label>
            <input
              value={customerForm.phone}
              onChange={e => onFormChange({...customerForm, phone: e.target.value})}
              placeholder="Tu número de teléfono"
              type="tel"
            />
          </div>

          <div className="form-group">
            <label>Modalidad *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" value="pickup"
                  checked={customerForm.delivery === 'pickup'}
                  onChange={() => onFormChange({...customerForm, delivery: 'pickup'})}
                />
                🏪 Recogida en tienda
              </label>
              <label className="radio-label">
                <input type="radio" value="delivery"
                  checked={customerForm.delivery === 'delivery'}
                  onChange={() => onFormChange({...customerForm, delivery: 'delivery'})}
                />
                🏠 Envío a domicilio
              </label>
            </div>
          </div>

          {customerForm.delivery === 'delivery' && (
            <LocationPicker form={customerForm} onFormChange={onFormChange} />
          )}

          <div className="form-group">
            <label>Hora deseada *</label>
            <input
              type="time"
              value={customerForm.time}
              onChange={e => onFormChange({...customerForm, time: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Notas adicionales</label>
            <textarea
              value={customerForm.notes}
              onChange={e => onFormChange({...customerForm, notes: e.target.value})}
              placeholder="Corte especial, instrucciones de entrega..."
              rows={3}
            />
          </div>

          <button className="btn-whatsapp-order" onClick={handleFormSave} disabled={!isFormValid()} type="button">
            ✅ Guardar datos y continuar
          </button>
          <button className="btn-back" onClick={() => setView('cart')} type="button">
            ← Volver al carrito
          </button>
        </div>
      </div>
    )
  }

  // ── Vista confirmación ──
  if (view === 'confirm') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Confirmar Pedido</h3>
          <button className="close-btn" onClick={onClose} type="button">✕</button>
        </div>
        <div className="confirm-view">
          <div className="confirm-client">
            <h4>📋 Datos del pedido</h4>
            <div className="confirm-row"><span>Cliente</span><strong>{customerForm.name}</strong></div>
            <div className="confirm-row"><span>Teléfono</span><strong>{customerForm.phone}</strong></div>
            <div className="confirm-row"><span>Hora</span><strong>{customerForm.time}</strong></div>
            <div className="confirm-row">
              <span>Modalidad</span>
              <strong>{customerForm.delivery === 'pickup' ? 'Recogida en tienda' : 'Envío a domicilio'}</strong>
            </div>
            {customerForm.delivery === 'delivery' && (
              <>
                <div className="confirm-row"><span>Dirección</span><strong>{customerForm.address}</strong></div>
                {customerForm.locationLink && (
                  <div className="confirm-row">
                    <span>Mapa</span>
                    <a href={customerForm.locationLink} target="_blank" rel="noreferrer" className="confirm-map-link">Ver ubicación →</a>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="confirm-products">
            <h4>🛒 Productos ({cart.length})</h4>
            {cart.map(item => (
              <div key={item.id} className="confirm-item">
                <span className="confirm-item-name">{item.emoji} {item.name}</span>
                <span className="confirm-item-detail">
                  {formatGrams(item.grams)} × {item.price.toFixed(2)}€/kg = <strong>{calcItemTotal(item).toFixed(2)}€</strong>
                </span>
              </div>
            ))}
          </div>

          <div className="confirm-total">
            <span>Total estimado</span>
            <strong>{total.toFixed(2)}€</strong>
          </div>
          <p className="confirm-note">El precio final se confirmará al hacer el corte exacto solicitado.</p>

          <button className="btn-whatsapp-send" onClick={sendWhatsApp} type="button">
            <WhatsAppIcon />
            Enviar pedido por WhatsApp
          </button>
          <button className="btn-back" onClick={() => setView('cart')} type="button">← Volver a editar el pedido</button>
          <button className="btn-back-shopping" onClick={() => { setView('cart'); onContinueShopping() }} type="button">
            🛍️ Seguir comprando
          </button>
        </div>
      </div>
    )
  }

  // ── Vista carrito principal ──
  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>
          Tu Pedido
          {formSubmitted && <span className="client-badge">👤 {customerForm.name}</span>}
        </h3>
        <button className="close-btn" onClick={onClose} type="button">✕</button>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-top">
              <span className="cart-item-emoji">{item.emoji}</span>
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price.toFixed(2)}€/kg</span>
              </div>
              <button className="remove-btn" onClick={() => onRemove(item.id)} type="button" aria-label="Quitar">✕</button>
            </div>
            <div className="cart-item-bottom">
              <div className="cart-grams-controls">
                <button onClick={() => onGramsChange(item.id, Math.max(50, item.grams - 100))} type="button">−100g</button>
                <input
                  type="number" min="50" step="50" value={item.grams}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10)
                    if (!isNaN(val) && val > 0) onGramsChange(item.id, val)
                  }}
                />
                <span className="cart-grams-unit">g</span>
                <button onClick={() => onGramsChange(item.id, item.grams + 100)} type="button">+100g</button>
              </div>
              <span className="cart-item-total">{calcItemTotal(item).toFixed(2)}€</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-continue-shopping">
        <button className="btn-continue" onClick={onContinueShopping} type="button">← Seguir añadiendo productos</button>
      </div>

      {!formSubmitted && (
        <div className="cart-data-reminder">
          <span>⚠️ Necesitamos tus datos antes de enviar</span>
          <button className="btn-link" onClick={() => setView('form')} type="button">Rellenar datos →</button>
        </div>
      )}

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total estimado</span>
          <strong>{total.toFixed(2)}€</strong>
        </div>
        {formSubmitted ? (
          <>
            <button className="btn-finish-order" onClick={() => setView('confirm')} type="button">✅ Terminar pedido y enviar</button>
            <button className="btn-edit-data" onClick={() => setView('form')} type="button">✏️ Editar mis datos</button>
          </>
        ) : (
          <button className="btn-whatsapp-order" onClick={() => setView('form')} type="button">Continuar con el pedido →</button>
        )}
      </div>
    </div>
  )
}