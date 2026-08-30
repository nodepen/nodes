import { useId } from "react"

type LogoProps = {
    width?: number
    height?: number
}

export const SelvaLogoIcon = ({ width = 20, height = 20 }: LogoProps) => {
    const id = useId()

    return (
        <svg width={width} height={height} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <linearGradient id={`${id}-1`} x1="29.92" y1="13.71" x2="62.4" y2="21.19" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#c9d87a" />
                    <stop offset=".13" stopColor="#c4d377" />
                    <stop offset=".28" stopColor="#b7c56f" />
                    <stop offset=".44" stopColor="#a2af62" />
                    <stop offset=".6" stopColor="#849050" />
                    <stop offset=".77" stopColor="#5e6739" />
                    <stop offset=".94" stopColor="#2f361d" />
                    <stop offset="1" stopColor="#1d2312" />
                </linearGradient>
                <linearGradient id={`${id}-2`} x1="42.7" y1="33.79" x2="77.71" y2="45.13" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fdf8be" />
                    <stop offset="1" stopColor="#575222" />
                </linearGradient>
                <linearGradient id={`${id}-3`} x1="20.38" y1="48.62" x2="51.54" y2="32.1" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#7fa545" />
                    <stop offset=".15" stopColor="#759840" />
                    <stop offset=".42" stopColor="#5a7633" />
                    <stop offset=".79" stopColor="#30401e" />
                    <stop offset="1" stopColor="#161f11" />
                </linearGradient>
                <linearGradient id={`${id}-4`} x1="18.67" y1="12.86" x2="39.92" y2="18.59" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#5c854d" />
                    <stop offset="1" stopColor="#121d12" />
                </linearGradient>
                <linearGradient id={`${id}-5`} x1="7.38" y1="46.01" x2="41.56" y2="31.31" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#31522c" />
                    <stop offset="1" stopColor="#000" />
                </linearGradient>
            </defs>
            <path d="M50.29,6.4C44.88,2.47,37.81.31,31.12.55c-.02,4.28,1.76,8,4.13,11.93.62,1.03,1.29,2.08,1.98,3.15,2.92,4.54,6.25,9.58,8.53,16.2,5.46-7.5,8.5-14.28,4.53-25.43Z" fill={`url(#${id}-1)`} />
            <path d="M22.36,15.61c-.69-1.07-1.35-2.11-1.97-3.14-1.62-2.68-2.96-5.27-3.64-8C8.94,8.68,3.1,16.62,1.22,25.41c-1.88,8.79.19,18.42,5.58,25.46.12-8,5.09-13.4,9.02-18.75,3.89-5.3,6.61-10.21,6.55-16.51Z" fill="#0f1612" />
            <path d="M50.29,6.4c3.97,11.15.93,17.93-4.53,25.43-.07.1-.14.19-.21.29-5.59,7.61-13.28,15.32-6.13,30.47,6.29-1.43,12.85-5.46,17.31-11.13,4.46-5.68,6.83-13,6.73-19.45.23-9.65-5.18-20.17-13.17-25.6Z" fill={`url(#${id}-2)`} />
            <path d="M30.9,31.83c-.07.1-.14.19-.21.29-5.59,7.61-13.28,15.32-6.13,30.47,4.81,1.18,10.05,1.18,14.86,0-7.15-15.14.54-22.85,6.13-30.47.07-.1.14-.19.21-.29-2.27-6.62-5.61-11.66-8.53-16.2.06,6.18-2.56,11.02-6.34,16.2Z" fill={`url(#${id}-3)`} />
            <path d="M22.36,15.61c2.92,4.54,6.26,9.59,8.54,16.22,3.77-5.19,6.39-10.02,6.34-16.2-.69-1.07-1.36-2.12-1.98-3.15-2.37-3.93-4.15-7.65-4.13-11.93-4.97.12-10.04,1.51-14.38,3.93.68,2.73,2.02,5.32,3.64,8,.62,1.03,1.28,2.07,1.97,3.14Z" fill={`url(#${id}-4)`} />
            <path d="M22.36,15.61c.06,6.3-2.66,11.21-6.55,16.51-3.93,5.35-8.9,10.75-9.02,18.75,4.21,5.72,10.84,10.1,17.76,11.72-7.15-15.14.54-22.85,6.13-30.47.07-.1.14-.19.21-.29-2.27-6.63-5.62-11.68-8.54-16.22Z" fill={`url(#${id}-5)`} />
        </svg>
    )
}
