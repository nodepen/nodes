import React, { useMemo, useState } from 'react'
import type * as NodePen from '@nodepen/core'
import { COLORS } from '@/constants'
import { getIconAsImage, groupTemplatesByCategory } from '@/utils/templates'
import { ControlPanel, ControlPanelHeader } from '../../common'

type TemplateLibraryControlProps = {
  templates: { [templateId: string]: NodePen.NodeTemplate }
}

const TemplateLibraryControl = ({ templates }: TemplateLibraryControlProps): React.ReactElement => {
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
            className={`${category === activeCategory ? 'np-bg-green np-border-b-green np-border-b-2 np-shadow-main' : ''} np-inline-block np-box-border np-h-6 np-mr-1 last:np-mr-2 np-rounded-sm np-rounded-br-none np-rounded-bl-none hover:np-border-b-2 hover:np-border-b-green`}
            onClick={() => { setActiveCategory(category) }}
          >
            <p className='np-pl-2 np-pr-2 np-font-sans np-text-sm np-text-dark np-select-none -np-translate-y-px hover:np-translate-y-[-2px]'>
              {category}
            </p>
          </button>
        ))}
      </div>
      <div className='np-w-full np-max-h-36 np-overflow-auto no-scrollbar'>
        {Object.entries(activeCategoryTemplatesBySubcategory).map(([subcategory, templates]) => (
          <div className='np-w-full np-grid np-grid-cols-6 np-gap-2'>
            {templates.map((template) => (
              <div className='np-w-full np-h-full np-bg-swampgreen np-rounded-sm'>
                <img src={getIconAsImage(template)} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* {Object.entries(templatesByCategory).map(([category, subcategoryNodes]) => (
        <div>
          <h3>{category}</h3>
          {Object.entries(subcategoryNodes).map(([subcategory, templates]) => (
            <>
              <h4>{subcategory}</h4>
              {templates.map((template) => (
                <p>{template.nickName}</p>
              ))}
            </>
          ))}
        </div>
      ))} */}
    </ControlPanel>
  )
}

export default React.memo(TemplateLibraryControl)
