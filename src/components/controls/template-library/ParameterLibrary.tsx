import { useStore } from "@/store"
import TemplateLibraryDraggable from "./TemplateLibraryDraggable"
import { COMPONENTS } from "@/constants"
import type { NodeTemplate } from "@/types"

export const ParameterLibrary = () => {
    const [params, specialParams] = useStore((state) => {
        const specialParamGuids = [
            COMPONENTS.NUMBER_SLIDER,
            COMPONENTS.PANEL
        ]

        const p: NodeTemplate[] = []
        const s: NodeTemplate[] = []

        for (const template of Object.values(state.templates)) {
            if (template.category !== 'Params') {
                continue
            }

            if (specialParamGuids.includes(template.guid)) {
                s.push(template)
            } else {
                p.push(template)
            }
        }

        return [p, s]
    })

    return <div className="np-w-full np-h-full np-p-1 np-flex np-flex-col np-justify-start">
        <div className="np-w-full np-mb-2 np-grid np-grid-cols-[repeat(auto-fill,minmax(30px,1fr))] np-gap-2 np-content-start np-overflow-y-auto">
            {specialParams.map((template) => <TemplateLibraryDraggable key={template.guid} template={template} showTooltip />)}
        </div>
        <div className="np-w-full np-grow np-grid np-grid-cols-[repeat(auto-fill,minmax(30px,1fr))] np-gap-2 np-content-start np-overflow-y-auto">
            {params.map((template) => <TemplateLibraryDraggable key={template.guid} template={template} showTooltip />)}
        </div>
    </div>
}