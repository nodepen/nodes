import React from 'react'
import Link from 'next/link'
import { NextPage } from 'next'
import { CommonSection, QuirkyDivider } from './components/layout'

/**
 * Home page for unauthenticated visits.
 */
const HomePageLanding: NextPage = () => {
  return (
    <div className="w-vw h-vh overflow-auto">
      <div className="w-full h-10 flex justify-start items-center bg-green sticky top-0 z-50">
        <a className="p-0 mr-4 w-12 h-full flex justify-center items-center" href="/">
          <img
            src="/nodepen-green.svg"
            width="30"
            height="28"
            alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
          />
        </a>
        <div className="flex-grow h-full p-1 pr-2 flex justify-end items-center">
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
        </div>
      </div>
      <div className="w-full pt-4 flex flex-col justify-end bg-green overflow-hidden">
        <CommonSection>
          <div className="w-full h-48 bg-swampgreen">
            <img src="/nodepen-brand-green.svg" width="128" />
          </div>
        </CommonSection>
        <QuirkyDivider topColor="#98E2C6" bottomColor="#eff2f2" />
      </div>
      <div className="w-full pt-12 flex flex-col justify-end bg-pale overflow-hidden">
        <CommonSection>
          <div className="w-full h-128 bg-swampgreen" />
        </CommonSection>
        <QuirkyDivider topColor="#eff2f2" bottomColor="#ffffff" />
      </div>
      <div className="w-full pt-4 pb-2 bg-white">
        <CommonSection>
          <div className="w-full h-36 bg-swampgreen" />
        </CommonSection>
      </div>
    </div>
  )
}

export default React.memo(HomePageLanding)
