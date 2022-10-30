import React, { useEffect } from 'react'
import type * as NodePen from '@nodepen/core'
import '@/styles.css'
import { useDispatch, useStore, NodesAppCallbacks } from '$'
import { ControlsContainer } from '@/components'
import { PseudoShadowsContainer } from './views/common'

type NodesAppProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
  children: React.ReactNode
} & NodesAppCallbacks

export const NodesApp = ({ document, templates, children, ...callbacks }: NodesAppProps): React.ReactElement => {
  const { apply, loadTemplates } = useDispatch()

  useEffect(() => {
    loadTemplates(templates ?? [])
  }, [templates])

  useEffect(() => {
    apply((state) => {
      state.document = document
    })
  }, [document.id])

  return <NodesAppInternal children={children} />
}

type NodesAppInternalProps = {
  children: React.ReactNode
}

const NodesAppInternal = React.memo(({ children }: NodesAppInternalProps) => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  return (
    <div
      id="np-app-root"
      className="np-w-full np-h-full np-relative np-overflow-hidden np-rounded-md"
      ref={canvasRootRef}
    >
      <ControlsContainer />
      <PseudoShadowsContainer />
      {children}
    </div>
  )
})
