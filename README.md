# 📍 Programmatic SEO Directory

A high-performance, SEO-optimized local business directory application built with Next.js 16, TypeScript, and Drizzle ORM. Designed for Programmatic SEO (pSEO) with dynamic routing for Locations and Categories.

## 🚀 Key Features

- **Modern Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4.
- **Data Layer**: Type-safe database interactions with Drizzle ORM & PostgreSQL.
- **Programmatic SEO**: Dynamic routing pattern `[locationSlug]/[categorySlug]` to generate thousands of landing pages for locations like cities and categories like services.
- **Performance**: Optimized Core Web Vitals using Next.js runtime.
- **Search Ready**: API endpoints and UI for filtering directory listings.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Package Manager**: pnpm

## ⚡ Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd seo-directory
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure Environment**

   Create a `.env` file in the root directory:

   ```bash
   # Create a .env file
   touch .env
   ```

   Add your database connection string and application URL:

   ```env
   # .env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Setup Database**

   Push the Drizzle schema to your database:

   ```bash
   pnpm db:push
   ```

5. **Seed Data**

   Populate the database with initial locations and categories:

   ```bash
   pnpm db:seed
   ```

6. **Run Development Server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

| Script           | Description                             |
| :--------------- | :-------------------------------------- |
| `pnpm dev`       | Starts the development server           |
| `pnpm build`     | Builds the application for production   |
| `pnpm start`     | Runs the built production application   |
| `pnpm lint`      | Runs ESLint                             |
| `pnpm db:push`   | Pushes schema changes to the database   |
| `pnpm db:studio` | Opens Drizzle Studio to inspect data    |
| `pnpm db:seed`   | Runs the seed script (`script/seed.ts`) |

## 📂 Project Structure

```text
├── app/                  # Next.js App Router
│   ├── api/              # API Routes (Search, etc.)
│   ├── directory/        # Dynamic pSEO routes ([locationSlug]/[categorySlug])
│   ├── globals.css       # Global styles (Tailwind)
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
├── db/                   # Database configuration
│   ├── index.ts          # DB connection
│   └── schema.ts         # Drizzle schema definitions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── script/               # Database maintenance scripts (Seed)
└── public/               # Static assets
```

## 📄 License

This project is licensed under the MIT License.
