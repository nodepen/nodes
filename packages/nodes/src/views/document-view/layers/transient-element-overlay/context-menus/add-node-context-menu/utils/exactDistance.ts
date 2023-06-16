export const exactDistance = (a: string, b: string): number => {
  return a.toUpperCase() === b.toUpperCase() ? 1 : 0
}
