import type { CartItem } from '../types'

export const formatGrams = (g: number): string => {
  if (g >= 1000) {
    const kg = g / 1000
    return Number.isInteger(kg) ? `${kg} kg` : `${kg.toFixed(2)} kg`
  }
  return `${g} g`
}

export const calcItemTotal = (item: CartItem): number => {
  return (item.price * item.grams) / 1000
}