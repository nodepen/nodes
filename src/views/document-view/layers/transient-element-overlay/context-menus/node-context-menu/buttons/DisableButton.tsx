import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type DisableButtonProps = {
  nodeInstanceId: string
}

export const DisableButton = ({ nodeInstanceId: _n }: DisableButtonProps) => {
  const handleDisable = useCallback(() => {
    console.log('🐍 Not yet implemented!')
  }, [])

  const icon = (
    <svg {...STYLES.BUTTON.SMALL} strokeWidth={2} width={16} height={16}>
      <path
        clipRule="evenodd"
        d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
        fillRule="evenodd"
      />
    </svg>
  )

  return <MenuButton icon={icon} label="Disable" action={handleDisable} />
}
