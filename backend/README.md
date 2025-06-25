

## 🧾 Backend - README.md

# 🔙 veegil-banking-app - Backend

This is the **NestJS** GraphQL backend API for the `veegil-banking-app`. It handles authentication, transaction management, and user data storage securely using JWT and MongoDB.

---
# 🔧 veegil-banking-app – Backend (NestJS + GraphQL)

This is the backend API for the Veegil Banking App. It is built with **NestJS**, **GraphQL**, **MongoDB**, and **JWT** authentication to manage secure banking transactions and user operations.

---

## 🔧 Local Setup

1. Navigate into the backend folder:

```bash
cd backend
npm install
Create a .env file using the template below:

env
Copy
Edit
MONGO_URI=mongodb://localhost:27017/veegil-banking
JWT_SECRET=your_jwt_secret_here
Start the development server:

bash
Copy
Edit
npm run start:dev
Access GraphQL playground at:
🔗 http://localhost:4000/graphql

📁 Structure
bash
Copy
Edit
backend/
├── src/
│   ├── auth/                 # Auth logic (JWT, guards)
│   ├── user/                 # User module
│   ├── transaction/          # Deposit & withdraw logic
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── main.ts
│   └── schema.gql            # Auto-generated (ignored)
├── seed.ts                   # Seeder for test data
├── .env                      # Environment config (ignored)
├── tsconfig.build.json
├── package.json
├── nest-cli.json
├── README.md
└── test/                     # Unit test files
✨ Features
✅ User signup/login with JWT

📱 Phone number = account number

💰 Deposit and Withdraw mutations

📜 Transaction history query

🔒 Protected routes using GqlAuthGuard

🧪 Over 70% test coverage with Jest

📄 Well-structured modules

🧪 Testing
To run tests with coverage:

bash
Copy
Edit
npm run test:cov
Expected output includes:

yaml
Copy
Edit
All files                     |   74.24 |       96 |   46.34 |   73.52 |
Test Suites: 5 passed, 5 total
Tests:       51 passed, 51 total
🔍 Sample GraphQL
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
      fullName
      phoneNumber
    }
  }
}
🙋‍♂️ whoAmI
Requires Authorization: Bearer <token>

graphql
Copy
Edit
query {
  whoAmI {
    fullName
    phoneNumber
    balance
  }
}
👤 Author
Fatai Sunmonu
GitHub: @FAS2024

📄 License
MIT License

yaml
Copy
Edit

---

Let me know if you want `.env.example` or seed scripts next!