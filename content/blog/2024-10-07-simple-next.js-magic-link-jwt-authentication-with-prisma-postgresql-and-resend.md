---
layout: post
title: Simple Next.js Magic Link JWT Authentication with Prisma, PostgreSQL, and Resend
date: 2024-10-07
---

When building web applications, authentication is almost always a core requirement. I needed something simple and secure that would let me get started quickly on new projects without over-complicating the setup. My goal was to have a solution that's easy to implement, handles email verification out of the box, and just works. In this post, I'm sharing how to build a straightforward magic link authentication system using [Next.js](https://nextjs.org/), [Auth.js](https://authjs.dev/), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), and [Resend](https://resend.com/home). It's a powerful yet simple solution that accomplishes exactly what I needed, and I hope it'll be useful for your projects too.

You can find the starter kit, which implements the setup described in this blog post, in the following [GitHub repository](https://github.com/diegocasmo/nextjs-magic-link-auth).

## Getting Started

### Installing Dependencies

To get started, initialize a new Next.js app:

```bash
npx create-next-app@latest
```

For this setup, I’ve configured the new app `nextjs-magic-link-auth` to use TypeScript, ESLint, Tailwind, a `/src` directory, the App Router, and a custom import alias `@/*` for cleaner imports.

### Prisma Setup

The next step is to set up the Prisma ORM and connect it to the database. I’ve chosen PostgreSQL for its strong support for relational data, ease of integration with Prisma, and reliability for production use.

```markdown
cd nextjs-magic-link-auth
yarn add @prisma/client
yarn add prisma --dev
```

Once Prisma is installed, initialize it and create a `schema.prisma` file by running:

```bash
yarn prisma init
```

Next, set up the `DATABASE_URL` in your `.env` file (i.e., `touch .env`). Make sure to replace `<username>`, `<password>`, and `<db_name>` with your actual database credentials:

```bash
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<db_name>?schema=public"
```

Now, update the `schema.prisma` file to define the tables and columns needed for email magic link authentication. For this example, I’ve only added the essentials, but you might want to refer to the [Auth.js Prisma documentation](https://authjs.dev/getting-started/adapters/prisma) to tailor it to your needs.

```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime? @updatedAt @map("updated_at")

  @@index([email])
  @@map("users")
}

model VerificationToken {
  id         String    @id @default(cuid())
  identifier String
  token      String    @unique
  expires    DateTime
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime? @updatedAt @map("updated_at")

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

After updating the `schema.prisma` file, run the following commands to create the migration and apply the changes to your database. This ensures that your schema is correctly set up:

```bash
yarn prisma migrate dev --name init
yarn prisma generate
```

The `migrate dev` command will prompt you to name your migration (e.g., `init`). It will also create a new migration file in the `prisma/migrations` directory, allowing you to track changes to your schema over time.

Once the migration is complete, create a new file called `prisma.ts` in your `src/lib` directory to configure the Prisma client:

```bash
mkdir src/lib
touch src/lib/prisma.ts
```

Add the following code to `prisma.ts`:

```tsx
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

The code creates a single instance of `PrismaClient` and attaches it to the global object when not in production to avoid multiple client instances during development. In production, the client is not stored on the global object (`globalForPrisma`), meaning each module that imports `prisma` will use a fresh instance from `new PrismaClient()`.

### Configure the Resend Provider with Prisma

Once Prisma is set up, it’s time to integrate it with [Resend](https://resend.com/). If you don’t have a Resend account yet, start by creating one and generating an API key. Save this API key in your `.env` file as `AUTH_RESEND_KEY`:

```bash
AUTH_RESEND_KEY=<your-resend-api-key>
```

Next, install Auth.js and its Prisma adapter by running:

```bash
yarn add next-auth@beta @auth/prisma-adapter
```

After installing these dependencies, add the `AUTH_SECRET` environment variable to your `.env` file. You can generate a random secret by running:

```bash
npx auth secret
```

This `AUTH_SECRET` is used by Auth.js to encrypt tokens and email verification hashes securely.

Now, it’s time to set up the Auth.js configuration. Create a folder and file to hold the configuration:

```bash
mkdir src/lib/auth
touch src/lib/auth/index.ts
```

Fill in `src/lib/auth/index.ts` with the following content:

```tsx
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Resend from "next-auth/providers/resend";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: "onboarding@resend.dev",
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
```

Next, add the route handler for Auth.js under `src/app/api/auth/[...nextauth]/route.ts`:

```tsx
mkdir -p src/app/api/auth/\[...nextauth\]
touch src/app/api/auth/\[...nextauth\]/route.ts
```

Fill it in with the following content:

```tsx
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

And that’s it! Run `yarn dev` and navigate to [`http://localhost:3000/api/auth/signin`](http://localhost:3000/api/auth/signin) to sign in with your email, verify that a sign-in email is sent to you, click on the link, and the user will be signed in.

By default, the user will be redirected to `http://localhost:3000/dashboard` after signing in, which currently doesn’t exist in the project. Because of that, you’ll get a 404 error. To fix it, you’ll need to create a page in `src/app/dashboard/page.tsx`. I’ve chosen not to include that part in this blog post to keep it concise, but the [attached repository](https://github.com/diegocasmo/nextjs-magic-link-auth) includes it in case you want to fork it.

## Conclusion and Further Improvements

This simple magic link authentication system with Next.js, Prisma, and Resend provides a solid foundation for secure and easy-to-implement authentication. To further enhance this setup, consider the following improvements:

- Secure sensitive routes using Next.js middleware to prevent unauthorized access ([read more here](https://authjs.dev/getting-started/session-management/protecting)).
- Log emails to the console locally instead of sending them in a development environment to avoid unnecessary Resend API calls:

```tsx
  return Resend({
    from: "onboarding@resend.dev",,
    // Send email verification requests to the console in development to avoid
    // spamming the Resend API
    ...(process.env.NODE_ENV === "development"
      ? {
          sendVerificationRequest: async ({ identifier, url, provider }) => {
            const { host } = new URL(url);
            console.log(`
----------------------------------
From: ${provider.from}
To: ${identifier}
Subject: Sign in to ${host}

Sign in URL:

${url}
----------------------------------
  `);
          },
        }
      : {}),
  });
```

- Implement rate limiting to prevent potential abuse by limiting the number of sign-in requests within a specified timeframe ([read more here](https://vercel.com/guides/rate-limiting-edge-middleware-vercel-kv)).

These additions will help make the authentication flow more robust and production-ready while maintaining a simple codebase.
