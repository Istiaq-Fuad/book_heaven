# T3 Book Library Application

A modern web application built with the T3 stack (TypeScript, Next.js, Prisma, and NextAuth.js) for managing and discovering books using the Google Books API.

## Features

- User authentication via GitHub
- Book search and discovery powered by Google Books API
- PostgreSQL database integration with Prisma ORM
- Type-safe API routes and database queries
- Responsive and modern UI

## Prerequisites

- Node.js 16.x or later
- pnpm package manager
- PostgreSQL database (we use Neon Database)
- GitHub account for authentication
- Google Books API key

## Getting Started

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <your-project-name>
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# Auth
AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Database
DATABASE_URL="your-postgresql-connection-string"

# Google Books API
GOOGLE_BOOKS_API_KEY="your-google-books-api-key"
```

4. Initialize the database:
```bash
npx prisma db push
```

5. Start the development server:
```bash
pnpm run dev
```

## Environment Variables

### Required Environment Variables

- `AUTH_SECRET`: A secret key for NextAuth.js authentication. Generate using `npx auth secret`
- `AUTH_GITHUB_ID`: GitHub OAuth application client ID
- `AUTH_GITHUB_SECRET`: GitHub OAuth application client secret
- `DATABASE_URL`: PostgreSQL connection URL
- `GOOGLE_BOOKS_API_KEY`: API key for Google Books API

### How to Obtain Environment Variables

1. **GitHub Authentication**:
   - Go to GitHub Developer Settings
   - Create a new OAuth application
   - Set callback URL to `http://localhost:3000/api/auth/callback/github` for development
   - Copy the generated Client ID and Client Secret

2. **Database URL**:
   - Create a postgresql database
   - Copy the provided connection string
   - Replace placeholders with your credentials

3. **Google Books API Key**:
   - Visit Google Cloud Console
   - Create a new project
   - Enable the Books API
   - Create credentials and copy the API key


## Available Scripts

- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm start`: Start production server
- `pnpm run lint`: Run ESLint
- `pnpm run typecheck`: Check TypeScript types

## Technologies Used

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TypeScript](https://www.typescriptlang.org/)