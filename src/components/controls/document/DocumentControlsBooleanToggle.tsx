import { useCallback } from 'react'
import { COLORS } from '@/constants'
import { useDispatch, useStore } from '@/store'
import { expireSolution } from '@/store/utils'
import type { BooleanToggleConfig } from '@/types'

type DocumentControlsBooleanToggleProps = {
    nodeInstanceId: string
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

export const DocumentControlsBooleanToggle = ({ nodeInstanceId, isDisabled }: DocumentControlsBooleanToggleProps) => {
    const { apply } = useDispatch()

    const currentValue = useStore((state) => (state.document.nodes[nodeInstanceId].nodeConfiguration as BooleanToggleConfig)?.value ?? false)

    const commitValue = useCallback((next: 'true' | 'false') => {
        if (isDisabled) {
            return
        }

        apply((state) => {
            ; (state.document.nodes[nodeInstanceId].nodeConfiguration as BooleanToggleConfig).value = next === 'true'
            expireSolution(state)
        })
    }, [apply, nodeInstanceId, isDisabled])

    const handleSelectTrue = useCallback(() => commitValue('true'), [commitValue])
    const handleSelectFalse = useCallback(() => commitValue('false'), [commitValue])

    if (isDisabled) {
        return (
            <div className="np-w-full np-pl-1 np-flex np-items-center">
                <p className="np-text-xs np-text-grey-3 np-font-panel np-select-none">
                    {currentValue ? 'True' : 'False'}
                </p>
            </div>
        )
    }

    return (
        <div className="np-w-full np-pl-1 np-flex np-items-center np-gap-4">
            <Radio label="True" selected={currentValue} onClick={handleSelectTrue} />
            <Radio label="False" selected={!currentValue} onClick={handleSelectFalse} />
        </div>
    )
}
