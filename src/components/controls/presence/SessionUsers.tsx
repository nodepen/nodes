import { CircleButton } from '@/components/layout/CircleButton'
import { COLORS } from '@/constants'
import { useCallbacks, useStore } from '@/store'
import { clamp } from '@/utils'
import React, { useCallback } from 'react'
import { shallow } from 'zustand/shallow'

const SessionUsers = () => {
    const sessions = useStore((state) => Object.entries((state.presence.sessions)).filter(([sessionId]) => state.presence.sessionId !== sessionId), shallow)

    const { onClickProfile, onClickShare } = useCallbacks()

    const handleClickProfile = useCallback(() => {
        onClickProfile?.(useStore.getState())
    }, [onClickProfile])

    const handleClickPresence = useCallback(() => {
        onClickShare?.(useStore.getState())
    }, [onClickShare])

    return <div className='np-flex np-items-center np-rounded-full np-bg-light np-shadow-main np-pointer-events-auto'>
        {sessions.length ? (<div className='np-h-8 np-ml-1 np-relative' style={{ width: `${32 + (16 * clamp(sessions.length - 1, 0, 2))}px` }}>
            {sessions.map(([sessionId, session], i) => (
                <div key={`session-presence-${sessionId}`} className='np-w-8 np-h-8 np-absolute' style={{ top: '0px', left: `${clamp(i, 0, 2) * 16}px`, zIndex: i }}>
                    <CircleButton size="sm" onClick={handleClickPresence}>
                        <div className='np-w-full np-h-full np-rounded-full np-flex np-items-center np-justify-center' style={{ background: session.color }}>
                            <p className='np-m-0 np-font-mono np-text-[15px] np-font-semibold np-text-dark np-leading-none np-translate-y-px'>
                                {session.name.at(0)?.toUpperCase() ?? 'X'}
                            </p>
                        </div>
                    </CircleButton>
                </div>
            ))}
        </div>
        ) : null}
        <CircleButton size="lg" onClick={handleClickProfile}>
            <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-6">
                <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
        </CircleButton>
    </div>
}

export default React.memo(SessionUsers)