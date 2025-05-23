export function deleteProperty<T, K extends keyof T>(target: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = target

  return rest
}
