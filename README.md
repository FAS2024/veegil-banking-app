# 💼 veegil-banking-app

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**veegil-banking-app** is a full-stack digital banking solution built with **NestJS**, **GraphQL**, and **MongoDB** on the backend, and **React** on the frontend. It allows users to securely sign up, log in, view balance, deposit, withdraw, and review their transaction history.

---

## 🧱 Tech Stack

### 🔙 Backend

- [NestJS](https://nestjs.com/) – Node.js framework
- [GraphQL (Apollo Server)](https://www.apollographql.com/docs/apollo-server/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Passport.js + JWT](http://www.passportjs.org/)

### 🔜 Frontend

- [React](https://reactjs.org/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Tailwind CSS](https://tailwindcss.com/) *(optional)*

---

## ✨ Features

- 🔐 JWT-based user authentication
- 🧾 User signup, login, and secure query access
- 👤 `whoAmI` query for current user info
- 💸 Deposit and Withdraw transactions
- 💰 Real-time balance display
- 📜 Transaction history (sorted and styled)
- 💾 MongoDB for data persistence
- 🧪 Unit tests with Jest
- 💡 Clean modular code architecture

---

## 📁 Project Structure

veegil-banking-app/
├── backend/
│ ├── src/
│ │ ├── auth/
│ │ ├── user/
│ │ ├── transaction/
│ │ └── main.ts
│ ├── .env.example
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── apollo/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.tsx
│ ├── .env
│ └── package.json
│
└── README.md

yaml
Copy
Edit

---

## ⚙️ Getting Started

### 🔧 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Then set values inside .env:
# MONGO_URI=mongodb://localhost:27017/veegil-banking
# JWT_SECRET=your_secret_here
npm run start:dev
🖥 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start
Make sure your Apollo Client endpoint is set to:

bash
Copy
Edit
http://localhost:4000/graphql
✅ Tests
To run all unit tests with coverage:

bash
Copy
Edit
cd backend
npm run test:cov
📊 Sample Output
bash
Copy
Edit
 PASS  src/transaction/transaction.service.spec.ts
 PASS  src/auth/strategies/jwt.strategy.spec.ts
 PASS  src/app.controller.spec.ts
 PASS  src/user/user.resolver.spec.ts
 PASS  src/user/user.service.spec.ts
------------------------------|---------|----------|---------|---------|-------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------------|---------|----------|---------|---------|-------------------
All files                     |   74.24 |       96 |   46.34 |   73.52 |
...
Test Suites: 5 passed, 5 total  
Tests:       51 passed, 51 total  
Snapshots:   0 total  
Time:        82.333 s  
Ran all test suites.
🔍 Sample GraphQL Queries
🔑 Login
graphql
Copy
Edit
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
🔐 whoAmI
Set header:

makefile
Copy
Edit
Authorization: Bearer <your_token_here>
Then query:

graphql
Copy
Edit
query {
  whoAmI {
    _id
    fullName
    phoneNumber
    balance
  }
}
🧭 Roadmap
 User authentication with JWT

 Protected GraphQL route (whoAmI)

 Transactions & Wallet logic

 Transaction history + balance display

 Role-based permissions (optional)

 Admin dashboard (optional)

 Email verification & password reset (optional)

 Docker & CI/CD setup (optional)

 75%+ Test Coverage

🧪 Developer Notes
Use Altair, Insomnia, or GraphQL Playground to test queries.

Always round amount values:
Math.round(amount * 100) / 100

Use GqlAuthGuard on all protected routes.

Never return passwords in GraphQL responses.

👨‍💻 Author
Fatai Sunmonu
GitHub: @FAS2024
LinkedIn: linkedin.com/in/fatai-sunmonu

📄 License
Licensed under the MIT License.

vbnet
Copy
Edit

Let me know if you’d like help creating a badge for test coverage or auto-generating a table of contents.






