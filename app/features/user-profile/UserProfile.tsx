import React, { useState } from 'react'
import { Layout } from 'features/common'
import { useSessionManager } from '../common/context/session'
import { QuirkyDivider } from '../home/components/layout'

type UserProfileProps = {
  photoUrl?: string
}

export const UserProfile = ({ photoUrl }: UserProfileProps): React.ReactElement => {
  const { device, user } = useSessionManager()

  const [showFallback, setShowFallback] = useState(!photoUrl)

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
      {device.breakpoint === 'sm' ? null : (
        <>
          <Layout.Section color="green">
            <div className="w-full h-24 body-md">
              <div className="w-full h-full relative">
                <div className="absolute left-0 top-0 w-48 h-48 p-4 bg-green rounded-md">
                  <div className="w-full h-full flex items-center justify-center rounded-md bg-swampgreen">
                    {showFallback ? (
                      <svg className="w-12 h-12" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <img className="object-cover" src={photoUrl} onError={() => setShowFallback(true)} alt="" />
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-end">
                <div className="w-full flex items-center justify-start">Scripts</div>
              </div>
            </div>
          </Layout.Section>
          <Layout.Section color="pale" flex after={<QuirkyDivider topColor="#eff2f2" bottomColor="#FFF" />}>
            <div className="w-full h-full body-md">
              <div className="w-full flex flex-col" style={{ transform: 'translateY(112px)' }}>
                User info
              </div>
              <div className="w-full flex-flex-col">Cards</div>
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
      `}</style>
    </div>
  )
}
