import { useStore } from "@/store"
import TemplateLibraryDraggable from "./TemplateLibraryDraggable"
import { COMPONENTS } from "@/constants"
import type { NodeTemplate } from "@/types"

export const ParameterLibrary = () => {
    const [primitiveParams, geometricParams, specialParams] = useStore((state) => {
        const specialParamGuids = [
            COMPONENTS.NUMBER_SLIDER,
            COMPONENTS.PANEL,
            COMPONENTS.VALUE_LIST,
            COMPONENTS.BOOLEAN_TOGGLE
        ]

        const p: NodeTemplate[] = []
        const g: NodeTemplate[] = []
        const s: NodeTemplate[] = []

        for (const template of Object.values(state.templates)) {
            if (template.category !== 'Params') {
                continue
            }

            if (specialParamGuids.includes(template.guid)) {
                s.push(template)
            }

            if (template.subcategory === 'Geometry') {
                g.push(template)
            }

            if (template.subcategory === 'Primitive') {
                p.push(template)
            }
        }

        return [p, g, s]
    })

    return <div className="np-w-full np-h-full np-flex np-flex-col np-justify-start">
        <div className="np-w-full np-flex np-justify-between np-items-center">
            <p className="np-ml-2 np-text[14px] np-text-dark np-font-panel np-font-[800]">
                Geometry
            </p>
        </div>
        <div className="np-w-[60%] np-pl-1 np-pr-1 np-mb-2 np-grid np-grid-cols-[repeat(auto-fill,minmax(30px,1fr))] np-gap-2 np-content-start np-overflow-y-auto">
            {geometricParams.map((template) => <TemplateLibraryDraggable key={template.guid} template={template} showTooltip />)}
        </div>
        <div className="np-w-full np-flex np-justify-start np-items-center">
            <p className="np-ml-2 np-text[14px] np-text-dark np-font-panel np-font-[800]">
                Primitives
            </p>
        </div>
        <div className="np-w-[60%] np-pl-1 np-pr-1 p-mb-2 np-grid np-grid-cols-[repeat(auto-fill,minmax(30px,1fr))] np-gap-2 np-content-start np-overflow-y-auto">
            {primitiveParams.map((template) => <TemplateLibraryDraggable key={template.guid} template={template} showTooltip />)}
        </div>
        <div className="np-w-full np-flex np-justify-start np-items-center">
            <p className="np-ml-2 np-text[14px] np-text-dark np-font-panel np-font-[800]">
                Special
            </p>
        </div>
        <div className="np-w-[60%] np-pl-1 np-pr-1 np-grow np-grid np-grid-cols-[repeat(auto-fill,minmax(30px,1fr))] np-gap-2 np-content-start np-overflow-y-auto">
            {specialParams.map((template) => <TemplateLibraryDraggable key={template.guid} template={template} showTooltip />)}
        </div>
    </div>
}