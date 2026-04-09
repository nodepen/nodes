import { COLORS } from '@/constants'
import { useCallbacks, useStore } from '@/store'
import React from 'react'

const ActiveDocumentControl = () => {
    const documentMeta = useStore((state) => state.document.meta)
    const { onClickHome } = useCallbacks()

    //   console.log(documentMeta)
    const handleClickHome = () => {
        const state = useStore.getState()
        onClickHome?.(state)
    }

    return (
        <div className='np-flex np-items-center'>
            <div className='np-h-12 np-w-12 np-mr-2 np-p-1 np-rounded-md np-bg-light np-shadow-main'>
                <div className="np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-sm np-pointer-events-auto hover:np-cursor-pointer" onClick={handleClickHome}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </div>
            </div>
            <div className="np-h-12 np-w-40 np-mr-4 np-p-1 np-rounded-md np-bg-light np-shadow-main">
                <div className='np-w-full np-h-full np-p-1 np-flex np-items-center np-rounded-sm np-pointer-events-auto'>
                    <div className="np-h-full np-mr-2 np-flex-grow np-flex np-flex-col np-items-start np-justify-center np-overflow-hidden">
                        <p className="np-text-sm np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3" style={{ textDecorationThickness: '2px' }}>
                            {documentMeta.name}
                        </p>
                        <p className='np-text-xs np-text-dark np-font-panel np-translate-y-1'>
                            Made by you!
                        </p>
                        {/* <div className="np-pr-2 np-text-xs np-font-panel np-flex np-items-center np-rounded-sm np-pointer-events-auto np-group hover:np-cursor-pointer">
                        You
                    </div> */}
                    </div>
                    {/* <div className='np-w-4 np-h-full np-flex np-flex-col np-justify-center np-items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="np-h-6 np-w-6" fill="none" viewBox="0 0 24 24" stroke={COLORS.DARK} strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div> */}
                </div>
            </div>
        </div>
    )
}

export default React.memo(ActiveDocumentControl)