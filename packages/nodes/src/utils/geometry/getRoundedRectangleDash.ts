export const getRoundedRectangleDash = (
  targetDash: number,
  targetGap: number,
  width: number,
  height: number,
  cornerRadius: number,
  scale = 1
): { strokeDasharray: string; strokeDashoffset: string } => {
  const targetSpan = targetDash + targetGap

  const pathLength =
    [2 * Math.PI * cornerRadius, 2 * (height - 2 * cornerRadius), 2 * (width - 2 * cornerRadius)].reduce(
      (partial, value) => value + partial,
      0
    ) * scale

  const dashSegmentCount = Math.floor(pathLength / targetSpan)
  const dashSegmentOverflow = pathLength % dashSegmentCount

  const dashSegmentLength = targetSpan + dashSegmentOverflow / dashSegmentCount

  const dashSegmentFraction = dashSegmentLength / targetSpan
  const dashSegmentDash = dashSegmentFraction * targetDash
  const dashSegmentGap = dashSegmentFraction * targetGap

  return { strokeDasharray: `${dashSegmentDash} ${dashSegmentGap}`, strokeDashoffset: `${dashSegmentLength}` }
}
