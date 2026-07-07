import React, { useCallback, useReducer, useState } from 'react'
import { Divider } from './Divider'
import DocumentViewToggle from './DocumentViewToggle'
import DocumentMetadata from './DocumentMetadata'
import DocumentModelSlider from './DocumentModelSlider'
import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { targetIsChildOf } from '@/utils/dom/targetIsChildOf'
import { useDispatch, useStore } from '@/store'
import { COLORS } from '@/constants'
import { CircleButton } from '@/components/layout/CircleButton'

type ReducerState = {
    drawers: {
        activeHover: 'components' | 'params' | null
        components: {
            activeCategory: string | null
            activeComponent: string | null
        }
    }
    tooltips: {
        anchorX: number | null
        activeLabel: string | null
        activeHotkey: string | null
    }
}

const initialState: ReducerState = {
    drawers: {
        activeHover: null,
        components: {
            activeCategory: null,
            activeComponent: null
        }
    },
    tooltips: {
        anchorX: null,
        activeLabel: null,
        activeHotkey: null
    }
}

type ReducerAction =
    | {
        type: 'set-drawer-hover'
        payload: {
            drawer: 'components' | 'params'
        }
    }
    | {
        type: 'clear-drawer-hover'
    }

const reducer = (currentState: ReducerState, action: ReducerAction): ReducerState => {
    const patchState = (callback: (draft: ReducerState) => void): ReducerState => {
        const nextState = structuredClone(currentState)
        callback(nextState)
        return nextState
    }

    switch (action.type) {
        case 'set-drawer-hover': {
            const { drawer } = action.payload

            return patchState((state) => {
                state.drawers.activeHover = state.drawers.activeHover === drawer ? null : drawer
            })
        }
        case 'clear-drawer-hover': {
            return patchState((state) => {
                state.drawers.activeHover = null
            })
        }
        default: {
            console.log(`🐍 Unknown dispatch action of type: ${action}`)
            return currentState
        }
    }
}

const DocumentToolsControl = () => {
    const { apply } = useDispatch()

    const activeDrawer = useStore((state) => state.registry.documentControls.activeDrawer)

    const isComponentsOpen = activeDrawer === 'components'
    const isParamsOpen = activeDrawer === 'params'

    const [state, dispatch] = useReducer(reducer, initialState)

    const isAnyHovered = !!state.drawers.activeHover
    const isComponentsHovered = state.drawers.activeHover === 'components'
    const isParamsHovered = state.drawers.activeHover === 'params'

    const toggleActiveDrawer = useCallback((type: 'components' | 'params') => {
        apply((state) => {
            state.registry.documentControls.activeDrawer = state.registry.documentControls.activeDrawer === type ? null : type
        })
    }, [])

    const componentsDrawerHeight = isAnyHovered ? isComponentsHovered ? isComponentsOpen ? 128 : 24 : 0 : isComponentsOpen ? 128 : 0
    const paramsDrawerHeight = isAnyHovered ? isParamsHovered ? isParamsOpen ? 128 : 24 : 0 : isParamsOpen ? 128 : 0

    return (
        <div className='np-relative np-h-16 np-flex np-items-center np-justify-center'>
            <div className='np-flex np-h-full np-p-0.5 np-items-center np-justify-center np-rounded-lg np-bg-light np-shadow-main np-z-50'>
                <div className='np-h-full np-w-12 np-mr-0.5 np-p-0.5 np-flex np-flex-col np-items-center np-border-2 np-border-dark np-rounded-md np-pointer-events-auto np-group hover:np-cursor-pointer'
                    onClick={() => toggleActiveDrawer('components')}
                    onMouseEnter={() => dispatch({ type: 'set-drawer-hover', payload: { drawer: 'components' } })}
                    onMouseLeave={() => dispatch({ type: 'clear-drawer-hover' })}
                >
                    <div className='np-w-full np-mt-1 np-flex np-items-center np-justify-center'>
                        <svg fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 10 5" width={16} height={8} className='np-overflow-visible'>
                            <path d="M 0 2.5 L 5 0 L 10 2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
                    </div>
                    <div className='np-w-full np-grow np-flex np-items-center np-justify-center'>
                        <CircleButton>
                            <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-6 np-mb-0.5'>
                                <path d="M5.25 11.75A2.25 2.25 0 0 1 7.5 9.5h9a2.25 2.25 0 0 1 2.25 2.25v4.5a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-4.5Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                <path d="M5.25 9.75A2.25 2.25 0 0 1 7.5 7.5h9a2.25 2.25 0 0 1 2.25 2.25v4.5a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-4.5Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" fill={COLORS.LIGHT} />
                            </svg>
                        </CircleButton>
                    </div>
                </div>
                <div className='np-h-full np-w-12 np-p-0.5 np-flex np-flex-col np-items-center np-border-2 np-border-dark np-rounded-md np-pointer-events-auto np-group hover:np-cursor-pointer'
                    onClick={() => toggleActiveDrawer('params')}
                    onMouseEnter={() => dispatch({ type: 'set-drawer-hover', payload: { drawer: 'params' } })}
                    onMouseLeave={() => dispatch({ type: 'clear-drawer-hover' })}
                >
                    <div className='np-w-full np-mt-1 np-flex np-items-center np-justify-center'>
                        <svg fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 10 5" width={16} height={8} className='np-overflow-visible'>
                            <path d="M 0 2.5 L 5 0 L 10 2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
                    </div>
                    <div className='np-w-full np-grow np-flex np-items-center np-justify-center'>
                        <CircleButton>
                            <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-5 np-mb-0.5' style={{ transform: 'translateX(0.5px)' }}>
                                <path d="M9.443 7.072 L14.557 7.072 A2.5 2.5 0 0 1 16.722 8.322 L19.278 12.75 A2.5 2.5 0 0 1 19.278 15.25 L16.722 19.678 A2.5 2.5 0 0 1 14.557 20.928 L9.443 20.928 A2.5 2.5 0 0 1 7.278 19.678 L4.722 15.25 A2.5 2.5 0 0 1 4.722 12.75 L7.278 8.322 A2.5 2.5 0 0 1 9.443 7.072 Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                <path d="M9.443 5.072 L14.557 5.072 A2.5 2.5 0 0 1 16.722 6.322 L19.278 10.75 A2.5 2.5 0 0 1 19.278 13.25 L16.722 17.678 A2.5 2.5 0 0 1 14.557 18.928 L9.443 18.928 A2.5 2.5 0 0 1 7.278 17.678 L4.722 13.25 A2.5 2.5 0 0 1 4.722 10.75 L7.278 6.322 A2.5 2.5 0 0 1 9.443 5.072 Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" fill={COLORS.PALE} />
                            </svg>
                        </CircleButton>
                    </div>
                </div>
                <Divider />
                <DocumentViewToggle />
                <Divider />
                {/* <div className='np-h-full np-flex np-flex-col np-justify-start np-items-center np-pointer-events-auto'>
                    <div className='np-flex np-mb-0.5 np-items-center'>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-tl-md np-border-2 np-border-dark np-mr-0.5 np-p-0.5 np-group np-overflow-hidden hover:np-cursor-pointer' >
                            <div className='np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-tl-sm group-hover:np-bg-grey'>
                                <svg fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-5'>
                                    <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>
                        </div>
                        <div className='np-w-[29px] np-h-[29px] np-border-2 np-border-dark np-mr-0.5 np-p-0.5 np-group np-overflow-hidden hover:np-cursor-pointer' >
                            <div className='np-w-full np-h-full np-flex np-items-center np-justify-center group-hover:np-bg-grey'>
                                x
                            </div>
                        </div>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-tr-md np-border-2 np-border-dark np-mr-0.5 np-p-0.5 np-group np-overflow-hidden hover:np-cursor-pointer' >
                            <div className='np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-tr-sm group-hover:np-bg-grey'>
                                x
                            </div>
                        </div>
                    </div>
                    <div className='np-flex np-items-center'>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-bl-md np-border-2 np-border-dark np-mr-0.5 np-p-0.5 np-group np-overflow-hidden hover:np-cursor-pointer' >
                            <div className='np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-bl-sm group-hover:np-bg-grey'>
                                x
                            </div>
                        </div>
                        <div className='np-w-[29px] np-h-[29px] np-border-2 np-border-dark np-mr-0.5 np-p-0.5 np-group np-overflow-hidden hover:np-cursor-pointer' >
                            <div className='np-w-full np-h-full np-flex np-items-center np-justify-center group-hover:np-bg-grey'>
                                x
                            </div>
                        </div>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-br-md np-border-2 np-border-dark np-mr-0.5 np-p-0.5 np-group np-overflow-hidden hover:np-cursor-pointer' >
                            <div className='np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-br-sm group-hover:np-bg-grey'>
                                x
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className='np-h-full np-mr-1 np-flex np-flex-col np-justify-between np-items-center np-pointer-events-auto'>
                    <div className='np-flex np-items-center np-gap-0.5'>
                        <CircleButton>
                            <svg fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                                <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </CircleButton>
                        <CircleButton>
                            <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                                <path d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </CircleButton>
                        <CircleButton>
                            <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                                <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </CircleButton>
                    </div>
                    <div className='np-flex np-items-center np-gap-0.5'>
                        <CircleButton>
                            <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                                <path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </CircleButton>
                        <CircleButton>
                            <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                                <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </CircleButton>
                        <CircleButton>
                            <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                                <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </CircleButton>
                    </div>
                </div>
                <DocumentModelSlider />
            </div>
            <div className={`${isComponentsHovered ? 'np-z-30' : 'np-z-10'} np-w-full np-pb-16 np-rounded-lg np-bg-light np-absolute np-bottom-0 np-pointer-events-auto`}>
                <div className={`np-w-full np-overflow-hidden np-transition-all np-duration-300 np-ease-out`} style={{ height: `${componentsDrawerHeight}px` }}>
                    Component Library
                </div>
            </div>
            <div className={`${isParamsHovered ? 'np-z-30' : 'np-z-10'} np-w-full np-pb-16 np-rounded-lg np-bg-light np-absolute np-bottom-0 np-pointer-events-auto`}>
                <div className={`np-w-full np-overflow-hidden np-transition-all np-duration-300 np-ease-out`} style={{ height: `${paramsDrawerHeight}px` }}>
                    Param Library
                </div>
            </div>
        </div>

    )
}

export default React.memo(DocumentToolsControl)