import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { useParameterMenuConnection } from 'features/graph/store/overlay/hooks'
import { useSetCameraPosition } from 'features/graph/hooks'

type ConnectionMenuProps = {
  onClose: () => void
}

export const ParameterConnectionMenu = ({ onClose }: ConnectionMenuProps): React.ReactElement => {
  const { sourceType, from, to } = useParameterMenuConnection()

  return (
    <div className="w-full flex flex-col pointer-events-auto">
      <button onClick={onClose} className="w-full p-4 bg-red-400" />
      <p>{sourceType}</p>
      <p>{from?.parameterId ?? 'unset'}</p>
      <p>{to?.parameterId ?? 'unset'}</p>
    </div>
  )
}
