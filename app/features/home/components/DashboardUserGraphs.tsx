import React from 'react'
import { NodePen } from 'glib'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { useSessionManager } from '../../common/context/session'
import { GraphCard } from '@/features/common/gallery'
import Link from 'next/link'

const DashboardUserGraphs = (): React.ReactElement => {
  const { user } = useSessionManager()

  const client = useApolloClient()

  const { loading, data, refetch } = useQuery(
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

  const graphs: NodePen.GraphManifest[] = data?.graphsByAuthor ?? []

  if (loading || !user) {
    return <></>
  }

  if (graphs.length === 0) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center rounded-md border-2 border-green border-dashed">
        <h3 className="mb-2 text-2xl text-dark font-semibold">No scripts yet!</h3>
        <Link href="/gh">
          <a className="p-1 pl-1 pr-3 flex items-center rounded-md bg-green hover:bg-swampgreen text-sm text-darkgreen font-semibold">
            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create One Now
          </a>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full container">
      {graphs.map((graph) => (
        <GraphCard
          key={`graph-list-card-${graph.id}`}
          graph={graph}
          orientation="vertical"
          color="white"
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
