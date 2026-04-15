export const targetIsScrolling = (e: Event): boolean => {
    return !!(e.target as Element).closest?.('[data-scrolling]')
}