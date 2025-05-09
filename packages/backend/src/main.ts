import process from 'node:process'

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import compression from 'compression'
import 'dotenv/config'

import { proxyMiddleware } from '~/common/middleware/proxy.middleware'
import { AppModule } from '~/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe())
  app.use(proxyMiddleware)
  app.use(compression())
  app.enableCors()

  await app.listen(5088, '0.0.0.0')

  console.log(`[${process.env.NODE_ENV}] Application is running on: ${await app.getUrl()}`)
}

bootstrap()
