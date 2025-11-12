# NaturePeak

NaturePeak is a sample full-stack real estate listing application built with React + TypeScript on the frontend and Node + Express + MongoDB on the backend.

## Technology

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose)

## Features

- Create / Read / Update / Delete property listings (CRUD)
- User authentication (register / login) with JWT
- Role-based access: regular user and admin
- Admin moderation: preview and approve/hide posts

## How to run

1. Start the backend

   ```powershell
   cd api
   npm run dev
   ```

2. Start the frontend

   ```powershell
   cd client
   npm run dev
   ```

Make sure to create a `.env` file for the backend with at least the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Sample accounts

- Admin: admin@example.com / 123456
- User: user@example.com / 123456

If you have a seed script, run it (for example `npm run seed` in the backend) to populate these accounts; otherwise register them via the app's register endpoint.

## Notes

- Images in the simple demo are handled as base64 strings for quick prototyping. For production, consider using multipart uploads with cloud storage.
- The frontend uses an in-app `UserContext` to store the JWT token in localStorage; you may want to switch to httpOnly cookies for improved security.

Enjoy exploring NaturePeak!

# Real Estate Pro Application
