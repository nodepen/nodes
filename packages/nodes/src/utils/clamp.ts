/**
 * Given a value, return that value within a specified minimum and maximum value
 * @param {number} value The value to clamp
 * @param {number} min The minimum allowed value (inclusive)
 * @param {number} max The maximum allowed value (inclusive)
 * @returns
 */
export const clamp = (value: number, min: number, max: number): number => {
    return value < min ? min : value > max ? max : value
}