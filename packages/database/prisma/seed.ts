import process from 'node:process'
import { faker } from '@faker-js/faker' // Import faker for generating realistic data
import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'
import { config } from 'dotenv'

config({ path: '../../.env' })

const prisma = new PrismaClient()

async function main() {
  await prisma.role.deleteMany() // Deletes all roles
  await prisma.user.deleteMany() // Deletes all users
  await prisma.blog.deleteMany() // Deletes all blogs to prevent conflicts

  const adminRole = await prisma.role.create({ data: { name: 'ADMIN' } })
  const userRole = await prisma.role.create({ data: { name: 'USER' } })

  const hashedPasswordAdmin = await argon2.hash('admin')
  const hashedPasswordUser = await argon2.hash('123456') // A default password for generated users

  const usersToCreate = 10
  const userPromises: ReturnType<typeof prisma.user.create>[] = [
    prisma.user.create({
      data: {
        username: 'admin',
        hashedPassword: hashedPasswordAdmin,
        email: faker.internet.email(),
        roles: {
          create: [{ roleId: adminRole.id }],
        },
        avatar: `https://i.pravatar.cc/150?u=admin`,
      },
    }),
  ]

  for (let i = 0; i < usersToCreate; i++) {
    const username = faker.internet.username()
    userPromises.push(
      prisma.user.create({
        data: {
          username,
          hashedPassword: hashedPasswordUser,
          email: faker.internet.email(), // Added email for more complete user data
          roles: {
            create: [{ roleId: userRole.id }],
          },
          avatar: faker.image.avatar(),
        },
      }),
    )
  }

  const createdUsers = await Promise.all(userPromises)

  const blogPromises: ReturnType<typeof prisma.blog.create>[] = []
  for (const user of createdUsers) {
    const numberOfBlogs = faker.number.int({ min: 5, max: 20 }) // Random number of blogs between 5 and 20
    for (let i = 0; i < numberOfBlogs; i++) {
      // Generate richer content for the blog posts
      const contentSections: string[] = []
      const numSections = faker.number.int({ min: 3, max: 7 }) // Between 3 and 7 sections

      for (let s = 0; s < numSections; s++) {
        contentSections.push(`## ${faker.lorem.words({ min: 3, max: 7 })}`) // Add a sub-heading
        contentSections.push(faker.lorem.paragraphs({ min: 3, max: 7 }, '\n\n')) // More paragraphs per section
        if (faker.datatype.boolean()) {
          // Occasionally add a list
          contentSections.push(
            `### Key Takeaways:\n`
            + `* ${faker.lorem.sentence()}\n`
            + `* ${faker.lorem.sentence()}\n`
            + `* ${faker.lorem.sentence()}`,
          )
        }
        if (faker.datatype.boolean()) {
          // Occasionally add a blockquote for emphasis
          contentSections.push(`> _"${faker.lorem.paragraph()}"_`)
        }
      }

      const blogContent = contentSections.join('\n\n') // Join all sections with double newlines

      blogPromises.push(
        prisma.blog.create({
          data: {
            title: faker.lorem.sentence({ min: 5, max: 10 }), // Slightly longer titles
            content: blogContent,
            slug: faker.lorem.slug(),
            authorUuid: user.uuid,
            published: faker.datatype.boolean(),
            imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 600 }), // Larger images
            tags: faker.helpers.arrayElements(
              [
                'NestJS',
                'Prisma',
                'TypeScript',
                'Node.js',
                'Database',
                'Backend',
                'Frontend',
                'JavaScript',
                'Web Development',
                'API',
                'Security',
                'Deployment',
                'Testing',
                'Cloud',
                'Microservices',
                'DevOps',
                'Architecture',
              ],
              { min: 2, max: 5 },
            ), // More tags, with variable count
            category: faker.helpers.arrayElement([
              'Development',
              'Technology',
              'Tutorial',
              'Personal',
              'News',
              'Case Study',
              'Opinion',
              'Guide',
            ]),
          },
        }),
      )
    }
  }

  await Promise.all(blogPromises)

  console.log({ users: await prisma.user.findMany({ include: { blogs: true } }) })
  console.log(`🎉 Successfully created ${createdUsers.length} users and their blogs.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
