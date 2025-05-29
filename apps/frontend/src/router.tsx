import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Spinning } from '~/components/Spinning'
import { EnumRole } from '~/fetchers'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  children: React.ReactNode
  roles?: EnumRole[]
}

const RolesAuthRoute: React.FC<Props> = ({ children, roles }) => {
  const { user } = useUserStore()

  if (user && roles && !roles.some(role => user?.roles.includes(role)))
    return <Navigate replace to="/" />

  return children
}

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

const routes: Route[] = [
  {
    label: 'Home',
    path: 'home',
    icon: <HomeOutlined />,
    element: import('./pages/home').then(({ HomePage }) => HomePage),
    roles: [EnumRole.ADMIN, EnumRole.USER],
  },
  {
    label: 'User',
    path: 'user',
    icon: <UserOutlined />,
    element: import('./pages/user').then(({ UserPage }) => UserPage),
    roles: [EnumRole.ADMIN],
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('~/layout').then(({ Layout }) => ({ Component: Layout })),
    HydrateFallback: () => (
      <div className="w-screen h-screen relative">
        <Spinning />
      </div>
    ),
    children: routes.map(route => ({
      path: route.path,
      async lazy() {
        const roles = route.roles
        const Component = await route.element
        return { Component: withRolesAuthRoute(Component, { roles }) }
      },
    })),
  },
  {
    path: '/404',
    lazy: () => import('./pages/404').then(({ NotFound }) => ({ Component: NotFound })),
  },
  {
    path: '*',
    Component: () => <Navigate to="/404" replace />,
  },
])

function Router() {
  return <RouterProvider router={router} />
}

export { Router, routes }
