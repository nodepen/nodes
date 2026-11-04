import { COLORS } from '@/constants'
import { usePickFile, usePortValues } from '@/hooks'
import { getDataTreeSummary } from '@/utils/data-trees'

type DocumentControlsFileProps = {
    nodeInstanceId: string
    portInstanceId: string
    isDisabled?: boolean
}

export const DocumentControlsFile = ({ nodeInstanceId, portInstanceId, isDisabled }: DocumentControlsFileProps) => {
    const handlePickFile = usePickFile(nodeInstanceId, portInstanceId)

    const currentValue = usePortValues(nodeInstanceId, portInstanceId)
    const hasValue = (currentValue?.stats?.valueCount ?? 0) > 0

    if (isDisabled || !handlePickFile) {
        return (
            <div className="np-w-full np-flex np-items-center">
                <p className="np-pl-1 np-pt-1 np-min-w-0 np-truncate np-text-xs np-text-dark np-font-panel np-font-[800] np-select-none">
                    {hasValue ? getDataTreeSummary(currentValue) : 'Unset file path'}
                </p>
            </div>
        )
    }

    return (
        <div className="np-w-full np-flex np-items-center np-justify-between np-gap-1">
            <p className={`np-pl-1 np-pt-1 np-min-w-0 np-truncate np-text-xs np-font-panel np-font-[800] np-select-none ${hasValue ? 'np-text-dark' : 'np-text-grey-2 hover:np-text-dark hover:np-cursor-pointer'}`} onClick={hasValue ? undefined : handlePickFile}>
                {hasValue ? getDataTreeSummary(currentValue) : 'Set file path'}
            </p>
            <div className="np-w-5 np-h-5 np-mr-1.5 np-flex-shrink-0 np-flex np-justify-center np-items-center np-rounded-full hover:np-bg-grey hover:np-cursor-pointer" onClick={handlePickFile}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </div>
    )
}
