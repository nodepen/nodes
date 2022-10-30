import React, { useRef, useEffect } from 'react'
import { Viewer, DefaultViewerParams } from '@speckle/viewer'
import { useStore } from '$'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'

type SpeckleModelViewProps = {
  streamId: string
}

const SpeckleModelView = ({ streamId }: SpeckleModelViewProps): React.ReactElement | null => {
  const container = useStore((store) => store.registry.modelRoot)

  const { viewPosition } = useViewRegistry({ key: 'speckle-viewer', label: 'Model' })

  const viewer = useRef<Viewer>()

  useEffect(() => {
    if (viewer.current) {
      return
    }

    if (!container.current) {
      return
    }

    const v = new Viewer(container.current, { showStats: false, environmentSrc: '' })
    viewer.current = v
    v.init().then(() => {
      console.log('Initialized viewer!')
    })

    // .then(() => {
    //   return v.loadObject(
    //     `http://localhost:3000/streams/b0d3a3c122/objects/${id}`,
    //     '8ac998dd805648be63a69a8e0480d07a1e06c6465e'
    //   )
    // })
    // // .then(() => {
    // //   console.log('Loaded!')
    // // })
    // .catch((e) => {
    //   console.log(`Failed to load object ${id}`)
    //   console.error(e)
    // })
  })

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

  if (viewPosition === null) {
    return <></>
  }

  return (
    <Layer id="np-model-layer" position={viewPosition} z={10}>
      <div className="np-w-full np-h-full np-pointer-events-auto" ref={container} />
    </Layer>
  )
}

export default React.memo(SpeckleModelView)
