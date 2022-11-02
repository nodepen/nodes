import type { DataTree } from '../data'

export type SolutionData = {
    id: string
    manifest: {
        streamObjectIds: string[]
    }
    values: {
        [nodeInstanceId: string]: {
            [portInstanceId: string]: DataTree
        }
    }
}