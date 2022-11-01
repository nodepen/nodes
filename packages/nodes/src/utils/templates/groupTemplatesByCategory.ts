import type * as NodePen from '@nodepen/core'

type TemplatesByCategory = {
    [category: string]: {
        [subcategory: string]: NodePen.NodeTemplate[]
    }
}

export const groupTemplatesByCategory = (templates: { [templateId: string]: NodePen.NodeTemplate }): TemplatesByCategory => {
    const library: TemplatesByCategory = {}

    for (const template of Object.values(templates)) {
        const { category, subcategory } = template

        library[category] ??= {}
        library[category][subcategory] ??= []

        library[category][subcategory].push(template)
    }

    return library
}