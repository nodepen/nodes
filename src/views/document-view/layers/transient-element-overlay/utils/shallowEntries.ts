/** zustand shallow but for `Object.entries()` */
export const shallowEntries = <V,>(a: [string, V][], b: [string, V][]): boolean => {
    if (a.length !== b.length) {
        return false
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
            return false
        }
    }

    return true
}
