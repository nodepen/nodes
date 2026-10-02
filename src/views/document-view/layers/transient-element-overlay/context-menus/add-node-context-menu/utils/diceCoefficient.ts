/**
 * Character-bigram overlap coefficient (Szymkiewicz–Simpson coefficient) between two strings.
 *
 * @returns A similarity in [0, 1], where 1 means every bigram of the shorter string
 * appears in the other, and 0 means no bigrams in common.
 */
export const diceCoefficient = (a: string, b: string): number => {
    if (a === b) {
        return 1
    }

    // Strings shorter than 2 characters have no bigrams to compare.
    if (a.length < 2 || b.length < 2) {
        return a === b ? 1 : 0
    }

    const bigramsOf = (value: string): Map<string, number> => {
        const counts = new Map<string, number>()

        for (let i = 0; i < value.length - 1; i++) {
            const bigram = value.substring(i, i + 2)
            counts.set(bigram, (counts.get(bigram) ?? 0) + 1)
        }

        return counts
    }

    const aBigrams = bigramsOf(a)
    const bBigrams = bigramsOf(b)

    let intersection = 0

    for (const [bigram, aCount] of aBigrams) {
        const bCount = bBigrams.get(bigram)

        if (bCount) {
            intersection += Math.min(aCount, bCount)
        }
    }

    const minBigramCount = Math.min(a.length - 1, b.length - 1)

    return intersection / minBigramCount
}
