import process from 'node:process'
import { $Enums, PrismaClient, User } from '@prisma/client'
import * as argon2 from 'argon2'

// initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  // delete all users
  for (const { uuid } of users) {
    await prisma.user.delete({ where: { uuid } })
  }

  const hashedPassword0 = await argon2.hash('root')
  const hashedPassword1 = await argon2.hash('123456')

  await prisma.user.createMany({
    data: [
      {
        username: 'root',
        password: hashedPassword0,
        roles: [$Enums.Role.ADMIN],
      },
      ...Array.from({ length: 100 }).map((_, i) => ({
        username: `user${i}`,
        password: hashedPassword1,
        roles: [$Enums.Role.USER],
      } satisfies Partial<User>)),
    ],
  })

  console.log({ users: await prisma.user.findMany() })
}

// execute the main function
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect()
  })
