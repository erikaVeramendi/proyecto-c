import { useState } from 'react'
import type { CustomerForm } from '../types'

interface LocationPickerProps {
  form: CustomerForm
  onFormChange: (f: CustomerForm) => void
}

export default function LocationPicker({ form, onFormChange }: LocationPickerProps) {
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const useMyLocation = () => {
    setError('')
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización. Por favor escribe la dirección manualmente.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const link = `https://www.google.com/maps?q=${lat},${lng}`
        onFormChange({
          ...form,
          locationLat: lat,
          locationLng: lng,
          locationLink: link,
          address: form.address || `Ubicación GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`
        })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        if (err.code === 1) setError('Permiso denegado. Activa la ubicación en tu navegador o escribe la dirección manualmente.')
        else if (err.code === 2) setError('No se pudo obtener tu ubicación. Inténtalo de nuevo.')
        else if (err.code === 3) setError('Tiempo de espera agotado. Inténtalo de nuevo.')
        else setError('Error al obtener ubicación.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const searchOnGoogleMaps = () => {
    if (!searchQuery.trim()) {
      setError('Escribe una dirección para buscar')
      return
    }
    setError('')
    const encoded = encodeURIComponent(searchQuery.trim())
    const link = `https://www.google.com/maps/search/?api=1&query=${encoded}`
    onFormChange({
      ...form,
      address: searchQuery.trim(),
      locationLink: link,
      locationLat: null,
      locationLng: null,
    })
    window.open(link, '_blank')
  }

  const clearLocation = () => {
    onFormChange({ ...form, locationLat: null, locationLng: null, locationLink: '', address: '' })
    setSearchQuery('')
    setError('')
  }

  const hasLocation = form.locationLink || (form.address && form.address.length > 0)

  return (
    <div className="location-picker">
      <label className="loc-label">📍 Dirección de entrega *</label>

      {hasLocation && (
        <div className="loc-current">
          <div className="loc-current-info">
            <span className="loc-icon">✅</span>
            <div>
              <strong>Ubicación seleccionada</strong>
              <p>{form.address}</p>
              {form.locationLink && (
                <a href={form.locationLink} target="_blank" rel="noreferrer" className="loc-link">
                  Ver en Google Maps →
                </a>
              )}
            </div>
          </div>
          <button className="loc-clear" onClick={clearLocation} type="button">Cambiar</button>
        </div>
      )}

      {!hasLocation && (
        <>
          <button className="loc-btn-gps" onClick={useMyLocation} disabled={locating} type="button">
            {locating ? '⏳ Obteniendo ubicación...' : '📍 Usar mi ubicación actual'}
          </button>
          <div className="loc-divider"><span>o</span></div>
          <div className="loc-search">
            <label>Buscar dirección en Google Maps</label>
            <div className="loc-search-row">
              <input
                type="text"
                placeholder="Calle, número, ciudad..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); searchOnGoogleMaps() } }}
              />
              <button onClick={searchOnGoogleMaps} type="button" className="loc-btn-search">
                🔍 Buscar
              </button>
            </div>
            <small className="loc-help">
              Se abrirá Google Maps para que verifiques la dirección exacta. Tu ubicación se enviará por WhatsApp.
            </small>
          </div>
        </>
      )}

      {error && <div className="loc-error">{error}</div>}
    </div>
  )
}