import { Module } from '@nestjs/common'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PasswordService } from './password.service'

import { PrismaModule } from '~/modules/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PasswordService],
  exports: [UserService],
})
export class UserModule {}
