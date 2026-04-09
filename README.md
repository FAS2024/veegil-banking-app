# veegil-banking-app

A full-stack digital banking demo built with NestJS, GraphQL, MongoDB, and React.  
This project started as a technical assessment and is now maintained as a portfolio project to demonstrate production-oriented full-stack engineering skills.

## Why This Project

- End-to-end authentication with JWT
- Clean GraphQL API with protected resolvers
- Transaction workflows (deposit, withdraw, history)
- Test coverage on backend business logic
- CI-ready and recruiter-friendly architecture

## Tech Stack

- Backend: NestJS, GraphQL (Apollo), MongoDB (Mongoose), Passport JWT
- Frontend: React, TypeScript, Apollo Client, React Router
- Testing: Jest, Supertest, React Testing Library

## Project Structure

```text
veegil-banking-app/
  backend/    # NestJS + GraphQL API
  frontend/   # React client
```

## Local Setup

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set environment values in `backend/.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/veegil-banking
JWT_SECRET=change_me
JWT_EXPIRATION=3600s
FRONTEND_URL=http://localhost:5173
```

Start backend:

```bash
npm run start:dev
```

GraphQL endpoint:

- `http://localhost:4000/graphql`
- Health check: `http://localhost:4000/health`

### 2) Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` (or `.env.local`) with:

```env
VITE_GRAPHQL_API=http://localhost:4000/graphql
```

Start frontend:

```bash
npm start
```

App URL:

- `http://localhost:5173` (Vite default)
- If `5173` is in use, Vite automatically picks the next free port (for example `5174`)

## Demo Credentials

Seeded test user:

- Phone Number: `07070707070`
- Password: `707070`

## Testing

Backend:

```bash
cd backend
npm test
npm run test:cov
```

Frontend:

```bash
cd frontend
npm test
```

## CI Pipeline

A GitHub Actions workflow is included at `.github/workflows/ci.yml` and runs:

- backend tests and build
- frontend tests and build

This gives recruiters a quick signal that the codebase is maintained and verifiable.

## Containerized Deployment

Docker support is included for backend, frontend, and MongoDB:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`

Run with Docker Compose:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend GraphQL: `http://localhost:4000/graphql`
- Backend health check: `http://localhost:4000/health`

## Production Readiness Notes

- GraphQL Playground and introspection are disabled when `NODE_ENV=production`
- Backend request validation is globally enabled (`whitelist`, `transform`, `forbidNonWhitelisted`)
- Backend security headers are enabled with `helmet`
- Backend HTTP request logging is enabled with `morgan`
- Environment templates are included in `backend/.env.example` and `frontend/.env.example`

## API Quick Examples

Login mutation:

```graphql
mutation {
  login(input: { phoneNumber: "07070707070", password: "707070" }) {
    token
    user {
      _id
      fullName
      phoneNumber
    }
  }
}
```

Authenticated user query:

```graphql
query {
  whoAmI {
    _id
    fullName
    phoneNumber
    balance
  }
}
```

Use header:

```text
Authorization: Bearer <token>
```

## Portfolio Notes

- Built and maintained by Fatai Sunmonu
- Focus areas: backend correctness, clear architecture, and practical UX
- Open to remote full-stack opportunities

## License

MIT
