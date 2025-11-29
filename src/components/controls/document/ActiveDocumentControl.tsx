import { COLORS } from '@/constants'
import { useCallbacks, useStore } from '@/store'
import React from 'react'

const ActiveDocumentControl = () => {
  const documentMeta = useStore((state) => state.document.meta)
  const { onOpenDocumentSettings } = useCallbacks()

  console.log(documentMeta)

  return <div className="np-h-12 np-w-40 np-mr-4 np-p-1 np-rounded-md np-bg-light np-shadow-main">
    <div className='np-w-full np-h-full np-p-1 np-flex np-items-center np-rounded-sm np-pointer-events-auto hover:np-cursor-pointer hover:np-bg-grey' onClick={() => onOpenDocumentSettings?.()}>
      <div className="np-h-full np-mr-2 np-flex-grow np-flex np-flex-col np-items-start np-justify-center np-overflow-hidden">
        <div className="np-h-6 np-mb-1 np-pr-2 np-flex np-items-center np-rounded-sm np-pointer-events-auto np-group hover:np-cursor-pointer">
          <p className="np-text-sm np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3 -np-translate-y-1" style={{ textDecorationThickness: '2px' }}>
            {documentMeta.name}
          </p>
        </div>
        <div className="np-h-6 np-pr-2 np-flex np-items-center np-rounded-sm np-pointer-events-auto np-group hover:np-cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="np-h-3 np-w-3 np-mr-1" fill="none" viewBox="0 0 24 24" stroke={COLORS.DARK} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {/* <div className="np-flex np-flex-col np-justify-start" style={{ transform: 'translateY(-1px)' }}>
              <p className="np-text-xs np-mb-px np-text-left np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3 -np-translate-y-1">
                My Speckle Model
              </p>
              <p className="np-text-xs np-text-left np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3 -np-translate-y-1">
                <span className="np-font-extralight">in</span> My Speckle Project
              </p>
            </div> */}
          <p className="np-mt-0.5 np-text-xs np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3">
            No linked model
          </p>
        </div>
      </div>
      <div className='np-w-4 np-h-full np-flex np-flex-col np-justify-center np-items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" className="np-h-6 np-w-6" fill="none" viewBox="0 0 24 24" stroke={COLORS.DARK} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
}

export default React.memo(ActiveDocumentControl)