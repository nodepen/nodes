import React from 'react'

type ControlPanelHeaderProps = {
    icon: React.ReactNode
    label: string
    sublabel?: string
    onClickMenu: () => void
}

export const ControlPanelHeader = ({ icon, label, sublabel, onClickMenu }: ControlPanelHeaderProps) => {
    return (
        <div className={`np-w-full ${sublabel ? 'np-mb-3' : 'np-mb-4'} last:np-mb-0 np-flex np-flex-col np-justify-start`}>
            <div className='np-w-full np-h-6 np-flex np-justify-start np-items-center'>
                <div className='np-w-8 np-mr-1 np-flex np-items-center np-justify-center'>
                    {icon}
                </div>
                <h3 className='np-font-sans np-text-md np-text-darkgreen np-select-none -np-translate-y-px'>{label}</h3>
            </div>
            {sublabel ? (
                <div className='np-w-full np-pl-9 np-flex np-justify-start np-items-center'>
                    <p className='np-font-sans np-text-sm np-text-darkgreen np-font-light'>{sublabel}</p>
                </div>
            ) : null}
        </div>
    )
}