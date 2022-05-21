import React from 'react'
import type { Element } from '@nodepen/core'

type ElementsContainerProps = {
  elements: { [elementId: string]: Element }
}

const ElementsContainer = ({ elements }: ElementsContainerProps): React.ReactElement => {
  return <></>
}

export default React.memo(ElementsContainer, (prev, next) => {
  const previousElementIds = Object.keys(prev.elements)
  const nextElementIds = Object.keys(next.elements)

  const isDifferentLength = () => previousElementIds.length !== nextElementIds.length
  const isDifferentSet = () =>
    previousElementIds.some((id) => !nextElementIds.includes(id)) ||
    nextElementIds.some((id) => !previousElementIds.includes(id))

  return isDifferentLength() || isDifferentSet()
})
