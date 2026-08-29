import React from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'

type GradientEditorProps = {
    config: NodePen.GradientConfig
    onClose: () => void
}

// TODO
export const GradientEditor = ({ config, onClose }: GradientEditorProps) => {
    return (
        <div className="np-w-80 np-p-0.5">
            <div className="np-w-full np-h-32 np-p-4 np-flex np-flex-col np-items-center np-justify-center np-rounded-md np-border-2 np-border-dashed np-border-dark">
                <p className="np-text-sm np-text-dark np-font-panel np-text-center">
                    Gradient editor not yet implemented.
                </p>
                <p className="np-mt-2 np-text-xs np-text-grey-3 np-font-panel np-text-center">
                    {config.grips.length} grip{config.grips.length === 1 ? '' : 's'} · {config.linear ? 'linear' : 'smooth'}
                </p>
            </div>
            <div className="np-w-full np-p-2 np-flex np-items-center np-justify-end">
                <div className="np-w-6 np-h-6 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
