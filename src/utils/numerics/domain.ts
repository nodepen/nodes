// Given a domain and a value within it, return value t where 0 < t < 1 that represents the position of the value "along" the domain
export const getDomainParameter = (domain: [min: number, max: number], value: number): number => {
    const [min, max] = domain
    const range = max - min

    if (range === 0) {
        return 0
    }

    return (value - min) / range
}

// Given a domain and a parameter along it, return the value. Accepts values outside of 0 to 1
export const getDomainValue = (domain: [min: number, max: number], t: number): number => {
    const [min, max] = domain
    const range = max - min
    return range * t
}

export const remap = (sourceDomain: [min: number, max: number], targetDomain: [min: number, max: number], n: number): number => {
    const t = getDomainParameter(sourceDomain, n)
    const v = getDomainValue(targetDomain, t)

    return v
}