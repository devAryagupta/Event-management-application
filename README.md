# Event Management Application

Full-stack event management system with timezone-aware scheduling, availability checks, role-based visibility, and audit logs.

## Live demo


| App                       | URL                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend (login here)** | [https://event-management-application-alpha.vercel.app/login](https://event-management-application-alpha.vercel.app/login)                     |
| Backend API               | [https://event-management-application-backend-zl29.onrender.com](https://event-management-application-backend-zl29.onrender.com)               |
| Health check              | [https://event-management-application-backend-zl29.onrender.com/health](https://event-management-application-backend-zl29.onrender.com/health) |


## Quick start (test the deployed app)

1. Open the frontend login page:
  [https://event-management-application-alpha.vercel.app/login](https://event-management-application-alpha.vercel.app/login)
2. Sign in with one of the test accounts below.
3. Try:
  - Create / edit / delete an event
  - Add or remove attendees
  - View event logs
  - Change your timezone and confirm event times update in the UI



## Test credentials



### Admin

- **Email:** `arya@example.com`
- **Password:** `secret123`



### Regular users


| Email              | Password    |
| ------------------ | ----------- |
| `abhi@testing.com` | `secret123` |
| `aysh@testing.com` | `secret123` |


Admin can view all meetings. Regular users only see meetings they are part of.

## Local development



### Backend

```bash
npm install
# create root .env (see variables below)
npm run dev
```

API runs at `http://localhost:3000`.

### Frontend

```bash
cd Frontend/client
npm install
npm run dev
```

UI runs at `http://localhost:5173` and proxies `/api` to the local backend.

### Required backend `.env`

```env
PORT=3000
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_NAME=
DB_PORT=5432
JWT_SECRET=
JWT_EXPIRATION=8h
FRONTEND_URL=http://localhost:5173
```



### Frontend env (local)

Leave empty so Vite proxy is used:

```env
VITE_API_BASE_URL=
```



### Frontend env (production / Vercel)

```env
VITE_API_BASE_URL=https://event-management-application-backend-zl29.onrender.com/api
```



## Tech stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT
- **Hosting:** Vercel (frontend) + Render (backend)

