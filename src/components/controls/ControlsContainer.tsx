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
                                <div className='np-h-6 np-flex np-items-center np-justify-center np-rounded-full np-overflow-hidden hover:np-bg-grey hover:np-cursor-pointer'>
                                    <div className='np-h-6 np-w-6 -np-mr-0.5 np-flex np-items-center np-justify-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-3">
                                            {/* <path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /> */}
                                            <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </div>
                                    <p className='np-text-xs np-text-dark np-font-panel np-pr-2 np-translate-y-px'>Share</p>
                                </div>
                            </div>
                            <div className='np-ml-2 np-p-0.5 np-rounded-full np-bg-light np-shadow-main np-z-10 np-pointer-events-auto'>
                                <div className='np-h-6 np-flex np-items-center np-justify-center np-rounded-full np-overflow-hidden hover:np-bg-grey hover:np-cursor-pointer'>
                                    <div className='np-h-6 np-w-6 -np-mr-0.5 np-flex np-items-center np-justify-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-3">
                                            <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </div>
                                    <p className='np-text-xs np-text-dark np-font-panel np-pr-2 np-translate-y-px'>Give feedback</p>
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
                                    <div className='np-h-6 np-flex np-items-center np-justify-center np-rounded-full np-overflow-hidden'>
                                        <div className='np-h-6 np-w-6 np-mr-0.5 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-w-4 np-h-4">
                                                <path d="m4.5 12.75 6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                            </svg>
                                        </div>
                                        <div className='np-mr-0.5 np-h-3 np-w-12 np-rounded-full np-border-2 np-border-dark' />
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
