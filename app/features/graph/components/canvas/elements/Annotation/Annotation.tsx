import { useGraphManager } from '@/features/graph/context/graph'
import { useDebugRender } from '@/hooks'
import { NodePen } from 'glib'
import React, { useRef } from 'react'

type AnnotationProps = {
  annotation: NodePen.Element<'annotation'>
}

const Annotation = ({ annotation }: AnnotationProps): React.ReactElement => {
  const { id, template, current } = annotation
  const [x, y] = current.position
  const { width } = current.dimensions

  useDebugRender(`Annotation | ${id}`)

  const { registry } = useGraphManager()

  const fallbackRef = useRef<HTMLDivElement>(null)

  if (!registry.portals[template.parent]) {
    console.log(`🐍🐍🐍 Attempted to render an annotation before its portal ref existed!`)
  }

  const annotationRef = registry.portals?.[template.parent] ?? fallbackRef

  return (
    <div
      className={`absolute pointer-events-none z-0 overflow-visible h-8 bg-red-500`}
      style={{ width, left: x, top: y }}
      ref={annotationRef}
    />
  )
}

export default React.memo(Annotation)
