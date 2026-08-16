import { useCallback } from 'react'
import { COLORS } from '@/constants'
import { useDispatch, useStore } from '@/store'
import { createSingleValue, tryGetSingleValue } from '@/utils/data-trees'
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

    const currentValue = useStore((state) => tryGetSingleValue(state.document.nodes[nodeInstanceId]?.values[portInstanceId])?.value)

    const commitValue = useCallback((next: 'true' | 'false') => {
        if (isDisabled) {
            return
        }

        apply((state) => {
            state.document.nodes[nodeInstanceId].values[portInstanceId] = createSingleValue(next, 'boolean')
            expireSolution(state)
        })
    }, [apply, nodeInstanceId, portInstanceId, isDisabled])

    const handleSelectTrue = useCallback(() => commitValue('true'), [commitValue])
    const handleSelectFalse = useCallback(() => commitValue('false'), [commitValue])

    if (isDisabled) {
        return (
            <div className="np-w-full np-pl-1 np-flex np-items-center">
                <p className="np-text-xs np-text-grey-3 np-font-panel np-select-none">
                    {currentValue === 'true' ? 'True' : 'False'}
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
