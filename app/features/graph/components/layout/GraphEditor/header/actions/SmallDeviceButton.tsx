import React, { useState } from 'react'
import { firebase } from 'features/common/context/session/auth'
import { Layout } from '@/features/common'

type SmallDeviceButtonProps = {
  user: firebase.User
}

const SmallDeviceButton = ({ user }: SmallDeviceButtonProps): React.ReactElement => {
  const [showModal, setShowModal] = useState(false)

  const handleShowModal = (): void => {
    setShowModal((current) => !current)
  }

  return (
    <>
      <button
        className="h-6 w-6 border-2 border-dark rounded-sm bg-white flex items-center justify-center hover:bg-green"
        onClick={handleShowModal}
      >
        <svg className="w-5 h-5" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {showModal ? (
        <Layout.Modal onClose={() => setShowModal(false)}>
          <Layout.HeaderMenus.CurrentUserMenu user={{ name: user.displayName, photoUrl: user.photoURL }} />
        </Layout.Modal>
      ) : null}
    </>
  )
}

export default React.memo(SmallDeviceButton)
