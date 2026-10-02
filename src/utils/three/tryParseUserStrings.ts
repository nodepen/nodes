import type * as Three from 'three'

type UserStringData = {
    nodeInstanceId?: string
    portInstanceId?: string
    branchPath?: string
    branchEntryIndex?: string
    previewColor?: string
}

const PREFIX = 'nodepen:'

export const tryParseUserStrings = (o: Three.Object3D): UserStringData => {
    const metadata: Record<string, unknown> = o.userData?.metadata ?? {}
    const result: Record<string, string> = {}

    for (const [key, value] of Object.entries(metadata)) {
        if (key.startsWith(PREFIX) && typeof value === 'string') {
            result[key.slice(PREFIX.length)] = value
        }
    }

    return result
}
