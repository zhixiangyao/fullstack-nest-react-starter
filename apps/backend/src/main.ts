import type { ValidationPipeOptions } from '@nestjs/common'
import process from 'node:process'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import { AppModule } from '~/app.module'

import { frontendProxyMiddleware } from '~/common/middleware/proxy.middleware'
import 'dotenv/config'

const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true, // Only retain the properties defined in the DTO.
  forbidNonWhitelisted: true, // If an undefined property in the DTO is passed, an error is reported.
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions))
  app.use(compression())
  app.enableCors()
  // Access frontend resources through middleware proxy (5088 → 5089).
  process.env.NODE_ENV === 'dev' && app.use(frontendProxyMiddleware)

  await app.listen(5088, '0.0.0.0')
}

bootstrap()
