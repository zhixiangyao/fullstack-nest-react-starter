import type { NextFunction, Request, Response } from 'express'
import dayjs from 'dayjs'
import { FormatOptions, formatTime } from 'utils'

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${formatTime(dayjs(), FormatOptions.YYYY_MM_DD_HH_mm_ss)}] [${req.url}]`)
  next()
}
