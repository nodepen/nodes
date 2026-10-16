export type PortTemplate = {
    __order: number
    __direction: PortDirection
    name: string
    nickName: string
    description: string
    typeName: string
    keywords: string[]
    isOptional: boolean
    access: PortAccess
    defaultValue?: string
}

export type PortDirection = 'input' | 'output'

export type PortAccess = 'item' | 'list' | 'tree'
