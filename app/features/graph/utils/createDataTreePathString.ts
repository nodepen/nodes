export const createDataTreePathString = (path: number[]): string => {
  return `{${path.join(';')}}`
}
