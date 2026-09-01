import { diceCoefficient } from './diceCoefficient'

/**
 * Distance function for `useTextSearch`, built on `diceCoefficient`.
 * @returns A distance in [0, 1], where 0 is a perfect match.
 */
export const diceDistance = (a: string, b: string): number => {
    const isDirectMatch = a.length > 0 && b.length > 0 && (a.includes(b) || b.includes(a))

    if (isDirectMatch) {
        const lengthRatio = Math.min(a.length, b.length) / Math.max(a.length, b.length)
        return (1 - lengthRatio) * 0.5
    }

    const similarity = diceCoefficient(a, b)

    return 0.5 + (1 - similarity) * 0.5
}
