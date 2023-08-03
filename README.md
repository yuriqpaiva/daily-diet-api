# 🥗 Daily Diet API
<!-- Badges showing Technologies being used -->
![NodeJS](https://img.shields.io/badge/-NodeJS-339933?style=flat-square&logo=node.js&logoColor=white)
![Typescript](https://img.shields.io/badge/-Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)

Manage your daily diet using this API written using NodejS.
1. Create, Read, Update and Delete meals
2. Session ID with cookies to manage users' meals
3. Get metrics of your meals (total count, best score, etc)

## 👨‍💻 Technologies
- [NodeJS](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Knex](http://knexjs.org/)
- [SQlite3](https://www.sqlite.org/index.html)
- [Vitest](https://vitest.dev/)


## 🔧 Getting started
Install dependencies
```bash
npm install
```

Run migrations
```bash
npm run knex -- migrate:latest
```

Run application
```bash
npm run dev
```

## 🧪 Run E2E tests
Run tests using Vitest
```bash
npm run test
```
---
Made with ❤️ by [Yuri Paiva](https://yuripaiva.dev) 