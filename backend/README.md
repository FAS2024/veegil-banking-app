# 🔙 veegil-banking-app - Backend

This is the backend API for the Veegil Banking App. It is built with **NestJS**, **GraphQL**, **MongoDB**, and **JWT** authentication to manage secure banking transactions and user operations.

---

## 🔧 Local Setup

1. Navigate into the backend folder:

```bash
cd backend
npm install


=========================================================================================================================
Create a .env file using the template below:

MONGO_URI=mongodb://localhost:27017/veegil-banking
JWT_SECRET=your_jwt_secret_here


=========================================================================================================================
Start the development server:
npm run start:dev

Access GraphQL playground at:

Local
🔗 http://localhost:4000/graphql

Deployment
http://18.233.7.185:4000/graphql
=========================================================================================================================

📁 Structure

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



=========================================================================================================================
✨ Features
✅ User signup/login with JWT

📱 Phone number = account number

💰 Deposit and Withdraw mutations

📜 Transaction history query

🔒 Protected routes using GqlAuthGuard

🧪 Over 70% test coverage with Jest

📄 Well-structured modules


=========================================================================================================================

🧪 Testing
To run tests with coverage:

npm run test:cov    or     jest --coverage


Expected output includes:

All files                     |   74.24 |       96 |   46.34 |   73.52 |
Test Suites: 5 passed, 5 total
Tests:       51 passed, 51 total


=========================================================================================================================
🔍 Sample GraphQL

🔑 Login

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

query {
  whoAmI {
    fullName
    phoneNumber
    balance
  }
}


===============================================================================================================

## 👨‍💻 Author

**Fatai Sunmonu**  
- GitHub: [@FAS2024](https://github.com/FAS2024)  
- LinkedIn: [linkedin.com/in/fatai-sunmonu](https://linkedin.com/in/fatai-sunmonu)

===============================================================================================================
## 📄 License

This project is licensed under the [MIT License](https://opensource.org/license/MIT).

