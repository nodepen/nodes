import React, { useCallback, useMemo, useRef, useState } from 'react'
import type * as NodePen from '@nodepen/core'
import { groupTemplatesByCategory } from '@/utils/templates'
import { ControlPanel, ControlPanelHeader } from '../../common'
import { useDispatch } from '@/store'
import { TemplateDraggable } from './components'
import { KEYS } from '@/constants'

type TemplateLibraryControlProps = {
  templates: { [templateId: string]: NodePen.NodeTemplate }
}

const TemplateLibraryControl = ({ templates }: TemplateLibraryControlProps): React.ReactElement => {
  const { apply } = useDispatch()

  const templatesByCategory = useMemo(() => groupTemplatesByCategory(templates), [templates])

  const [activeCategory, setActiveCategory] = useState<string>()

  const templateCategories = Object.keys(templatesByCategory)
  if (!activeCategory && templateCategories.length > 0) {
    setActiveCategory(templateCategories[0])
  }

  const activeCategoryTemplatesBySubcategory = templatesByCategory[activeCategory ?? ''] ?? {}

  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const remapVerticalScroll = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // Based on post by StackOverflow user Guido Bouman 🙏
    // https://stackoverflow.com/a/59680347

    if (!e.deltaY) {
      return
    }

    e.currentTarget.scrollLeft += e.deltaY * 0.2 + e.deltaX
    e.preventDefault()
  }, [])

  return (
    <ControlPanel>
      <div
        ref={tabsContainerRef}
        className={`np-shadow-input np-bg-pale np-w-full np-p-2 np-pt-1 np-pb-0 np-mb-2 np-rounded-sm np-overflow-auto np-whitespace-nowrap no-scrollbar`}
        onWheel={remapVerticalScroll}
      >
        {templateCategories.map((category) => (
          <button
            key={`template-library-tab-button-${category.toLowerCase()}`}
            className={`${
              category === activeCategory
                ? 'np-bg-green np-shadow-main np-sticky np-left-0 np-right-0 np-z-20 np-translate-y-[-2px]'
                : 'np-z-10 np-translate-y-[-1px] hover:np-bg-grey'
            } np-inline-block np-box-border np-mr-1 last:np-mr-2 np-rounded-sm`}
            onClick={() => {
              setActiveCategory(category)
            }}
          >
            <p
              className={`${
                category === activeCategory ? 'np-text-darkgreen' : 'np-text-dark'
              } np-pl-2 np-pr-2 np-font-sans np-text-sm np-select-none -np-translate-y-px`}
            >
              {category}
            </p>
          </button>
        ))}
      </div>
      <div
        className="np-w-full np-max-h-[148px] np-overflow-auto no-scrollbar"
        onPointerLeave={() => {
          apply((state) => {
            delete state.registry.tooltips[KEYS.TOOLTIPS.TEMPLATE_LIBRARY_CONTROL_OPTION_HOVER]
          })
        }}
      >
        {Object.entries(activeCategoryTemplatesBySubcategory).map(([subcategory, templates]) => (
          <div
            key={`template-library-subcategory-group-${subcategory.toLowerCase()}`}
            className="np-w-full np-pb-2 last:np-pb-0 np-mb-2 last:np-mb-0 np-border-b-2 np-border-b-swampgreen last:np-border-none np-grid np-grid-cols-[repeat(auto-fill,_minmax(30px,_1fr))] np-gap-2 np-z-0"
          >
            {templates.map((template) => (
              <TemplateDraggable key={`template-library-template-icon-${template.guid}`} template={template} />
            ))}
          </div>
        ))}
      </div>
    </ControlPanel>
  )
}

export default React.memo(TemplateLibraryControl)
