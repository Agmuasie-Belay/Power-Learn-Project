# Blog API

## Overview
A RESTful API built with **Node.js**, **Express**, **Sequelize**, and **MySQL**.  
Supports user registration, login (JWT), and CRUD operations for blog posts.

---

## Features
- User registration & login
- JWT authentication
- Passwords hashed with bcrypt
- CRUD for blog posts (only owners can update/delete)
- Swagger documentation

---

## Setup
1. **Clone repo**
```bash
git clone <repo-url>
cd <repo-folder>
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env`**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
JWT_SECRET=your_jwt_secret
```

4. **Start server**
```bash
npm start
```

Server runs at `http://localhost:3000`.

---

## Swagger Documentation

- Access the interactive API docs at:  
http://localhost:3000/api/docs


- Use Swagger UI to:
  - View all endpoints
  - Send requests directly from the browser
  - See required parameters, request bodies, and responses

- JWT-protected endpoints:
  - Click "Authorize" in Swagger
  - Enter your token as `Bearer <your_jwt_token>` to access protected routes

---

## API Endpoints

### Auth
| Method | Endpoint             |            Body       |
|--------|----------------------|-----------------------|
| POST   | `/api/auth/register` | name, email, password |
| POST   | `/api/auth/login`    | email, password       |

### Posts
| Method | Endpoint          | Body           | Auth |
|--------|-------------------|----------------|------|
| GET    | `/api/posts`      | None           | No   |
| GET    | `/api/posts/:id`  | None           | No   |
| POST   | `/api/posts`      | title, content | Yes  |
| PUT    | `/api/posts/:id`  | title, content | Yes  |
| DELETE | `/api/posts/:id`  | None           | Yes  |

---

## Notes
- JWT required for creating/updating/deleting posts
- Tokens expire in 1 hour
- Passwords stored securely (bcrypt)

---

## .gitignore
```
node_modules/
.env
logs/
*.log
dist/
.vscode/
.DS_Store
coverage/
```
