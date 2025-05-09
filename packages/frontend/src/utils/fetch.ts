import { message } from 'antd'

import { useUserStore } from '~/stores/useUserStore'

async function handleResponseOK(response: Response) {
  if (!response.ok) {
    const json = await response.json()
    message.error(json?.message ?? response.statusText)

    switch (response.status) {
      case 401:
        useUserStore.getState().handleLogout()
        break
    }

    throw new Error(`Error! status: ${response.status}`)
  }
}

export async function fetchPost<T>(url: string, body: BodyInit | null | undefined) {
  const token = useUserStore.getState().token ?? ''

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body,
  })

  await handleResponseOK(response)

  const result = await response.json()

  return result as T
}

export async function fetchGet<T>(url: string) {
  const token = useUserStore.getState().token ?? ''

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  await handleResponseOK(response)

  const result = await response.json()

  return result as T
}
