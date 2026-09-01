// JSON.stringify() comparison but better
export const deepEqual = (a: unknown, b: unknown): boolean => {
    if (a === b) {
        return true
    }

    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
        return false
    }

    if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
            return false
        }
        return a.every((value, i) => deepEqual(value, b[i]))
    }

    const aKeys = Object.keys(a as Record<string, unknown>)
    const bKeys = Object.keys(b as Record<string, unknown>)

    if (aKeys.length !== bKeys.length) {
        return false
    }

    return aKeys.every((key) =>
        Object.prototype.hasOwnProperty.call(b, key) &&
        deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    )
}
