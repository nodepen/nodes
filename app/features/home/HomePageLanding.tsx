import React from 'react'
import Link from 'next/link'
import { NextPage } from 'next'
import { Layout } from 'features/common'
import { QuirkyDivider } from './components/layout'
import { LandingSection } from './components'
import { LandingSectionContent } from './types'

/**
 * Home page for unauthenticated visits.
 */
const HomePageLanding: NextPage = () => {
  const content: LandingSectionContent[] = [
    {
      title: 'Create and Edit Grasshopper Scripts',
      copy: 'NodePen is a platform for creating, sharing, and exploring Grasshopper scripts online. Try something out, learn something new, and share it with the world - all from the comfort of your favorite web browser.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      ),
      graphic: <svg></svg>,
    },
  ]
  return (
    <div className="w-vw h-vh overflow-x-hidden">
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
      <Layout.Section
        color="green"
        before={<hr className="pt-6 opacity-0 bg-green" />}
        after={<QuirkyDivider topColor="#98E2C6" bottomColor="#eff2f2" />}
      >
        <Layout.Columns>
          <div className="w-full flex flex-col items-start">
            <img src="/nodepen-brand-green.svg" width="300" className="mb-2" />
            <h2 className="mb-3 text-4xl font-bold text-dark">SAME GRASSHOPPER, NEW DIGS</h2>
            <p className="mb-8 text-xl leading-8 font-medium text-dark">
              NodePen is a platform for creating, sharing, and exploring Grasshopper scripts online. Try something out,
              learn something new, and share it with the world — all from the comfort of your favorite web browser.
            </p>
            <div className="w-full flex flex-wrap justify-start items-center">
              <Link href="/signup">
                <a className="pl-6 pr-6 mr-4 rounded-md h-12 border-2 border-swampgreen hover:bg-swampgreen flex items-center text-lg font-semibold text-darkgreen">
                  SIGN UP FOR FREE
                </a>
              </Link>
              <Link href="/gh">
                <a className="pl-6 pr-6 rounded-md h-12 flex items-center text-lg font-semibold text-darkgreen hover:bg-swampgreen">
                  TRY THE EDITOR
                </a>
              </Link>
            </div>
          </div>
          <div className="w-full cards">
            <div className="w-12 h-12 bg-swampgreen rounded-md" style={{ width: '100%', paddingBottom: '133%' }} />
            <div className="w-12 h-12 bg-swampgreen rounded-md" style={{ width: '100%', paddingBottom: '133%' }} />
            <div className="w-12 h-12 bg-swampgreen rounded-md" style={{ width: '100%', paddingBottom: '133%' }} />
            <div className="w-12 h-12 bg-swampgreen rounded-md" style={{ width: '100%', paddingBottom: '133%' }} />
            <div className="w-12 h-12 bg-swampgreen rounded-md" style={{ width: '100%', paddingBottom: '133%' }} />
            <div className="w-12 h-12 bg-swampgreen rounded-md" style={{ width: '100%', paddingBottom: '133%' }} />
          </div>
        </Layout.Columns>
      </Layout.Section>
      <Layout.Section flex color="pale" after={<QuirkyDivider topColor="#eff2f2" bottomColor="#ffffff" />}>
        <div className="w-full pt-36 h-128">
          <LandingSection content={{} as any} shape="circle" />
        </div>
      </Layout.Section>
      <div className="w-full pt-4 pb-2 bg-white">
        <Layout.Footer />
      </div>
      <style jsx>{`
        .cards {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-gap: 16px;
          transform: translateY(94px);
          z-index: 35;
        }
      `}</style>
    </div>
  )
}

export default React.memo(HomePageLanding)
