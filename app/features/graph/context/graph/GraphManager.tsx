import React, { useCallback, useEffect, useState, useRef, createRef } from 'react'
import { Grasshopper } from 'glib'
import { GrasshopperGraphManifest } from '@/features/graph/types'
import { GraphStore } from './types'
import { useSessionManager } from 'features/common/context/session'
import { useApolloClient, gql } from '@apollo/client'
import { SetTransform } from '@/features/graph/types'
import { useGraphDispatch } from '../../store/graph/hooks'
import rhino3dm from 'rhino3dm'

export const GraphContext = React.createContext<GraphStore>({
  register: {
    setTransform: () => '',
    portal: {
      add: () => '',
      remove: () => '',
    },
  },
  registry: {
    canvasContainerRef: createRef(),
    layoutContainerRef: createRef(),
    sceneContainerRef: createRef(),
    portals: {},
  },
})

type GraphManagerProps = {
  manifest: GrasshopperGraphManifest
  children?: JSX.Element
}

export const GraphManager = ({ children, manifest }: GraphManagerProps): React.ReactElement => {
  const { token, session } = useSessionManager()

  const { restore } = useGraphDispatch()
  const sessionInitialized = useRef(false)

  useEffect(() => {
    if (sessionInitialized.current) {
      return
    }

    sessionInitialized.current = true

    rhino3dm().then(() => {
      if (process?.env?.NEXT_PUBLIC_DEBUG === 'true') {
        console.log('🟢 Loaded rhino3dm wasm.')
      }
    })

    restore(manifest, false)
  }, [manifest, restore])

  const client = useApolloClient()

  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const layoutContainerRef = useRef<HTMLDivElement>(null)
  const sceneContainerRef = useRef<HTMLDivElement>(null)

  const [library, setLibrary] = useState<Grasshopper.Component[]>()

  useEffect(() => {
    if (!token || !!library) {
      return
    }

    const fetchLibrary = async (): Promise<Grasshopper.Component[]> => {
      const { data, error } = await client.query({
        query: gql`
          query {
            getInstalledComponents {
              guid
              name
              nickname
              description
              keywords
              icon
              libraryName
              category
              subcategory
              isObsolete
              isVariable
              inputs {
                name
                nickname
                description
                type
                isOptional
              }
              outputs {
                name
                nickname
                description
                type
                isOptional
              }
            }
          }
        `,
      })

      if (error) {
        console.error(error)
      }

      return data?.getInstalledComponents
    }

    fetchLibrary()
      .then((lib) => {
        setLibrary(lib)
      })
      .catch((err) => {
        console.log(document.cookie)
        console.error(err)
      })
  }, [token, library, client])

  const [setTransform, setSetTransform] = useState<SetTransform>()

  const handleSetTransform = useCallback((setTransform: SetTransform) => {
    setSetTransform(() => setTransform)
  }, [])

  const libraryValue = session.id ? library : undefined

  const [portals, setPortals] = useState<GraphStore['registry']['portals']>({})

  const handleAddPortal = useCallback((id: string, ref: React.RefObject<HTMLDivElement>): void => {
    setPortals((current) => ({ ...current, [id]: ref }))
  }, [])

  const handleRemovePortal = useCallback((id: string): void => {
    setPortals((current) => {
      const next = { ...current }

      if (id in next) {
        delete next[id]
        return next
      }

      return current
    })
  }, [])

  const store: GraphStore = {
    library: libraryValue,
    registry: {
      setTransform,
      canvasContainerRef,
      layoutContainerRef,
      sceneContainerRef,
      portals,
    },
    register: {
      setTransform: handleSetTransform,
      portal: {
        add: handleAddPortal,
        remove: handleRemovePortal,
      },
    },
  }

  return <GraphContext.Provider value={store}>{children}</GraphContext.Provider>
}
