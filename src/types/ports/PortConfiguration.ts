import type { PortFlag } from './PortFlag'
import type { PortAccess } from '../templates/PortTemplate'

export type PortConfiguration = {
    label: string | null
    description?: string
    typeName?: string
    flags: PortFlag[]
    access?: PortAccess // scripting components
}
