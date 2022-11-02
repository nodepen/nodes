import React, { useRef, useEffect } from 'react'
import { Viewer, DefaultViewerParams, ViewerEvent } from '@speckle/viewer'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'
import { useStore } from '$'

type SpeckleModelViewProps = {
  streamId: string
}

const STREAM_ID = 'e1aa8e3dce'
const BRANCH_NAME = 'main'
const TOKEN = 'ed0010b22f0211453ad5807fca57925722cc86224a'

const SpeckleModelView = ({ streamId }: SpeckleModelViewProps): React.ReactElement | null => {
  const objectIds = useStore((state) => state.stream.objectIds)

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

      await viewer.loadObject(`http://localhost:3000/streams/${STREAM_ID}/objects/${objectId}`, TOKEN)
    }

    refreshObjects().then(() => {
      // Do nothing
    })
  }, [objectIds])

  return (
    <Layer id="np-model-layer" position={viewPosition ?? 1} z={10}>
      <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} />
    </Layer>
  )
}

export default React.memo(SpeckleModelView)
