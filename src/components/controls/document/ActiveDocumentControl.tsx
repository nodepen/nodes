import { CircleButton } from '@/components/layout/CircleButton'
import { COLORS } from '@/constants'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useCallbacks, useDispatch, useStore } from '@/store'
import { saveDocument } from '@/store/utils/saveDocument'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const ActiveDocumentControl = () => {
    const documentMeta = useStore((state) => state.document.meta)
    const [internalName, setInternalName] = useState(documentMeta.name ?? '')

    const isEditable = useIsEditable()

    const { apply } = useDispatch()
    const { onClickHome } = useCallbacks()

    const inputRef = useRef<HTMLInputElement>(null)
    const menuButtonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setInternalName(documentMeta.name ?? '')
    }, [documentMeta.name])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalName(e.currentTarget.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() === 'enter') {
            e.currentTarget.blur()
        }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const nextName = e.currentTarget.value

        setInternalName(nextName)

        e.currentTarget.scroll(0, 0)

        if (nextName !== documentMeta.name) {
            apply((state) => {
                state.document.meta.name = nextName
                saveDocument(state)
            })
        }
    }

    const handleOpenMenu = useCallback(() => {
        const el = menuButtonRef.current

        if (!el) {
            return
        }

        const { left, width, top, height } = el.getBoundingClientRect()

        const x = left + (width / 2)
        const y = top + (height / 2)

        apply((state) => {
            state.registry.contextMenus['document-menu'] = {
                position: {
                    x: x + 32,
                    y: y - 20
                },
                context: {
                    type: 'document'
                }
            }
        })
    }, [apply])

    const documentCollection = documentMeta?.collection?.name
    const documentOwner = documentMeta?.owner?.name ?? "Jack Grasshopper"

    return (
        <div className='np-flex np-items-center np-grow md:np-grow-0 np-h-12 np-rounded-full np-select-none np-pointer-events-auto'>
            <div className='np-h-12 np-w-full md:np-w-min np-rounded-full np-flex np-items-center np-justify-start np-bg-light np-shadow-main'>
                <CircleButton size="lg" onClick={() => onClickHome?.(useStore.getState())}>
                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-6'>
                        <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                </CircleButton>
                <div className='np-h-full md:np-w-48 np-pl-1 np-pr-2 np-pt-1 np-pb-1 np-flex np-flex-col np-justify-between np-items-start'>
                    <input
                        className={`${isEditable ? 'hover:np-bg-grey' : ''} np-h-5 np-hidden md:np-inline np-w-full np-p-1 np-pt-1.5 np-pb-1 np-mb-0.5 np-rounded-sm np-text-sm np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3`}
                        ref={inputRef}
                        disabled={!isEditable}
                        value={internalName}
                        style={{ textDecorationThickness: '2px' }}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <p className='np-h-full np-inline md:np-hidden np-w-full np-p-1 np-pt-1.5 np-pb-1 mp-mb-0.5 np-text-sm np-font-light np-font-panel np-text-dark np-whitespace-nowrap np-leading-3'>
                        {internalName}
                    </p>
                    <div className='np-pl-1 np-grow np-flex np-items-center np-justify-start -np-translate-y-px'>
                        {documentCollection ? (<>
                            <div className='np-w-3 np-h-3 np-mr-1 np-rounded-sm np-bg-dark np-flex np-items-center np-justify-center'>
                                <svg aria-hidden="true" fill={COLORS.LIGHT} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H12.5A1.5 1.5 0 0 1 14 5.5v1.401a2.986 2.986 0 0 0-1.5-.401h-9c-.546 0-1.059.146-1.5.401V3.5ZM2 9.5v3A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 12.5 8h-9A1.5 1.5 0 0 0 2 9.5Z" />
                                </svg>
                            </div>
                            <p className='np-mr-2 np-whitespace-nowrap np-overflow-hidden np-text-xs np-text-dark np-font-panel np-translate-y-px'>
                                Collection Name
                            </p>
                        </>) : null}
                        {documentOwner ? (<>
                            <div className='np-w-3 np-h-3 np-mr-1 np-rounded-sm np-bg-dark np-flex np-items-center np-justify-center'>
                                <svg aria-hidden="true" fill={COLORS.LIGHT} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className='np-size-3'>
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                            </div>
                            <p className='np-whitespace-nowrap np-overflow-hidden np-text-xs np-text-dark np-font-panel np-translate-y-px'>
                                {documentOwner}
                            </p>
                        </>) : null}
                    </div>
                </div>
                <div className='np-h-full np-mr-2 np-flex np-flex-col np-justify-center np-items-center'>
                    {isEditable ? (<div ref={menuButtonRef} className='np-w-6 np-h-6 np-hidden md:np-flex np-justify-center np-items-center np-rounded-full hover:np-bg-grey hover:np-cursor-pointer' onClick={handleOpenMenu}>
                        <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="2" stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-4">
                            <path d="m19.5 8.25-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"></path>
                        </svg>
                    </div>) : (
                        <div className='np-w-6' />
                    )}
                </div>
            </div>
        </div>
        //     <div className='np-h-12 np-w-12 np-mr-2 np-p-1 np-rounded-md np-bg-light np-shadow-main'>
        //         <div className="np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-sm np-pointer-events-auto hover:np-cursor-pointer" onClick={handleClickHome}>
        //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-6">
        //                 <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        //             </svg>
        //         </div>
        //     </div>
        //     <div className="np-h-12 np-w-40 np-mr-4 np-p-1 np-rounded-md np-bg-light np-shadow-main">
        //         <div className='np-w-full np-h-full np-p-1 np-flex np-items-center np-rounded-sm np-pointer-events-auto'>
        //             <div className="np-h-full np-mr-2 np-flex-grow np-flex np-flex-col np-items-start np-justify-center np-overflow-hidden">
        //                 <p className="np-text-sm np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3" style={{ textDecorationThickness: '2px' }}>
        //                     {documentMeta.name}
        //                 </p>
        //                 <p className='np-text-xs np-text-dark np-font-panel np-translate-y-1'>
        //                     Made by you!
        //                 </p>
        //                 {/* <div className="np-pr-2 np-text-xs np-font-panel np-flex np-items-center np-rounded-sm np-pointer-events-auto np-group hover:np-cursor-pointer">
        //                 You
        //             </div> */}
        //             </div>
        //             {/* <div className='np-w-4 np-h-full np-flex np-flex-col np-justify-center np-items-center'>
        //             <svg xmlns="http://www.w3.org/2000/svg" className="np-h-6 np-w-6" fill="none" viewBox="0 0 24 24" stroke={COLORS.DARK} strokeWidth={2}>
        //                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        //             </svg>
        //         </div> */}
        //         </div>
        //     </div>
        // </div>
    )
}

export default React.memo(ActiveDocumentControl)