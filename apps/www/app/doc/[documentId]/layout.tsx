
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div style={{ width: '100vw', height: '100vh' }}>{children}</div>
}