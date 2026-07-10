// ─── Constantes globales ──────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = '59176446793'
export const PRECIO_ESTANDAR = 15.00

// ─── Reseñas ─────────────────────────────────────────────────────────────────
export const reviews = [
  { name: 'María González', stars: 5, text: 'La mejor carnicería de Madrid. Llevo 20 años comprando aquí y la calidad nunca falla.', date: 'Hace 2 semanas' },
  { name: 'Carlos Martínez', stars: 5, text: 'Los cortes de ternera son excepcionales. Un negocio con mucha historia y tradición.', date: 'Hace 1 mes' },
  { name: 'Ana López', stars: 5, text: 'Atención personalizada y productos fresquísimos. ¡Recomendado 100%!', date: 'Hace 3 semanas' },
  { name: 'Pedro Sánchez', stars: 5, text: 'La carne de cordero es la mejor que he probado. Tradición familiar que se nota en cada corte.', date: 'Hace 1 semana' },
  { name: 'Laura Fernández', stars: 5, text: 'Siempre amables y con los mejores precios. Mi carnicería de confianza desde siempre.', date: 'Hace 2 meses' },
]

// ─── Horario de concurrencia ──────────────────────────────────────────────────
export const horarioConcurrencia = [
  { day: 'Lun', level: 3, label: 'Moderado' },
  { day: 'Mar', level: 2, label: 'Tranquilo' },
  { day: 'Mié', level: 3, label: 'Moderado' },
  { day: 'Jue', level: 4, label: 'Concurrido' },
  { day: 'Vie', level: 5, label: 'Muy concurrido' },
  { day: 'Sáb', level: 5, label: 'Muy concurrido' },
  { day: 'Dom', level: 1, label: 'Cerrado' },
]