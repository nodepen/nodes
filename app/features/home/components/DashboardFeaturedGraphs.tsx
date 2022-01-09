import React from 'react'
import { NodePen } from 'glib'
import { gql, useQuery } from '@apollo/client'
import { GraphCard } from '@/features/common/gallery'
import { useSessionManager } from '@/features/common/context/session'

const DashboardFeaturedGraphs = (): React.ReactElement => {
  const { token } = useSessionManager()

  const { data, error } = useQuery(
    gql`
      query DashboardPopularGraphs {
        graphsByPopularity {
          id
          name
          author {
            name
          }
          files {
            thumbnailImage {
              url
            }
            thumbnailVideo {
              url
            }
          }
          stats {
            views
          }
        }
      }
    `,
    {
      skip: !token,
    }
  )

  if (error) {
    console.log(error)
  }

  const cards = (data?.graphsByPopularity ?? []).slice(0, 5)
  const visibleCards = [...cards, ...cards]

  return (
    <div className="w-full pt-4 mb-4 no-scrollbar whitespace-nowrap overflow-hidden" style={{ minHeight: 175 }}>
      {visibleCards.map((graph: NodePen.GraphManifest, i) => (
        <div
          key={`featured-graph-list-card-${i}-${graph.id}`}
          className="w-76 mr-4 inline-block whitespace-normal card"
        >
          <GraphCard graph={graph} orientation="horizontal" color="green" />
        </div>
      ))}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0px);
          }
          to {
            transform: translateX(-1600px);
          }
        }

        .card {
          animation-name: scroll;
          animation-duration: 120s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  )
}

export default React.memo(DashboardFeaturedGraphs)
