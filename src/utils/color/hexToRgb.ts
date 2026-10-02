import type { RGB } from './RGB'

/**
 * Given a hex color string (3 or 6 digits, with or without a leading `#`), return its
 * RGB triple. Returns `null` when the string is not a valid hex color.
 * @param {string} hex The hex string to parse
 * @returns
 */
export const hexToRgb = (hex: string): RGB | null => {
    const normalized = hex.trim().replace(/^#/, '')

    const expanded = normalized.length === 3
        ? normalized.split('').map((channel) => channel + channel).join('')
        : normalized

    if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
        return null
    }

    return {
        r: Number.parseInt(expanded.slice(0, 2), 16),
        g: Number.parseInt(expanded.slice(2, 4), 16),
        b: Number.parseInt(expanded.slice(4, 6), 16),
    }
}
