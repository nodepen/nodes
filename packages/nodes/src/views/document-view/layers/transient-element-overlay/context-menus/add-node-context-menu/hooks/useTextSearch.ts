import { exactDistance, jaroWinklerDistance, levenshteinDistance } from '../utils'
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

type SearchAlgorithmKey = 'lev' | 'jw' | 'exact'

/**
 * @param items The collection of objects to run the search against.
 * @param search The string value to compare object properties against.
 * @param keys The keys on each object to compare the search query against.
 */
export const useTextSearch = <T extends Record<string, unknown>>(
  items: T[],
  search: string,
  keys: RequireStringKeys<PickStringOrStringArrayValue<T>>[],
  searchAlgorithm: SearchAlgorithmKey = 'lev',
  /**
   * Only return results with search value less than threshold.
   * Values are between 0 and 1, with lower values meaning a better match.
   */
  searchResultThreshold = 1,
  searchResultLimit = 20
): T[] => {
  // Map each object to an array of string values at specified search keys
  const searchValues: [string[], number][] = useMemo(() => {
    return items.map((item, i) => {
      const searchValuesForItem: string[] = []

      for (const key of keys) {
        const targetValue = item[key]

        switch (typeof targetValue) {
          case 'object': {
            if (!Array.isArray(targetValue)) {
              continue
            }

            searchValuesForItem.push(...targetValue)

            break
          }
          case 'string': {
            searchValuesForItem.push(targetValue)
            break
          }
          default: {
            break
          }
        }
      }

      return [searchValuesForItem, i]
    })
  }, [items, keys])

  const sortResult: [searchValue: number, originalIndex: number][] = useMemo(() => {
    const searchAlgorithms: Record<SearchAlgorithmKey, (a: string, b: string) => number> = {
      lev: levenshteinDistance,
      jw: (a, b) => 1 - jaroWinklerDistance(a, b),
      exact: exactDistance,
    }

    const compare = searchAlgorithms[searchAlgorithm]

    const getSearchValue = (values: string[]): number => {
      return Math.min(...values.map((value) => compare(value.toLowerCase(), search.toLowerCase())))
    }

    return searchValues
      .map(([values, originalIndex]): [number, number] => [getSearchValue(values), originalIndex])
      .filter(([searchValue]) => searchValue <= searchResultThreshold)
      .sort((a, b) => a[0] - b[0])
  }, [search, searchValues, searchAlgorithm])

  return sortResult.slice(0, searchResultLimit).map(([_keys, originalIndex]) => items[originalIndex])
}
