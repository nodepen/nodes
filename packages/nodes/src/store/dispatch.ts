import type { NodesAppState } from './state'
import { startTransition } from 'react'
import { setAutoFreeze, freeze } from 'immer'
import type * as NodePen from '@nodepen/core'
import { shallow } from 'zustand/shallow'
import { useStore } from '$'
import { DIMENSIONS } from '@/constants'
import { getNodeWidth, getNodeHeight } from '@/utils/node-dimensions'
import { divideDomain, remap } from '@/utils/numerics'
import { expireSolution } from './utils'

const { NODE_INTERNAL_PADDING } = DIMENSIONS

type BaseAction = string | ({ type: string } & Record<string, unknown>)
type BaseSetter = (callback: (state: NodesAppState) => void, replace?: boolean, action?: BaseAction) => void
type BaseGetter = () => NodesAppState

export type NodesAppDispatch = ReturnType<typeof createDispatch>

setAutoFreeze(false)

export const createDispatch = (set: BaseSetter, get: BaseGetter) => {
  const dispatch = {
    apply: (callback: (state: NodesAppState, get: BaseGetter) => void) => set((state) => callback(state, get)),
    loadDocument: (document: NodePen.Document) =>
      set((state) => {
        state.document = document

        for (const node of Object.values(document.nodes)) {
          // Sanitize node properties
          const { instanceId, templateId, inputs, outputs } = node

          const template = state.templates[templateId]

          if (!template) {
            console.log(`🐍 Could not find template [${templateId}] for document node [${instanceId}]`)
            continue
          }
          const nodeWidth = getNodeWidth()
          const nodeHeight = getNodeHeight(template)

          node.dimensions = {
            width: nodeWidth,
            height: nodeHeight,
          }

          const inputInstanceIds = Object.keys(inputs)
          const inputHeightSegments = divideDomain(
            [0, nodeHeight - NODE_INTERNAL_PADDING * 2],
            inputInstanceIds.length > 0 ? inputInstanceIds.length : 1
          )

          for (let i = 0; i < inputInstanceIds.length; i++) {
            const currentId = inputInstanceIds[i]
            const currentDomain = inputHeightSegments[i]

            const deltaX = 0
            const deltaY = remap(0.5, [0, 1], currentDomain) + NODE_INTERNAL_PADDING

            node.anchors[currentId] = {
              dx: deltaX,
              dy: deltaY,
            }
          }

          const outputInstanceIds = Object.keys(outputs)
          const outputHeightSegments = divideDomain(
            [0, nodeHeight - NODE_INTERNAL_PADDING * 2],
            outputInstanceIds.length > 0 ? outputInstanceIds.length : 1
          )

          for (let i = 0; i < outputInstanceIds.length; i++) {
            const currentId = outputInstanceIds[i]
            const currentDomain = outputHeightSegments[i]

            const deltaX = nodeWidth
            const deltaY = remap(0.5, [0, 1], currentDomain) + NODE_INTERNAL_PADDING

            node.anchors[currentId] = {
              dx: deltaX,
              dy: deltaY,
            }
          }
        }

        expireSolution(state)
      }),
    loadTemplates: (templates: NodePen.NodeTemplate[]) =>
      set(
        (state) => {
          const library: Record<string, NodePen.NodeTemplate> = {}

          for (const template of templates) {
            library[template.guid] = template
          }

          state.templates = freeze(library)
        },
        false,
        'templates/loadTemplates'
      ),
    commitRegionSelection: () =>
      set(
        (state) => {
          if (!state.registry.selection.region.isActive) {
            console.log('🐍 Attempted to commit a region selection that was not active!')
            return
          }

          const { from, to } = state.registry.selection.region

          const mode = from.x < to.x ? 'contains' : 'intersects'

          const selectedNodeIds: string[] = []

          for (const node of Object.values(state.document.nodes)) {
            // const extents = getExtents(node)

            const isSelected = false

            switch (mode) {
              case 'contains': {
                // regionContainsRegion()
                break
              }
              case 'intersects': {
                // regionIntersectsRegion()
                break
              }
            }

            if (isSelected) {
              state.document.nodes[node.instanceId].status.isSelected = true
              selectedNodeIds.push(node.instanceId)
            }
          }

          // Update top-level selection
          state.registry.selection.nodes = selectedNodeIds

          // Reset state to unset value
          state.registry.selection.region = { isActive: false }
        },
        false,
        'selection/region/commit'
      ),
    setCameraAspect: (aspect: number) =>
      set(
        (state) => {
          state.camera.aspect = aspect
        },
        false,
        'camera/setAspect'
      ),
    setCameraPosition: (x: number, y: number) =>
      set(
        (state) => {
          startTransition(() => {
            state.camera.position = { x, y }
          })
        },
        false,
        'camera/setPosition'
      ),
    setCameraZoom: (zoom: number) =>
      set(
        (state) => {
          startTransition(() => {
            state.camera.zoom = zoom
          })
        },
        false,
        'camera/setZoom'
      ),
    setNodePosition: (id: string, x: number, y: number) =>
      set(
        (state) => {
          const node = state.document.nodes[id]

          if (!node) {
            return
          }

          if (!state.registry.selection.nodes.includes(id)) {
            startTransition(() => {
              node.position.x = x
              node.position.y = y
            })

            return
          }

          const { x: currentX, y: currentY } = node.position

          const [dx, dy] = [x - currentX, y - currentY]

          for (const nodeInstanceId of state.registry.selection.nodes) {
            const selectedNode = state.document.nodes[nodeInstanceId]

            if (!selectedNode) {
              console.log('🐍 Could not move selected node position because node is not present in document!')
              continue
            }

            state.document.nodes[nodeInstanceId].position = {
              x: selectedNode.position.x + dx,
              y: selectedNode.position.y + dy,
            }
          }
        },
        false,
        {
          type: 'node/setPosition',
          payload: { id, x, y },
        }
      ),
    clearInterface: () =>
      set(
        (state) => {
          state.registry.contextMenus = {}
          state.registry.tooltips = {}
        },
        false,
        'ui/clearInterface'
      ),
    clearSelection: () =>
      set(
        (state) => {
          for (const nodeInstanceId of state.registry.selection.nodes) {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
              console.log('🐍 Node selected in registry missing from document!')
              continue
            }

            node.status.isSelected = false
          }

          state.registry.selection.nodes = []
        },
        false,
        'ui/clearSelection'
      ),
  }

  return { dispatch }
}

export const useDispatch = () => {
  return useStore((state) => state.dispatch, shallow)
}
