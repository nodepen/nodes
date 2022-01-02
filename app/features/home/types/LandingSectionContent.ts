export type LandingSectionContent = {
  title: string
  copy: string
  icon: JSX.Element
  graphic: JSX.Element
  shape: 'circle' | 'square' | 'triangle' | 'plus'
  action?: {
    label: string
    href: string
  }
}
