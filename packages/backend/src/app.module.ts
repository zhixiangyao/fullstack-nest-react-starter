import { Module, RequestMethod } from '@nestjs/common'
import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

// module
import { AuthModule } from '~/modules/auth/auth.module'
import { UserModule } from '~/modules/user/user.module'
// forRoot module
import { FrontendStaticModule } from '~/modules/frontend-static.module'
// Guard
import { AuthGuard } from '~/common/guards/auth.guard'
import { RolesGuard } from '~/common/guards/roles.guard'
// middleware
import { loggerMiddleware } from '~/common/middleware/logger.middleware'

@Module({
  imports: [AuthModule, UserModule, FrontendStaticModule.forRoot()],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
