import React, { useCallback, useState, useEffect, useRef, useContext } from 'react'
import { useGraphDispatch, useGraphElements } from '@/features/graph/store/graph/hooks'

type ResizableStore = {
  position: [x: number, y: number]
  dimensions: {
    width: number
    height: number
  }
  onResizeStart: (anchor: ResizeAnchor) => void
  onResize: (dx: number, dy: number) => void
  onResizeEnd: () => void
}

type ResizeAnchor = 'T' | 'TL' | 'L' | 'BL' | 'B' | 'BR' | 'R' | 'TR'

type ResizableElementContainerProps = {
  elementId: string
  children?: JSX.Element
}

const ResizableContext = React.createContext<ResizableStore>({
  position: [0, 0],
  dimensions: {
    width: 0,
    height: 0,
  },
  onResizeStart: () => '',
  onResize: () => '',
  onResizeEnd: () => '',
})

export const ResizableElementContainer = ({
  elementId,
  children,
}: ResizableElementContainerProps): React.ReactElement => {
  const elements = useGraphElements()
  const { updateElement } = useGraphDispatch()

  const element = elements[elementId]

  const [internalPosition, setInternalPosition] = useState<ResizableStore['position']>(element.current.position)
  const [internalDimensions, setInternalDimensions] = useState<ResizableStore['dimensions']>(element.current.dimensions)

  const MINIMUM_WIDTH = 50
  const MAXIMUM_WIDTH = 500
  const MINIMUM_HEIGHT = 50
  const MAXIMUM_HEIGHT = 500

  useEffect(() => {
    setInternalPosition(element.current.position)
    setInternalDimensions(element.current.dimensions)
  }, [element.current.dimensions, element.current.position])

  const internalAnchor = useRef<ResizeAnchor>('TL')
  const internalDeltaX = useRef(0)
  const internalDeltaY = useRef(0)

  const onResizeStart = useCallback((anchor: ResizeAnchor): void => {
    internalAnchor.current = anchor
  }, [])

  const onResize = useCallback(
    (dx: number, dy: number): void => {
      internalDeltaX.current = internalDeltaX.current + dx
      internalDeltaY.current = internalDeltaY.current + dy

      const clamp = (value: number, min: number, max: number): number => {
        return value < min ? min : value > max ? max : value
      }

      const clampX = (value: number): number => clamp(value, MINIMUM_WIDTH, MAXIMUM_WIDTH)
      const clampY = (value: number): number => clamp(value, MINIMUM_HEIGHT, MAXIMUM_HEIGHT)

      const [x, y] = internalPosition
      const { width, height } = internalDimensions

      const nextWidth = clampX(width + internalDeltaX.current)
      const nextHeight = clampY(height + internalDeltaY.current)

      const nextDx = nextWidth - width
      const nextDy = nextHeight - height

      if (nextDx === 0 && nextDy === 0) {
        // No change allowed, do no work
        return
      }

      switch (internalAnchor.current) {
        case 'TL': {
          setInternalPosition([x - nextDx, y - nextDy])
          setInternalDimensions({
            width: nextWidth,
            height: nextHeight,
          })
        }
      }
    },
    [internalPosition, internalDimensions]
  )

  const onResizeEnd = useCallback(() => {
    updateElement({
      id: elementId,
      type: element.template.type,
      data: {
        position: internalPosition,
        dimensions: internalDimensions,
      },
    })
  }, [element, elementId, updateElement, internalPosition, internalDimensions])

  const store: ResizableStore = {
    position: internalPosition,
    dimensions: internalDimensions,
    onResizeStart,
    onResize,
    onResizeEnd,
  }

  return <ResizableContext.Provider value={store}>{children}</ResizableContext.Provider>
}

export const useResizableElement = (): ResizableStore => {
  return useContext(ResizableContext)
}
