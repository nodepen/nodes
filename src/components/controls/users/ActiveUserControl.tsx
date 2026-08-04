import { COLORS } from "@/constants"
import { useDocumentRef, useImperativeEvent } from "@/hooks"
import { useLerpState } from "@/hooks/useLerpState"
import { useStore } from "@/store"
import { distance } from "@/utils/numerics"
import { Dialog } from "@/views/components"
import React, { useCallback, useRef, useState } from "react"

const ActiveUserControl = () => {
    const documentRef = useDocumentRef()
    const buttonRef = useRef<HTMLDivElement>(null)
    const user = useStore((state) => state.user)
    const callbacks = useStore((state) => state.callbacks)

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

    const [showDialog, setShowDialog] = useState(false)

    const handleClick = () => {
        callbacks.onClickProfile?.(useStore.getState())
    }

    const [showAvatar, setShowAvatar] = useState(!!user?.image)

    return (
        <>
            <div className="np-w-16 np-h-16 np-relative np-z-0">
                <div className="np-w-full np-h-full np-absolute np-flex np-items-center np-justify-center np-top-0 np-left-0 z-0" style={{ transform: `rotate(${arrowAngle * -1}deg)` }}>
                    <svg width={24} height={24} viewBox="0 0 10 10" vectorEffect={"non-scaling-stroke"} style={{ transform: `translateX(${arrowTransform}px)` }} className="np-overflow-visible">
                        <path d="M 0 0 L 2.5 5 L 0 10" stroke="#414141" fill="none" strokeLinecap="round" strokeWidth={2} vectorEffect={"non-scaling-stroke"} />
                    </svg>
                </div>
                <div className="np-w-full np-h-full np-absolute np-top-0 np-left-0 np-flex np-items-center np-justify-center z-10">
                    <div className='np-w-12 np-h-12 np-rounded-full np-flex np-items-center np-justify-center np-bg-light np-shadow-main' ref={buttonRef}>
                        <button onClick={handleClick} className="np-w-11 np-h-11 np-p-0.5 np-border-2 np-border-dark np-rounded-full np-flex np-justify-center np-items-center np-pointer-events-auto np-select-none np-group" style={{ transform: `rotate(${(photoAngle - 45) * -1}deg)` }}>
                            <div className="np-w-full np-h-full np-rounded-full np-flex np-items-center np-justify-center group-hover:np-bg-grey group-hover:np-cursor-pointer">
                                {showAvatar
                                    ? <img className="np-w-8 np-h-8 np-rounded-full hover:np-opacity-80" src={user?.image} onError={() => { setShowAvatar(false) }} />
                                    : (
                                        <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-6">
                                            <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    )
                                }
                            </div>
                        </button>
                    </div>
                </div>
            </div >
            {/* {showDialog ? (
                <Dialog onClose={() => setShowDialog(false)}>
                    <div>
                        {user?.name ? (
                            <>
                                <p>{user.name}</p>
                                <button onClick={callbacks.onSignOut}>Sign Out</button>
                            </>
                        ) : (
                            <a href={`${speckle?.serverUrl}/authn/verify/${speckle?.appId}/${speckle?.appChallenge}`}>GO</a>
                        )}
                    </div>
                </Dialog>
            ) : null} */}
        </>
    )
}

export default React.memo(ActiveUserControl)