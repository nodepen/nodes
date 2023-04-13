import { levenshteinDistance } from '../utils'
import { useMemo } from 'react'

/**
 * Given a generic record type T, map T to a subset of T where the only keys are those that are
 * for a value of type `string` or `string[]` in T.
 */
type PickStringOrStringArrayValue<T extends Record<string, unknown>> = {
  [Property in keyof T as T[Property] extends string
    ? Property extends string
      ? Property
      : never
    : T[Property] extends string[]
    ? Property extends string
      ? Property
      : never
    : never]: string | string[]
}

/**
 * Given a generic record type T, return the string union type of its keys that are strings.
 */
type RequireStringKeys<T extends Record<string | number | symbol, unknown>> = keyof Pick<
  T,
  Exclude<keyof T, number | symbol>
>

type SearchResult<T> = {
  candidates: T[]
  exactMatch?: T
}

// TODO: Use a better text comparison algorithm

/**
 * @param items The collection of objects to run the search against.
 * @param search The string value to compare object properties against.
 * @param keys The keys on each object to compare the search query against.
 */
export const useTextSearch = <T extends Record<string, unknown>>(
  items: T[],
  search: string,
  keys: RequireStringKeys<PickStringOrStringArrayValue<T>>[]
): SearchResult<T> => {
  const getSortValue = (item: T, search: string): number => {
    const sortValues = keys
      .reduce((allTerms, key) => {
        const targetValue = item[key] as PickStringOrStringArrayValue<T>[keyof PickStringOrStringArrayValue<T>]

        switch (typeof targetValue) {
          case 'object': {
            if (!Array.isArray(targetValue)) {
              return allTerms
            }

            return [...allTerms, ...targetValue]
          }
          case 'string': {
            return [...allTerms, targetValue]
          }
          default: {
            return allTerms
          }
        }
      }, [] as string[])
      .map((term) => levenshteinDistance(term.toLowerCase(), search.toLowerCase()))

    return Math.min(...sortValues)
  }

  const searchCandidates = items

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
