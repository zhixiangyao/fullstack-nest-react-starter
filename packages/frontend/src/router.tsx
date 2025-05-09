import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import React, { memo } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Spinning } from '~/components/Spinning'
import { Role } from '~/fetchers/type'
import { useUserStore } from '~/stores/useUserStore'

interface Props { children: React.ReactNode, roles?: Role[] }

const RolesAuthRoute = memo<Props>(({ children, roles }) => {
  const { user } = useUserStore()

  if (user && roles && !roles.includes(user?.role))
    return <Navigate to="/" />

  return children
})
RolesAuthRoute.displayName = 'RolesAuthRoute'

function withRolesAuthRoute(Component: React.FC, options?: { roles: Role[] }) {
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
  roles: Role[]
}

export const routes: Route[] = [
  {
    label: 'Home',
    path: '/home',
    icon: <HomeOutlined />,
    element: import('./pages/home').then(({ HomePage }) => HomePage),
    roles: [Role.ADMIN, Role.USER],
  },
  {
    label: 'User',
    path: '/user',
    icon: <UserOutlined />,
    element: import('./pages/user').then(({ UserPage }) => UserPage),
    roles: [Role.ADMIN],
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
