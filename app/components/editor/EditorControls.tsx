import React, { useContext, useState, useMemo, useEffect } from 'react'
import { Grasshopper } from '@/../lib'
import { store } from './lib/state'

export const EditorControls = (): JSX.Element => {
  const { state, dispatch } = useContext(store)

  const [selectedCategory, setSelectedCategory] = useState('cat')
  const [selectedSubcategory, setSelectedSubcategory] = useState('subcat')

  const categories = useMemo(() => {
    const categories: Grasshopper.Category[] = []

    state.library.components.forEach((component) => {
      const { Category: cat, Subcategory: subcat } = component

      if (categories.some(({ name }) => name === cat)) {
        const cached = categories.find((c) => c.name === cat)

        if (cached.subcategories.includes(subcat)) {
          return
        }

        cached.subcategories.push(subcat)
        cached.subcategories.sort()
      } else {
        categories.push({ name: cat, subcategories: [subcat] })
      }
    })

    return categories
  }, [state.library.components])

  useEffect(() => {
    setSelectedCategory(categories[0]?.name ?? 'cat')
    setSelectedSubcategory(categories[0]?.subcategories[0] ?? 'subcat')
  }, [categories])

  const components = useMemo(() => {
    return state.library.components.filter(
      (c) => c.Category === selectedCategory && c.Subcategory === selectedSubcategory
    )
  }, [state.library.components, selectedCategory, selectedSubcategory])

  const handleToggleCategory = (): void => {
    const currentIndex = categories.findIndex(({ name }) => name === selectedCategory)
    const nextIndex = (currentIndex + 1) % categories.length

    setSelectedCategory(categories[nextIndex].name)
    setSelectedSubcategory(categories[nextIndex].subcategories[0])
  }

  const handleToggleSubcategory = (): void => {
    const currentCategory = categories.find(({ name }) => name === selectedCategory)

    if (!currentCategory) {
      return
    }

    const currentIndex = currentCategory.subcategories.findIndex((name) => name === selectedSubcategory)
    const nextIndex = (currentIndex + 1) % currentCategory.subcategories.length

    setSelectedSubcategory(currentCategory.subcategories[nextIndex])
  }

  return (
    <div className="w-full h-12 min-h-12 pl-8 pr-8 pt-2 pb-2 bg-green flex flex-row items-center">
      <div className="w-64 min-w-64 h-full p-1 mr-4 border-2 border-swampgreen rounded-sm flex flex-row items-center justify-evenly">
        <button
          className="w-1/2 text-sm text-darkgreen text-center transition-colors duration-200 bg-green hover:bg-swampgreen focus:outline-none"
          onClick={handleToggleCategory}
        >
          {selectedCategory}
        </button>
        <div className="text-sm text-darkgreen pl-1 pr-1">|</div>
        <button
          className="w-1/2 text-sm text-darkgreen text-center transition-colors duration-200 bg-green hover:bg-swampgreen focus:outline-none"
          onClick={handleToggleSubcategory}
        >
          {selectedSubcategory}
        </button>
      </div>
      <div className="h-full flex-grow overflow-hidden">
        {components.map((component) => (
          <button
            key={`sel-${component.Guid}`}
            className="h-full w-8 mr-2 inline-block border-2 rounded-sm transition-colors duration-200 border-green hover:border-swampgreen"
          >
            <div className="w-full h-full flex justify-center items-center">
              <img src={`data:image/png;base64,${component.Icon}`} alt={component.Name} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
