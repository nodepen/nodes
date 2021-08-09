export type NumberSliderData = {
    domain: [min: number, max: number]
    /**
     * 0 for integer, >0 for decimal count (up to 6)
     */
    precision: number
}