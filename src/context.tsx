import { ObjectLoader2Factory, type ObjectLoader2 } from "@speckle/objectloader2"
import type { LegacyViewer } from "@speckle/viewer"
import React, { useCallback, useContext, useRef } from "react"

type SpeckleObjectLoaderContextValue = {
  objectLoader: React.RefObject<ObjectLoader2 | null>
  setObjectLoader: (args: { serverUrl: string, projectId: string, objectId: string, token: string }) => void
  viewer: React.RefObject<LegacyViewer | null>
  setViewer: (viewer: LegacyViewer) => void
}

export const SpeckleObjectLoaderContext = React.createContext<SpeckleObjectLoaderContextValue | null>(null)

type SpeckleObjectLoaderProviderProps = {
  children: React.ReactNode
}

export const SpeckleObjectLoaderProvider = ({ children }: SpeckleObjectLoaderProviderProps) => {
  const objectLoader = useRef<ObjectLoader2 | null>(null)
  const viewer = useRef<LegacyViewer | null>(null)

  const setObjectLoader = useCallback((args: { serverUrl: string, projectId: string, objectId: string, token: string }) => {
    objectLoader.current = ObjectLoader2Factory.createFromUrl({
      serverUrl: args.serverUrl,
      streamId: args.projectId,
      objectId: args.objectId,
      token: args.token
    })
  }, [])

  const setViewer = useCallback((viewerRef: LegacyViewer) => {
    viewer.current = viewerRef
  }, [])

  return <SpeckleObjectLoaderContext.Provider value={{ objectLoader, setObjectLoader, viewer, setViewer }}>
    {children}
  </SpeckleObjectLoaderContext.Provider>
}

export const useSpeckleObjectLoader = () => {
  const ctx = useContext(SpeckleObjectLoaderContext)
  if (!ctx) throw new Error("Yikes")
  return ctx.objectLoader.current
}