import { NodePen } from 'glib'

export const coerceValue = (
  value: number,
  precision: NodePen.Element<'number-slider'>['current']['precision']
): number => {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
}
