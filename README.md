# Project Management App

A **Project Management App** built with **Next.js**, **tRPC**, **Prisma**, and **NextAuth.js**, using **Supabase PostgreSQL** as the database.

## Features
- User authentication with NextAuth.js
- Database management with Prisma
- API routes using tRPC
- PostgreSQL database hosted on Supabase
- Next.js for server-side rendering and client-side interactions

## Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 18)
- **npm** or **yarn**
- **Supabase PostgreSQL** setup

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/project-management-app.git
   cd project-management-app
   ```

2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```sh
   DATABASE_URL=your_supabase_database_url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   DISCORD_CLIENT_ID="discord client id"
   DISCORD_CLIENT_SECRET="discord client secret"
   ```
   You can refer to the `.env.example` file for guidance.

4. Apply database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```

5. Generate Prisma Client:
   ```sh
   npx prisma generate
   ```

6. Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
   The app should now be running at `http://localhost:3000`

## Deployment

### Build for production
```sh
npm run build
npm run start
```


## Useful Commands
- **Run development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Run Prisma migrations**: `npx prisma migrate dev`
- **Generate Prisma Client**: `npx prisma generate`

## License
This project is licensed under the MIT License.

