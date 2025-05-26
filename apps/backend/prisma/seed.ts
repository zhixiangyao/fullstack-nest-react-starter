import process from 'node:process'
import * as argon2 from 'argon2'

import { $Enums, PrismaClient } from '@prisma/client'

// initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  // delete all users
  for (const { userId } of users) {
    await prisma.user.delete({ where: { userId } })
  }

  const hashedPassword0 = await argon2.hash('666888qifei')
  const hashedPassword1 = await argon2.hash('yao')

  await prisma.user.createMany({
    data: [
      {
        username: 'root',
        password: hashedPassword0,
        role: $Enums.Role.ADMIN,
      },
      ...Array.from({ length: 100 }).map((_, i) => ({
        username: `yao${i}`,
        password: hashedPassword1,
        role: $Enums.Role.USER,
      })),
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
