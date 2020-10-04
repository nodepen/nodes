import React from 'react'

export const EditorHeader = (): JSX.Element => {
  return (
    <div className="w-full bg-green pl-8 pr-8 pt-2 pb-2 flex flex-row justify-between">
      <div className="w-64 p-3 pt-2 pb-2 border-swampgreen border-2 rounded-sm box-border flex flex-col justify-start">
        <h2 className="font-barlow font-medium text-lg leading-tight text-darkgreen">Another Twisty Tower</h2>
        <a className="font-barlow text-xs text-darkgreen no-underline" href="/">
          ravid_dutten
        </a>
      </div>
      <div className="w-24 h-full rounded-sm" />
    </div>
  )
}
