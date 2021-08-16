import { NodePen } from 'glib'
import { NumberSliderStore } from '../store'
import { coerceValue } from './coerceValue'

type NumberSliderData = NodePen.Element<'number-slider'>['current']

export const initializeStore = (
  rounding: NumberSliderData['rounding'],
  precision: NumberSliderData['precision'],
  domain: NumberSliderData['domain'],
  value: number
): NumberSliderStore => {
  const [min, max] = domain

  const [minValue, minLabel] = coerceValue(min, precision)
  const [maxValue, maxLabel] = coerceValue(max, precision)
  const [valValue, valLabel] = coerceValue(value, precision)
  const [rangeValue, rangeLabel] = coerceValue(max - min, precision)

  return {
    rounding,
    precision,
    domain: {
      minimum: {
        value: minValue,
        label: minLabel,
      },
      maximum: {
        value: maxValue,
        label: maxLabel,
      },
    },
    value: {
      value: valValue,
      label: valLabel,
    },
    range: {
      value: rangeValue,
      label: rangeLabel,
    },
  }
}
