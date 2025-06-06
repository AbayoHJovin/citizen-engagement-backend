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

🐳 Docker Setup

1. Create a `.env` file:

   For Windows users, run the provided PowerShell script:

   ```
   powershell -ExecutionPolicy Bypass -File create-env.ps1
   ```

   Alternatively, manually create a `.env` file based on the `env.example` template.

2. Production Mode:

   ```
   docker-compose up -d
   ```

3. Development Mode (with hot reload):

   ```
   docker-compose --profile dev up -d app-dev
   ```

4. Run Prisma migrations:
   ```
   docker-compose exec app npx prisma migrate deploy
   ```
5. Access the API at http://localhost:5000

**Note:** This project uses Supabase for PostgreSQL hosting, so the local database container has been removed from the Docker setup.

**Using the setup script:**

For Linux/Mac:

```
chmod +x docker-setup.sh
./docker-setup.sh prod     # Start in production mode
./docker-setup.sh dev      # Start in development mode
./docker-setup.sh migrate  # Run Prisma migrations
./docker-setup.sh logs     # Show production logs
./docker-setup.sh logs dev # Show development logs
./docker-setup.sh stop     # Stop all containers
./docker-setup.sh clean    # Stop and remove all containers
```

For Windows:

```
docker-setup.bat prod     # Start in production mode
docker-setup.bat dev      # Start in development mode
docker-setup.bat migrate  # Run Prisma migrations
docker-setup.bat logs     # Show production logs
docker-setup.bat logs dev # Show development logs
docker-setup.bat stop     # Stop all containers
docker-setup.bat clean    # Stop and remove all containers
```

To stop the containers:

```
docker-compose down
```

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
