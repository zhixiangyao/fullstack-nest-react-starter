import process from 'node:process'
import { PrismaClient, User } from '@prisma/client'
import * as argon2 from 'argon2'

// initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  // delete all users
  for (const { uuid } of users) {
    await prisma.user.delete({ where: { uuid } })
  }

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
    },
  })

  const passwordHash0 = await argon2.hash('root')
  const passwordHash1 = await argon2.hash('123456')

  await prisma.user.create({
    data: {
      username: 'root',
      passwordHash: passwordHash0,
      roles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  })

  await prisma.user.createMany({
    data: [
      ...Array.from({ length: 100 }).map(
        (_, i) =>
          ({
            username: `user${i}`,
            passwordHash: passwordHash1,
          } satisfies Partial<User>),
      ),
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
