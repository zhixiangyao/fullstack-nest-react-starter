import { useSize } from 'ahooks'

export function useIsTablet() {
  const size = useSize(document.querySelector('#root'))

  return (size?.width ?? 0) >= 768 && (size?.width ?? 0) < 1024
}
