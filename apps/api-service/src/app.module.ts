import type { MiddlewareConsumer, ModuleMetadata, NestModule } from '@nestjs/common'
import { Module, RequestMethod } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'

import { AuthGuard } from '~/common/guards/auth.guard'
import { RolesGuard } from '~/common/guards/roles.guard'
import { LoggerDurationInterceptor } from '~/common/interceptors/logger-duration.interceptor'
import { loggerMiddleware } from '~/common/middleware/logger.middleware'
import { AuthModule } from '~/modules/auth/auth.module'
import { DashboardStaticModule } from '~/modules/dashboard-static.module'
import { PrismaModule } from '~/modules/prisma/prisma.module'
import { UserModule } from '~/modules/user/user.module'

import { AUTH_SECRET, isDev } from './config'
import { BlogModule } from './modules/blog/blog.module'
import { RoleModule } from './modules/role/role.module'

const imports: ModuleMetadata['imports'] = [
  JwtModule.register({
    global: true,
    secret: AUTH_SECRET,
    // https://github.com/vercel/ms
    signOptions: { expiresIn: '3d' },
  }),
  PrismaModule,
  AuthModule,
  UserModule,
  RoleModule,
  BlogModule,
]

// Directly use DashboardStaticModule to provide packaged static.
if (!isDev) {
  imports.push(DashboardStaticModule.forRoot())
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
