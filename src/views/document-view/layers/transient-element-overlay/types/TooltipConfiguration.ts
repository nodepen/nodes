export type TooltipConfiguration = {
  /** Position in overlay space */
  position: {
    x: number
    y: number
  }
  /** If true, tooltip will not be dismissed automatically. */
  isSticky: boolean
}
