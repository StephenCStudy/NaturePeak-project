RealEstatePro — API (Node, Express, MongoDB Atlas)
===============================================

Quick start (API only)

1. 
2. Install dependencies:
    ```bash 
   npm install

3. Start in development (uses ts-node + nodemon):
    ```bash
   npm run dev

4. Seed sample data into the database:
    ```bash
   npm run seed

What was added
- Mongoose-based `src/config/db.ts` (reads `MONGO_URI`)
- Express app in `app.ts` and server entrypoint `src/server.ts`
- Models: `User`, `Agent`, `Property` (in `src/models`)
- Property CRUD controller and routes
- Seed script: `src/scripts/seed.ts` to create sample agents, users and properties
