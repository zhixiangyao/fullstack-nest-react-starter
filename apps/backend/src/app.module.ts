import type { MiddlewareConsumer, ModuleMetadata, NestModule } from '@nestjs/common'
import process from 'node:process'
import { Module, RequestMethod } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AuthModule } from '~/modules/auth/auth.module'
import { UserModule } from '~/modules/user/user.module'
import { FrontendStaticModule } from '~/modules/frontend-static.module'
import { PrismaModule } from '~/modules/prisma/prisma.module'
import { AuthGuard } from '~/common/guards/auth.guard'
import { RolesGuard } from '~/common/guards/roles.guard'
import { LoggerDurationInterceptor } from '~/common/interceptors/logger-duration.interceptor'
import { loggerMiddleware } from '~/common/middleware/logger.middleware'

const imports: ModuleMetadata['imports'] = [
  AuthModule,
  UserModule,
  PrismaModule,
  JwtModule.register({
    global: true,
    secret: process.env.AUTH_SECRET,
    // https://github.com/vercel/ms
    signOptions: { expiresIn: '3d' },
  }),
]

// Directly use FrontendStaticModule to provide packaged static.
if (process.env.NODE_ENV !== 'dev') {
  imports.push(FrontendStaticModule.forRoot())
}

@Module({
  imports,
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggerDurationInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes({ path: '*all', method: RequestMethod.ALL })
  }
}
