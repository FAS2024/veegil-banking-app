---
## 🧾 Frontend - README.md

# 📲 veegil-banking-app - Frontend

This is the **React** frontend for the `veegil-banking-app`, a full-stack digital banking solution that communicates with a GraphQL backend API. It provides users with authentication, deposit/withdraw functionality, and transaction history.

---

## 🔧 Tech Stack

- React
- TypeScript
- Apollo Client
- GraphQL
- Tailwind CSS *(optional)*

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14
- Backend GraphQL API running at `http://localhost:3000/graphql`

### Installation
```bash
cd frontend
npm install
```

### Start the app
```bash
npm start
```

---

## 📁 Folder Structure
```
frontend/
├── src/
│   ├── apollo/         # Apollo Client setup
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components (e.g. Signup, Login, Transaction)
│   ├── App.tsx         # Routing and layout
├── .env                # Environment config (API endpoint)
├── package.json
```

---

## ✅ Features

- Signup and login using phone number & password
- Make deposits or withdrawals
- View current balance (live update)
- View transaction history (styled)
- Apollo Client + GraphQL integration

---

## 🔐 Auth Headers
All authenticated requests automatically attach JWT via Apollo Link.

---

## 👨‍💻 Developer
Fatai Sunmonu  
GitHub: https://github.com/FAS2024  

---

