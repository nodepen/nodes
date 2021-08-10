export type NumberSliderData = {
    mode: 'integer' | 'rational' | 'even' | 'odd'
    domain: [min: number, max: number]
    /**
     * 0 implies integer type
     */
    precision: 0 | 1 | 2 | 3 | 4 | 5 | 6
}