"use client"

import React, { useState } from "react"
import { Layer } from "../common"
import ModelCanvas from "./ModelCanvas"
import { useStore } from "@/store"

const ModelView = () => {
    const solutionModelUrl = useStore((state) => state.solution.solutionModelUrl)

    const [isExpanded, setIsExpanded] = useState(false)

    // Ratio between 0 and 1
    const [width, setWidth] = useState(0.5)

    return (
        <Layer id="np-model-layer" z={85}>
            <div className="np-w-full np-h-full np-p-6 np-flex np-flex-col np-justify-end np-pointer-events-none">
                <div className={`${isExpanded ? 'np-h-full' : 'np-h-16'} np-ease-out np-w-full np-relative np-transition-all np-duration-[350ms] `}>
                    <div className={`${isExpanded ? '' : ''} np-ease-out np-h-full np-bg-pale np-p-0.5 np-rounded-lg np-absolute np-transition-all np-duration-[350ms] np-pointer-events-auto np-group`} style={{ width: isExpanded ? `${width * 100}%` : '96px', bottom: isExpanded ? "0px" : "8px", right: isExpanded ? "0" : "calc(50% - 48px)" }}>
                        <div className="np-w-full np-h-full np-p-0.5 np-rounded-lg np-border-2 np-border-green">
                            <div className="np-w-full np-h-full np-rounded-md np-relative np-overflow-hidden">
                                <div className={`np-w-full np-h-full np-absolute np-flex np-items-center np-justify-center np-z-20 np-bg-pale np-rounded-lg`} onPointerDownCapture={(e) => {
                                    if (isExpanded) {
                                        return
                                    }

                                    e.stopPropagation()
                                }}>
                                    <ModelCanvas solutionModelUrl={solutionModelUrl} />
                                </div>
                                <div className="np-w-full np-h-full np-absolute np-flex np-items-center np-justify-center np-invisible group-hover:np-visible np-z-30 np-pointer-events-none">
                                    <div className="np-w-8 np-h-8 np-bg-green np-pointer-events-auto" onClick={() => setIsExpanded((value) => !value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  */}
            </div>
        </Layer>
    )
}

export default React.memo(ModelView)