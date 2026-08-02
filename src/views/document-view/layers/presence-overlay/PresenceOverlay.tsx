import { useStore } from '@/store'
import React from 'react'
import PresenceOverlayCursor from './PresenceOverlayCursor'

const PresenceOverlay = () => {
    // Filter out active session from presence
    const sessionIds = useStore((state) => Object.keys(state.presence.sessions).filter((id) => id !== state.presence.sessionId))

    return <div className='np-w-full np-h-full np-relative'>
        {sessionIds.map((sessionId) => (<>
            <PresenceOverlayCursor key={`presence-${sessionId}-cursor`} sessionId={sessionId} />
        </>))}
    </div>
}

export default React.memo(PresenceOverlay)