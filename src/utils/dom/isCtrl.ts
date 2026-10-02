export const isCtrl = (e: KeyboardEvent | PointerEvent | MouseEvent): boolean => {
    return e.ctrlKey || e.metaKey
}