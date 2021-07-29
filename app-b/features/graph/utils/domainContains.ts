export const domainContains = (domain: [min: number, max: number], value: number): boolean => {
  const [min, max] = domain
  return value > min && value < max
}
