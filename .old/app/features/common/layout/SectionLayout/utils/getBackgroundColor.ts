export const getBackgroundColor = (colorName: 'dark' | 'green' | 'pale' | 'white' | 'none'): string => {
  switch (colorName) {
    case 'dark':
      return 'bg-dark'
    case 'green':
      return 'bg-green'
    case 'pale':
      return 'bg-pale'
    case 'white':
      return 'bg-white'
    case 'none':
      return 'bg-none'
    default:
      return 'bg-pale'
  }
}
