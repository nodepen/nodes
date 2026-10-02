import { clamp } from '../numerics'
import type { RGB } from './RGB'

/**
 * Given an RGB triple, return its `#RRGGBB` hex string representation.
 * @param {RGB} rgb The color to convert
 * @returns
 */
export const rgbToHex = ({ r, g, b }: RGB): string => {
    const toHexChannel = (channel: number): string =>
        Math.round(clamp(Number.isNaN(channel) ? 0 : channel, 0, 255))
            .toString(16)
            .padStart(2, '0')

    return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`.toUpperCase()
}
