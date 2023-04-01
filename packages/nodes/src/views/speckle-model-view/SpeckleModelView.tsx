import React, { useRef, useEffect } from 'react'
import { Viewer, DefaultViewerParams, ViewerEvent } from '@speckle/viewer'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'
import { useStore } from '$'

type SpeckleModelViewProps = {
  stream: {
    id: string
    url: string
    token: string
  }
}

const SpeckleModelView = ({ stream }: SpeckleModelViewProps): React.ReactElement | null => {
  const objectIds = useStore((state) => state.solution.manifest.streamObjectIds)

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
      verbose: true,
      keepGeometryData: true
    })

    viewerRef.current = viewer

    void viewer.init().then(() => {
      viewerRef.current = viewer
    })

    viewer.on(ViewerEvent.LoadProgress, (arg) => {
      console.log(arg)
    })

    return () => {
      viewer.dispose()
    }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current

    if (!viewer) {
      return
    }

    const objectId = objectIds[0]

    if (!objectId) {
      return
    }

    const refreshObjects = async (): Promise<void> => {
      await viewer.unloadAll()

      await viewer.loadObject(`${stream.url}/streams/${stream.id}/objects/${objectId}`, stream.token)
    }

    void refreshObjects()
  }, [objectIds])

  return (
    <Layer id="np-model-layer" position={viewPosition ?? 1} z={10}>
      <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} />
    </Layer>
  )
}

export default React.memo(SpeckleModelView)
