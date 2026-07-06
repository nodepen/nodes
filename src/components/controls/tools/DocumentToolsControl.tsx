import React, { useCallback, useState } from 'react'
import { Divider } from './Divider'
import DocumentViewToggle from './DocumentViewToggle'
import DocumentMetadata from './DocumentMetadata'
import DocumentModelSlider from './DocumentModelSlider'
import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { targetIsChildOf } from '@/utils/dom/targetIsChildOf'
import { useDispatch, useStore } from '@/store'
import { COLORS } from '@/constants'

const DocumentToolsControl = () => {
    const { apply } = useDispatch()

    const activeDrawer = useStore((state) => state.registry.documentControls.activeDrawer)

    const isComponentsOpen = activeDrawer === 'components'
    const [isComponentsHovered, setIsComponentsHovered] = useState(false)

    const handleClick = useCallback((type: 'components' | 'params') => {
        apply((state) => {
            state.registry.documentControls.activeDrawer = state.registry.documentControls.activeDrawer === type ? null : type
        })
    }, [])

    const componentsHeight = isComponentsOpen ? 128 : isComponentsHovered ? 24 : 0

    return (
        <div className='np-relative np-h-16 np-flex np-items-center np-justify-center'>
            <div className='np-flex np-h-full np-p-0.5 np-items-center np-justify-center np-rounded-lg np-bg-light np-shadow-main np-z-20'>
                <div className='np-h-full np-w-12 np-mr-0.5 np-p-0.5 np-flex np-flex-col np-items-center np-border-2 np-border-dark np-rounded-md np-pointer-events-auto np-group hover:np-cursor-pointer'
                    onClick={() => handleClick('components')}
                    onMouseEnter={() => setIsComponentsHovered(true)}
                    onMouseLeave={() => setIsComponentsHovered(false)}
                >
                    <div className='np-w-full np-h-2 np-mt-1 np-mb-1 np-flex np-items-center np-justify-center'>
                        <svg fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 10 5" width={16} height={8} className='np-overflow-visible'>
                            <path d="M 0 2.5 L 5 0 L 10 2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
                    </div>
                    <div className='np-w-full np-grow np-flex np-items-center np-justify-center np-rounded-sm group-hover:np-bg-grey'>
                        <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-6'>
                            <path d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect='non-scaling-stroke' />
                        </svg>
                    </div>
                </div>
                <div className='np-h-full np-w-12 np-border-2 np-border-dark np-rounded-md' />
                <Divider />
                <DocumentViewToggle />
                <Divider />
                <div className='np-h-full np-flex np-flex-col np-justify-start np-items-center'>
                    <div className='np-flex np-mb-0.5 np-items-center'>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-tl-md np-border-2 np-border-dark np-mr-0.5' />
                        <div className='np-w-[29px] np-h-[29px] np-border-2 np-border-dark np-mr-0.5' />
                        <div className='np-w-[29px] np-h-[29px] np-rounded-tr-md np-border-2 np-border-dark np-mr-0.5' />
                    </div>
                    <div className='np-flex np-items-center'>
                        <div className='np-w-[29px] np-h-[29px] np-rounded-bl-md np-border-2 np-border-dark np-mr-0.5' />
                        <div className='np-w-[29px] np-h-[29px] np-border-2 np-border-dark np-mr-0.5' />
                        <div className='np-w-[29px] np-h-[29px] np-rounded-br-md np-border-2 np-border-dark np-mr-0.5' />
                    </div>
                </div>
                <DocumentModelSlider />
            </div>
            <div className='np-w-full np-pb-16 np-rounded-lg np-bg-light np-absolute np-bottom-0 np-z-10 np-pointer-events-auto'>
                <div className={`np-w-full np-overflow-hidden np-transition-all np-duration-300 np-ease-out`} style={{ height: `${componentsHeight}px` }}>
                    Component Library
                </div>
            </div>
        </div>

    )
}

export default React.memo(DocumentToolsControl)