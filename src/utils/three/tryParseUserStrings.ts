import type * as Three from 'three'

type UserStringData = {
    nodeInstanceId?: string
    portInstanceId?: string
    branchPath?: string
    branchEntryIndex?: string
}

type UserString = [key: string, value: string]

export const tryParseUserStrings = (o: Three.Object3D): UserStringData => {
    const userStrings: UserString[] = o.userData?.attributes?.userStrings ?? []
    return userStrings.reduce((all, [k, v]) => {
        all[k] = v
        return all
    }, {} as Record<string, string>)
}