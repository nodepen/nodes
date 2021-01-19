import { Glasshopper } from 'glib'

export const getValueCount = (
  element: Glasshopper.Element.StaticParameter | Glasshopper.Element.StaticComponent,
  parameter: string
): number => {
  switch (element.template.type) {
    case 'static-component': {
      const component = element as Glasshopper.Element.StaticComponent

      const tree = component.current.values[parameter]

      return getTreeValueCount(tree)
    }
    case 'static-parameter': {
      const parameter = element as Glasshopper.Element.StaticParameter

      const tree = parameter.current.values

      return getTreeValueCount(tree)
    }
  }
}

const getTreeValueCount = (data: Glasshopper.Data.DataTree): number => {
  return Object.values(data).reduce((count, branch) => count + branch.length, 0)
}
