import type { RGB } from './RGB'

/**
 * Given a `color` `DataTreeValue` string (`"{R},{G},{B}"`), return its RGB triple.
 * Returns `null` when the string doesn't parse as three comma-separated channels.
 * @param {string} value The color value string to parse
 * @returns
 */
export const colorValueStringToRgb = (value: string): RGB | null => {
    const channels = value.split(',').map((channel) => Number.parseInt(channel.trim(), 10))

    if (channels.length !== 3 || channels.some((channel) => Number.isNaN(channel))) {
        return null
    }

    const [r, g, b] = channels

    return { r, g, b }
}
