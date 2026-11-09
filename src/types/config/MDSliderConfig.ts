export type MDSliderDomain = {
    min: number
    max: number
}

export type MDSliderMode = '2D' | '3D'

export type MDSliderConfig = {
    mode: MDSliderMode
    x: MDSliderDomain
    y: MDSliderDomain
    z: MDSliderDomain
}
