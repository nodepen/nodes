import { NodePen } from 'glib'
import { Dispatch, useReducer } from 'react'
import { NumberSliderStore } from './NumberSliderStore'
import { reducer } from './reducer'
import { initializeStore } from '../utils'
import { NumberSliderAction } from './NumberSliderAction'

type NumberSliderInitialState = Pick<
  NodePen.Element<'number-slider'>['current'],
  'precision' | 'domain' | 'rounding'
> & { value: number }

type FormState = {
  state: NumberSliderStore
  dispatch: Dispatch<NumberSliderAction>
}

export const useNumberSliderForm = (initialState: NumberSliderInitialState): FormState => {
  const { rounding, precision, domain, value } = initialState
  const initialStore = initializeStore(rounding, precision, domain, value)

  const [state, dispatch] = useReducer(reducer, initialStore)

  return { state, dispatch }
}
