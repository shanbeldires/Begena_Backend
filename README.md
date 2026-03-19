# 🎵 Begena Backend API

A **production-ready backend system** built with **Node.js, Express, and MongoDB**, implementing secure authentication, role-based access control, and modular architecture for scalability and maintainability.

---

# 🚀 Features

## 🔐 Authentication & Security

- JWT Authentication (**Access + Refresh Tokens**)
- Tokens stored in **HTTP-only cookies**
- Password hashing using **bcrypt**
- Refresh token stored securely (hashed in DB)
- Account lock after multiple failed login attempts
- Role-based authorization (**Admin / User**)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- cookie-parser
- Joi (validation)
- Morgan (logging)
- CORS

---

# 📁 Project Structure

```bash
Begena_Backend/
│
├── config/
│   ├── db.js
│   └── env.js
│
├── controllers/
│   ├── authController.js
│   ├── studentController.js
│   ├── paymentController.js
│   ├── sectionController.js
│   ├── classScheduleController.js
│   └── announcementController.js
│
├── middleware/
│   ├── authentication.js
│   ├── authorization.js
│   ├── user.js
│   ├── student.js
│   ├── payment.js
│   ├── section.js
│   ├── classSchedule.js
│   └── announcement.js
│
├── models/
│   ├── User.js
│   ├── Student.js
│   ├── Payment.js
│   ├── Section.js
│   ├── ClassSchedule.js
│   ├── Announcement.js
│   └── refreshToken.js
│
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── paymentRoutes.js
│   ├── sectionRoutes.js
│   ├── classScheduleRoutes.js
│   └── announcementRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── server.js
```

---

# ⚙️ Environment Variables

```env
PORT=3000
MONGO_URL=your_mongodb_uri

ACCESS_TOKEN_PRIVATE_KEY=your_secret
ACCESS_TOKEN_PUBLIC_KEY=your_secret

REFRESH_TOKEN_PRIVATE_KEY=your_secret
REFRESH_TOKEN_PUBLIC_KEY=your_secret

ACCESS_TOKEN_EXPIRE_DATE=15m
REFRESH_TOKEN_EXPIRE_DATE=7d
```

---

# ▶️ Run the Project

```bash
npm install
npm run dev
```

---

# 🔐 Authentication Flow

1. Register → Create user + hash password + generate tokens
2. Login → Validate + issue tokens
3. Refresh → Generate new access token
4. Logout → Remove refresh token + clear cookies

---

# 🔗 API ROUTES (WITH INPUT & RESPONSE)

---

## 🔐 AUTH ROUTES

### ➤ Register

**POST** `/api/auth/register`

**Request**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123",
  "phone": "0912345678",
  "address": "Addis Ababa"
}
```

**Response**

```json
{
  "success": true,
  "message": "successfuly signup",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "userObject": {
      "_id": "...",
      "email": "john@example.com"
    }
  }
}
```

---

### ➤ Login

**POST** `/api/auth/login`

**Request**

```json
{
  "email": "john@example.com",
  "password": "StrongPass123"
}
```

**Response**

```json
{
  "success": true,
  "message": "successfuly signin",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "userObject": {}
  }
}
```

---

### ➤ Logout

**POST** `/api/auth/logout`
✔ Requires authentication

**Response**

```json
{
  "success": true,
  "message": "successfuly log out"
}
```

---

### ➤ Refresh Token

**POST** `/api/auth/refresh`

**Response**

```json
{
  "success": true,
  "message": "access token produced",
  "accessToken": "..."
}
```

---

### ➤ Get Current User (Admin only)

**GET** `/api/auth/getuser`

✔ Protected route
✔ Requires Admin role

---

# 👨‍🎓 Student Routes

Base: `/api/students`

| Method | Endpoint | Access        | Description        |
| ------ | -------- | ------------- | ------------------ |
| POST   | `/`      | Admin         | Create student     |
| GET    | `/`      | Authenticated | Get all students   |
| GET    | `/:id`   | Authenticated | Get single student |
| PUT    | `/:id`   | Admin         | Update student     |
| DELETE | `/:id`   | Admin         | Delete student     |

---

# 📅 Class Schedule Routes

Base: `/api/class-schedules`

| Method | Endpoint | Access        |
| ------ | -------- | ------------- |
| POST   | `/`      | Admin         |
| GET    | `/`      | Authenticated |
| GET    | `/:id`   | Authenticated |
| PUT    | `/:id`   | Admin         |
| DELETE | `/:id`   | Admin         |

---

# 💳 Payment Routes

Base: `/api/payments`

| Method | Endpoint | Access        |
| ------ | -------- | ------------- |
| POST   | `/`      | Authenticated |
| GET    | `/`      | Admin         |
| GET    | `/:id`   | Admin         |
| PUT    | `/:id`   | Admin         |
| DELETE | `/:id`   | Admin         |

✔ Prevents duplicate monthly payments per student

---

# 📢 Announcement Routes

Base: `/api/announcements`

| Method | Endpoint | Access        |
| ------ | -------- | ------------- |
| POST   | `/`      | Admin         |
| GET    | `/`      | Authenticated |
| GET    | `/:id`   | Authenticated |
| PUT    | `/:id`   | Admin         |
| DELETE | `/:id`   | Admin         |

---

# 🏫 Section Routes

Base: `/api/sections`

| Method | Endpoint | Access |
| ------ | -------- | ------ |
| POST   | `/`      | Admin  |
| GET    | `/`      | Admin  |
| GET    | `/:id`   | Admin  |
| PUT    | `/:id`   | Admin  |
| DELETE | `/:id`   | Admin  |

---
