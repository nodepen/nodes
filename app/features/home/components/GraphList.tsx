import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useSessionManager } from '../../common/context/session'
import { CompositeThumbnail } from './CompositeThumbnail'

const GraphList = (): React.ReactElement => {
  const { user } = useSessionManager()

  const { loading, error, data } = useQuery(
    gql`
      query CurrentUserGraphs($author: String!) {
        graphsByAuthor(author: $author) {
          manifest {
            id
            name
          }
          files {
            json
            gh
            thumbnailImage
            thumbnailVideo
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

  console.log(data)

  return (
    <>
      {data?.graphsByAuthor?.map((graph) => {
        const { manifest, files } = graph

        return (
          <>
            <h3>{manifest.name}</h3>
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
