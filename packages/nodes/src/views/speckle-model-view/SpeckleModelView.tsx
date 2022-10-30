import React, { useRef, useEffect } from 'react'
import { Viewer, DefaultViewerParams, ViewerEvent } from '@speckle/viewer'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'

type SpeckleModelViewProps = {
  streamId: string
}

const SpeckleModelView = ({ streamId }: SpeckleModelViewProps): React.ReactElement | null => {
  const { viewPosition } = useViewRegistry({ key: 'speckle-viewer', label: 'Model' })

  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer>()

  useEffect(() => {
    if (!containerRef.current) {
      console.log(`🐍 Failed to mount Speckle Viewer container div!`)
      return
    }

    const viewer = new Viewer(containerRef.current, {
      showStats: true,
      environmentSrc: '',
    })

    viewer.init().then(() => {
      viewerRef.current = viewer
    })

    viewer.on(ViewerEvent.LoadProgress, (arg) => {
      console.log(arg)
    })

    return () => {
      viewer.dispose()
    }
  }, [])

  //   useEffect(() => {
  //     const v = viewer.current

  //     if (!v) {
  //       return
  //     }

  //     v.unloadAll()
  //       .then(() => {
  //         const loadRequests = streamObjectIds.map((id) => {
  //           console.log(`Loading ${id}`)
  //           return v.loadObject(
  //             `http://localhost:3000/streams/${streamId}/objects/${id}`,
  //             '8ac998dd805648be63a69a8e0480d07a1e06c6465e'
  //           )
  //         })
  //         return Promise.allSettled(loadRequests)
  //       })
  //       .then(() => {
  //         console.log('Loaded a bunch of stuff.')
  //       })
  //   }, [streamId, streamObjectIds])

  return (
    <Layer id="np-model-layer" position={viewPosition ?? 1} z={10}>
      <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} />
    </Layer>
  )
}

export default React.memo(SpeckleModelView)
