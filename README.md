# 💼 veegil-banking-app

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**veegil-banking-app** is a full-stack digital banking solution developed using **NestJS** (with GraphQL) and **React**, built for the Veegil Technologies Fullstack Developer Assessment. The app enables users to sign up, log in, deposit, withdraw, and view transaction history — all within a secure, token-based environment.

> 🔒 **Disclaimer**: This project is intended solely for assessment by Veegil Technologies.  
> Unauthorized reproduction or distribution is strictly prohibited.

===============================================================================================================

## 🧾 Full Name (as on Indeed)

**Fatai Sunmonu**

===============================================================================================================

## 🔐 Login Guide

Use the following test account credentials (already seeded in the database):

Phone Number: 09090909090 
Password: 909090

===============================================================================================================

> You can log in through the web interface or directly via GraphQL Playground.

---

## 🚀 Hosted Application Link

- 🌍 **Live Fullstack App (Frontend + Backend on one Heroku app)**  
  [https://veegil-banking-app.herokuapp.com](https://veegil-banking-app.herokuapp.com)

- ⚙️ **GraphQL Playground**  
  [https://veegil-banking-app.herokuapp.com/graphql](https://veegil-banking-app.herokuapp.com/graphql)

---

===============================================================================================================

## 🧪 How to Test the App

### ✅ Option 1: Online (Recommended)

1. Visit: [https://veegil-banking-app.herokuapp.com](https://veegil-banking-app.herokuapp.com)  
2. Log in with the test credentials above  
3. Use the UI to:  
   - View current balance  
   - Make deposits and withdrawals  
   - View full transaction history  

> You can also use GraphQL Playground at `/graphql` with Bearer token authentication.

---

### ✅ Option 2: Local Testing

```bash
# Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env and set values for:
# MONGO_URI=mongodb://localhost:27017/veegil-banking
# JWT_SECRET=yourSecretKey
npm run start:dev

# Frontend Setup
cd ../frontend
npm install
npm start
===============================================================================================================

Ensure your frontend GraphQL endpoint is set to:

http://localhost:4000/graphql


backend/.env.example
# Port the backend server runs on
PORT=4000

# MongoDB connection string (replace with your own credentials and cluster info)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority

# Secret key for signing JWT tokens
JWT_SECRET=<your_jwt_secret>

# Token expiration time
JWT_EXPIRATION=3600s

# Frontend URL (used for CORS and redirects)
FRONTEND_URL=https://<your_frontend_url>



frontend/.env.example

# GraphQL API endpoint for the React frontend
REACT_APP_GRAPHQL_API=https://<your_backend_url>/graphql

===============================================================================================================

🧪 Running Backend Tests

cd backend
npm run test:cov
Sample output:

All files                     |   74.24 |       96 |   46.34 |   73.52 |
Test Suites: 5 passed, 5 total  
Tests:       51 passed, 51 total  
Test coverage is above the required 70%.

===============================================================================================================

🔍 Sample GraphQL Queries
🔑 Login

mutation {
  login(input: {
    phoneNumber: "07066623544",
    password: "securePass123"
  }) {
    token
    user {
      _id
      fullName
      phoneNumber
    }
  }
}


🧍‍♂️ whoAmI (Authenticated)
Set header:
Authorization: Bearer <your_token_here>

query {
  whoAmI {
    _id
    fullName
    phoneNumber
    balance
  }
}


=========================================================================================================================
🧱 Tech Stack
Backend

NestJS (Node.js)

GraphQL (Apollo Server)

MongoDB + Mongoose

Passport.js + JWT

Frontend

React

Apollo Client

Tailwind CSS (optional)

===============================================================================================================

✨ Features

🔐 JWT-based Authentication

📱 Phone Number = Account Number

💸 Deposit and Withdraw Funds

🧾 Transaction History

💰 Real-Time Balance Display

📊 Seeded Data for Evaluation

🧪 70%+ Test Coverage (Jest)

===============================================================================================================

📁 Final Project Structure

veegil-banking-app/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── transaction/
│   │   ├── app.controller.ts
│   │   ├── app.controller.spec.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── schema.graphql
│   │   └── main.ts
│   ├── test/
│   ├── coverage/
│   ├── dist/
│   ├── seed.ts
│   ├── nest-cli.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   ├── .gitignore
│   ├── .prettierrc
│   ├── eslint.config.mjs
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── apollo/
│   │   ├── components/
│   │   ├── context/
│   │   ├── graphql/
│   │   ├── apolloClient.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   ├── build/
│   ├── build.json
│   ├── .gitignore
│   ├── tsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── LICENSE
├── .gitignore
└── README.md

===============================================================================================================

🧠 Developer Notes
Use GqlAuthGuard to secure routes

Always round amounts: Math.round(amount * 100) / 100

Use GraphQL Playground or Postman for manual testing

Do NOT expose passwords in any API response


==========================================================================================================================
📝 Additional Notes
The app has been tested on multiple devices to ensure functionality and accessibility

GraphQL Playground requires Bearer token in header for authenticated queries


==========================================================================================================================
📬 Submission Checklist
 Added hr@veegil.com as a developer on the private GitLab repo (not via a group)

 Included this README.md in the root of the parent folder

 Included login credentials (see above)

 Included link to hosted Heroku app (see above)

 Hosted app tested on a second device (outside dev machine)

 Code organized into backend and frontend folders inside one parent project folder

===============================================================================================================

👨‍💻 Author

**Fatai Sunmonu**  
- GitHub: [@FAS2024](https://github.com/FAS2024)  
- LinkedIn: [https://linkedin.com/in/fatai-sunmonu](https://linkedin.com/in/fatai-sunmonu)


===============================================================================================================

📄 License
This project is licensed under the MIT License.