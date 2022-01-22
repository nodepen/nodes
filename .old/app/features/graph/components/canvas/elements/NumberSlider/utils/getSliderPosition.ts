export const getSliderPosition = (value: number, domain: [min: number, max: number], width: number): number => {
  const [min, max] = domain
  return ((value - min) / (max - min)) * width
}
