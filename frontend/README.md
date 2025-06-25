
# 📲 veegil-banking-app - Frontend

This is the **React** frontend for the `veegil-banking-app`, a full-stack digital banking solution that communicates with a GraphQL backend API. It provides users with authentication, deposit/withdraw functionality, and transaction history.

---


Certainly! Here is the standalone frontend README.md for your project:

markdown
Copy
Edit
# 🖥️ veegil-banking-app – Frontend (React)

This is the frontend of the Veegil Banking App, built with **React**, **Apollo Client**, and **Tailwind CSS**. It connects to a NestJS GraphQL backend to allow users to sign up, log in, view balances, deposit, withdraw, and track their transaction history.

---

## 🔧 Local Setup

1. Navigate into the frontend folder:

```bash
cd frontend
npm install
Create a .env file using the example below:

env
Copy
Edit
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
Start the React app:

bash
Copy
Edit
npm start
Ensure the backend server is already running on port 4000.

🌐 Hosted App
The full app is deployed to:
🔗 https://veegil-banking-app.herokuapp.com

📁 Structure
bash
Copy
Edit
frontend/
├── src/
│   ├── apollo/              # Apollo client setup
│   ├── components/          # Reusable components
│   ├── context/             # Auth context
│   ├── graphql/             # Queries and mutations
│   ├── App.tsx              # Main app component
│   ├── App.test.tsx         # React test file
│   ├── index.tsx            # Entry point
│   └── ...
├── public/
├── .env                     # Local environment config (ignored)
├── package.json
├── tsconfig.json
└── README.md
✨ Features
🔐 User login via JWT

📲 Real-time balance updates

💸 Deposit & withdrawal forms

📜 Transaction history display

🔁 State managed via React Context and Apollo

⚛️ Clean component-based structure

🧪 Testing
bash
Copy
Edit
npm test
Runs all React unit tests.

👤 Author
Fatai Sunmonu
GitHub: @FAS2024

📄 License
MIT License

yaml
Copy
Edit

---

Let me know when you want the backend README next!








