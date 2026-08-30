import type { HSV } from './HSV'
import type { RGB } from './RGB'

/**
 * Given an RGB triple, return its HSV representation.
 * @param {RGB} rgb The color to convert
 * @returns
 */
export const rgbToHsv = ({ r, g, b }: RGB): HSV => {
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255

    const max = Math.max(rn, gn, bn)
    const min = Math.min(rn, gn, bn)
    const delta = max - min

    let h = 0

    if (delta !== 0) {
        if (max === rn) {
            h = 60 * (((gn - bn) / delta) % 6)
        } else if (max === gn) {
            h = 60 * (((bn - rn) / delta) + 2)
        } else {
            h = 60 * (((rn - gn) / delta) + 4)
        }
    }

    if (h < 0) {
        h += 360
    }

    const s = max === 0 ? 0 : delta / max
    const v = max

    return { h, s, v }
}
