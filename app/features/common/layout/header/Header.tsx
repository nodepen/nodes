import { useGraphId } from '@/features/graph/store/graph/hooks'
import React from 'react'
import { useSessionManager } from '../../context/session'
import { HeaderActions } from './HeaderActions'

const Header = (): React.ReactElement => {
  const { user: currentUser } = useSessionManager()

  const graphId = useGraphId()

  const graph = { id: graphId }
  const user = currentUser && !currentUser.isAnonymous ? currentUser : undefined

  return (
    <div
      className="w-full h-10 flex justify-start items-center bg-white border-b-2 border-dark"
      style={{ zIndex: 99998 }}
    >
      <a className="p-0 mr-4 w-12 h-full flex justify-center items-center" href="/">
        <img
          src="/nodepen.svg"
          width="30"
          height="28"
          alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
        />
      </a>
      <div className="flex-grow h-full p-1 pr-2 flex justify-end items-center">
        <HeaderActions graph={graph} user={user} />
      </div>
    </div>
  )
}

export default React.memo(Header)
