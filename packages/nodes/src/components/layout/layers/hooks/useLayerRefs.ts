import React from 'react'
import { useMemo } from 'react'
import { Layer } from '../types'

type LayerRefMap = Map<Layer, React.RefObject<HTMLDivElement>>

export const useLayerRefs = (): LayerRefMap => {
  const t: LayerRefMap = new Map()

  t.get(24)
  const x = Object.entries(Layer).reduce((all, [_key, value]) => {
    if (typeof value !== 'number') {
      return all
    }

    return { ...all, [value]: React.createRef() }
  }, {} as LayerRefMap)

  console.log(x)

  return {} as any
}