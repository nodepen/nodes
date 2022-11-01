import React, { useMemo } from 'react'
import type * as NodePen from '@nodepen/core'
import { groupTemplatesByCategory } from '@/utils/templates'
import { ControlPanel } from '../../common'

type TemplateLibraryControlProps = {
  templates: { [templateId: string]: NodePen.NodeTemplate }
}

const TemplateLibraryControl = ({ templates }: TemplateLibraryControlProps): React.ReactElement => {
  const templatesByCategory = useMemo(() => groupTemplatesByCategory(templates), [templates])
  return (
    <ControlPanel>
      {Object.entries(templatesByCategory).map(([category, subcategoryNodes]) => (
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
      ))}
    </ControlPanel>
  )
}

export default React.memo(TemplateLibraryControl)
