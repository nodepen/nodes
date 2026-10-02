/** Prefix `className` with `data-` */
export const targetIsChildOf = (e: Event, className: string): boolean => {
    return !!(e.target as Element).closest?.(`[${className}]`)
}