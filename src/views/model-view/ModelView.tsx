"use client"

import React, { useCallback, useState } from "react"
import { Layer } from "../common"
import ModelCanvas from "./ModelCanvas"
import { useStore } from "@/store"

const ModelView = () => {
    const solutionModelUrl = useStore((state) => state.solution.solutionModelUrl)

    const [isExpanded, setIsExpanded] = useState(false)
    const [isSceneVisible, setIsSceneVisible] = useState(true)

    const handleTransitionStart = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
        switch (e.nativeEvent.propertyName) {
            case 'height': {
                setIsSceneVisible(false)
                break
            }
        }
    }, [])

    const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
        switch (e.nativeEvent.propertyName) {
            case 'height': {
                setTimeout(() => {
                    setIsSceneVisible(true)
                }, 50);
                break
            }
        }
    }, [])

    // Ratio between 0 and 1
    const [width, setWidth] = useState(1)

    return (
        <Layer id="np-model-layer" z={85}>
            <div className="np-w-full np-h-full np-p-4 np-flex np-flex-col np-justify-end np-pointer-events-none">
                <div className={`${isExpanded ? 'np-h-full' : 'np-h-20'} np-ease-out np-w-full np-relative np-transition-all np-duration-[350ms] `} onTransitionStart={handleTransitionStart} onTransitionEnd={handleTransitionEnd}>
                    <div className={`${isExpanded ? 'np-rounded-[34px]' : 'np-rounded-lg'} np-ease-out np-h-full np-bg-pale np-p-0.5 np-absolute np-transition-all np-duration-[350ms] np-pointer-events-auto np-group`} style={{ width: isExpanded ? `${width * 100}%` : '102px', bottom: isExpanded ? "0px" : "8px", right: isExpanded ? "0" : "calc(50% - 51px)" }}>
                        <div className={`${isExpanded ? 'np-rounded-[32px]' : 'np-rounded-lg'} np-w-full np-h-full np-p-0.5 np-border-2 np-border-green np-transition-all np-duration-[350ms]`}>
                            <div className={`${isExpanded ? 'np-rounded-[30px]' : 'np-rounded-md'} np-w-full np-h-full np-relative np-overflow-hidden`}>
                                <div className={`${isSceneVisible ? 'np-opacity-100' : 'np-opacity-0'} np-w-full np-h-full np-absolute np-flex np-items-center np-justify-center np-z-20 np-bg-pale np-rounded-lg`} onPointerDownCapture={(e) => {
                                    if (isExpanded) {
                                        return
                                    }

                                    e.stopPropagation()
                                }}>
                                    <ModelCanvas solutionModelUrl={solutionModelUrl} />
                                </div>
                                <div className="np-w-full np-h-full np-absolute np-flex np-flex-col np-items-start np-justify-end np-invisible group-hover:np-visible np-z-30 np-pointer-events-none">
                                    <div className={`${isExpanded ? 'np-w-full np-ml-6 np-pb-6' : 'np-w-8 np-ml-[29px] np-pb-4'} np-flex np-items-center np-justify-start np-overflow-hidden np-whitespace-nowrap np-transition-all np-duration-[350ms] np-ease-out`}>
                                        <div className="np-w-8 np-min-w-8 np-h-8 np-rounded-full np-bg-green np-pointer-events-auto" onClick={() => setIsExpanded((value) => !value)}>
                                            x
                                        </div>
                                        <div className="np-w-8 np-min-w-8 np-h-8 np-ml-1 np-rounded-full np-bg-green np-pointer-events-auto" onClick={() => setIsExpanded((value) => !value)}>
                                            x
                                        </div>
                                    </div>
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