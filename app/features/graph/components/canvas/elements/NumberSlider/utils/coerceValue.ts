import { NodePen } from 'glib'

export const coerceValue = (
  value: number,
  precision: NodePen.Element<'number-slider'>['current']['precision']
): [value: number, label: string] => {
  const coercedValue = Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)

  const [numberLabel, decimal] = isNaN(coercedValue) ? [''] : coercedValue.toString().split('.')
  const decimalLabel = (decimal ?? '').padEnd(precision, '0')

  const coercedLabel = precision === 0 ? numberLabel : `${numberLabel}.${decimalLabel}`

  return [coercedValue, coercedLabel]
}
