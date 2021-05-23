type EditorLayoutProps = {
  children?: JSX.Element
}

export const EditorLayout = ({ children }: EditorLayoutProps): React.ReactElement => {
  return (
    <div className="w-vw h-vh flex flex-col justify-start">
      <div className="w-full h-10 flex justify-start items-center bg-white border-b-2 border-dark">
        <button className="p-0 mr-4 w-12 h-full flex justify-center items-center">
          <img
            src="nodepen.svg"
            width="30"
            height="28"
            alt="The NodePen logo: an 'N' followed by a 'P', both fit into narrow rounded-rectangle geometry. A hollow circle punctuates the space left over under the P. This shape is a reference to the grip geometry used to connect graph nodes."
          />
        </button>
      </div>
      {children}
    </div>
  )
}
