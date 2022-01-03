import React from 'react'
import { NodePen } from 'glib'
import { gql, useQuery } from '@apollo/client'
import { GraphCard } from '@/features/common/gallery'

const DashboardFeaturedGraphs = (): React.ReactElement => {
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

  console.log({ data })

  if (error) {
    console.log(error)
  }

  const cards = (data?.graphsByPopularity ?? []).slice(0, 5)
  const visibleCards = [...cards, ...cards]

  return (
    <div className="w-full pt-4 mb-4 no-scrollbar whitespace-nowrap overflow-hidden">
      {visibleCards.map((graph: NodePen.GraphManifest) => (
        <div key={`featured-graph-list-card-${graph.id}`} className="w-76 mr-4 inline-block whitespace-normal card">
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
