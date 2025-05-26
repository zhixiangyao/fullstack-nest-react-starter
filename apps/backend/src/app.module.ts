import { Module, RequestMethod } from '@nestjs/common'
import type { MiddlewareConsumer, ModuleMetadata, NestModule } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import process from 'node:process'

import { AuthModule } from '~/modules/auth/auth.module'
import { UserModule } from '~/modules/user/user.module'
import { FrontendStaticModule } from '~/modules/frontend-static.module'
import { AuthGuard } from '~/common/guards/auth.guard'
import { RolesGuard } from '~/common/guards/roles.guard'
import { loggerMiddleware } from '~/common/middleware/logger.middleware'

const imports: ModuleMetadata['imports'] = [AuthModule, UserModule]

// Directly use FrontendStaticModule to provide packaged static.
if (process.env.NODE_ENV !== 'dev') {
  imports.push(FrontendStaticModule.forRoot())
}

@Module({
  imports,
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes({ path: '*all', method: RequestMethod.ALL })
  }
}
