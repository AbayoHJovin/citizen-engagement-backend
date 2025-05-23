# citizen-engagement-backend

📦 Backend - API Service

🛠 Tech Stack

Node.js

Express

Prisma ORM

PostgreSQL (hosted on Supabase)

JWT Auth (access & refresh tokens)

Cloudinary (for image uploads)

📂 Project Structure

src/
├── controllers/
├── services/
├── middleware/
├── prisma/
├── routes/
├── utils/
├── models/
└── index.ts

⚙️ Setup & Run

Install Dependencies

npm install

**Configure **``

DATABASE_URL=your_supabase_postgres_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=...

Migrate Prisma Schema

npx prisma migrate deploy

Start Server

npm run dev

🔐 Authentication

Access and refresh tokens are used via HttpOnly cookies

Refresh tokens are stored securely and rotated

If the access token expires, a new one is issued using the refresh token

🧑 User Roles

Citizen: Submits complaints

Leader: Manages complaints for an administrative area

Admin: Manages users and monitors overall system

📋 Complaint Lifecycle

Citizen submits complaint with optional images

Complaint is tagged with status PENDING

Leader in the respective area views it

Leader responds; complaint status may change (IN_PROGRESS, RESOLVED, REJECTED)

Citizen views responses

PENDING complaints can be deleted; images removed from Cloudinary

🧠 Admin Capabilities

Create new admins or leaders

View/filter all leaders and citizens

See dashboards with statistics & graphs

📡 API Summary

Method

Endpoint

Description

POST

/complaints

Submit complaint

GET

/complaints/:id

View complaint + responses + images

DELETE

/complaints/delete/:id

Delete (only if PENDING)

POST

/responses

Add a response

GET

/users/me

Authenticated user details

PATCH

/users/update

Update user info