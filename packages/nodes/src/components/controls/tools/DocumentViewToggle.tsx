import { COLORS } from '@/constants'
import React from 'react'

const DocumentViewToggle = () => {

  return (
    <div className='np-h-full np-w-64 np-flex np-items-center np-justify-between np-border-2 np-border-dark np-rounded-md'>
      <div className='np-w-8 np-h-8 np-border-2 np-border-dark np-rounded-md' />
      <svg width="80" height="40" className='np-overflow-visible' viewBox="0 0 20 10">
        <path d="M 0 10 A 10 10 0 0 1 20 10" fill="none" stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="square" />
        <IncrementMarkers />
        <g style={{ transform: 'rotate(-45deg)', transformOrigin: '50% 100%' }}>
          <path d="M 11 10 A 1 1 0 0 1 9 10 L 9.5 0 A 0.5 0.5 0 0 1 10.5 0 Z" fill={COLORS.LIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <div className='np-w-8 np-h-8 np-border-2 np-border-dark np-rounded-md' />
    </div>
  )
}

const IncrementMarkers = () => {
  const MAJOR_LENGTH = 1.75
  const MINOR_LENGTH = 0.75
  return (
    <>
      {/* Major */}
      <Ray from={[10, 10]} position={180} raySize={9} segmentSize={MAJOR_LENGTH} />
      <Ray from={[10, 10]} position={135} raySize={9} segmentSize={MAJOR_LENGTH} />
      <Ray from={[10, 10]} position={90} raySize={9} segmentSize={MAJOR_LENGTH} />
      <Ray from={[10, 10]} position={45} raySize={9} segmentSize={MAJOR_LENGTH} />
      <Ray from={[10, 10]} position={0} raySize={9} segmentSize={MAJOR_LENGTH} />
      {/* Minor */}
      <Ray from={[10, 10]} position={15} raySize={9} segmentSize={MINOR_LENGTH} />
      <Ray from={[10, 10]} position={30} raySize={9} segmentSize={MINOR_LENGTH} />
      <Ray from={[10, 10]} position={60} raySize={9} segmentSize={MINOR_LENGTH} />
      <Ray from={[10, 10]} position={75} raySize={9} segmentSize={MINOR_LENGTH} />
      <Ray from={[10, 10]} position={105} raySize={9} segmentSize={MINOR_LENGTH} />
      <Ray from={[10, 10]} position={120} raySize={9} segmentSize={MINOR_LENGTH} />
      <Ray from={[10, 10]} position={150} raySize={9} segmentSize={MINOR_LENGTH} />
      <Ray from={[10, 10]} position={165} raySize={9} segmentSize={MINOR_LENGTH} />
    </>
  )
}

type RayProps = {
  // Ray center point
  from: [cx: number, cy: number]
  // In degrees
  position: number
  // Length of ray from center
  raySize: number
  // Length of line drawn along ray
  segmentSize: number
}

const Ray = ({ from, position, raySize, segmentSize }: RayProps) => {
  const [cx, cy] = from
  const rad = position / (180 / Math.PI)

  const unitX = Math.cos(rad)
  const unitY = Math.sin(rad) * -1

  const segmentRadius = raySize - segmentSize

  return <line x1={unitX * segmentRadius + cx} y1={unitY * segmentRadius + cy} x2={unitX * raySize + cx} y2={unitY * raySize + cy} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
}

export default React.memo(DocumentViewToggle)