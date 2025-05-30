import type { DynamicModule } from '@nestjs/common'
import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({})
export class FrontendStaticModule {
  static forRoot(): DynamicModule {
    return ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../frontend/dist'),
      exclude: ['/api/(.*)'],
    })
  }
}
