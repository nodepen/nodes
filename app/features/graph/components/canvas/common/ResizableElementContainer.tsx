import React, { useCallback, useState, useEffect, useRef, useContext } from 'react'
import { useGraphDispatch, useGraphElements } from '@/features/graph/store/graph/hooks'
import { useCameraStaticZoom } from '@/features/graph/store/camera/hooks'

type ResizableStore = {
  transform: [tx: number, ty: number]
  dimensions: {
    width: number
    height: number
  }
  onResizeStart: (e: React.PointerEvent<HTMLDivElement>, anchor: ResizeAnchor) => void
}

type ResizeAnchor = 'T' | 'TL' | 'L' | 'BL' | 'B' | 'BR' | 'R' | 'TR'

type ResizableElementContainerProps = {
  elementId: string
  children?: JSX.Element
}

const ResizableContext = React.createContext<ResizableStore>({
  transform: [0, 0],
  dimensions: {
    width: 0,
    height: 0,
  },
  onResizeStart: () => '',
})

export const ResizableElementContainer = ({
  elementId,
  children,
}: ResizableElementContainerProps): React.ReactElement => {
  const elements = useGraphElements()
  const { updateElement } = useGraphDispatch()

  const zoom = useCameraStaticZoom()

  const element = elements[elementId]

  const [internalTransform, setInternalTransform] = useState<ResizableStore['transform']>([0, 0])
  const [internalDimensions, setInternalDimensions] = useState<ResizableStore['dimensions']>(element.current.dimensions)

  const MINIMUM_WIDTH = 50
  const MAXIMUM_WIDTH = 500
  const MINIMUM_HEIGHT = 50
  const MAXIMUM_HEIGHT = 500

  useEffect(() => {
    setInternalTransform([0, 0])
    setInternalDimensions(element.current.dimensions)
  }, [element.current.dimensions])

  const internalAnchor = useRef<ResizeAnchor>('TL')
  const internalAnchorId = useRef<number>()
  const internalDeltaX = useRef(0)
  const internalDeltaY = useRef(0)

  const resizeStartPosition = useRef<[number, number]>([0, 0])
  const previousPosition = useRef<[number, number]>([0, 0])

  const [isResizing, setIsResizing] = useState(false)
  const initialWidth = useRef(0)
  const initialHeight = useRef(0)

  const onResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, anchor: ResizeAnchor): void => {
      if (e.pointerType !== 'mouse') {
        return
      }

      e.stopPropagation()

      const { pageX, pageY } = e
      resizeStartPosition.current = [pageX, pageY]
      previousPosition.current = [pageX, pageY]

      internalAnchor.current = anchor
      internalAnchorId.current = e.pointerId

      internalDeltaX.current = 0
      internalDeltaY.current = 0

      initialWidth.current = internalDimensions.width
      initialHeight.current = internalDimensions.height

      setIsResizing(true)
    },
    [internalDimensions]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (!isResizing) {
        return
      }

      if (e.pointerId !== internalAnchorId.current) {
        return
      }

      const { pageX: x, pageY: y } = e

      const [sx, sy] = resizeStartPosition.current
      const [dx, dy] = [x - sx, y - sy]

      const anchor = internalAnchor.current

      const dxModifier = anchor.includes('R') ? 1 : -1
      const dyModifier = anchor.includes('T') ? -1 : 1

      const widthDelta = dx * dxModifier
      const heightDelta = dy * dyModifier

      internalDeltaX.current = widthDelta
      internalDeltaY.current = heightDelta

      const clamp = (value: number, min: number, max: number): number => {
        return value < min ? min : value > max ? max : value
      }

      const clampX = (value: number): number => clamp(value, MINIMUM_WIDTH, MAXIMUM_WIDTH)
      const clampY = (value: number): number => clamp(value, MINIMUM_HEIGHT, MAXIMUM_HEIGHT)

      const [tx, ty] = internalTransform
      const { width, height } = internalDimensions

      const nextWidth = clampX(initialWidth.current + internalDeltaX.current)
      const nextHeight = clampY(initialHeight.current + internalDeltaY.current)

      const nextDx = nextWidth - width
      const nextDy = nextHeight - height

      console.log({ dx: internalDeltaX.current })

      if (nextDx === 0 && nextDy === 0) {
        // No change allowed, do no work
        return
      }

      switch (internalAnchor.current) {
        case 'BR': {
          setInternalDimensions({
            width: nextWidth,
            height: nextHeight,
          })
        }
      }

      previousPosition.current = [x, y]
    },
    [isResizing, internalTransform, internalDimensions]
  )

  const handlePointerUp = useCallback(() => {
    setIsResizing(false)

    const [x, y] = element.current.position
    const [tx, ty] = internalTransform

    updateElement({
      id: elementId,
      type: element.template.type,
      data: {
        position: [x + tx, y + ty],
        dimensions: internalDimensions,
      },
    })
  }, [element, elementId, updateElement, internalTransform, internalDimensions])

  useEffect(() => {
    if (!isResizing) {
      return
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  const store: ResizableStore = {
    transform: internalTransform,
    dimensions: internalDimensions,
    onResizeStart,
  }

  return <ResizableContext.Provider value={store}>{children}</ResizableContext.Provider>
}

export const useResizableElement = (): ResizableStore => {
  return useContext(ResizableContext)
}
