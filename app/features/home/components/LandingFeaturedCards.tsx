import { useSessionManager } from '@/features/common/context/session'
import React from 'react'

export const LandingFeaturedCards = (): React.ReactElement => {
  const { device } = useSessionManager()

  const count = device.breakpoint === 'sm' ? 3 : 6

  return (
    <div className="w-full cards">
      {Array(count)
        .fill('')
        .map((_, i) => (
          <div
            key={`featured-card-${i}`}
            className="w-12 h-12 bg-swampgreen rounded-md"
            style={{ width: '100%', paddingBottom: '133%' }}
          />
        ))}
      <style jsx>{`
        .cards {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-gap: 16px;
          transform: translateY(94px);
          z-index: 35;
        }
      `}</style>
    </div>
  )
}
