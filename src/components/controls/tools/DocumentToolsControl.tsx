import React, { useCallback, useReducer, useState } from 'react'
import { Divider } from './Divider'
import DocumentViewToggle from './DocumentViewToggle'
import DocumentMetadata from './DocumentMetadata'
import DocumentModelSlider from './DocumentModelSlider'
import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { targetIsChildOf } from '@/utils/dom/targetIsChildOf'
import { useDispatch, useStore } from '@/store'
import { COLORS } from '@/constants'

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
                    <div className='np-w-full np-grow np-flex np-items-center np-justify-center'>
                        <svg fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 10 5" width={16} height={8} className='np-overflow-visible'>
                            <path d="M 0 2.5 L 5 0 L 10 2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
                    </div>
                    <div className='np-w-full np-h-10 np-flex np-items-center np-justify-center np-rounded-sm group-hover:np-bg-grey'>
                        <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-6'>
                            <path d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
                    </div>
                </div>
                <div className='np-h-full np-w-12 np-p-0.5 np-flex np-flex-col np-items-center np-border-2 np-border-dark np-rounded-md np-pointer-events-auto np-group hover:np-cursor-pointer'
                    onClick={() => toggleActiveDrawer('params')}
                    onMouseEnter={() => dispatch({ type: 'set-drawer-hover', payload: { drawer: 'params' } })}
                    onMouseLeave={() => dispatch({ type: 'clear-drawer-hover' })}
                >
                    <div className='np-w-full np-grow np-flex np-items-center np-justify-center'>
                        <svg fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 10 5" width={16} height={8} className='np-overflow-visible'>
                            <path d="M 0 2.5 L 5 0 L 10 2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
                    </div>
                    <div className='np-w-full np-h-10 np-flex np-items-center np-justify-center np-rounded-sm group-hover:np-bg-grey'>
                        <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-6'>
                            <path d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
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
                <div className='np-h-full np-mr-1 np-flex np-flex-col np-justify-between np-items-center'>
                    <div className='np-flex np-items-center np-gap-0.5'>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-full np-border-2 np-border-dark' />
                        <div className='np-w-[29px] np-h-[29px] np-rounded-full np-border-2 np-border-dark' />
                        <div className='np-w-[29px] np-h-[29px] np-rounded-full np-border-2 np-border-dark' />
                    </div>
                    <div className='np-flex np-items-center np-gap-0.5'>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-full np-border-2 np-border-dark' />
                        <div className='np-w-[29px] np-h-[29px] np-rounded-full np-border-2 np-border-dark' />
                        <div className='np-w-[29px] np-h-[29px] np-rounded-full np-border-2 np-border-dark' />
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