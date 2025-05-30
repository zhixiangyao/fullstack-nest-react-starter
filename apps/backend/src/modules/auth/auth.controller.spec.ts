import process from 'node:process'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'

import { UserModule } from '~/modules/user/user.module'
import { AuthController } from './auth.controller'

import { AuthService } from './auth.service'

describe('authController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule.register({
          global: true,
          secret: process.env.AUTH_SECRET,
          // https://github.com/vercel/ms
          signOptions: { expiresIn: '7d' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
