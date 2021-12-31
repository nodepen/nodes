import React from 'react'
import { useSessionManager } from 'features/common/context/session'
import { HeaderActions } from './HeaderActions'
import { HeaderTitle } from './HeaderTitle'

const Header = (): React.ReactElement => {
  const { user: currentUser } = useSessionManager()

  const user = currentUser && !currentUser.isAnonymous ? currentUser : undefined

  return (
    <div
      className="w-full h-10 flex justify-start items-center bg-white border-b-2 border-dark"
      style={{ zIndex: 99998 }}
    >
      <a className="p-0 w-12 h-full flex justify-center items-center" href="/">
        <img
          src="/nodepen.svg"
          width="30"
          height="28"
          alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
        />
      </a>
      <div className="flex-grow h-full p-1 pr-2 pl-0 flex justify-end items-center">
        <HeaderTitle />
        <HeaderActions user={user} />
      </div>
    </div>
  )
}

export default React.memo(Header)
