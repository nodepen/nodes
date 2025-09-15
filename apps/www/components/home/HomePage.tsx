"use client"

import { useRouter } from "next/navigation"
import DocumentSelectionModal from "../editor/modals/DocumentSelectionModal"
import { useCallback, useEffect, useState, useTransition } from "react"
import { HomePageCross } from "./HomePageCross"
import { useLerpState } from "@/hooks/useLerpState"
import { throttle } from "lodash"

const HomePage = () => {
  const [cellCount, setCellCount] = useState(1000)

  const [pointerX, setPointerX] = useLerpState(90)
  const [pointerY, setPointerY] = useLerpState(90)

  const handleResize = useCallback(() => {
    const { width, height } = document.documentElement.getBoundingClientRect()

    const nx = Math.ceil(width / 50)
    const ny = Math.ceil(height / 50)

    const n = nx * ny

    setCellCount(n)
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const { pageX, pageY } = e
    setPointerX(pageX)
    setPointerY(pageY)
  }, [setPointerX, setPointerY])

  useEffect(() => {
    handleResize()
  }, [])

  useEffect(() => {
    const el = document.documentElement

    const cb = throttle(handlePointerMove, 150)

    el.addEventListener('resize', handleResize)
    el.addEventListener('pointermove', cb)

    return () => {
      el.removeEventListener('resize', handleResize)
      el.removeEventListener('pointermove', cb)
    }
  }, [handleResize, handlePointerMove])

  const l = 4
  // return <DocumentSelectionModal onSelectDocument={async (doc) => { router.push(`/doc/${doc.meta.id}`) }} />

  return <div className="w-full h-full relative overflow-hidden">
    <div className="w-full h-full absolute top-0 grid grid-cols-[minmax(0,_1fr)_repeat(auto-fill,_50px)_minmax(0,_1fr)] grid-rows-[50px_repeat(auto-fill,_50px)_minmax(0,_1fr)] z-0">
      {Array.from({ length: cellCount }, (_, i) => (
        // <div key={crypto.randomUUID()} className="w-full h-full flex items-center justify-center overflow-hidden">
        //   <div style={{ minWidth: '50px', minHeight: '50px' }}>
        //     <svg width={50} height={50} viewBox="0 0 50 50">
        //       <line x1={0} y1={0} x2={l} y2={0} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       <line x1={0} y1={0} x2={0} y2={l} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       <line x1={50} y1={0} x2={50 - l} y2={0} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       <line x1={50} y1={0} x2={50} y2={l} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       <line x1={50} y1={50} x2={50} y2={50 - l} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       <line x1={50} y1={50} x2={50 - l} y2={50} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       <line x1={0} y1={50} x2={0} y2={50 - l} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       <line x1={0} y1={50} x2={l} y2={50} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" />
        //       {/* <line x1={25 + l} y1={25 - l} x2={25 - l} y2={25 + l} stroke="#414141" strokeWidth='1px' vectorEffect="non-scaling-stroke" /> */}

        //     </svg>
        //   </div>
        // </div>
        <HomePageCross key={`item-${i}`} cursorPosition={[pointerX, pointerY]} />
        // <div key={crypto.randomUUID()} className="w-full h-full relative">
        //   <div className="w-2 h-2 absolute top-0 left-0">
        //     <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
        //       <line x1={0} y1={0} x2={l} y2={0} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //       <line x1={0} y1={0} x2={0} y2={l} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //     </svg>
        //   </div>
        //   <div className="w-2 h-2 absolute top-0 right-0">
        //     <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
        //       <line x1={8} y1={0} x2={8 - l} y2={0} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //       <line x1={8} y1={0} x2={8} y2={l} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //     </svg>
        //   </div>
        //   <div className="w-2 h-2 absolute bottom-0 right-0">
        //     <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
        //       <line x1={8} y1={8} x2={8} y2={8 - l} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //       <line x1={8} y1={8} x2={8 - l} y2={8} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //     </svg>
        //   </div>
        //   <div className="w-2 h-2 absolute bottom-0 left-0">
        //     <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
        //       <line x1={0} y1={8} x2={l} y2={8} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //       <line x1={0} y1={8} x2={0} y2={8 - l} stroke="#414141" strokeWidth='1px' strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        //     </svg>
        //   </div>
        // </div>
      ))}
    </div>
    <div className="w-full h-full absolute z-10" style={{ border: `${l}px solid #FFFFFF` }} />
    <div className="w-full h-full absolute top-0 grid grid-cols-[minmax(0,_1fr)_repeat(auto-fill,_50px)_minmax(0,_1fr)] grid-rows-[9px_minmax(0,_1fr)_repeat(auto-fill,_50px)_minmax(0,_1fr)] z-20">
      <div className="col-start-1 -col-end-1 row-start-1 -row-end-1">
        <div className="w-full h-full flex flex-col justify-start items-center">
          <div className="w-[900px] h-[360px] flex flex-col justify-start items-center pl-2 pr-2">
            <div className="w-full h-full bg-white">
              CONTENT
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default HomePage