import { DataTree } from '../../../solution/tree'
import { ParameterReference } from '../../../graph'

/** An element that affects the data flow of the graph. */
export type GraphElement = {
    solution: {
        id: string
        mode: 'deferred' | 'immediate'
    }
    sources: {
        [parameterId: string]: ParameterReference[]
    }
    values: {
        [parameterId: string]: DataTree
    }
}