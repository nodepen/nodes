import React, { useEffect } from 'react'
import { NodePen } from 'glib'
import { useQuery, gql } from '@apollo/client'
import { useSessionManager } from '../../common/context/session'
import { CompositeThumbnail } from './CompositeThumbnail'

const GraphList = (): React.ReactElement => {
  const { user } = useSessionManager()

  const { loading, error, data } = useQuery(
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

  return (
    <>
      {data?.graphsByAuthor?.map((graph: NodePen.GraphManifest) => {
        const { id, name, author, files } = graph

        return (
          <>
            <a href={`/${author.name}/gh/${id}`}>{name}</a>
            <div className="w-48 h-36">
              <CompositeThumbnail imageSrc={files.thumbnailImage} videoSrc={files.thumbnailVideo} />
            </div>
          </>
        )
      })}
    </>
  )
}

export default React.memo(GraphList)
