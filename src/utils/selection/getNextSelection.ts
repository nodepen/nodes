export type SelectionMode = 'set' | 'add' | 'remove'

export const getNextSelection = (current: readonly string[], ids: readonly string[], mode: SelectionMode): string[] => {
    switch (mode) {
        case 'set': {
            return [...new Set(ids)]
        }
        case 'add': {
            return [...new Set([...current, ...ids])]
        }
        case 'remove': {
            const removed = new Set(ids)
            return current.filter((id) => {
                return !removed.has(id)
            })
        }
    }
}

export const getSelectionMode = (event: { shiftKey: boolean, ctrlKey: boolean }): SelectionMode => {
    return event.shiftKey ? 'add' : event.ctrlKey ? 'remove' : 'set'
}

