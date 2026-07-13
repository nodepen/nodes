type Props = React.PropsWithChildren<{
    size?: 'sm' | 'lg'
    shadow?: boolean
    onClick?: () => void
}>

export const CircleButton = ({ children, ...props }: Props) => {
    const {
        size = 'sm',
        shadow = false,
        onClick
    } = props

    return <div className={`${size === 'sm' ? 'np-w-8 np-h-8' : 'np-w-12 np-h-12'} ${shadow ? 'np-shadow-main' : ''} np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-bg-light np-pointer-events-auto np-group hover:np-cursor-pointer`} onClick={onClick} >
        <div className="np-w-full np-h-full np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark ">
            <div className="np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-full group-hover:np-bg-grey">
                {children}
            </div>
        </div>
    </div>
}