// Currently only supporting bezier and linear
export type GraphMapperGraphType =
    | 'bezier'
    | 'conic'
    | 'gaussian'
    | 'linear'
    | 'parabola'
    | 'perlin'
    | 'power'
    | 'sinc'
    | 'sine'
    | 'sine-summation'
    | 'square-root'

export type GraphMapperGrip = {
    x: number
    y: number
}

export type GraphMapperDomain = {
    min: number
    max: number
}

export type GraphMapperConfig = {
    graphType: GraphMapperGraphType | null
    grips: GraphMapperGrip[]
    domain: {
        /** The domain incoming values are read against, along the graph's x axis. */
        source: GraphMapperDomain
        /** The domain mapped values are written into, along the graph's y axis. */
        target: GraphMapperDomain
    }
}
