RealEstatePro — API (Node, Express, MongoDB Atlas)
===============================================

Quick start (API only)

1. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB Atlas connection string.
2. Install dependencies:

   npm install

3. Start in development (uses ts-node + nodemon):

   npm run dev

4. Seed sample data into the database:

   npm run seed

What was added
- Mongoose-based `src/config/db.ts` (reads `MONGO_URI`)
- Express app in `app.ts` and server entrypoint `src/server.ts`
- Models: `User`, `Agent`, `Property` (in `src/models`)
- Property CRUD controller and routes
- Seed script: `src/scripts/seed.ts` to create sample agents, users and properties
