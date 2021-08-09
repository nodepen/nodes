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
    /**
     * Map a specific parameter to its template information.
     * @remarks - Naked parameters are treated as components with only
     *      an 'input' and an 'output' parameter.
     */
    inputs: {
        [parameterInstanceId: string]: number
    }
    outputs: {
        [parameterInstanceId: string]: number
    }
    values: {
        [parameterId: string]: DataTree
    }
}