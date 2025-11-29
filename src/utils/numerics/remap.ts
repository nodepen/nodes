export const remap = (
  value: number,
  sourceDomain: [min: number, max: number],
  targetDomain: [min: number, max: number]
): number => {
  const [sourceMin, sourceMax] = sourceDomain
  const sourceRange = sourceMax - sourceMin

  const pct = (value - sourceMin) / sourceRange

  const [targetMin, targetMax] = targetDomain
  const targetRange = targetMax - targetMin

  return targetRange * pct + targetMin
}
