/**
 * An element that drives selection actions.
 * @remarks `default` behavior is to overwrite the current selection with the new one.
 */
export type SelectionElement = {
    selection: {
        mode: 'default' | 'add' | 'remove'
    }
}