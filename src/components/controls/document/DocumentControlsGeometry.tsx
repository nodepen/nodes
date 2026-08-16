import { useCallback } from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { useDispatch, useStore } from '@/store'
import { getDataTreeSummary } from '@/utils/data-trees'

type DocumentControlsGeometryProps = {
    nodeInstanceId: string
    portInstanceId: string
    valueType: NodePen.DataTreeValueType
    isDisabled?: boolean
}

export const DocumentControlsGeometry = ({ nodeInstanceId, portInstanceId, valueType, isDisabled }: DocumentControlsGeometryProps) => {
    const { startModelSelection } = useDispatch()

    const currentValue = useStore((state) => state.document.nodes[nodeInstanceId]?.values[portInstanceId])
    const hasValue = (currentValue?.stats?.valueCount ?? 0) > 0

    const handlePickGeometry = useCallback(() => {
        startModelSelection(nodeInstanceId, portInstanceId, valueType)
    }, [startModelSelection, nodeInstanceId, portInstanceId, valueType])

    if (isDisabled) {
        return (
            <div className="np-w-full np-flex np-items-center">
                <p className="np-pl-1 np-pt-1 np-min-w-0 np-truncate np-text-xs np-text-grey-3 np-font-panel np-select-none">
                    {hasValue ? getDataTreeSummary(currentValue) : `Set ${valueType}`}
                </p>
            </div>
        )
    }

    return (
        <div className="np-w-full np-flex np-items-center np-justify-between np-gap-1">
            <p className={`np-pl-1 np-pt-1 np-min-w-0 np-truncate np-text-xs np-font-panel np-select-none ${hasValue ? 'np-text-dark' : 'np-text-grey-2 hover:np-text-dark hover:np-cursor-pointer'}`} onClick={hasValue ? undefined : handlePickGeometry}>
                {hasValue ? getDataTreeSummary(currentValue) : `Set ${valueType}`}
            </p>
            <div className="np-w-5 np-h-5 np-mr-1.5 np-flex-shrink-0 np-flex np-justify-center np-items-center np-rounded-full hover:np-bg-grey hover:np-cursor-pointer" onClick={handlePickGeometry}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </div>
    )
}
