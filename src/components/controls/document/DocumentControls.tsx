import { COLORS } from '@/constants'
import { useDispatch, useStore } from '@/store'
import { useCallback, useRef } from 'react'
import { shallow } from 'zustand/shallow'
import { DocumentControlsInput } from './DocumentControlsInput'

type ControlsProps = {
    isEditable?: boolean
    hideHeader?: boolean
}
export const DocumentControls = ({ isEditable, hideHeader }: ControlsProps) => {
    const { apply } = useDispatch()

    const closeButtonRef = useRef<HTMLDivElement>(null)

    const handleClose = useCallback(() => {
        apply((state) => {
            state.ui.sidebar.isDocumentControlsOpen = false
        })
    }, [apply])

    const inputControls = useStore((state) => [...state.document.controls.input].sort((a, b) => a.order - b.order), shallow)

    return <div className="np-w-full np-h-full np-flex np-flex-col np-justify-start np-items-center">
        {!hideHeader ? (<div className="np-w-full np-pl-0.5 np-h-8 np-flex np-items-center np-justify-start">
            <div className='np-w-8 np-h-8 np-ml-1 np-p-0.5'>
                <div className='np-w-full np-h-full  np-rounded-full np-flex np-items-center np-justify-center np-border-2 np-border-dark'>
                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                        <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
            </div>
            <p className="np-ml-2 np-flex-grow np-text-[13px] np-text-dark np-font-panel np-leading-tight np-translate-y-px">
                Script Controls
            </p>
            <div ref={closeButtonRef} className='np-w-6 np-h-6 np-mr-1.5 np-flex np-justify-center np-items-center np-rounded-full hover:np-bg-grey hover:np-cursor-pointer' onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </div>) : null}
        <div className="np-w-full np-grow np-flex np-flex-col np-items-center np-pt-2 np-pb-2 np-overflow-y-auto">
            {inputControls.length ? inputControls.map((control) => (
                <DocumentControlsInput
                    key={`${control.ref.nodeInstanceId}-${control.ref.portInstanceId}`}
                    nodeInstanceId={control.ref.nodeInstanceId}
                    portInstanceId={control.ref.portInstanceId}
                />
            )) : (
                <div className='np-w-full np-h-full np-flex np-flex-col np-justify-center np-items-center'>
                    <p className="np-text-xs np-text-dark np-font-panel">
                        No controls set.
                    </p>
                    <p className="np-text-xs np-text-dark np-font-panel">
                        Try pinning a param or number slider!
                    </p>
                </div>
            )}
        </div>
    </div>
}
