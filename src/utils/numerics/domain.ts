// Given a domain and a value within it, return value t where 0 < t < 1 that represents the position of the value "along" the domain
export const getDomainParameter = (domain: [min: number, max: number], value: number): number => {
    const [min, max] = domain
    const range = max - min

    if (range === 0) {
        return 0
    }

    return (value - min) / range
}