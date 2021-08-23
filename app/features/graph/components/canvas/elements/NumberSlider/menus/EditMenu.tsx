import { NodePen } from 'glib'
import { useGenericMenuManager } from 'features/graph/components/overlay/GenericMenu/hooks'
import { NumberSliderMenu } from '../components'

type EditMenuProps = {
  slider: NodePen.Element<'number-slider'>
}

export const EditMenu = ({ slider }: EditMenuProps): React.ReactElement => {
  const { id, current } = slider

  const { rounding, precision, domain, values } = current

  const value = values['output']['{0;}'][0].data as number

  const { onClose, onCancel } = useGenericMenuManager()

  return (
    <div className="w-full h-full pt-2 pl-4 pr-4 flex flex-col items-center bg-green rounded-md overflow-auto">
      <div className="w-full flex flex-col items-center">
        <div className="w-full h-12 mb-2 mt-2 flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <h3 className="ml-2 text-left text-darkgreen text-xl font-sans">Edit Number Slider</h3>
        </div>
        <NumberSliderMenu
          id={id}
          initial={{ rounding, precision, domain, value }}
          onClose={onClose}
          onCancel={onCancel}
        />
      </div>
    </div>
  )
}
