import type { ReactNode } from 'react'
import { FileMarkdownOutlined, HomeOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { App, Spin } from 'antd'
import { useEffect } from 'react'
import { createBrowserRouter, matchPath, Navigate, RouterProvider } from 'react-router-dom'

import { useAppStore } from '~/stores/useAppStore'
import { useUserStore } from '~/stores/useUserStore'

interface Props {
  children: ReactNode
  roles?: string[]
}

function HydrateFallback() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spin spinning />
    </div>
  )
}

function RolesAuthRoute({ children, roles }: Props) {
  const { user } = useUserStore()

  if (user && roles && roles.length !== 0 && !roles.some(role => user?.roles.map(role => role.name).includes(role)))
    return <Navigate replace to="/" />

  return children
}

function withRolesAuthRoute(Component: () => ReactNode, options?: { roles: string[] }) {
  return () => (
    <RolesAuthRoute roles={options?.roles}>
      <Component />
    </RolesAuthRoute>
  )
}

interface Route {
  label: string
  icon: ReactNode
  path: string
  element: Promise<() => ReactNode>
  roles: string[]
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
    label: 'Blogs',
    path: '/blogs',
    icon: <FileMarkdownOutlined />,
    element: import('./pages/blogs').then(({ Blogs }) => Blogs),
    roles: [],
  },
  {
    label: 'Roles',
    path: '/roles',
    icon: <TeamOutlined />,
    element: import('./pages/roles').then(({ Roles }) => Roles),
    roles: ['ADMIN'],
  },
  {
    label: 'Users',
    path: '/users',
    icon: <UserOutlined />,
    element: import('./pages/users').then(({ Users }) => Users),
    roles: ['ADMIN'],
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('~/layout').then(({ Layout }) => ({ Component: Layout })),
    HydrateFallback,
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
    HydrateFallback,
  },
  {
    path: '/404',
    lazy: () => import('./pages/404').then(({ NotFound }) => ({ Component: NotFound })),
    HydrateFallback,
  },
  {
    path: '/blog/:id',
    lazy: () => import('./pages/[id]').then(({ Blog }) => ({ Component: Blog })),
    HydrateFallback,
  },
  {
    path: '*',
    Component: () => <Navigate to="/404" replace />,
    HydrateFallback,
  },
])

function Router() {
  const { message } = App.useApp()
  const { handleInitMessage } = useAppStore()

  useEffect(() => handleInitMessage(message), [handleInitMessage, message])

  return <RouterProvider router={router} />
}

function genMenus(roles: string[]) {
  return routes
    .filter(route => route.roles.length === 0 || route.roles.some(role => roles.includes(role)))
    .map(({ path, label, icon }) => ({ key: path, label, icon }))
}

function genTitle(pathname: string) {
  return routes.find(route => matchPath(pathname, route.path))?.label
}

export { genMenus, genTitle, Router }
