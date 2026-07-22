import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Layer } from '@/views/common'
import { useCallbacks, useDispatch, useStore } from '$'
import {
    DocumentInfoControl,
    PinnedInputsControl,
    PinnedOutputsControl,
} from './panels'

const ControlsContainer = (): React.ReactElement => {
    return (
        <ControlsContainerLayout>
            {/* <DocumentInfoControl /> */}
            <PinnedInputsControl />
            <PinnedOutputsControl />
        </ControlsContainerLayout>
    )
}

import ActiveUserControl from './users/ActiveUserControl'
import DocumentToolsControl from './tools/DocumentToolsControl'
import ActiveDocumentControl from './document/ActiveDocumentControl'
import HelpButton from './HelpButton'
import { COLORS } from '@/constants'
import { CircleButton } from '../layout/CircleButton'
import { expireSolution } from '@/store/utils'
import { SidebarPanel } from './common/SidebarPanel'
import { TemplateLibrary } from './template-library/TemplateLibrary'

type LayoutProps = {
    children: React.ReactNode
}

const ControlsContainerLayout = ({ children }: LayoutProps): React.ReactElement => {
    const { apply } = useDispatch()

    const { onClickHome, onClickProfile } = useCallbacks()

    const handleClickHome = () => {
        onClickHome?.(useStore.getState())
    }

    const handleClickProfile = () => {
        onClickProfile?.(useStore.getState())
    }

    const showComponentLibraryPanel = useStore((state) => state.ui.sidebar.isComponentLibraryOpen)
    const [componentLibraryPosition, setComponentLibraryPosition] = useState<[number, number]>([0, 0])
    const handleClickComponentLibrary = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const { pageX, pageY } = e
        setComponentLibraryPosition([pageX, pageY])
        apply((state) => {
            state.ui.sidebar.isComponentLibraryOpen = true
        })
    }, [])
    const componentLibraryButtonRef = useRef<SVGSVGElement>(null)
    useLayoutEffect(() => {
        const el = componentLibraryButtonRef.current
        if (!el) {
            return
        }
        const { left, width, top, height } = el.getBoundingClientRect()
        setComponentLibraryPosition([left + width / 2, top + height / 2])
    }, [])

    return (
        <Layer id="np-controls-layer" z={90}>
            <div className="np-w-full np-h-full np-relative">
                <div className='np-w-full np-h-full np-absolute np-z-50 np-top-0 np-left-0'>
                    <div className='np-w-full np-h-full np-relative'>
                        <SidebarPanel isOpen={showComponentLibraryPanel} from={componentLibraryPosition} height={240} bottom={38}>
                            <TemplateLibrary />
                        </SidebarPanel>
                    </div>
                </div>
                <div className='np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-col np-justify-start np-items-center np-pointer-events-none np-z-40'>
                    <div className='np-w-full np-pt-9 np-pl-9 np-pr-9 np-flex np-justify-between np-items-center'>
                        <div className='np-flex np-items-center'>
                            <div className='np-mr-1 np-bg-light np-rounded-tl-[32px] np-rounded-bl-[32px] np-rounded-tr-md np-rounded-br-md np-shadow-main'>
                                <CircleButton size="lg" onClick={handleClickHome}>
                                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-6'>
                                        <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                    </svg>
                                </CircleButton>
                            </div>
                            <ActiveDocumentControl />
                        </div>
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
                            <div className='np-ml-2 np-mr-2 np-p-0.5 np-rounded-full np-bg-light np-shadow-main np-z-10 np-pointer-events-auto'>
                                <div className='np-h-6 np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark np-overflow-hidden np-group hover:np-cursor-pointer'>
                                    <div className='np-h-full np-flex np-items-center np-justify-center np-rounded-full group-hover:np-bg-grey'>
                                        <svg aria-hidden="true" fill={COLORS.DARK} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className='np-w-4 np-h-4 np-ml-1 np-mr-1'>
                                            <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                                        </svg>
                                        <p className='np-text-xs np-text-dark np-font-panel np-pr-2 np-translate-y-px'>Give feedback</p>
                                    </div>
                                </div>
                            </div>
                            <CircleButton size="lg" shadow onClick={handleClickProfile}>
                                <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-6">
                                    <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </CircleButton>
                        </div>
                    </div>
                </div>
                <div className="np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-col np-justify-end np-items-center np-pointer-events-none np-z-40">
                    <div className='np-w-full np-pb-4 np-pl-4 np-pr-4 np-grid np-grid-cols-3'>
                        <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-start np-items-center'>
                            <div className='np-p-8 np-flex np-items-center np-gap-1'>
                                <CircleButton shadow tooltip='Component Library' onClick={handleClickComponentLibrary} >
                                    <svg ref={componentLibraryButtonRef} aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-6 np-mb-0.5'>
                                        <path d="M5.25 11.75A2.25 2.25 0 0 1 7.5 9.5h9a2.25 2.25 0 0 1 2.25 2.25v4.5a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-4.5Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                        <path d="M5.25 9.75A2.25 2.25 0 0 1 7.5 7.5h9a2.25 2.25 0 0 1 2.25 2.25v4.5a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-4.5Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" fill={COLORS.LIGHT} />
                                    </svg>
                                </CircleButton>
                                <CircleButton shadow tooltip='Param Library'>
                                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-5 np-mb-0.5'>
                                        <path d="M9.443 7.072 L14.557 7.072 A2.5 2.5 0 0 1 16.722 8.322 L19.278 12.75 A2.5 2.5 0 0 1 19.278 15.25 L16.722 19.678 A2.5 2.5 0 0 1 14.557 20.928 L9.443 20.928 A2.5 2.5 0 0 1 7.278 19.678 L4.722 15.25 A2.5 2.5 0 0 1 4.722 12.75 L7.278 8.322 A2.5 2.5 0 0 1 9.443 7.072 Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                        <path d="M9.443 5.072 L14.557 5.072 A2.5 2.5 0 0 1 16.722 6.322 L19.278 10.75 A2.5 2.5 0 0 1 19.278 13.25 L16.722 17.678 A2.5 2.5 0 0 1 14.557 18.928 L9.443 18.928 A2.5 2.5 0 0 1 7.278 17.678 L4.722 13.25 A2.5 2.5 0 0 1 4.722 10.75 L7.278 6.322 A2.5 2.5 0 0 1 9.443 5.072 Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" fill={COLORS.PALE} />
                                    </svg>
                                </CircleButton>
                            </div>
                            {/* <ActiveUserControl /> */}
                        </div>
                        <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-center np-items-center'>
                            {/* <DocumentToolsControl /> */}
                        </div>
                        <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-end np-items-center'>
                            <div className='np-p-8 np-flex np-items-center np-justify-end'>
                                <div className='np-rounded-full np-bg-light np-shadow-main np-flex np-items-center'>
                                    <div className='np-rounded-full np-h-full np-pl-2 np-pr-1 np-flex np-items-center np-justify-center np-gap-1'>
                                        <div className='np-w-3 np-h-3 np-rounded-full np-bg-green' />
                                        <div className='np-w-3 np-h-3 np-rounded-full np-bg-green' />
                                    </div>
                                    <CircleButton tooltip='Recompute' onClick={() => {
                                        apply((state) => {
                                            expireSolution(state)
                                        })
                                    }}>
                                        <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                                            <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </CircleButton>
                                </div>

                            </div>
                            {/* <div className='np-flex np-flex-col np-pr-0.5'>
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
                            </div> */}
                            {/* <HelpButton /> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layer>
    )
}

export default React.memo(ControlsContainer)
