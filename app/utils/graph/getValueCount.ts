export const getValueCount = (data: { [key: string]: string[] }): number => {
  return Object.values(data).reduce((count, branch) => count + branch.length, 0)
}
