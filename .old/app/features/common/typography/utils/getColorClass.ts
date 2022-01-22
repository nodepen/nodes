import { ColorOption } from '../types'

export const getColorClass = (color: ColorOption): string => {
  switch (color) {
    case 'dark':
      return 'text-dark'
    case 'darkgreen':
      return 'text-darkgreen'
    default:
      return 'text-dark'
  }
}
