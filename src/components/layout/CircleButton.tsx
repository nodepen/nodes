type Props = React.PropsWithChildren<{
    onClick?: () => void
}>

export const CircleButton = ({ children, ...props }: Props) => {
    const { onClick } = props

    return <div className={`np-w-[29px] np-h-[29px] np-p-0.5 np-flex np-items-center np-justify-center np-rounded-full np-border-2 np-border-dark np-group hover:np-cursor-pointer`} onClick={onClick} >
        <div className="np-w-full np-h-full np-flex np-items-center np-justify-center np-rounded-full group-hover:np-bg-grey">
            {children}
        </div>
    </div>
}