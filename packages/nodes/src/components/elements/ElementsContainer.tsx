import React from 'react'
import type { Element } from '@nodepen/core'
import { useStore } from '$'

const ElementsContainer = (): React.ReactElement => {
  const elements = useStore((store) => store.document.elements)

  return <></>
}

export default React.memo(ElementsContainer)
