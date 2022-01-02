export type LandingSectionContent = {
  title: string
  copy: string
  icon: JSX.Element
  graphic: JSX.Element
  action?: {
    label: string
    href: string
  }
}
