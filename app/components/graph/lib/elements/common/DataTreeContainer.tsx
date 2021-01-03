import React from 'react'

type DataTreeProps = {
  data: { [key: string]: string[] }
  type?: string
}

export const DataTreeContainer = ({ data, type }: DataTreeProps): React.ReactElement => {

  return <div>{Object.keys(data).length} branches</div>
}