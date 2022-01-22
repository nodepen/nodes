export type MenuAction<T> = {
  position: number
  icon: JSX.Element
  label: JSX.Element
  menu: JSX.Element
  onClick?: (context: T) => void
}
