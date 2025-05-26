import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import React, { memo } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Spinning } from '~/components/Spinning'
import { EnumRole } from '~/fetchers/type'
import { useUserStore } from '~/stores/useUserStore'

interface Props { children: React.ReactNode, roles?: EnumRole[] }

const RolesAuthRoute = memo<Props>(({ children, roles }) => {
  const { user } = useUserStore()

  if (user && roles && !roles.some(role => user?.roles.includes(role)))
    return <Navigate replace to="/" />

  return children
})
RolesAuthRoute.displayName = 'RolesAuthRoute'

function withRolesAuthRoute(Component: React.FC, options?: { roles: EnumRole[] }) {
  return () => (
    <RolesAuthRoute roles={options?.roles}>
      <Component />
    </RolesAuthRoute>
  )
}

interface Route {
  label: string
  icon: React.ReactNode
  path: string
  element: Promise<React.FC>
  roles: EnumRole[]
}

export const routes: Route[] = [
  {
    label: 'Home',
    path: '/home',
    icon: <HomeOutlined />,
    element: import('./pages/home').then(({ HomePage }) => HomePage),
    roles: [EnumRole.ADMIN, EnumRole.USER],
  },
  {
    label: 'User',
    path: '/user',
    icon: <UserOutlined />,
    element: import('./pages/user').then(({ UserPage }) => UserPage),
    roles: [EnumRole.ADMIN],
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('~/layout').then(({ Layout }) => ({ Component: Layout })),
    HydrateFallback: Spinning,
    children: routes.map(route => ({
      path: route.path,
      lazy: () =>
        route.element.then(Component => ({ Component: withRolesAuthRoute(Component, { roles: route.roles }) })),
    })),
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
