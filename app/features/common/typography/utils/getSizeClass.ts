import { SizeOption } from '../types'

export const getSizeClass = (size: SizeOption): [textHeight: string, lineHeight: string] => {
  switch (size) {
    case 'lg':
      return ['text-lg', 'leading-7']
    case 'md':
      return ['text-md', 'leading-6']
    case 'sm':
      return ['text-sm', 'leading-5']
    default:
      return ['text-md', 'leading-5']
  }
}
