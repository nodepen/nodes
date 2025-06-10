import { useDocumentRef, useImperativeEvent } from "@/hooks"
import { useLerpState } from "@/hooks/useLerpState"
import { distance } from "@/utils/numerics"
import React, { useCallback, useRef } from "react"

const ActiveUserControl = () => {
  const documentRef = useDocumentRef()
  const buttonRef = useRef<HTMLDivElement>(null)

  const [arrowAngle, setArrowAngle] = useLerpState(0, 0.2)
  const [arrowTransform, setArrowTransform] = useLerpState(40, 0.1)
  const [photoAngle, setPhotoAngle] = useLerpState(0, 0.05)

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const { pageX: cursorX, pageY: cursorY } = e

    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const vectorX = cursorX - centerX
    const vectorY = centerY - cursorY // Inverted

    const angleRad = Math.atan2(vectorY, vectorX)
    const angleDeg = angleRad * 180 / Math.PI

    const dist = distance([cursorX, cursorY], [centerX, centerY])

    setArrowAngle(dist > 50 ? angleDeg : 45)
    setPhotoAngle(dist > 50 ? angleDeg : 45)
    setArrowTransform(dist > 50 ? 40 : 0)
    // targetAngle.current = dist > 50 ? angleDeg : 45
    // targetTransform.current = dist > 50 ? 40 : 0
    // setCurrentAngle(angleDeg)
  }, [])

  useImperativeEvent(documentRef, 'pointermove', handlePointerMove)

  return (
    <div className="np-w-16 np-h-16 np-ml-4 np-relative">
      <div className="np-w-full np-h-full np-absolute np-flex np-items-center np-justify-center np-top-0 np-left-0 z-0" style={{ transform: `rotate(${arrowAngle * -1}deg)` }}>
        <svg width={24} height={24} viewBox="0 0 10 10" vectorEffect={"non-scaling-stroke"} style={{ transform: `translateX(${arrowTransform}px)` }} className="np-overflow-visible">
          <path d="M 0 0 L 2.5 5 L 0 10" stroke="#414141" fill="none" strokeLinecap="round" strokeWidth={2} vectorEffect={"non-scaling-stroke"} />
        </svg>
      </div>
      <div className="np-w-full np-h-full np-absolute np-top-0 np-left-0 np-flex np-items-center np-justify-center z-10">
        <div className='np-w-12 np-h-12 np-rounded-full np-flex np-items-center np-justify-center np-bg-light np-shadow-main' ref={buttonRef}>
          <button className="np-w-10 np-h-10 np-border-2 np-border-dark hover:np-bg-grey hover:np-cursor-pointer np-rounded-full np-flex np-justify-center np-items-center np-pointer-events-auto np-select-none" style={{ transform: `rotate(${(photoAngle - 45) * -1}deg)` }}>
            <img className="np-w-8 np-h-8 np-rounded-full hover:np-opacity-80" src="https://lh3.googleusercontent.com/ogw/AF2bZyjARiTEo5fZHy57Q0yN9_yrrTLAPuAsPX3cGMeHYWhzq1aA=s32-c-mo" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ActiveUserControl)