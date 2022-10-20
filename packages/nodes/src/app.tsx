import React, { useEffect } from 'react'
import type * as NodePen from '@nodepen/core'
import '@/styles.css'
import { useDispatch, useStore } from '$'
import { ControlsContainer } from '@/components'
import { PseudoShadowsContainer } from './views/common'

type NodesProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
  onChange?: (document: NodePen.Document) => void
  children: React.ReactNode
}

export const NodesApp = ({ document, templates, children, ...callbacks }: NodesProps): React.ReactElement => {
  const { loadTemplates } = useDispatch()

  useEffect(() => {
    loadTemplates(templates ?? [])
  }, [templates])

  return <NodesAppInternal children={children} />
}

type NodesAppInternalProps = {
  children: React.ReactNode
}

const NodesAppInternal = React.memo(({ children }: NodesAppInternalProps) => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  return (
    <div id="np-app-root" className="np-w-full np-h-full np-relative np-overflow-hidden" ref={canvasRootRef}>
      <ControlsContainer />
      <PseudoShadowsContainer />
      {children}
    </div>
  )
})
