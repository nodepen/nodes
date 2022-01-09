import React from 'react'
import { getBackgroundColor } from './utils'
import { SectionInnerLayout } from './SectionInnerLayout'

type SectionOuterLayoutProps = {
  id?: string
  color?: 'dark' | 'green' | 'pale' | 'white' | 'none'
  flex?: boolean
  before?: JSX.Element
  after?: JSX.Element
  children?: JSX.Element
}

export const SectionOuterLayout = ({
  id,
  flex = false,
  color = 'pale',
  before,
  after,
  children,
}: SectionOuterLayoutProps): React.ReactElement => {
  const background = getBackgroundColor(color)

  return (
    <section id={id} className={`${background} ${flex ? 'flex flex-col flex-grow' : ''} w-full`}>
      <>
        {before}
        <SectionInnerLayout>{children}</SectionInnerLayout>
        {flex ? <div className="w-full flex-grow flex flex-col justify-end">{after}</div> : <>{after}</>}
      </>
    </section>
  )
}
