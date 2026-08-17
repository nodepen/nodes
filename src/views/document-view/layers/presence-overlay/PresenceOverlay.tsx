import { useStore } from '@/store'
import React from 'react'
import { shallow } from 'zustand/shallow'
import PresenceOverlayCursor from './PresenceOverlayCursor'
import PresenceOverlaySelectionRegion from './PresenceOverlaySelectionRegion'
import PresenceOverlayWires from './PresenceOverlayWire'

const PresenceOverlay = () => {
    // Filter out active session from presence
    const sessionIds = useStore((state) => Object.keys(state.presence.sessions).filter((id) => id !== state.presence.sessionId), shallow)

    return <div className='np-w-full np-h-full np-relative'>
        {sessionIds.map((sessionId) => (<>
            <PresenceOverlayCursor key={`presence-${sessionId}-cursor`} sessionId={sessionId} />
            <PresenceOverlaySelectionRegion key={`presence-${sessionId}-selection-region`} sessionId={sessionId} />
            <PresenceOverlayWires key={`presence-${sessionId}-wires`} sessionId={sessionId} />
        </>))}
    </div>
}

export default React.memo(PresenceOverlay)