import { NumberSliderStore } from './NumberSliderStore'
import { NumberSliderAction } from './NumberSliderAction'

export const reducer = (state: NumberSliderStore, action: NumberSliderAction): NumberSliderStore => {
  switch (action.type) {
    case 'set-rounding': {
      return state
    }
    case 'set-precision': {
      return state
    }
    case 'set-domain-minimum': {
      return state
    }
    case 'set-domain-maximum': {
      return state
    }
    case 'set-value': {
      return state
    }
    default: {
      throw new Error(`Invalid action attempted during number slider configuration.`)
    }
  }
}
