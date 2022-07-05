import React from 'react'
import type { Element } from '@nodepen/core'
import { useStore } from '$'
import { COLORS } from '@/constants'

const ElementsContainer = (): React.ReactElement => {
  const elements = useStore((store) => store.document.elements)

  return (
    <>
      <rect x={50} y={25} width={50} height={20} fill={COLORS.LIGHT} />
    </>
  )
}

export default React.memo(ElementsContainer)
