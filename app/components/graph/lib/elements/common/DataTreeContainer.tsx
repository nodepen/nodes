import React from 'react'

type DataTreeProps = {
  label: string
  data: { [key: string]: string[] }
}

export const DataTreeContainer = ({ data, label }: DataTreeProps): React.ReactElement => {

  return <div>{Object.keys(data).length} branches</div>
}