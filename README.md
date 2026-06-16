# RateHub – Store Rating Platform

A full-stack web app where users can discover and rate stores. Built with **Express.js + MySQL** (backend) and **React** (frontend).

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MySQL connection pool
│   │   │   └── schema.sql      # DB schema + seed data
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   └── storeController.js
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT authenticate + authorize
│   │   │   └── validate.js     # express-validator rules
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   └── stores.js
│   │   └── index.js            # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js         # Axios instance + interceptors
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── AppLayout.jsx    # Sidebar + outlet wrapper
    │   │   ├── SortableTable.jsx
    │   │   └── StarRating.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminUsers.jsx
    │   │   │   ├── AdminStores.jsx
    │   │   │   ├── AdminAddUser.jsx
    │   │   │   ├── AdminAddStore.jsx
    │   │   │   └── AdminUserDetail.jsx
    │   │   ├── user/
    │   │   │   ├── UserStores.jsx
    │   │   │   └── UserPassword.jsx
    │   │   └── owner/
    │   │       ├── OwnerDashboard.jsx
    │   │       └── OwnerPassword.jsx
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## Prerequisites

- **Node.js** v18+
- **MySQL** 8.0+
- **npm** v9+

---

## Setup Instructions

### 1. Clone / extract the project

```bash
cd store-rating-app
```

### 2. Set up MySQL Database

```bash
# Log into MySQL
mysql -u root -p

# Run the schema file
source backend/src/config/schema.sql;
# or:
mysql -u root -p < backend/src/config/schema.sql
```

This creates the `store_rating_db` database, all tables, and a default admin user.

**Default Admin Credentials:**
- Email: `admin@storerating.com`
- Password: `Admin@1234`

### 3. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=change_this_to_a_long_random_secret
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Running the App

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev       # development with nodemon
# or
npm start         # production
```

Backend runs at: `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register normal user |
| POST | `/api/auth/login` | Login (all roles) |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/password` | Update password |

### Admin (requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats totals |
| GET | `/api/admin/users` | List users (filterable) |
| GET | `/api/admin/users/:id` | User detail |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/stores` | List stores (filterable) |
| POST | `/api/admin/stores` | Create store |

### Stores
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | Browse stores (normal_user) |
| POST | `/api/stores/:id/rating` | Submit/update rating |
| GET | `/api/stores/owner/dashboard` | Owner's store + raters |

---

## User Roles & Access

| Role | Access |
|------|--------|
| **Admin** | Dashboard stats, manage all users & stores |
| **Normal User** | Browse/search stores, submit ratings, change password |
| **Store Owner** | View own store dashboard with ratings, change password |

---

## Form Validation Rules

| Field | Rule |
|-------|------|
| Name | Min 20, Max 60 characters |
| Address | Max 400 characters |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| Email | Standard email format |
| Rating | Integer between 1 and 5 |

---

## Tech Stack

- **Backend:** Node.js, Express.js, MySQL2, JWT, bcryptjs, express-validator
- **Frontend:** React 18, React Router v6, Axios, react-hot-toast, lucide-react
- **Database:** MySQL 8 with normalized schema, indexes, foreign keys
