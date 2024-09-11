# Job Application Backend

This is the backend of the Job Application platform, which provides APIs to manage job posts, applications, and user authentication. It uses **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

## Features

- User authentication (JWT-based)
- Create, update, delete job posts (for recruiters)
- Manage job applications
- PostgreSQL as the database
- Prisma ORM

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Prisma

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/job-application-backend.git

   cd job-application-backend

   npm install

   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<dbname>?schema=public
   JWT_SECRET=your_jwt_secret

   npx prisma migrate dev
   ```

npm run dev

```


```
