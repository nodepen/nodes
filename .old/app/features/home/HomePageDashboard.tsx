import React, { useEffect, useState } from 'react'
import { useSessionManager } from '../common/context/session'
import { DashboardFeaturedGraphs, DashboardUserGraphs } from './components'
import { Layout } from 'features/common'
import { GridDivider, QuirkyDivider } from './components/layout'
import Link from 'next/link'

/**
 * Home page for authenticated visits
 */
const HomePageDashboard = (): React.ReactElement => {
  const { user } = useSessionManager()

  const [width, setWidth] = useState(1920)

  const handleResize = (): void => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(() => {
    handleResize()
  }, [])

  const PIXEL_PER_SECOND = 13.33
  const duration = width / PIXEL_PER_SECOND

  return (
    <div className="w-vw h-vh flex flex-col overflow-x-hidden" id="layout-root">
      <Layout.Header>
        {user ? <Layout.HeaderActions.CurrentUserButton user={user} color="darkgreen" /> : <></>}
      </Layout.Header>
      <Layout.Section id="popular-scripts" color="green">
        <>
          <div className="w-full mt-4 flex items-center">
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
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>

            <h2 className="text-darkgreen text-xl font-semibold">Popular Scripts</h2>
          </div>
          <DashboardFeaturedGraphs />
        </>
      </Layout.Section>
      <Layout.Section
        id="user-scripts"
        color="pale"
        before={<GridDivider duration={duration} />}
        after={<QuirkyDivider topColor="#eff2f2" bottomColor="#ffffff" />}
        flex
      >
        <>
          <div className="w-full mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="#333"
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
            <h2 className="text-dark text-xl font-semibold">Your Scripts</h2>
            <div className="flex flex-grow justify-end">
              <Link href="/gh">
                <a className="ml-4 p-1 pl-1 pr-3 flex items-center rounded-md bg-green hover:bg-swampgreen text-sm text-darkgreen font-semibold">
                  <svg
                    className="w-6 h-6 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Script
                </a>
              </Link>
            </div>
          </div>
          <DashboardUserGraphs />
        </>
      </Layout.Section>
      <hr className="opacity-0 mb-6" />
      <Layout.Footer />
      <hr className="opacity-0 mb-6" />
    </div>
  )
}

export default React.memo(HomePageDashboard)
