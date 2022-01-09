import React from 'react'
import Link from 'next/link'
import { SectionInnerLayout as SectionBody } from '../SectionLayout'
import { FooterSection } from './components'
import { FooterLink } from './types'

export const FooterLayout = (): React.ReactElement => {
  const mainLinks: FooterLink[] = [
    {
      label: 'License',
      href: 'https://github.com/cdriesler/nodepen/blob/main/LICENSE',
      internal: false,
    },
    {
      label: 'Source Code',
      href: 'https://github.com/cdriesler/nodepen',
      internal: false,
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/cdriesler',
      internal: false,
    },
  ]

  return (
    <>
      <SectionBody>
        <footer>
          <div className="w-full flex flex-col justify-start items-start">
            <FooterSection title="NodePen" links={mainLinks} />
            <FooterSection
              title="Attribution"
              content={'Rhinoceros and Grasshopper are registered trademarks of Robert McNeel & Associates.'}
            />
          </div>
          <div className="w-full flex flex-col justify-start items-end">
            <img
              src="/nodepen.svg"
              width="30"
              height="28"
              alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
            />
            <p className="text-xs font-medium text-dark">&copy; Chuck 2022</p>
            <Link href="/legal/terms-and-conditions">
              <a className="text-xs font-medium text-dark hover:underline">Terms and Conditions</a>
            </Link>
            <Link href="/legal/privacy-policy">
              <a className="text-xs font-medium text-dark hover:underline">Privacy Policy</a>
            </Link>
          </div>
        </footer>
      </SectionBody>
      <style jsx>{`
        footer {
          display: grid;
          grid-template-columns: 1fr minmax(150px, 20%);
        }
      `}</style>
    </>
  )
}
