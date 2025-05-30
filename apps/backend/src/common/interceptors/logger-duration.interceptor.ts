import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { tap } from 'rxjs/operators'
import { FormatOptions, formatTime } from 'utils'

@Injectable()
export class LoggerDurationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>()

    const now = Date.now()
    return next.handle().pipe(
      tap({
        complete: () => {
          const requestTime = formatTime(now, FormatOptions.YYYY_MM_DD_HH_mm_ss)
          const message = `[${requestTime}] [${request.url}] [duration: ${Date.now() - now}ms]`
          return console.log(message)
        },
      }),
    )
  }
}
