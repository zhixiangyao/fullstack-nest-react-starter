import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

// initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  // Delete existing roles
  await prisma.role.deleteMany()
  // Delete existing users
  await prisma.user.deleteMany()
  // Delete existing blogs
  await prisma.blog.deleteMany()

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

  const hashedPassword0 = await argon2.hash('root')
  const hashedPassword1 = await argon2.hash('123456')

  const promiseList = [
    prisma.user.create({
      data: {
        username: 'root',
        hashedPassword: hashedPassword0,
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
          hashedPassword: hashedPassword1,
          roles: {
            create: [{ roleId: userRole.id }],
          },
        },
      }),
    )
  })

  const [admin] = await Promise.all(promiseList)
  const firstBlog = await prisma.blog.create({
    data: {
      title: 'My first blog post',
      content: 'This is the content of my first blog post.',
      slug: 'my-first-blog-post',
      authorUuid: admin.uuid,
      published: true,
      imageUrl: 'https://example.com/blog-image.jpg',
      tags: ['NestJS', 'Prisma', 'TypeScript'],
      category: 'Development',
    },
  })

  await prisma.blogTreeNode.create({
    data: {
      name: 'tree: My first blog post',
      blogId: firstBlog.id,
      authorUuid: admin.uuid,
    },
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
