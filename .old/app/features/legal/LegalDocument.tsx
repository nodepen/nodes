import TermsAndConditions from '@/pages/legal/terms-and-conditions'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
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

  const [content, setContent] = useState('')

  useEffect(() => {
    const paths = {
      TOS: '/docs/Terms of Service.md',
      P: '/docs/Privacy Policy.md',
    }

    fetch(paths[doc])
      .then((res) => {
        return res.text()
      })
      .then((text) => {
        setContent(text)
      })
  }, [doc])

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
            <a>
              <img
                src="/nodepen-pale.svg"
                width="30"
                height="28"
                alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
              />
            </a>
          </Link>
        </div>
      </div>
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="w-vw h-vh absolute top-0 left-0 z-30 overflow-auto bg-none"
      >
        <Layout.Section color="none">
          <div className="w-full bg-pale rounded-md p-4 mt-12 mb-12">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </Layout.Section>
      </div>
      <style global jsx>{`
        * {
          font-family: 'Barlow', 'Inter', sans-serif;
          color: #333;
        }

        h1 {
          font-size: 3rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 2.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.6rem;
          margin-bottom: 8px;
        }

        li {
          padding-left: 9px;
        }

        a {
          text-decoration: underline;
        }

        a:hover {
          color: #777;
        }
      `}</style>
    </div>
  )
}
