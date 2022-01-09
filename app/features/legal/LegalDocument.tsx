import Link from 'next/link'
import React, { useRef } from 'react'
import { Layout } from '../common'

type LegalDocumentProps = {
  doc: 'TOS' | 'P'
}

export const LegalDocument = ({ doc }: LegalDocumentProps): React.ReactElement => {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    const bg = backgroundRef.current

    if (!bg) {
      return
    }

    const range = bg.scrollHeight - window.innerHeight

    const body = e.target as HTMLDivElement

    const pct = body.scrollTop / (body.scrollHeight - window.innerHeight)

    bg.scrollTo(0, pct * range)
  }

  return (
    <div className="w-vw h-vh relative overflow-hidden">
      <div ref={backgroundRef} className="w-vw h-vh bg-pale absolute top-0 left-0 z-0 overflow-hidden">
        <div
          className="w-full"
          style={{
            height: '125%',
            backgroundSize: `5mm 5mm`,
            backgroundPosition: '3mm 3mm',
            backgroundImage: `linear-gradient(to right, #98e2c6 0.3mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 0.3mm, transparent 1px, transparent 10px)`,
          }}
        />
      </div>
      <div className="w-vw h-10 pl-2 absolute top-0 left-0 bg-none z-50">
        <div className="w-full h-full flex items-center">
          <Link href="/">
            <img
              src="/nodepen-pale.svg"
              width="30"
              height="28"
              alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
            />
          </Link>
        </div>
      </div>
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="w-vw h-vh absolute top-0 left-0 z-30 overflow-auto bg-none"
      >
        <Layout.Section color="none">
          <div className="w-full bg-pale rounded-md mt-12 mb-12">
            {new Array(100).fill('').map((_, i) => (
              <p key={i}>OK</p>
            ))}
          </div>
        </Layout.Section>
      </div>
    </div>
  )
}
