# Job Application Backend

This is the backend of the Job Application platform, which provides APIs to manage job posts, applications, and user authentication. It uses **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

## How to run the server

```bash
npx ts-node-dev --files --respawn src/server.ts
```

## Create a recruiter account

1. Using postman create a new account.

- URL: http://localhost:3000/api/users/register
- Method: POST
- Headers: Content-Type: application/json
- Body: name, email, password
- User role: recruiter

```bash
{
    "name": "Jon",
    "email":"jon_222@mail.ru",
    "password":"123",
    "role":"recruiter"
}

```

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

   npm run dev

   ```

## environment variables

- DATABASE_URL="postgresql://nazim:nzmai@localhost:5432/jobplatform"
- JWT_SECRET="secret"

# Job Application Client

This is the job seeker client interface for the Job Application platform. Job seekers can view available job posts and apply for them. It uses **React**, **Ant Design**, **React Query**, and **Axios** for API calls.

## Features

- View available job posts
- Apply for a job with a form that includes name, email, cover letter, and resume upload
- Responsive design using Ant Design
- React Query for data fetching and caching

## Prerequisites

- Node.js (v14 or later)

## Installation and Usage

```bash

npm install

npm run dev

```

## environment variables

VITE_BACKEND_URL=http://localhost:3000

# Job Application Admin Dashboard

This is the admin dashboard of the Job Application platform, where recruiters can manage their job posts and view applications. It uses **React**, **Ant Design**, **React Query**, and **Axios** for API calls.

## Features

- View all job posts
- Create, edit, delete job posts
- View applications for each job post
- Responsive design using Ant Design
- React Query for data fetching and caching

## Prerequisites

- Node.js (v14 or later)

## Installation and Usage

```bash

npm install

npm run dev

```

## environment variables

VITE_BACKEND_URL=http://localhost:3000
