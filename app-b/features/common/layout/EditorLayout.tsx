type EditorLayoutProps = {
  children?: JSX.Element
}

export const EditorLayout = ({ children }: EditorLayoutProps): React.ReactElement => {
  return (
    <div className="w-vw h-vh flex flex-col justify-start">
      <div className="w-full h-10 bg-white border-b-2 border-dark" />
      {children}
    </div>
  )
}
