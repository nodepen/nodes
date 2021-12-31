export const getBackgroundColor = (colorName: 'dark' | 'green' | 'pale' | 'white'): string => {
  switch (colorName) {
    case 'dark':
      return 'bg-dark'
    case 'green':
      return 'bg-green'
    case 'pale':
      return 'bg-pale'
    case 'white':
      return 'bg-white'
    default:
      return 'bg-pale'
  }
}
