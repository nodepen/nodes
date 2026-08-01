import { useStore } from '@/store'
import React from 'react'
import PresenceOverlayCursor from './PresenceOverlayCursor'

const PresenceOverlay = () => {
    const cursors = useStore((state) => state.presence.cursors)

    return <div className='np-w-full np-h-full np-relative'>
        {Object.keys(cursors).map((sessionId) => {
            return <PresenceOverlayCursor key={`presence-${sessionId}-cursor`} sessionId={sessionId} />
        })}
    </div>
}

export default React.memo(PresenceOverlay)