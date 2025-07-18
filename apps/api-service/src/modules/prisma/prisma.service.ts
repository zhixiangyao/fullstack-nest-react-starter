import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'database'

@Injectable()
export class PrismaService extends PrismaClient {}
