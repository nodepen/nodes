export type ValueListConfig = {
    listMode: 'dropdown' | 'checklist'
    items: {
        // Label
        name: string
        expression: string
        isSelected: boolean
    }[]
}