import React from 'react'
import { NodePen } from 'glib'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { useSessionManager } from '../../common/context/session'
import { GraphCard } from '@/features/common/gallery'

const DashboardUserGraphs = (): React.ReactElement => {
  const { user } = useSessionManager()

  const client = useApolloClient()

  const { data, refetch } = useQuery(
    gql`
      query CurrentUserGraphs($author: String!) {
        graphsByAuthor(author: $author) {
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
    `,
    {
      variables: {
        author: user?.displayName,
      },
      skip: !user?.displayName,
    }
  )

  const handleDelete = (id?: string): void => {
    if (!id) {
      return
    }

    client
      .mutate({
        mutation: gql`
          mutation DeleteGraph($graphId: String!) {
            deleteGraph(graphId: $graphId)
          }
        `,
        variables: {
          graphId: id,
        },
      })
      .then((_res) => {
        return refetch()
      })
      .then((_res) => {
        // Do nothing
      })
      .catch((err) => {
        console.log(`🐍 Failed to delete graph!`)
        console.error(err)
      })
  }

  return (
    <div className="w-full container">
      {data?.graphsByAuthor?.map((graph: NodePen.GraphManifest) => (
        <GraphCard
          key={`graph-list-card-${graph.id}`}
          graph={graph}
          orientation="vertical"
          color="swampgreen"
          actionable
          onDelete={() => handleDelete(graph.id)}
        />
      ))}
      <style jsx>{`
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-gap: 16px;
        }
      `}</style>
    </div>
  )
}

export default React.memo(DashboardUserGraphs)
