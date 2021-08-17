import { NumberSliderStore } from './NumberSliderStore'
import { NumberSliderAction } from './NumberSliderAction'
import { coerceValue } from '../utils'

export const reducer = (state: NumberSliderStore, action: NumberSliderAction): NumberSliderStore => {
  const { skipClamp, skipLabel } = action

  switch (action.type) {
    case 'set-rounding': {
      const { rounding } = action

      state.rounding = rounding
      state.precision = rounding === 'rational' ? state.precision : 0

      return { ...state, ...coerceAll(state, action.type, skipClamp, skipLabel) }
    }
    case 'set-precision': {
      const { precision } = action

      state.precision = precision

      return { ...state, ...coerceAll(state, action.type, skipClamp, skipLabel) }
    }
    case 'set-domain-minimum': {
      const { minimum } = action

      state.errors[action.type] = validate(minimum)

      state.domain.minimum.label = minimum
      state.domain.minimum.value = parseFloat(minimum)

      return { ...state, ...coerceAll(state, 'set-domain-minimum', skipClamp, skipLabel) }
    }
    case 'set-domain-maximum': {
      const { maximum } = action

      state.errors[action.type] = validate(maximum)

      state.domain.maximum.label = maximum
      state.domain.maximum.value = parseFloat(maximum)

      return { ...state, ...coerceAll(state, 'set-domain-maximum', skipClamp, skipLabel) }
    }
    case 'set-value': {
      const { value } = action

      state.errors['set-value'] = validate(value)

      state.value.label = value
      state.value.value = parseFloat(value)

      return { ...state, ...coerceAll(state, 'set-value', skipClamp, skipLabel) }
    }
    default: {
      throw new Error(`Invalid action attempted during number slider configuration.`)
    }
  }
}

const coerceAll = (
  state: NumberSliderStore,
  anchor: NumberSliderAction['type'],
  skipClamp = false,
  skipLabel = false
): Pick<NumberSliderStore, 'domain' | 'value' | 'range'> => {
  const { precision } = state

  let adjustedMinimum = toEvenOrOdd(state.domain.minimum.value, state.rounding)
  let adjustedMaximum = toEvenOrOdd(state.domain.maximum.value, state.rounding)
  const adjustedValue = clamp(
    toEvenOrOdd(state.value.value, state.rounding),
    skipClamp ? undefined : [adjustedMinimum, adjustedMaximum]
  )

  const delta = Math.pow(10, -precision) * (state.rounding === 'even' || state.rounding === 'odd' ? 2 : 1)
  const validDomain = adjustedMaximum - adjustedMinimum >= delta

  switch (anchor) {
    case 'set-rounding': {
      adjustedMaximum = validDomain ? adjustedMaximum : adjustedMinimum + delta
      break
    }
    case 'set-domain-minimum': {
      if (state.errors[anchor]) {
        break
      }

      adjustedMaximum = validDomain ? adjustedMaximum : adjustedMinimum + delta
      break
    }
    case 'set-domain-maximum': {
      if (state.errors[anchor]) {
        break
      }

      adjustedMinimum = validDomain ? adjustedMinimum : adjustedMaximum - delta
      break
    }
    default: {
      break
    }
  }

  const [minValue, minLabel] = coerceValue(adjustedMinimum, precision)
  const [maxValue, maxLabel] = coerceValue(adjustedMaximum, precision)
  const [valValue, valLabel] = coerceValue(adjustedValue, precision)
  const [rngValue, rngLabel] = coerceValue(maxValue - minValue, precision)

  return {
    domain: {
      minimum: state.errors['set-domain-minimum']
        ? state.domain.minimum
        : {
            value: minValue,
            label: skipLabel ? state.domain.minimum.label : minLabel,
          },
      maximum: state.errors['set-domain-maximum']
        ? state.domain.maximum
        : {
            value: maxValue,
            label: skipLabel ? state.domain.maximum.label : maxLabel,
          },
    },
    value: state.errors['set-value']
      ? state.value
      : {
          value: valValue,
          label: skipLabel ? state.value.label : valLabel,
        },
    range: {
      value: rngValue,
      label: rngLabel,
    },
  }
}

const toEvenOrOdd = (value: number, rounding: NumberSliderStore['rounding']): number => {
  const even = Math.round(value / 2) * 2

  switch (rounding) {
    case 'even':
      return even
    case 'odd':
      return even + 1
    default:
      return value
  }
}

const validate = (value: string): string | undefined => {
  const tests = [
    value.length > 0,
    value.split('.').length <= 2,
    Array.from(value).every((c) => '-+.0123456789'.includes(c)),
    Array.from(value.substr(1)).every((c) => '.0123456789'.includes(c)),
  ]

  const pass = tests.every((test) => test)

  return pass ? undefined : 'invalid'
}

const clamp = (value: number, domain?: [min: number, max: number]): number => {
  if (!domain) {
    return value
  }

  const [min, max] = domain
  return value < min ? min : value > max ? max : value
}
