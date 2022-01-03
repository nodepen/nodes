import React, { useRef, useState } from 'react'
import { NodePen } from 'glib'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { useSessionManager } from '../../common/context/session'
import { CompositeThumbnail } from './CompositeThumbnail'
import { GraphCard } from '@/features/common/gallery'
import { ModalLayout } from '@/features/common/layout/ModalLayout'

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

  const [showModal, setShowModal] = useState(false)
  const graphStagedForDeletion = useRef<NodePen.GraphManifest>()

  const confirmDelete = (graph: NodePen.GraphManifest): void => {
    graphStagedForDeletion.current = graph

    setShowModal(true)
  }

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
        <GraphCard key={`graph-list-card-${graph.id}`} graph={graph} orientation="vertical" />
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

  return (
    <>
      {data?.graphsByAuthor?.map((graph: NodePen.GraphManifest) => {
        const { id, name, author, files } = graph

        return (
          <>
            <a href={`/${author.name}/gh/${id}`}>{name}</a>
            <button onClick={() => confirmDelete(graph)}>Delete</button>
            <div className="rounded-md overflow-hidden bg-pale" style={{ width: 200, height: 150 }}>
              <CompositeThumbnail imageSrc={files.thumbnailImage} videoSrc={files.thumbnailVideo} />
            </div>
            {showModal ? (
              <ModalLayout onClose={() => setShowModal(false)}>
                <>
                  <h1>Are you sure you want to delete {graphStagedForDeletion.current?.name}?</h1>
                  <button
                    onClick={() => {
                      handleDelete(graphStagedForDeletion.current?.id)
                      setShowModal(false)
                    }}
                  >
                    YES
                  </button>
                  <button onClick={() => setShowModal(false)}>NO!</button>
                </>
              </ModalLayout>
            ) : null}
          </>
        )
      })}
    </>
  )
}

export default React.memo(GraphList)
