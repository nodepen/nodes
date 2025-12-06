import { ObjectLoader2Factory, type ObjectLoader2 } from "@speckle/objectloader2"
import React, { useCallback, useContext, useRef } from "react"

type SpeckleObjectLoaderContextValue = {
  objectLoader: React.RefObject<ObjectLoader2 | null>
  setObjectLoader: (args: { serverUrl: string, projectId: string, objectId: string, token: string }) => void
}

export const SpeckleObjectLoaderContext = React.createContext<SpeckleObjectLoaderContextValue | null>(null)

type SpeckleObjectLoaderProviderProps = {
  children: React.ReactNode
}

export const SpeckleObjectLoaderProvider = ({ children }: SpeckleObjectLoaderProviderProps) => {
  const objectLoader = useRef<ObjectLoader2 | null>(null)

  const setObjectLoader = useCallback((args: { serverUrl: string, projectId: string, objectId: string, token: string }) => {
    objectLoader.current = ObjectLoader2Factory.createFromUrl({
      serverUrl: args.serverUrl,
      streamId: args.projectId,
      objectId: args.objectId,
      token: args.token
    })
  }, [])

  return <SpeckleObjectLoaderContext.Provider value={{ objectLoader, setObjectLoader }}>
    {children}
  </SpeckleObjectLoaderContext.Provider>
}

export const useSpeckleObjectLoader = () => {
  const ctx = useContext(SpeckleObjectLoaderContext)
  if (!ctx) throw new Error("Yikes")
  return ctx.objectLoader.current
}