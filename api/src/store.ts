import { Grasshopper } from 'glib'

export const serverConfig: Grasshopper.Component[] = []

export const setServerConfig = (installed: Grasshopper.Component[]): void => {
  const ids = getAllowedIds()

  serverConfig.push(
    ...installed.filter((component) => ids.includes(component.guid))
  )
}

export const getAllowedIds = (): string[] => {
  return Object.values(allowedComponents).reduce(
    (allowedIds, subcategories) => {
      return [
        ...allowedIds,
        ...Object.values(subcategories).reduce(
          (categoryIds, subcategoryIds) => {
            return [...categoryIds, ...subcategoryIds]
          },
          [] as string[]
        ),
      ]
    },
    [] as string[]
  )
}

export const allowedComponents = {
  sets: {
    sequence: [
      '01640871-69ea-40ac-9380-4660d6d28bd2', // Char Sequence (CharSeq)
    ],
  },
}
