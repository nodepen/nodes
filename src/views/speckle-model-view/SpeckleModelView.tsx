import React, { useRef, useEffect, useCallback, useMemo, useContext } from 'react'
import { AssetType, LegacyViewer, Loader, SpeckleLoader, ViewerEvent, SelectionExtension, StencilOutlineType, DefaultViewerParams } from '@speckle/viewer'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'
import { useDispatch, useStore } from '@/store'
import { SpeckleObjectLoaderContext } from '@/context'
import { lowercaseFirstLetterDeep } from '@/utils/common/lowercaseFirstLetterDeep'
import { useSpeckleViewer } from '@/hooks/useSpeckleViewer'

type SpeckleModelViewProps = {
  speckle: {
    serverUrl: string
    serverToken: string
  }
  model: {

    projectId: string
    rootObjectId?: string
  }
}

const SpeckleModelView = ({ speckle, model }: SpeckleModelViewProps): React.ReactElement | null => {
  const [position, preciseWidth] = useViewRegistry({ key: 'speckle-viewer', label: 'Model' })

  const { serverUrl, serverToken } = speckle
  const { projectId, rootObjectId } = model

  useSpeckleViewer()

  const width = Math.round(preciseWidth * 1000) / 1000

  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<LegacyViewer>(null)

  const { apply } = useDispatch()
  const context = useContext(SpeckleObjectLoaderContext)

  const setModelLoadStatus = useCallback((progress: number) => {
    apply((state) => {
      state.lifecycle.model.progress = progress
    })
  }, [])

  const widthBreakpoints = [0, 0.25, 0.5, 0.75, 1]

  // const safeResize = useThrottleCallback(() => {
  //   viewerRef.current?.resize()
  // }, 100)

  // useEffect(() => {
  //   safeResize()
  // }, [width])

  const safeSetModelLoadStatus = useThrottleCallback(setModelLoadStatus, 200)

  const currentSelection = useRef<string[]>([])

  useEffect(() => {
    if (!containerRef.current) {
      console.log(`🐍 Failed to mount Speckle Viewer container div!`)
      return
    }

    if (viewerRef.current) {
      return
    }
    const viewer = new LegacyViewer(containerRef.current, DefaultViewerParams)

    // TODO: Selection of existing data
    // viewer.on(ViewerEvent.ObjectClicked, (e) => {
    //   const nextSelection = new Set(currentSelection.current)
    //   const hitObjectId = e?.hits.at(0)?.node.model.id

    //   console.log({ hitObjectId })

    //   const getMode = (e: PointerEvent | undefined) => {
    //     if (e?.shiftKey) return 'add'
    //     if (e?.ctrlKey) return 'remove'
    //     return 'set'
    //   }

    //   if (!hitObjectId) {
    //     nextSelection.clear()
    //   } else {
    //     switch (getMode(e?.event)) {
    //       case 'add': {
    //         nextSelection.add(hitObjectId)
    //         break
    //       }
    //       case 'remove': {
    //         nextSelection.delete(hitObjectId)
    //         break
    //       }
    //       case 'set': {
    //         nextSelection.clear()
    //         nextSelection.add(hitObjectId)
    //       }
    //     }
    //   }

    //   const selectedObjectIds = [...nextSelection]

    //   currentSelection.current = selectedObjectIds
    //   viewer.selectObjects(selectedObjectIds)
    // })

    viewerRef.current = viewer

    // const extension = viewer.createExtension(SelectionExtension)
    // extension.options.selectionMaterialData = {
    //   id: 'foo',
    //   color: 0x04cbfb,
    //   emissive: 0x0,
    //   opacity: 1,
    //   roughness: 1,
    //   metalness: 0,
    //   vertexColors: false,
    //   lineWeight: 1,
    //   stencilOutlines: StencilOutlineType.OVERLAY,
    //   pointSize: 4
    // }
    // extension.on('object-clicked', (e: any) => {
    //   console.log(e)
    // })

    void viewer.init().then(() => {
      viewerRef.current = viewer
      context?.setViewer(viewerRef.current)
    })

    viewer.on(ViewerEvent.LoadComplete, (arg) => {
      safeSetModelLoadStatus(1)
    })

    return () => {
      viewer.dispose()
    }
  }, [])

  const refreshObjects = useCallback(async () => {
    const viewer = viewerRef.current

    if (!viewer) {
      return
    }

    await viewer.unloadAll()

    apply((state) => {
      state.lifecycle.model.status = 'loading'
    })

    if (!rootObjectId) {
      return
    }

    context?.objectLoader?.current?.disposeAsync()

    context?.setObjectLoader({
      serverUrl,
      projectId,
      objectId: rootObjectId,
      token: serverToken
    })

    const res = await context?.objectLoader.current?.getRootObject()

    apply((state) => {
      state.lifecycle.solution = 'ready'
      if (res?.base) {
        state.solution = lowercaseFirstLetterDeep(res.base)
      }
    })

    // TODO: What changed
    // await viewer.loadObject(`${stream.url}/streams/${stream.id}/objects/${rootObjectId}`, stream.token)
    const url = `${serverUrl}/streams/${projectId}/objects/${rootObjectId}`
    const loader = new SpeckleLoader(viewer.getWorldTree(), url, serverToken)
    await viewer.loadObject(loader, true)

    let visibleObjectCount = 0

    // viewer.getWorldTree().walk((node) => {
    //   const isVisible = !!node.model.renderView
    //   if (isVisible) {
    //     visibleObjectCount++
    //   }
    //   return true
    // })

    apply((state) => {
      state.lifecycle.model = { status: 'ready', progress: 1, objectCount: visibleObjectCount }
    })
  }, [serverUrl, serverToken, projectId, rootObjectId])

  const requestRefreshObjects = useDeferCallback(refreshObjects)

  useEffect(() => {
    requestRefreshObjects()
  }, [refreshObjects])

  const translation = (100 - (width * 100)) / -2

  return (
    <Layer id="np-model-layer" position={position} z={10}>
      <div className="np-w-full np-h-full np-pointer-events-auto np-bg-pale" ref={containerRef} style={{ transform: `translateX(${translation}%)` }} />
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

const useThrottleCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  intervalMs: number
): ((...args: T) => void) => {
  const internalCallback = useRef(callback)

  useEffect(() => {
    internalCallback.current = callback
  }, [callback])

  const nextArgs = useRef<T>(undefined)
  const interval = useRef<ReturnType<typeof setInterval>>(undefined)

  const handleInvoke = useCallback(() => {
    if (!nextArgs.current) {
      return
    }

    internalCallback.current(...nextArgs.current)

    interval.current = setInterval(() => {
      if (!nextArgs.current) {
        clearInterval(interval.current)
        return
      }

      const invokeArgs = nextArgs.current
      nextArgs.current = undefined
      internalCallback.current(...invokeArgs)
    }, intervalMs)
  }, [callback])

  const throttleCallback = useCallback(
    (...args: T): void => {
      if (!nextArgs.current) {
        nextArgs.current = args
        handleInvoke()
      } else {
        nextArgs.current = args
      }
    },
    [handleInvoke]
  )

  return throttleCallback
}

export default React.memo(SpeckleModelView)
