
type Props = React.PropsWithChildren<{
    size?: "lg" | "sm"
    disabled?: boolean
    label?: string
    labelDirection?: "left" | "right"
    outline?: "all" | "icon" | "none"
    variant?: ButtonVariant
}>

type ButtonVariant =
    // White button always visible
    | "default"
    // White icon with label appearing on hover
    | "hover"

export const Button = ({ children, ...props }: Props) => {
    const {
        size = 'lg',
        disabled = false,
        label = '',
        labelDirection = 'right',
        outline = 'icon',
        variant = 'default'
    } = props



    return (
        <div className={`np-h-12 np-flex np-items-center np-justify-start np-group`}>

        </div>
    )
}