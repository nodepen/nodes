import React, { useMemo, useState } from 'react'
import type * as NodePen from '@nodepen/core'
import { COLORS } from '@/constants'
import { createInstance, getIconAsImage, groupTemplatesByCategory } from '@/utils/templates'
import { ControlPanel, ControlPanelHeader } from '../../common'
import { useDispatch } from '@/store'
import { usePageSpaceToWorldSpace } from '@/hooks'
import { getNodeHeight, getNodeWidth } from '@/utils/node-dimensions'

type TemplateLibraryControlProps = {
  templates: { [templateId: string]: NodePen.NodeTemplate }
}

const TemplateLibraryControl = ({ templates }: TemplateLibraryControlProps): React.ReactElement => {
  const { apply } = useDispatch()

  const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

  const templatesByCategory = useMemo(() => groupTemplatesByCategory(templates), [templates])

  const [activeCategory, setActiveCategory] = useState<string>()

  const templateCategories = Object.keys(templatesByCategory)
  if (!activeCategory && templateCategories.length > 0) {
    setActiveCategory(templateCategories[0])
  }

  const activeCategoryTemplatesBySubcategory = templatesByCategory[activeCategory ?? ''] ?? {}

  return (
    <ControlPanel>
      <div
        className={`np-shadow-input np-bg-pale np-w-full np-p-2 np-pt-1 np-pb-0 np-mb-2 np-rounded-sm np-overflow-auto np-whitespace-nowrap no-scrollbar`}
      >
        {templateCategories.map((category) => (
          <button
            key={`template-library-tab-button-${category.toLowerCase()}`}
            className={`${category === activeCategory ? 'np-bg-green np-border-b-green np-border-b-2 np-shadow-main np-sticky np-left-0 np-right-0 np-z-20' : 'np-z-10'} np-inline-block np-box-border np-h-6 np-mr-1 last:np-mr-2 np-rounded-sm np-rounded-br-none np-rounded-bl-none hover:np-border-b-2 hover:np-border-b-green`}
            onClick={() => { setActiveCategory(category) }}
          >
            <p className='np-pl-2 np-pr-2 np-font-sans np-text-sm np-text-dark np-select-none -np-translate-y-px hover:np-translate-y-[-2px]'>
              {category}
            </p>
          </button>
        ))}
      </div>
      <div className='np-w-full np-max-h-[148px] np-overflow-auto no-scrollbar'>
        {Object.entries(activeCategoryTemplatesBySubcategory).map(([subcategory, templates]) => (
          <div
            key={`template-library-subcategory-group-${subcategory.toLowerCase()}`}
            className='np-w-full np-pb-2 last:np-pb-0 np-mb-2 last:np-mb-0 np-border-b-2 np-border-b-swampgreen last:np-border-none np-grid np-grid-cols-[repeat(auto-fill,_minmax(30px,_1fr))] np-gap-2 np-z-0'>
            {templates.map((template) => (
              <button
                key={`template-library-template-icon-${template.guid}`}
                className='np-w-full np-h-full np-pt-[100%] np-relative hover:np-bg-swampgreen np-rounded-sm'
                onPointerDown={(e) => {
                  const { pageX, pageY } = e

                  const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

                  const nodeWidth = getNodeWidth()
                  const nodeHeight = getNodeHeight(template)

                  apply((state) => {
                    const node = createInstance(template)

                    node.status.isProvisional = true
                    node.position = {
                      x: x - nodeWidth / 2,
                      y: y - nodeHeight / 2
                    }

                    state.document.nodes[node.instanceId] = node

                    state.layout.nodePlacement = {
                      isActive: true,
                      activeNodeId: node.instanceId,
                    }
                  })
                }}
              >
                <div className='np-absolute np-top-0 np-right-0 np-left-0 np-bottom-0'>
                  <div className='np-w-full np-h-full np-flex np-items-center np-justify-center'>
                    <img
                      width={22}
                      draggable={false}
                      src={getIconAsImage(template)}
                      alt={`${template.name} (${template.nickName}): ${template.description}`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </ControlPanel>
  )
}

export default React.memo(TemplateLibraryControl)
