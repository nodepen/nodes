import { useMemo } from 'react'
import { Grasshopper } from 'glib'
import { levenshteinDistance } from '../utils'

/**
 * Given a text query and the component library, return a proximity-ordered list of candidates.
 * @remarks If the text exactly matches the name of a component, it will be hoisted to the top of the list.
 * @param query
 * @param library
 */
export const useLibraryTextSearch = (
  query: string,
  library: Grasshopper.Component[] = []
): [candidates: Grasshopper.Component[], exactMatch: Grasshopper.Component | undefined] => {
  const [candidates, exactMatch] = useMemo(() => {
    if (!query || query.length <= 0) {
      return []
    }

    const allCandidates = [...library]

    const sortedCandidates = allCandidates.sort(
      (a, b) => levenshteinDistance(a.name, query) - levenshteinDistance(b.name, query)
    )

    const exactMatch = sortedCandidates.find(
      (candidate) => candidate.name.toLowerCase().indexOf(query.toLowerCase()) === 0
    )

    if (exactMatch) {
      sortedCandidates.splice(
        sortedCandidates.findIndex((candidate) => candidate.name === exactMatch.name),
        1
      )
    }

    const candidates = exactMatch ? [exactMatch, ...sortedCandidates.slice(0, 14)] : sortedCandidates.slice(0, 15)

    return [candidates, exactMatch]
  }, [query, library])

  return [candidates ?? [], exactMatch]
}
