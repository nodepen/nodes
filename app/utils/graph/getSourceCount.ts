export const getSourceCount = (map: { [key: string]: { element: string, parameter: string }[] }): number => {
  return Object.values(map).reduce((count, sources) => count + sources.length, 0)
}