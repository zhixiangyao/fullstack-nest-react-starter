export function getStorageStateByKey<T extends object>(key: string) {
  try {
    const storage1 = localStorage.getItem(key)
    const storage2 = sessionStorage.getItem(key)
    const storage = storage1 ?? storage2

    if (storage === null) {
      return null
    }

    const parsed = JSON.parse(storage) as T

    return parsed
  }
  catch {
    return null
  }
}
