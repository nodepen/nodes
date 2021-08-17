import { NodePen } from 'glib'

type NumberSliderData = NodePen.Element<'number-slider'>['current']

export type NumberSliderAction =
  | {
      type: 'set-rounding'
      rounding: NumberSliderData['rounding']
    }
  | {
      type: 'set-precision'
      precision: NumberSliderData['precision']
    }
  | {
      type: 'set-domain-minimum'
      minimum: string
    }
  | {
      type: 'set-domain-maximum'
      maximum: string
    }
  | {
      type: 'set-value'
      value: string
    }
