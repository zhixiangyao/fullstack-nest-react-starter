import process from 'node:process'

import type { NextFunction, Request, Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const devProxy = createProxyMiddleware({
  target: 'http://localhost:5089',
  ws: true,
  pathFilter(pathname) {
    if (process.env.NODE_ENV !== 'dev')
      return false

    if (pathname.match('^/api'))
      return false

    return true
  },
})

export async function proxyMiddleware(req: Request, res: Response, next: NextFunction) {
  devProxy(req, res, next)
}
