import type { RoleValue } from '~/fetchers'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Spinning } from '~/components/Spinning'
import { Role } from '~/fetchers'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  children: React.ReactNode
  roles?: RoleValue[]
}

const RolesAuthRoute: React.FC<Props> = ({ children, roles }) => {
  const { user } = useUserStore()

  if (user && roles && roles.length !== 0 && !roles.some(role => user?.roles.map(role => role.name).includes(role)))
    return <Navigate replace to="/" />

  return children
}

function withRolesAuthRoute(Component: React.FC, options?: { roles: RoleValue[] }) {
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
  roles: RoleValue[]
}

const routes: Route[] = [
  {
    label: 'Home',
    path: '/home',
    icon: <HomeOutlined />,
    element: import('./pages/home').then(({ Home }) => Home),
    roles: [],
  },
  {
    label: 'Users',
    path: '/users',
    icon: <UserOutlined />,
    element: import('./pages/users').then(({ Users }) => Users),
    roles: [Role.ADMIN],
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
    path: '/auth',
    lazy: () => import('./pages/auth').then(({ Auth }) => ({ Component: Auth })),
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

function genMenus(roles: RoleValue[]) {
  return routes
    .filter(route => route.roles.length === 0 || route.roles.some(role => roles.includes(role)))
    .map(({ path, label, icon }) => ({ key: path, label, icon }))
}

export { genMenus, Router }
