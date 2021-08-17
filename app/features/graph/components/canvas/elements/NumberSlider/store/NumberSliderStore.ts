import { NodePen } from 'glib'

type NumberSliderData = NodePen.Element<'number-slider'>['current']

export type NumberSliderStore = {
  rounding: NumberSliderData['rounding']
  precision: NumberSliderData['precision']
  domain: {
    minimum: {
      value: number
      label: string
    }
    maximum: {
      value: number
      label: string
    }
  }
  value: {
    value: number
    label: string
  }
  range: {
    value: number
    label: string
  }
  errors: {
    [key in keyof NumberSliderStore]?: string
  }
}
