import type { ColorValueString } from './ColorValueString'
import type { RGB } from './RGB'

/**
 * Given an RGB triple, return its `color` `DataTreeValue` string representation
 * (matching what the compute side parses back into a `System.Drawing.Color`).
 * @param {RGB} rgb The color to convert
 * @returns
 */
export const rgbToColorValueString = ({ r, g, b }: RGB): ColorValueString => `${r},${g},${b}`
