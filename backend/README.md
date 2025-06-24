

## 🧾 Backend - README.md

# 🔙 veegil-banking-app - Backend

This is the **NestJS** GraphQL backend API for the `veegil-banking-app`. It handles authentication, transaction management, and user data storage securely using JWT and MongoDB.

---

## ⚙️ Tech Stack

- NestJS
- GraphQL (Apollo Server)
- MongoDB + Mongoose
- JWT + Passport.js
- TypeScript

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14
- MongoDB running locally or in the cloud

### Installation
```bash
cd backend
npm install
cp .env.example .env
```

### Configure Environment
Edit `.env` file with:
```
MONGO_URI=mongodb://localhost:27017/veegil-banking
JWT_SECRET=your_jwt_secret_here
```

### Run the server
```bash
npm run start:dev
```

---

## 📁 Folder Structure
```
backend/
├── src/
│   ├── auth/         # JWT strategy, guards, decorators
│   ├── user/         # User schema, resolver, service
│   ├── transaction/  # Transaction logic
│   ├── main.ts       # App entry point
│   └── app.module.ts # Module imports
├── .env.example
├── package.json
```

---

## 🔐 Auth
- Signup/Login returns JWT.
- All protected routes require Bearer token via `Authorization` header.

---

## 🔍 Sample GraphQL Queries

### Login
```graphql
mutation {
  login(input: { phoneNumber: "07012345678", password: "123456" }) {
    token
    user {
      _id
      fullName
    }
  }
}
```

### Get Authenticated User
```graphql
query {
  whoAmI {
    _id
    fullName
    phoneNumber
  }
}
```

---

## 🧪 Testing
```bash
npm run test:cov
```
Target: > 70% coverage (unit + e2e)

---

## 👨‍💻 Developer
Fatai Sunmonu  
GitHub: https://github.com/FAS2024  

---

## 📄 License
MIT
