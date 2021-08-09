export const domainContains = (domain: [min: number, max: number], value: number | [number, number]): boolean => {
  switch (typeof value) {
    case 'number': {
      return domainContainsValue(domain, value)
    }
    case 'object': {
      const [min, max] = value
      return domainContainsValue(domain, min) && domainContainsValue(domain, max)
    }
    default: {
      return false
    }
  }
}

const domainContainsValue = (domain: [min: number, max: number], value: number): boolean => {
  const [min, max] = domain
  return value > min && value < max
}
