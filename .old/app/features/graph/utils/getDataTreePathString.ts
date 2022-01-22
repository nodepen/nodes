export const getDataTreePathString = (path: number[]): string => {
  return `{${path.join(';')}}`
}
