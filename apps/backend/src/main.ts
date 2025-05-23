import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import compression from 'compression'
import 'dotenv/config'
import process from 'node:process'

import { frontendProxyMiddleware } from '~/common/middleware/proxy.middleware'
import { AppModule } from '~/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe())
  // Access frontend resources through middleware proxy (5088 → 5089).
  process.env.NODE_ENV === 'dev' && app.use(frontendProxyMiddleware)
  app.use(compression())
  app.enableCors()

  await app.listen(5088, '0.0.0.0')
}

bootstrap()
