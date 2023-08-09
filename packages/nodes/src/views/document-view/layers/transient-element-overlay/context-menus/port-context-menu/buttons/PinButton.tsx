import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { useDispatch, useStore } from '$'
import { STYLES } from '@/constants'

type PinButtonProps = {
  nodeInstanceId: string
  portInstanceId: string
}

export const PinButton = ({ nodeInstanceId, portInstanceId }: PinButtonProps) => {
  const { apply } = useDispatch()

  const portDirection = Object.keys(useStore.getState().document.nodes[nodeInstanceId].inputs).includes(portInstanceId)
    ? 'inputs'
    : 'outputs'

  const isPinned = useStore((state) =>
    state.document.configuration[portDirection].some(
      (pin) => pin.nodeInstanceId === nodeInstanceId && pin.portInstanceId === portInstanceId
    )
  )

  const pinIcon = (
    <svg {...STYLES.BUTTON.SMALL}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
    </svg>
  )

  const handlePin = useCallback(() => {
    apply((state) => {
      state.document.configuration[portDirection].push({
        nodeInstanceId,
        portInstanceId,
      })
    })
  }, [])

  const unpinIcon = (
    <svg {...STYLES.BUTTON.SMALL}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
    </svg>
  )

  const handleUnpin = useCallback(() => {
    apply((state) => {
      state.document.configuration[portDirection] = state.document.configuration[portDirection].filter((pin) => {
        const sameNode = pin.nodeInstanceId === nodeInstanceId
        const samePort = pin.portInstanceId === portInstanceId

        return !sameNode && !samePort
      })
    })
  }, [])

  return isPinned ? (
    <MenuButton icon={unpinIcon} label="Unpin" action={handleUnpin} />
  ) : (
    <MenuButton icon={pinIcon} label={`Pin to ${portDirection}`} action={handlePin} />
  )
}
