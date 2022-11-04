import React, { useCallback, useEffect } from 'react'
import type * as NodePen from '@nodepen/core'
import '@/styles.css'
import { useDispatch, useStore, NodesAppCallbacks } from '$'
import { ControlsContainer } from '@/components'
import { FileUploadOverlayContainer, PseudoShadowsContainer } from './views/common'

type NodesAppProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
  solution?: NodePen.SolutionData
  children: React.ReactNode
} & NodesAppCallbacks

export const NodesApp = ({
  document,
  templates,
  solution,
  children,
  ...callbacks
}: NodesAppProps): React.ReactElement => {
  const { apply, loadDocument, loadTemplates } = useDispatch()

  useEffect(() => {
    loadTemplates(templates ?? [])
  }, [templates])

  useEffect(() => {
    loadDocument(document)
  }, [document.id])

  useEffect(() => {
    apply((state) => {
      state.callbacks = callbacks
    })
  }, [callbacks])

  useEffect(() => {
    if (!solution) {
      return
    }

    apply((state) => {
      state.solution = solution
    })
  }, [solution?.id, solution?.manifest.streamObjectIds])

  return <NodesAppInternal children={children} />
}

type NodesAppInternalProps = {
  children: React.ReactNode
}

const NodesAppInternal = React.memo(({ children }: NodesAppInternalProps) => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  const { apply } = useDispatch()

  const handleDragEnter = useCallback((_e: React.DragEvent<HTMLDivElement>) => {
    apply((state) => {
      if (state.layout.fileUpload.isActive) {
        return
      }

      state.layout.fileUpload = {
        isActive: true,
        activeFile: null,
        uploadStatus: 'none',
      }
    })
  }, [])

  return (
    <div
      id="np-app-root"
      className="np-w-full np-h-full np-relative np-overflow-hidden np-rounded-md"
      ref={canvasRootRef}
      onDragEnter={handleDragEnter}
    >
      <FileUploadOverlayContainer />
      <ControlsContainer />
      <PseudoShadowsContainer />
      {children}
    </div>
  )
})
