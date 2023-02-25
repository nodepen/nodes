import React, { useMemo } from 'react'
import type * as NodePen from '@nodepen/core'
import { COLORS } from '@/constants'
import { groupTemplatesByCategory } from '@/utils/templates'
import { ControlPanel, ControlPanelHeader } from '../../common'

type TemplateLibraryControlProps = {
  templates: { [templateId: string]: NodePen.NodeTemplate }
}

const TemplateLibraryControl = ({ templates }: TemplateLibraryControlProps): React.ReactElement => {
  const templatesByCategory = useMemo(() => groupTemplatesByCategory(templates), [templates])

  const icon = (
    <svg width={24} aria-hidden="true" fill="none" stroke={COLORS.DARKGREEN} strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <ControlPanel>
      <ControlPanelHeader
        icon={icon}
        label="Component Library"
        onClickMenu={() => ''}
      />
      <div className='np-w-full np-overflow-auto np-whitespace-nowrap'>
        {Object.keys(templatesByCategory).map((category) => (
          <p className='np-inline-block'>{category}</p>
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
