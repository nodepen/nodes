import React, { useState } from 'react'
import { firebase } from 'features/common/context/session/auth'
import { ModalLayout } from '../../ModalLayout'

type CurrentUserButtonProps = {
  user: firebase.User
}

const CurrentUserButton = ({ user }: CurrentUserButtonProps): React.ReactElement => {
  const { displayName, photoURL, isAnonymous } = user

  const [showIcon, setShowIcon] = useState(isAnonymous ?? true)
  const [showModal, setShowModal] = useState(false)

  const icon = showIcon ? (
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-4 h-4" fill="#333333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  ) : (
    <img
      src={photoURL ?? undefined}
      style={{ filter: 'grayscale(1)', WebkitFilter: 'grayscale(1)', width: '100%', height: '100%' }}
      onError={(e) => {
        setShowIcon(true)
      }}
    />
  )

  return (
    <>
      <button
        className="h-6 w-6 rounded-sm border-2 border-dark bg-white overflow-hidden"
        onClick={() => setShowModal((current) => !current)}
      >
        {icon}
      </button>
      {showModal ? (
        <ModalLayout onClose={() => setShowModal(false)}>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-5xl mb-4 font-sans font-semibold text-dark">Not yet!</h2>
            <p className="text-lg mb-6 font-sans font-semibold text-dark">User profiles are still being tested.</p>
            <div className="w-full flex flex-wrap justify-center items-center mb-3">
              <a
                href="https://twitter.com/cdriesler"
                target="_blank"
                rel="noopener noreferrer"
                className="w-48 h-12 ml-2 mr-2 mt-2 p-2 flex justify-center items-center bg-green hover:bg-swampgreen rounded-md"
              >
                <img className="w-6 h-6 mr-4" src="/logos/twitter.svg" />
                <p className="text-md text-darkgreen font-medium select-none" style={{ transform: 'translateY(-1px)' }}>
                  Follow Updates
                </p>
              </a>
              <a
                href="https://github.com/cdriesler/nodepen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-48 h-12 ml-2 mr-2 mt-2 p-2 flex justify-center items-center bg-green hover:bg-swampgreen rounded-md"
              >
                <img className="w-6 h-6 mr-4" src="/logos/github.svg" />
                <p className="text-md text-darkgreen font-medium select-none" style={{ transform: 'translateY(-1px)' }}>
                  View Code
                </p>
              </a>
            </div>
            <p className="text-sm mb-1 font-sans font-semibold text-dark">Thank you for trying NodePen.</p>
            <p className="text-md">💚🦗</p>
          </div>
        </ModalLayout>
      ) : null}
    </>
  )
}

export default React.memo(CurrentUserButton)
