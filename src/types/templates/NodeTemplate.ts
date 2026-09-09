import type { PortTemplate } from './PortTemplate'

export type NodeTemplate = {
    guid: string
    name: string
    nickName: string
    description: string
    keywords: string[]
    icon?: string
    libraryName: string
    category: string
    subcategory: string
    isObsolete: boolean
    inputs: PortTemplate[]
    outputs: PortTemplate[]
    toggles: NodeToggle[]
}

// Bespoke menu items per-component
// i.e. Cull Duplicates "Leave One" | "Cull All" | "Average"
export type NodeToggle = {
    mode: 'checkbox' | 'radio'
    items: {
        value: string
        label: string
    }[]
}
