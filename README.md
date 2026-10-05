# Portfolio CMS - Backend

> A robust, secure Express.js REST API powering a dynamic portfolio website and its companion Content Management System (CMS).

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based authentication using `httpOnly` cookies.
- 🗄️ **Relational Database** — PostgreSQL managed via Prisma ORM for type-safe database queries.
- 📂 **Media Management** — Integrated `multer` for handling image and document uploads.
- 🌐 **Public & Private APIs** — Read-only public endpoints for the frontend portfolio, and protected CRUD endpoints for the CMS dashboard.
- 🛡️ **Error Handling** — Centralized error handling and robust validation.

---

## 🏗️ System Architecture

```mermaid
graph TD
  FE["⚛️ React Frontend"] -->|"HTTP REST\nwithCredentials (JWT)"| BE["🚀 Express API"]

  BE --> MW["🔐 authMiddleware\n(JWT Verification)"]
  MW --> Routes["🔀 Express Routes"]
  Routes --> CTR["🎛️ Controllers"]

  CTR -->|"Prisma ORM"| DB[("🐘 PostgreSQL\nDatabase")]

  subgraph Backend ["Backend Architecture"]
    Auth["authController"]
    Projects["projectController"]
    Skills["skillController"]
    Media["mediaController"]
    Messages["contactController"]
  end
```

---

## 🗄️ Database Schema (ER Diagram)

```mermaid
erDiagram
  User {
    String id PK
    String name
    String email
    String password
  }

  Project {
    String id PK
    String title
    String slug
    String description
    String status
    DateTime createdAt
  }

  Skill {
    String id PK
    String name
    String category
    String level
  }

  Blog {
    String id PK
    String title
    String slug
    String content
    String status
  }
  
  Experience {
    String id PK
    String company
    String role
  }

  Message {
    String id PK
    String name
    String email
    String subject
    String status
  }

  Media {
    String id PK
    String filename
    String path
  }

  Project ||--o{ Skill : "uses (ProjectSkill)"
```

---

## 📁 Project Structure

```text
backend/
├── app.js                    # Express application setup & middleware
├── controllers/              # Business logic for all endpoints
├── middleware/               # Custom middlewares (auth, upload)
├── routes/                   # Express route definitions
├── prisma/
│   └── schema.prisma         # Database schema & models
└── package.json
```

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Apply database migrations and generate Prisma client:

```bash
npx prisma migrate dev
```

### 3. Start the Server

```bash
npm run dev
```
The API will be running on `http://localhost:3000`.

---

## 🔌 API Reference

### 🌐 Public Endpoints (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/projects` | Fetch published projects |
| GET | `/api/public/skills` | Fetch all skills |
| GET | `/api/public/blogs` | Fetch published blogs |
| POST | `/api/contact` | Submit a new contact message |

### 🔐 Admin Endpoints (JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Authenticate user & set cookie |
| POST | `/api/admin/projects` | Create a new project |
| PUT | `/api/admin/projects/:id` | Update an existing project |
| DELETE | `/api/admin/projects/:id` | Delete a project |
| POST | `/api/admin/media/upload` | Upload a new media file |

---

## 🚀 Deployment (Railway)

1. Connect your GitHub repository to Railway.
2. Set the Root Directory to `backend`.
3. Railway will automatically detect the Node.js environment and deploy the server.
