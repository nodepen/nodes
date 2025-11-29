import { COLORS } from "@/constants"
import React from "react"

const DocumentMetadata = () => {

  return <div className="np-h-full np-mr-2 np-max-w-48 np-flex np-flex-col np-items-start np-justify-center np-overflow-hidden">
    <button className="np-h-6 np-mb-0.5 np-pr-2 np-flex np-items-center np-rounded-sm np-pointer-events-auto np-group hover:np-cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" className="np-h-4 np-w-4 np-mr-1" fill="none" viewBox="0 0 24 24" stroke={COLORS.DARK} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <p className="np-text-sm np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3 -np-translate-y-1 group-hover:np-underline" style={{ textDecorationThickness: '2px' }}>
        My document
      </p>
    </button>
    <button className="np-h-6 np-pr-2 np-flex np-items-center np-rounded-sm np-pointer-events-auto np-group hover:np-cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" className="np-h-4 np-w-4 np-mr-1" fill="none" viewBox="0 0 24 24" stroke={COLORS.DARK} strokeWidth={2}>
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
      <p className="np-text-sm np-text-dark np-font-light np-font-panel np-whitespace-nowrap np-leading-3 -np-translate-y-1 group-hover:np-underline" style={{ textDecorationThickness: '2px' }}>
        No linked model
      </p>
    </button>
  </div>
}

export default React.memo(DocumentMetadata)