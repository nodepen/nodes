import React, { useRef, useEffect, useCallback } from 'react'
import { Viewer, ViewerEvent } from '@speckle/viewer'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'

type SpeckleModelViewProps = {
  stream: {
    id: string
    url: string
    token: string
  }
  rootObjectId?: string
}

const SpeckleModelView = ({ stream, rootObjectId }: SpeckleModelViewProps): React.ReactElement | null => {
  const { viewPosition } = useViewRegistry({ key: 'speckle-viewer', label: 'Model' })

  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer>()

  useEffect(() => {
    if (!containerRef.current) {
      console.log(`🐍 Failed to mount Speckle Viewer container div!`)
      return
    }

    if (viewerRef.current) {
      return
    }

    const viewer = new Viewer(containerRef.current, {
      showStats: false,
      environmentSrc: '',
      verbose: false,
      keepGeometryData: true,
    })

    viewerRef.current = viewer

    void viewer.init().then(() => {
      viewerRef.current = viewer
    })

    viewer.on(ViewerEvent.LoadProgress, (arg) => {
      // console.log(arg)
    })

    return () => {
      viewer.dispose()
    }
  }, [])

  const refreshObjects = useCallback(async () => {
    const viewer = viewerRef.current

    if (!viewer || !rootObjectId) {
      return
    }

    await viewer.unloadAll()
    await viewer.loadObject(`${stream.url}/streams/${stream.id}/objects/${rootObjectId}`, stream.token)
  }, [rootObjectId])

  const requestRefreshObjects = useDeferCallback(refreshObjects)

  useEffect(() => {
    requestRefreshObjects()
  }, [rootObjectId])

  return (
    <Layer id="np-model-layer" position={viewPosition ?? 1} z={10}>
      <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} />
    </Layer>
  )
}

// Delay serial requests to invoke a given callback until the current invocation finishes.
// Multiple requests while waiting will only lead to one invocation.
const useDeferCallback = (callback: () => Promise<void>): (() => void) => {
  const isInvoked = useRef(false)
  const shouldInvoke = useRef(false)

  const requestInvoke = useCallback(() => {
    const handleInvoke = () => {
      isInvoked.current = true
      shouldInvoke.current = false

      callback().finally(() => {
        isInvoked.current = false
        if (shouldInvoke.current) {
          handleInvoke()
        }
      })
    }

    if (!isInvoked.current) {
      // We are not awaiting a call, call immediately
      handleInvoke()
    } else {
      // We are awaiting a call, flag request for a subsequent run.
      shouldInvoke.current = true
    }
  }, [callback])

  return requestInvoke
}

export default React.memo(SpeckleModelView)
