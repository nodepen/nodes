// When a node has no outputs
export const getLeftRoundedRectanglePath = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): string => {
    return [
        `M ${x + radius} ${y}`,
        `H ${x + width}`,
        `V ${y + height}`,
        `H ${x + radius}`,
        `A ${radius} ${radius} 0 0 1 ${x} ${y + height - radius}`,
        `V ${y + radius}`,
        `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
        'Z',
    ].join(' ')
}
