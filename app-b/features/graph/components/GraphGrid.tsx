import { useCamera, useGridScale } from '../store/hooks'

export const GraphGrid = (): React.ReactElement => {
  const {
    position: [cx, cy],
    zoom,
  } = useCamera()

  const scale = useGridScale()

  return (
    <div
      className={`w-full h-full bg-pale z-0 overflow-hidden relative transition-opacity duration-75`}
      style={{
        backgroundSize: `${25 * zoom * scale}px ${25 * zoom * scale}px`,
        backgroundPosition: `${cx % (25 * zoom * scale)}px ${cy % (25 * zoom * scale)}px`,
        backgroundImage: `linear-gradient(to right, #98e2c6 ${
          0.3 * scale
        }mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 ${
          0.3 * scale
        }mm, transparent 1px, transparent 10px)`,
      }}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onMouseDown={(e) => {
        switch (e.button) {
          case 2:
            return
          default:
            e.stopPropagation()
        }
      }}
      role="presentation"
    ></div>
  )
}
