export type GradientGripColor = {
    r: number
    g: number
    b: number
}

export type GradientGrip = {
    /** 0-1, remapped by component & inputs*/
    position: number
    colorLeft: GradientGripColor
    /** Matches colorLeft for smooth transitions, differs for hard stops */
    colorRight: GradientGripColor
}

export type GradientConfig = {
    grips: GradientGrip[]
    /** true for hard stops, false for smooth transitions */
    linear: boolean
}
