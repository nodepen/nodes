import type { DataTree } from '../data'

export type SolutionData = {
    id: string
    manifest: {
        runtimeMessages: {
            [portInstanceId: string]: string
        }
        streamObjectIds: string[]
    }
    values: {
        [nodeInstanceId: string]: {
            [portInstanceId: string]: DataTree
        }
    }
}