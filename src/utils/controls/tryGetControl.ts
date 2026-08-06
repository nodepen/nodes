import type * as NodePen from '@/types'

/**
 * Find a document control by its port reference. Returns `undefined` if no such control exists.
 */
export const tryGetControl = (
    controls: NodePen.DocumentControls,
    controlType: 'input' | 'output',
    nodeInstanceId: string,
    portInstanceId: string
): NodePen.DocumentControl | undefined => {
    return controls[controlType].find(
        (control) => control.ref.nodeInstanceId === nodeInstanceId && control.ref.portInstanceId === portInstanceId
    )
}
