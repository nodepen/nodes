import React from 'react'
import Link from 'next/link'
import { FooterLink } from '../types'

type FooterSectionProps = {
  title: string
  links?: FooterLink[]
  content?: string
}

export const FooterSection = ({ title, links, content }: FooterSectionProps): React.ReactElement => {
  return (
    <div className="w-full mb-2 flex flex-col">
      <h4 className="mb-1 text-sm font-bold text-dark">{title}</h4>
      {links ? (
        <div className="w-full flex flex-row justify-start items-center flex-wrap">
          {links.map((link, i) => {
            const key = `footer-link-${i}-${link.label}`
            return link.internal ? (
              <Link href={link.href} key={key}>
                <a className="mr-6 mb-2 text-sm font-medium text-dark hover:underline">{link.label}</a>
              </Link>
            ) : (
              <a
                href={link.href}
                key={key}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-6 mb-2 text-sm font-medium text-dark hover:underline"
              >
                {link.label}
              </a>
            )
          })}
        </div>
      ) : null}
      {content ? <p className="w-full mb-2 text-sm font-medium text-dark">{content}</p> : null}
    </div>
  )
}
