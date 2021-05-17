import { DataTree } from '../../../solution/tree'

/** An element that generates and stores solution values. */
export type DataTreeElement = {
    values: {
        [parameterId: string]: DataTree
    }
}