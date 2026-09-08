import { useCallback } from 'react'
import { COLORS } from '@/constants'
import { useDispatch } from '@/store'
import { usePortValues } from '@/hooks'
import { createSingleValue, getDataTreeSummary, tryGetSingleValue } from '@/utils/data-trees'
import { expireSolution } from '@/store/utils'

type DocumentControlsBooleanProps = {
    nodeInstanceId: string
    portInstanceId: string
    isDisabled?: boolean
}

type RadioProps = {
    label: string
    selected: boolean
    onClick: () => void
}

const Radio = ({ label, selected, onClick }: RadioProps) => (
    <div className="np-flex np-items-center hover:np-cursor-pointer" onClick={onClick}>
        <div className="np-w-3 np-h-3 np-flex-shrink-0 np-rounded-full np-flex np-items-center np-justify-center" style={{ border: `2px solid ${COLORS.DARK}` }}>
            {selected ? <div className="np-w-1 np-h-1 np-rounded-full" style={{ background: COLORS.DARK }} /> : null}
        </div>
        <p className="np-ml-1 np-pt-0.5 np-text-xs np-text-dark np-font-panel np-select-none">
            {label}
        </p>
    </div>
)

export const DocumentControlsBoolean = ({ nodeInstanceId, portInstanceId, isDisabled }: DocumentControlsBooleanProps) => {
    const { apply } = useDispatch()

    const currentDataTree = usePortValues(nodeInstanceId, portInstanceId)
    const currentValue = tryGetSingleValue(currentDataTree ?? undefined)?.value

    const hasMultipleValues = (currentDataTree?.stats?.valueCount ?? 0) > 1

    const commitValue = useCallback((next: 'true' | 'false') => {
        if (isDisabled) {
            return
        }

        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            node.values[portInstanceId] = createSingleValue(next, 'boolean')
            expireSolution(state)
        })
    }, [apply, nodeInstanceId, portInstanceId, isDisabled])

    const handleSelectTrue = useCallback(() => commitValue('true'), [commitValue])
    const handleSelectFalse = useCallback(() => commitValue('false'), [commitValue])

    if (isDisabled) {
        return (
            <div className="np-w-full np-pl-1 np-flex np-items-center">
                <p className="np-min-w-0 np-truncate np-text-xs np-text-dark np-font-panel np-select-none">
                    {hasMultipleValues ? getDataTreeSummary(currentDataTree) : (currentValue === 'true' ? 'True' : 'False')}
                </p>
            </div>
        )
    }

    return (
        <div className="np-w-full np-pl-1 np-flex np-items-center np-gap-4">
            <Radio label="True" selected={currentValue === 'true'} onClick={handleSelectTrue} />
            <Radio label="False" selected={currentValue === 'false'} onClick={handleSelectFalse} />
        </div>
    )
}
