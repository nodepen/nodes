import { NumberSliderStore } from './NumberSliderStore'
import { NumberSliderAction } from './NumberSliderAction'

export const reducer = (state: NumberSliderStore, action: NumberSliderAction): NumberSliderStore => {
  switch (action.type) {
    case 'set-rounding': {
      const { rounding } = action

      return { ...state, rounding }
    }
    case 'set-precision': {
      const { precision } = action

      return { ...state, precision }
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
