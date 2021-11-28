import { useSessionManager } from '@/features/common/context/session'
import { useState } from 'react'

export const UserImage = (): React.ReactElement => {
  const { user } = useSessionManager()

  const [showIcon, setShowIcon] = useState(user?.isAnonymous ?? true)

  return showIcon ? (
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-4 h-4" fill="#333333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  ) : (
    <img
      src={user?.photoURL ?? undefined}
      style={{ filter: 'grayscale(1)', WebkitFilter: 'grayscale(1)', width: '100%', height: '100%' }}
      onError={(e) => {
        console.log(e)
        setShowIcon(true)
      }}
    />
  )
}
