export const targetIsScrollable = (e: Event): boolean => {
    return !!(e.target as Element).closest?.('[data-scrollable]')
}