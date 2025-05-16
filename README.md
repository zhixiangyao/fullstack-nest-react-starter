# fullstack-nest-react-starter

> This is a monorepo project based on pnpm.

## Preparatory Work

- **Editor:**

  - [VS Code](https://code.visualstudio.com/)

- **VSCode Extension:**

  - `ESLint`
  - `Stylelint`
  - `DotENV`
  - `Tailwind CSS IntelliSense`
  - `Prisma`

**Development ENV:**

- git => 2.40.0
- node => 16
- pnpm => 8
- pm2 => 5
- docker & docker compose plugin => 24.0.0

## Start

### Dev

```bash
# install pnpm to manage packages
npm install --global pnpm

# install dependencies
cd fullstack-nest-react-starter
pnpm install

# init prisma type file && seed:db
pnpm init:db

# start project
pnpm dev

# build project
pnpm build
```

### Prod

```bash
# install pnpm to manage packages and use pm2 to manage project
npm install --global pnpm pm2

# install dependencies
cd fullstack-nest-react-starter
pnpm install

# ✨ init prisma type file && seed:db
pnpm init:db

pnpm build

pm2 start ecosystem.config.js
```

## Hint

- Development environment: Access frontend resources through middleware proxy (5088 → 5089).
- Production environment: Directly use FrontendStaticModule to provide packaged static resources.
