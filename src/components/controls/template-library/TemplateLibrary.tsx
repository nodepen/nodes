import { CircleButton } from "@/components/layout/CircleButton"
import { COLORS } from "@/constants"
import { useStore } from "@/store"
import type { NodeTemplate } from "@/types"
import { useEffect, useMemo, useState } from "react"
import TemplateLibraryDraggable from "./TemplateLibraryDraggable"

export const TemplateLibrary = () => {
    const templates = useStore((state) => {
        const library: Record<string, Record<string, NodeTemplate[]>> = {}

        for (const template of Object.values(state.templates)) {
            library[template.category] ??= {}
            library[template.category][template.subcategory] ??= []
            library[template.category][template.subcategory].push(template)
        }

        return library
    })

    const categories = useMemo(() => Object.keys(templates).filter((category) => category.toLowerCase() !== 'params'), [templates])
    const [activeCategory, setActiveCategory] = useState<string>()

    if (categories.length && !activeCategory) {
        setActiveCategory(categories.at(0))
    }

    const subcategories = useMemo(() => Object.keys(templates[activeCategory ?? ''] ?? {}), [templates, categories])
    const [activeSubcategory, setActiveSubcategory] = useState<string>()
    useEffect(() => {
        setActiveSubcategory(subcategories.at(0))
    }, [activeCategory])

    const activeTemplates = templates[activeCategory ?? '']?.[activeSubcategory ?? ''] ?? []

    return <div className="np-w-full np-h-full np-flex np-flex-col np-justify-start np-items-center">
        <div className="np-w-full np-h-8 np-flex np-items-center np-justify-between">
            {/* <div className="np-w-8 np-min-w-8 np-h-8 np-flex np-items-center np-justify-center">
                <div className="np-w-6 np-h-6 np-rounded-full np-flex np-items-center np-justify-center">
                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-4">
                        <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
            </div> */}
            <div className="np-h-full np-grow np-flex np-items-center np-overflow-x-auto no-scrollbar">
                {categories.map((category) => (<>
                    <div key={`cat-${category}`} className="np-rounded-full np-p-0.5 np-group" onClick={() => setActiveCategory(category)}>
                        <div className={`${activeCategory === category ? 'np-border-dark' : 'np-border-light group-hover:np-border-grey group-hover:np-bg-grey'} np-rounded-full np-p-0.5 np-border-2`}>
                            <div className="np-pl-1 np-pr-1 np-rounded-full np-text-xs np-font-panel np-font-semibold np-whitespace-nowrap group-hover:np-bg-grey group-hover:np-cursor-pointer">
                                {category}
                            </div>
                        </div>
                    </div>
                </>))}
            </div>
            {/* <div className="np-w-8 np-min-w-8 np-h-8 np-flex np-items-center np-justify-center">
                <div className="np-w-6 np-h-6 np-rounded-full np-flex np-items-center np-justify-center">
                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-4">
                        <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
            </div> */}
        </div>
        <div className="np-w-full np-h-8 np-flex np-items-center np-justify-between">
            {/* <div className="np-w-8 np-min-w-8 np-h-8 np-flex np-items-center np-justify-center">
                <div className="np-w-6 np-h-6 np-rounded-full np-flex np-items-center np-justify-center">
                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-4">
                        <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
            </div> */}
            <div className="np-h-full np-grow np-flex np-items-center np-overflow-x-auto no-scrollbar">
                {subcategories.map((subcategory) => (<>
                    <div key={`cat-${subcategory}`} className="np-rounded-full np-p-0.5 np-group" onClick={() => setActiveSubcategory(subcategory)}>
                        <div className={`${activeSubcategory === subcategory ? 'np-border-dark' : 'np-border-light group-hover:np-border-grey group-hover:np-bg-grey'} np-rounded-full np-p-0.5 np-border-2`}>
                            <div className="np-pl-1 np-pr-1 np-rounded-full np-text-xs np-font-panel np-font-semibold np-whitespace-nowrap group-hover:np-bg-grey group-hover:np-cursor-pointer">
                                {subcategory}
                            </div>
                        </div>
                    </div>
                </>))}
            </div>
            {/* <div className="np-w-8 np-min-w-8 np-h-8 np-flex np-items-center np-justify-center">
                <div className="np-w-6 np-h-6 np-rounded-full np-flex np-items-center np-justify-center">
                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-4">
                        <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
            </div> */}
        </div>
        <div className="np-w-full np-h-full np-pl-0.5 np-pr-0.5 np-pb-0.5 np-grid np-grid-cols-[repeat(auto-fill,minmax(30px,1fr))] np-gap-2 np-content-start np-overflow-y-auto">
            {activeTemplates.map((template) => <TemplateLibraryDraggable key={template.guid} template={template} showTooltip />)}
        </div>
    </div>
}