import { COLORS } from '@/constants'
import { useStore } from '@/store'
import React from 'react'

const DocumentModelSlider = () => {
  const t = useStore((state) => state.layout.viewConfiguration[1])

  const dotY = t * 40 + 10

  return <div className="np-w-6 np-h-full np-flex np-flex-col np-items-center np-justify-center">
    <svg width="10" height="60" viewBox='0 0 10 60' className='np-overflow-visible'>
      <line x1={-4} y1={dotY} x2={0} y2={dotY} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line x1={2} y1={10} x2={9} y2={10} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line x1={5} y1={16.67} x2={9} y2={16.67} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line x1={5} y1={23.33} x2={9} y2={23.33} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line x1={2} y1={30} x2={9} y2={30} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line x1={5} y1={36.67} x2={9} y2={36.67} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line x1={5} y1={43.33} x2={9} y2={43.33} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line x1={2} y1={50} x2={9} y2={50} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  </div>
}

export default React.memo(DocumentModelSlider)