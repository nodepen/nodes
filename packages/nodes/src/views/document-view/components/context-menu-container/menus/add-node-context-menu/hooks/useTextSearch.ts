import { levenshteinDistance } from '../utils'
import { useMemo } from 'react'

type RequireStringValue<T extends Record<string, unknown>> = {
  [Property in keyof T as T[Property] extends string ? (Property extends string ? Property : never) : never]: string
}

type OnlyStringKeys<T extends Record<string, unknown>> = keyof Pick<
  T,
  Exclude<keyof RequireStringValue<T>, number | symbol>
>

type SearchResult<T> = {
  candidates: T[]
  exactMatch?: T
}

/**
 * @param items The collection of objects to run the search against.
 * @param search The string value to compare object properties against.
 * @param keys The keys on each object to compare the search query against.
 */
export const useTextSearch = <T extends Record<string, unknown>>(
  items: T[],
  search: string,
  keys: OnlyStringKeys<T>[]
): SearchResult<T> => {
  const getSortValue = (item: T, search: string): number => {
    return Math.min(
      ...keys.map((key) => {
        const targetValue = item[key]

        if (typeof targetValue !== 'string') {
          return Number.MAX_SAFE_INTEGER
        }

        return levenshteinDistance(targetValue, search)
      })
    )
  }

  const searchCandidates = useMemo(() => {
    return structuredClone(items)
  }, [items])

  const result: SearchResult<T> = useMemo(() => {
    const defaultResult: SearchResult<T> = {
      candidates: searchCandidates,
    }

    if (!search || search.length <= 0) {
      return defaultResult
    }

    const exactMatch = searchCandidates.find((candidate) => {
      for (const key of keys) {
        const value = candidate[key]

        if (typeof value !== 'string') {
          continue
        }

        if (value.toLowerCase() === search) {
          return true
        }
      }

      return false
    })

    const candidates = searchCandidates.sort((a, b) => getSortValue(a, search) - getSortValue(b, search))

    return { candidates, exactMatch }
  }, [search, searchCandidates])

  return result
}
