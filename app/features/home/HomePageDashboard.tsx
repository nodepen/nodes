import React from 'react'
import { ApolloContext } from '../common/context/apollo'
import { useSessionManager } from '../common/context/session'
import { DashboardFeaturedGraphs, DashboardUserGraphs } from './components'
import { Layout } from 'features/common'
import { QuirkyDivider } from './components/layout'

/**
 * Home page for authenticated visits
 */
const HomePageDashboard = (): React.ReactElement => {
  const { user, token } = useSessionManager()

  return (
    <ApolloContext token={token}>
      <div className="w-vw h-vh flex flex-col overflow-x-hidden" id="layout-root">
        <Layout.Header>
          {user ? <Layout.HeaderActions.CurrentUserButton user={user} color="darkgreen" /> : <></>}
        </Layout.Header>
        <Layout.Section id="popular-scripts" color="green">
          <>
            <h2>Popular Scripts</h2>
            <DashboardFeaturedGraphs />
          </>
        </Layout.Section>
        <Layout.Section
          id="user-scripts"
          color="pale"
          before={<hr className="mt-8 opacity-0" />}
          after={<QuirkyDivider topColor="#eff2f2" bottomColor="#ffffff" />}
          flex
        >
          <>
            <h2>Your Scripts</h2>
            <DashboardUserGraphs />
          </>
        </Layout.Section>
        <hr className="opacity-0 mb-6" />
        <Layout.Footer />
        <hr className="opacity-0 mb-6" />
      </div>
    </ApolloContext>
  )
}

export default React.memo(HomePageDashboard)
