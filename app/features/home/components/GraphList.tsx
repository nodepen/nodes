import React, { useEffect } from 'react'
import { NodePen } from 'glib'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { query } from '@reduxjs/toolkit'
import { useSessionManager } from '../../common/context/session'
import { CompositeThumbnail } from './CompositeThumbnail'

const GraphList = (): React.ReactElement => {
  const { user } = useSessionManager()

  const client = useApolloClient()

  const { loading, error, data, refetch } = useQuery(
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

  const handleDelete = (id: string): void => {
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
      .then((res) => {
        console.log(res)
        return refetch()
      })
      .then((res) => {
        console.log(res)
      })
  }

  return (
    <>
      {data?.graphsByAuthor?.map((graph: NodePen.GraphManifest) => {
        const { id, name, author, files } = graph

        return (
          <>
            <a href={`/${author.name}/gh/${id}`}>{name}</a>
            <button onClick={() => handleDelete(id)}>Delete</button>
            <div className="rounded-md overflow-hidden bg-pale" style={{ width: 200, height: 150 }}>
              <CompositeThumbnail imageSrc={files.thumbnailImage} videoSrc={files.thumbnailVideo} />
            </div>
          </>
        )
      })}
    </>
  )
}

export default React.memo(GraphList)
