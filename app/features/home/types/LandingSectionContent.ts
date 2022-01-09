export type LandingSectionContent = {
  title: string
  copy: string
  icon: JSX.Element
  graphic: string
  shape: 'circle' | 'square' | 'triangle' | 'plus'
  action?: {
    label: string
    href: string
  }
}
