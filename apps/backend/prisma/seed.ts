import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

// initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  // Delete existing roles
  await prisma.role.deleteMany() // Deletes all roles
  // Delete existing users
  await prisma.user.deleteMany() // Deletes all users

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
    },
  })

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
    },
  })

  const passwordHash0 = await argon2.hash('root')
  const passwordHash1 = await argon2.hash('123456')

  const promiseList = [
    prisma.user.create({
      data: {
        username: 'root',
        passwordHash: passwordHash0,
        roles: {
          create: [{ roleId: adminRole.id }],
        },
      },
    }),
  ]

  Array.from({ length: 30 }).forEach((_, i) => {
    promiseList.push(
      prisma.user.create({
        data: {
          username: `user${i}`,
          passwordHash: passwordHash1,
          roles: {
            create: [{ roleId: userRole.id }],
          },
        },
      }),
    )
  })

  await Promise.all(promiseList)

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
