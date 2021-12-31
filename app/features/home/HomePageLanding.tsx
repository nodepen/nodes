import React from 'react'
import Link from 'next/link'
import { NextPage } from 'next'
import { Layout } from 'features/common'
import { QuirkyDivider } from './components/layout'

/**
 * Home page for unauthenticated visits.
 */
const HomePageLanding: NextPage = () => {
  return (
    <div className="w-vw h-vh overflow-auto">
      <Layout.Header>
        <>
          <Link href="/signin">
            <a className="h-6 mr-2 pl-2 pr-2 rounded-sm flex items-center leading-5 text-darkgreen font-semibold text-xs hover:bg-swampgreen">
              SIGN IN
            </a>
          </Link>
          <Link href="/signup">
            <a className="h-6 pl-2 pr-2 rounded-sm bg-darkgreen flex items-center leading-5 text-white font-semibold text-xs hover:text-swampgreen">
              SIGN UP
            </a>
          </Link>
        </>
      </Layout.Header>
      <div className="w-full pt-4 flex flex-col justify-end bg-green overflow-hidden">
        <Layout.SectionBody>
          <div className="w-full h-48 bg-swampgreen">
            <img src="/nodepen-brand-green.svg" width="128" />
          </div>
        </Layout.SectionBody>
        <QuirkyDivider topColor="#98E2C6" bottomColor="#eff2f2" />
      </div>
      <div className="w-full pt-12 flex flex-col justify-end bg-pale overflow-hidden">
        <Layout.SectionBody>
          <div className="w-full h-128 bg-swampgreen" />
        </Layout.SectionBody>
        <QuirkyDivider topColor="#eff2f2" bottomColor="#ffffff" />
      </div>
      <div className="w-full pt-4 pb-2 bg-white">
        <Layout.Footer />
      </div>
    </div>
  )
}

export default React.memo(HomePageLanding)
