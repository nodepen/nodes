import { NodePen } from 'glib'

type SolutionReference = {
    status: 'ready'
} | {
    status: 'cached'
    data: NodePen.DataTree
}

export type SolutionState = {
    [solutionId: string]: {
        [elementId: string]: {
            [parameterId: string]: SolutionReference | undefined
        }
    }
}