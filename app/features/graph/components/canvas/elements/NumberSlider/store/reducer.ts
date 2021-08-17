import { NumberSliderStore } from './NumberSliderStore'
import { NumberSliderAction } from './NumberSliderAction'
import { coerceValue } from '../utils'

export const reducer = (state: NumberSliderStore, action: NumberSliderAction): NumberSliderStore => {
  switch (action.type) {
    case 'set-rounding': {
      const { rounding } = action

      const precision = rounding === 'rational' ? state.precision : 0

      return { ...state, rounding, precision, ...coerceAll(state, precision) }
    }
    case 'set-precision': {
      const { precision } = action

      return { ...state, precision, ...coerceAll(state, precision) }
    }
    case 'set-domain-minimum': {
      const { minimum } = action

      const domain: NumberSliderStore['domain'] = {
        minimum: {
          value: parseFloat(minimum),
          label: minimum,
        },
        maximum: { ...state.domain.maximum },
      }

      return { ...state, domain }
    }
    case 'set-domain-maximum': {
      const { maximum } = action

      const domain: NumberSliderStore['domain'] = {
        minimum: { ...state.domain.minimum },
        maximum: {
          value: parseFloat(maximum),
          label: maximum,
        },
      }

      return { ...state, domain }
    }
    case 'set-value': {
      const { value: v } = action

      const value: NumberSliderStore['value'] = {
        label: v,
        value: parseFloat(v),
      }

      return { ...state, value }
    }
    default: {
      throw new Error(`Invalid action attempted during number slider configuration.`)
    }
  }
}

const coerceAll = (
  state: NumberSliderStore,
  precision: NumberSliderStore['precision']
): Pick<NumberSliderStore, 'domain' | 'value' | 'range'> => {
  const [minValue, minLabel] = coerceValue(state.domain.minimum.value, precision)
  const [maxValue, maxLabel] = coerceValue(state.domain.maximum.value, precision)
  const [valValue, valLabel] = coerceValue(state.value.value, precision)
  const [rngValue, rngLabel] = coerceValue(maxValue - minValue, precision)

  return {
    domain: {
      minimum: state.errors['set-domain-minimum']
        ? state.domain.minimum
        : {
            value: minValue,
            label: minLabel,
          },
      maximum: state.errors['set-domain-maximum']
        ? state.domain.maximum
        : {
            value: maxValue,
            label: maxLabel,
          },
    },
    value: state.errors['set-value']
      ? state.value
      : {
          value: valValue,
          label: valLabel,
        },
    range: {
      value: rngValue,
      label: rngLabel,
    },
  }
}
