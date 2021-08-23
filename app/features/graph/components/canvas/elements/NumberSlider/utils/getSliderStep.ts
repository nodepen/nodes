import { NodePen } from 'glib'

export const getSliderStep = (
  rounding: NodePen.Element<'number-slider'>['current']['rounding'],
  precision: NodePen.Element<'number-slider'>['current']['precision'],
  domain: NodePen.Element<'number-slider'>['current']['domain'],
  width: number
): number => {
  const [min, max] = domain

  switch (rounding) {
    case 'rational': {
      const count = (max - min) * Math.pow(10, precision)
      return width / count
    }
    case 'even':
    case 'odd':
    case 'integer': {
      const count = max - min
      return rounding === 'integer' ? width / count : width / (count / 2)
    }
  }
}
