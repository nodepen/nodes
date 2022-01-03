import React from 'react'
import { NodePen } from 'glib'
import { useQuery, gql } from '@apollo/client'
import { useSessionManager } from '@/features/common/context/session'
import { GraphCard } from '@/features/common/gallery'

export const LandingFeaturedGraphs = (): React.ReactElement => {
  const { device } = useSessionManager()

  const { data } = useQuery(
    gql`
      query DashboardPopularGraphs {
        graphsByPopularity {
          id
          name
          author {
            name
          }
          files {
            thumbnailImage
            thumbnailVideo
          }
          stats {
            views
          }
        }
      }
    `
  )

  const count = device.breakpoint === 'sm' ? 2 : 6

  const cards: NodePen.GraphManifest[] = (data?.graphsByPopularity ?? []).slice(0, count)

  return (
    <div className={`${device.breakpoint === 'sm' ? 'cards-sm' : 'cards-md'} w-full cards`}>
      {cards.map((graph, i) => (
        <GraphCard
          key={`home-featured-graph-${i}-${graph.id}`}
          color="swampgreen"
          graph={graph}
          orientation="vertical"
          views={false}
        />
      ))}
      <style jsx>{`
        .cards {
          display: grid;
          grid-gap: 16px;
          transform: translateY(94px);
          z-index: 35;
        }

        .cards-sm {
          grid-template-columns: 1fr 1fr;
        }

        .cards-md {
          grid-template-columns: 1fr 1fr 1fr;
        }
      `}</style>
    </div>
  )
}
