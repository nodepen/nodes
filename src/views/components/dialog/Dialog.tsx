import React, { useCallback } from 'react'
import { DialogPortal } from './DialogPortal'
import { useDocumentRef, useImperativeEvent } from '@/hooks'

type DialogProps = {
    title?: string
    children: React.ReactNode
    onClose: () => void
}

export const Dialog = ({ title, onClose, children }: DialogProps) => {
    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation()
        onClose()
    }, [onClose])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const captureKeys = ['escape', 'esc']

        if (captureKeys.includes(e.key.toLowerCase())) {
            onClose()
        }
    }, [onClose])

    const documentRef = useDocumentRef()
    useImperativeEvent(documentRef, 'keydown', handleKeyDown)

    return (
        <DialogPortal>
            <div className="np-relative np-w-full np-h-full np-pointer-events-auto">
                <div
                    className="np-absolute np-left-0 np-top-0 np-w-full np-h-full np-z-0 np-bg-dark np-bg-opacity-30 np-pointer-events-auto"
                    onClick={onClose}
                    onPointerDown={handlePointerDown}
                ></div>
                <div className="np-absolute np-left-0 np-top-0 np-w-full np-h-full np-z-10 np-pointer-events-none">
                    <div className="np-w-full np-h-full np-flex np-justify-center np-items-center">
                        <div
                            className="np-w-96 np-p-4 np-bg-light np-rounded-md np-shadow-modal np-pointer-events-auto"
                            onPointerDown={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => e.stopPropagation()}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </DialogPortal>
    )
}
