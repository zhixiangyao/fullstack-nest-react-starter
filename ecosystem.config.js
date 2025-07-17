module.exports = {
  apps: [
    {
      name: 'Api Service and Dashboard',
      script: 'pnpm start:dashboard',
      autorestart: true,
    },
    {
      name: 'Frontend',
      script: 'pnpm start:frontend',
      autorestart: true,
    },
  ],
}
