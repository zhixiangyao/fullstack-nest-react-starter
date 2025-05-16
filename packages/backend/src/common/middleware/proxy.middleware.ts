import type { NextFunction, Request, Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const requestHandler = createProxyMiddleware({
  target: 'http://localhost:5089',
  ws: true,
  pathFilter(pathname) {
    if (pathname.match('^/api'))
      return false

    return true
  },
})

export async function frontendProxyMiddleware(req: Request, res: Response, next: NextFunction) {
  requestHandler(req, res, next)
}
