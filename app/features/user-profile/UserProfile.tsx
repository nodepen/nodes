import React from 'react'
import { Layout } from 'features/common'
import { useSessionManager } from '../common/context/session'
import { QuirkyDivider } from '../home/components/layout'

export const UserProfile = (): React.ReactElement => {
  const { device, user } = useSessionManager()

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
                  <div className="w-full h-full rounded-md bg-swampgreen" />
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
