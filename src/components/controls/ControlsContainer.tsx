import React from 'react'
import { Layer } from '@/views/common'
import { useDispatch, useStore } from '$'
import {
    DocumentInfoControl,
    PinnedInputsControl,
    PinnedOutputsControl,
    TemplateLibraryControl,
} from './panels'

const ControlsContainer = (): React.ReactElement => {
    const templates = useStore((state) => state.templates)

    return (
        <ControlsContainerLayout>
            {/* <DocumentInfoControl /> */}
            <PinnedInputsControl />
            <PinnedOutputsControl />
            <TemplateLibraryControl templates={templates} />
        </ControlsContainerLayout>
    )
}

import ActiveUserControl from './users/ActiveUserControl'
import DocumentToolsControl from './tools/DocumentToolsControl'
import ActiveDocumentControl from './document/ActiveDocumentControl'
import HelpButton from './HelpButton'
import { COLORS } from '@/constants'
import { CircleButton } from '../layout/CircleButton'

type LayoutProps = {
    children: React.ReactNode
}

const ControlsContainerLayout = ({ children }: LayoutProps): React.ReactElement => {
    const shadowResizeProxyRef = useStore((state) => state.registry.shadows.proxyRefs['controls'])

    const { clearInterface } = useDispatch()

    return (
        <Layer fixed id="np-controls-layer" z={90}>
            <div className="np-w-full np-h-full np-relative">
                <div className='np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-col np-justify-start np-items-center np-pointer-events-none np-z-50'>
                    <div className='np-w-full np-pt-9 np-pl-9 np-pr-9 np-flex np-justify-between np-items-center'>
                        <ActiveDocumentControl />
                        <div className='np-flex np-items-center'>
                            <div className='np-ml-2 np-p-0.5 np-rounded-full np-bg-light np-shadow-main np-z-10 np-pointer-events-auto'>
                                <div className='np-h-6 np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark np-overflow-hidden np-group hover:np-cursor-pointer'>
                                    <div className='np-h-full np-flex np-items-center np-justify-center np-rounded-full group-hover:np-bg-grey'>
                                        <svg aria-hidden="true" fill={COLORS.DARK} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className='np-w-4 np-h-4 np-ml-1 np-mr-1'>
                                            <path d="M2.87 2.298a.75.75 0 0 0-.812 1.021L3.39 6.624a1 1 0 0 0 .928.626H8.25a.75.75 0 0 1 0 1.5H4.318a1 1 0 0 0-.927.626l-1.333 3.305a.75.75 0 0 0 .811 1.022 24.89 24.89 0 0 0 11.668-5.115.75.75 0 0 0 0-1.175A24.89 24.89 0 0 0 2.869 2.298Z" />
                                        </svg>
                                        <p className='np-text-xs np-text-dark np-font-panel np-pr-2 np-translate-y-px'>Share</p>
                                    </div>
                                </div>
                            </div>
                            <div className='np-ml-2 np-p-0.5 np-rounded-full np-bg-light np-shadow-main np-z-10 np-pointer-events-auto'>
                                <div className='np-h-6 np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark np-overflow-hidden np-group hover:np-cursor-pointer'>
                                    <div className='np-h-full np-flex np-items-center np-justify-center np-rounded-full group-hover:np-bg-grey'>
                                        <svg aria-hidden="true" fill={COLORS.DARK} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className='np-w-4 np-h-4 np-ml-1 np-mr-1'>
                                            <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                                        </svg>
                                        <p className='np-text-xs np-text-dark np-font-panel np-pr-2 np-translate-y-px'>Give feedback</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-col np-justify-end np-items-center np-pointer-events-none np-z-50">
                    <div className='np-w-full np-pb-8 np-pl-7 np-pr-7 np-grid np-grid-cols-3'>
                        <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-start np-items-center'>
                            <ActiveUserControl />
                        </div>
                        <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-center np-items-center'>
                            <DocumentToolsControl />
                        </div>
                        <div className='np-w-full np-h-full np-pr-1 np-flex np-flex-grow np-justify-end np-items-center'>
                            <div className='np-flex np-flex-col np-pr-0.5'>
                                <div className='np-ml-2 np-mb-2 np-p-0.5 np-rounded-full np-bg-light np-shadow-main np-z-10 np-pointer-events-auto'>
                                    <div className='np-flex np-items-center np-justify-center np-rounded-full np-overflow-hidden'>
                                        <CircleButton>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-w-4 np-h-4">
                                                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                            </svg>
                                        </CircleButton>
                                        <div className='np-ml-0.5 np-mr-0.5 np-h-3 np-w-12 np-rounded-full np-border-2 np-border-dark' />
                                        <div className='np-h-3 np-w-12 np-rounded-full np-border-2 np-border-dark' />
                                    </div>
                                </div>
                            </div>
                            {/* <HelpButton /> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layer>
    )
}

export default React.memo(ControlsContainer)
