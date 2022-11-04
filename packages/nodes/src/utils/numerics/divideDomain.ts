export const divideDomain = (domain: [min: number, max: number], segments: number): [min: number, max: number][] => {
    const domainSegments: [min: number, max: number][] = []

    if (segments < 1) {
        return [domain]
    }

    const [min, max] = domain

    const range = max - min
    const segmentCount = Math.round(segments)
    const segmentSize = range / segmentCount

    for (let i = 0; i < segmentCount; i++) {
        const start = segmentSize * i
        const end = start + segmentSize
        domainSegments.push([start, end])
    }

    return domainSegments
}