import { SizeOption } from '../types'

export const getSizeClass = (size: SizeOption): [divHeight: string, textHeight: string] => {
  switch (size) {
    case 'lg':
      return ['h-8', 'text-lg']
    case 'md':
      return ['h-6', 'text-md']
    case 'sm':
      return ['h-6', 'text-sm']
    default:
      return ['h-6', 'text-md']
  }
}
