import type { NextFunction, Request, Response } from 'express'

async function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, time)
  })
}

export async function sleepMiddleware(req: Request, res: Response, next: NextFunction) {
  await sleep(50)
  next()
}
