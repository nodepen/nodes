import React from 'react'
import { useStore } from '$'

type CommonElementProps = {
  id: string
}

const CommonElement = ({ id }: CommonElementProps): React.ReactElement => {
  const element = useStore((store) => store.document.elements[id])

  return <g id={`common-element-${id}`}></g>
}

const propsAreEqual = (prevProps: Readonly<CommonElementProps>, nextProps: Readonly<CommonElementProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(CommonElement, propsAreEqual)
