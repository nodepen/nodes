import Link from 'next/link'
import React from 'react'

export const HeaderBranding = (): React.ReactElement => {
  return (
    <Link href="/">
      <a className="w-12 h-full mr-2 flex justify-center items-center">
        <img
          src="/nodepen-green.svg"
          width="30"
          height="28"
          alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
        />
      </a>
    </Link>
  )
}
