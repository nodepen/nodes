import React, { useState } from 'react'
import { Layout } from 'features/common'
import { useSessionManager } from '../common/context/session'
import { QuirkyDivider } from '../home/components/layout'
import { useQuery, gql } from '@apollo/client'
import { NodePen } from '@/glib/dist'
import { GraphCard } from '../common/gallery'

type UserProfileProps = {
  username: string
  photoUrl?: string
}

export const UserProfile = ({ username, photoUrl }: UserProfileProps): React.ReactElement => {
  const { device, user } = useSessionManager()

  const [showFallback, setShowFallback] = useState(!photoUrl)

  const { data } = useQuery(
    gql`
      query PublicUserGraphs($author: String!) {
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
        author: username,
      },
    }
  )

  const graphs: NodePen.GraphManifest[] = data?.graphsByAuthor ?? []
  const graphsContent = graphs.map((graph) => (
    <GraphCard key={`public-user-graph-${graph.id}`} graph={graph} color="white" orientation="vertical" />
  ))

  const photoContent = showFallback ? (
    <svg className="w-12 h-12" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ) : (
    <img className="object-cover" src={photoUrl} onError={() => setShowFallback(true)} alt="" />
  )

  const tabsContent = (
    <div className={`${device.breakpoint === 'sm' ? '' : 'pl-4'} w-full flex items-center justify-start`}>
      <button className="p-2 pl-4 pr-4 flex items-center border-b-2 border-darkgreen">
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="#093824"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        <p className="text-darkgreen tx-sm font-semibold">Scripts</p>
      </button>
    </div>
  )

  return (
    <div className="w-vw h-vw flex flex-col overflow-auto" id="layout-root">
      <Layout.Header>
        {user ? (
          <Layout.HeaderActions.CurrentUserButton user={user} color="darkgreen" />
        ) : (
          <>
            <Layout.HeaderActions.SignInButton />
            <Layout.HeaderActions.SignUpButton />
          </>
        )}
      </Layout.Header>
      {device.breakpoint === 'sm' ? (
        <>
          <Layout.Section color="green">
            <div className="w-full flex mt-2 mb-4 items-stretch">
              <div className="w-16 h-16 mr-2 flex items-center justify-center rounded-md bg-swampgreen">
                {photoContent}
              </div>
              <div className="flex flex-col">
                <h3 className="text-dark text-lg font-semibold">{username}</h3>
              </div>
            </div>
          </Layout.Section>
          <Layout.Section color="green">{tabsContent}</Layout.Section>
          <Layout.Section color="pale" flex after={<QuirkyDivider topColor="#eff2f2" bottomColor="#FFF" />}>
            <div className="w-full pt-4 cards-sm">{graphsContent}</div>
          </Layout.Section>
        </>
      ) : (
        <>
          <Layout.Section color="green">
            <div className="w-full h-24 body-md">
              <div className="w-full h-full relative">
                <div className="absolute left-0 top-0 w-48 h-48 p-4 bg-green rounded-md">
                  <div className="w-full h-full flex items-center justify-center rounded-md bg-swampgreen">
                    {photoContent}
                  </div>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-end">{tabsContent}</div>
            </div>
          </Layout.Section>
          <Layout.Section color="pale" flex after={<QuirkyDivider topColor="#eff2f2" bottomColor="#FFF" />}>
            <div className="w-full h-full body-md">
              <div className="w-full flex flex-col items-center" style={{ transform: 'translateY(106px)' }}>
                <h3 className="text-dark text-lg font-semibold">{username}</h3>
              </div>
              <div className="w-full p-4 cards-md">{graphsContent}</div>
            </div>
          </Layout.Section>
        </>
      )}
      <div className="w-full pt-6 bg-white">
        <Layout.Footer />
      </div>
      <style jsx>{`
        .body-md {
          display: grid;
          grid-template-columns: 12rem 1fr;
          grid-gap: 0.5rem;
        }

        .cards-md {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-gap: 16px;
        }

        .cards-sm {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          grid-gap: 16px;
        }
      `}</style>
    </div>
  )
}
