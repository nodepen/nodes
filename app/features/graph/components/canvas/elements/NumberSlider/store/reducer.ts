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
        value: Math.max(Math.pow(10, 6) * -1, parseFloat(minimum)),
      }

      // Constrain maximum based on minimum, if valid
      if (!state.errors[action.type]) {
        const minimumDelta = Math.pow(10, -state.precision)

        const adjustedMaximum =
          state.domain.maximum.value - incoming.value > minimumDelta
            ? state.domain.maximum.value
            : incoming.value + minimumDelta
        const adjustedValue = clamp(state.value.value, [incoming.value, adjustedMaximum])

        state.domain.maximum.value = adjustedMaximum
        state.value.value = adjustedValue
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
        value: Math.min(Math.pow(10, 6), parseFloat(maximum)),
      }

      // Constrain minimum based on maximum, if valid
      if (!state.errors[action.type]) {
        const minimumDelta = Math.pow(10, -state.precision)

        const adjustedMinimum =
          incoming.value - state.domain.minimum.value > minimumDelta
            ? state.domain.minimum.value
            : incoming.value - minimumDelta
        const adjustedValue = clamp(state.value.value, [adjustedMinimum, incoming.value])

        state.domain.minimum.value = adjustedMinimum
        state.value.value = adjustedValue
      }

      const {
        domain: { minimum },
        ...rest
      } = coerceAll(state, state.precision)

      return { ...state, ...rest, domain: { minimum, maximum: incoming } }
    }
    case 'set-value': {
      const { value, clamp: doClamp } = action

      console.log

      state.errors['set-value'] = validate(value)

      const adjustedValue =
        doClamp && !state.errors['set-value']
          ? clamp(parseFloat(value), [state.domain.minimum.value, state.domain.maximum.value])
          : parseFloat(value)

      const incoming: NumberSliderStore['value'] = {
        label: adjustedValue.toString(),
        value: adjustedValue,
      }

      /* eslint-disable-next-line */
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
  const eoAdjustment = state.rounding === 'even' || state.rounding === 'odd' ? 2 : 1
  const delta = Math.pow(10, -precision) * eoAdjustment
  const adjustedMaximum =
    state.domain.maximum.value - state.domain.minimum.value >= delta
      ? state.domain.maximum.value
      : state.domain.minimum.value + delta

  const [minValue, minLabel] = coerceValue(state.domain.minimum.value, precision)
  const [maxValue, maxLabel] = coerceValue(adjustedMaximum, precision)
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
    value.length > 0,
    value.split('.').length <= 2,
    Array.from(value).every((c) => '-+.0123456789'.includes(c)),
    Array.from(value.substr(1)).every((c) => '.0123456789'.includes(c)),
  ]

  const pass = tests.every((test) => test)

  return pass ? undefined : 'invalid'
}

const clamp = (value: number, domain: [min: number, max: number]): number => {
  const [min, max] = domain
  return value < min ? min : value > max ? max : value
}
