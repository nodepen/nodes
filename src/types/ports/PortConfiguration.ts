import type { PortFlag } from './PortFlag'

export type PortConfiguration = {
    label: string | null
    description?: string
    typeName?: string
    flags: PortFlag[]
}
