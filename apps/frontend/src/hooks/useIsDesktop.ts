import { useSize } from 'ahooks'

export function useIsDesktop() {
  const size = useSize(document.querySelector('#root'))

  return (size?.width ?? 0) >= 1024 && (size?.height ?? 0) >= 768
}
