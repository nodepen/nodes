import { Glasshopper } from 'glib'

export const getFlattenedValues = (
  data: Glasshopper.Data.DataTree
): Glasshopper.Data.DataTreeValue<Glasshopper.Data.ValueType>[] => {
  return Object.entries(data)
    .map(([_path, values]) => values)
    .reduce((all, current) => [...all, ...current], [])
}
