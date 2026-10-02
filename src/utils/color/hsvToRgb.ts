import type { HSV } from './HSV'
import type { RGB } from './RGB'

/**
 * Given an HSV triple, return its RGB (0-255 per channel) representation.
 * @param {HSV} hsv The color to convert
 * @returns
 */
export const hsvToRgb = ({ h, s, v }: HSV): RGB => {
    const hue = ((h % 360) + 360) % 360

    const c = v * s
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
    const m = v - c

    const [r, g, b] = (() => {
        if (hue < 60) return [c, x, 0]
        if (hue < 120) return [x, c, 0]
        if (hue < 180) return [0, c, x]
        if (hue < 240) return [0, x, c]
        if (hue < 300) return [x, 0, c]
        return [c, 0, x]
    })()

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    }
}
