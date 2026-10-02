export const getPortContextMenuKey = (nodeInstanceId: string, portInstanceId: string): string => {
  return `port-param-${nodeInstanceId}-${portInstanceId}`
}