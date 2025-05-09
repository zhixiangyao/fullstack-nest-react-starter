import { join } from 'node:path'
import process from 'node:process'

import { DynamicModule, Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({})
export class FrontendStaticModule {
  static forRoot(): DynamicModule {
    if (process.env.NODE_ENV === 'dev')
      return { module: FrontendStaticModule }

    return ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../frontend/dist'),
      exclude: ['/api/(.*)'],
    })
  }
}
