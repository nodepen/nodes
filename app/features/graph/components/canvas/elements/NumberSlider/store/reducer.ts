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

      state.errors[action.type] = validate(minimum)

      const incoming: NumberSliderStore['domain']['minimum'] = {
        label: minimum,
        value: parseFloat(minimum),
      }

      const {
        domain: { maximum },
        ...rest
      } = coerceAll(state, state.precision)

      return { ...state, ...rest, domain: { minimum: incoming, maximum } }
    }
    case 'set-domain-maximum': {
      const { maximum } = action

      state.errors[action.type] = validate(maximum)

      const incoming: NumberSliderStore['domain']['minimum'] = {
        label: maximum,
        value: parseFloat(maximum),
      }

      const {
        domain: { minimum },
        ...rest
      } = coerceAll(state, state.precision)

      return { ...state, ...rest, domain: { minimum, maximum: incoming } }
    }
    case 'set-value': {
      const { value } = action

      state.errors['set-value'] = validate(value)

      const incoming: NumberSliderStore['value'] = {
        label: value,
        value: parseFloat(value),
      }

      const { value: _discard, ...rest } = coerceAll(state, state.precision)

      return { ...state, ...rest, value: incoming }
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

const validate = (value: string): string | undefined => {
  const tests = [
    value.split('.').length <= 2,
    /^\d+\.\d+$/.test(value),
    Array.from(value).every((c) => '.0123456789'.includes(c)),
    !isNaN(parseFloat(value)),
  ]

  const pass = tests.every((test) => test)

  return pass ? undefined : 'invalid'
}
