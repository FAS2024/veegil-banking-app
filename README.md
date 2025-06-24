# 💼 veegil-banking-app

**veegil-banking-app** is a full-stack digital banking solution built with **NestJS**, **GraphQL**, and **MongoDB** on the backend, and **React** on the frontend. It allows users to securely sign up, log in, view balance, deposit, withdraw, and review their transaction history.

---

## 🧱 Tech Stack

### 🔙 Backend

* [NestJS](https://nestjs.com/) – Node.js framework
* [GraphQL (Apollo Server)](https://www.apollographql.com/docs/apollo-server/)
* [MongoDB + Mongoose](https://mongoosejs.com/)
* [Passport.js + JWT](http://www.passportjs.org/)

### 🔜 Frontend

* [React](https://reactjs.org/)
* [Apollo Client](https://www.apollographql.com/docs/react/)
* [Tailwind CSS](https://tailwindcss.com/) *(optional)*

---

## ✨ Features

* 🔐 JWT-based user authentication
* 🧾 User signup, login, and secure query access
* 👤 `whoAmI` query for current user info
* 💸 Deposit and Withdraw transactions
* 💰 Real-time balance display
* 📜 Transaction history (sorted and styled)
* 💾 MongoDB for data persistence
* 🧪 Unit tests with Jest
* 💡 Clean modular code architecture

---

## 📁 Project Structure

```
veegil-banking-app/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── transaction/
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── apollo/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### 🔧 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in the following:
# MONGO_URI=mongodb://localhost:27017/veegil-banking
# JWT_SECRET=your_secret_here
npm run start:dev
```

### 🖥 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Ensure Apollo Client endpoint is set to:

```
http://localhost:4000/graphql
```

---

## 🔍 Sample GraphQL Queries

### 🔑 Login

```graphql
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
```

### 🔐 whoAmI

Set request header:

```
Authorization: Bearer <your_token_here>
```

Query:

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

---

## ✅ Roadmap

* [x] User authentication with JWT
* [x] Protected GraphQL route (`whoAmI`)
* [x] Transactions & Wallet logic
* [x] Transaction history + balance display
* [ ] Role-based permissions (optional)
* [ ] Admin dashboard (optional)
* [ ] Email verification & password reset (optional)
* [ ] Docker & CI/CD setup (optional)
* [ ] 70%+ Test Coverage

---

## 🧪 Developer Notes

* Use Altair, Insomnia, or GraphQL Playground to test.
* Remove password from returned user object.
* Use `GqlAuthGuard` on protected routes.
* Round `amount` input to 2 decimals: `Math.round(val * 100) / 100`

---

## 🧑‍💻 Author

**Fatai Sunmonu**
GitHub: [@FAS2024](https://github.com/FAS2024)
LinkedIn: [linkedin.com/in/fatai-sunmonu](https://www.linkedin.com/in/fatai-sunmonu)

---

## 📄 License

MIT License
