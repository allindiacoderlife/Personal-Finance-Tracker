# 🧾 FinTrack - Personal Finance Tracker

A modern, full-stack Personal Finance & Budget Tracker built with **React**, **Tailwind CSS**, **Recharts**, **Node.js**, **Express**, and **MongoDB**.

---

## 🌟 Key Features

* **🔐 Authentication & Security**:
  * User Registration & Login with **JWT (JSON Web Tokens)**.
  * Passwords securely hashed with **bcryptjs** (salt rounds = 10).
  * Protected frontend routes and JWT bearer authorization middleware on backend.
  * Demo credentials 1-click auto-fill for quick testing.

* **💰 Transaction Management (CRUD)**:
  * Add, view, edit, and delete income and expense transactions.
  * Categorization (Salary, Freelance, Food, Housing, Utilities, Shopping, Entertainment, etc.).
  * Formatted currency and date handling using native `Intl` API.

* **📊 Interactive Visual Analytics**:
  * **Expense Breakdown Donut Chart** (Recharts) with animated tooltips and category legends.
  * **Monthly Trends Cash Flow Bar Chart** comparing Income vs. Expense over the last 6 months.

* **🔍 Live Filtering & Search**:
  * Search by transaction title, notes, or category.
  * Filter pills: `All Types`, `Income`, `Expense`.
  * Category dropdown filtering.
  * Quick date presets: `All Time`, `This Month`, `Last 30 Days`.

* **📤 Data Export (Bonus Feature)**:
  * 1-click **Export to CSV** for records backup or accountant reports.

* **📱 Modern & Responsive UI**:
  * Clean, responsive layout crafted with **Tailwind CSS**.
  * Real-time toast feedback (`react-hot-toast`) on actions.
  * Loading indicators and empty states.

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Recharts, Lucide Icons, Axios, React Router v7 |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, Morgan, CORS |
| **Database** | MongoDB & Mongoose ORM |
| **Deployment** | Vercel (Client), Render / Railway (Backend) |

---

## 📁 Project Structure

```text
Personal-Finance-Tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Auth & Transaction controllers
│   │   ├── middleware/      # JWT auth & error handler middlewares
│   │   ├── models/          # User & Transaction Mongoose models
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # JWT helper & MongoDB seeder script
│   │   └── server.js        # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute wrapper
│   │   │   ├── charts/      # Recharts CategoryPie & MonthlyBar
│   │   │   ├── common/      # Navbar
│   │   │   └── dashboard/   # StatCards, FilterBar, TransactionList, TransactionModal
│   │   ├── context/         # AuthContext & TransactionContext
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js       # Vite configuration with proxy and Tailwind
│   ├── vercel.json          # SPA routing rewrite rule for Vercel
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** v18+ (tested on Node v24)
* **MongoDB Atlas URI** or local MongoDB running on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env from template
cp .env.example .env
# Set your MONGO_URI and JWT_SECRET in .env

# Optional: Seed realistic demo data and user (demo@finance.com / demo1234)
npm run seed

# Run backend development server
npm run dev
# Server starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Run frontend development server
npm run dev
# App starts on http://localhost:5173
```

Visit **http://localhost:5173** in your browser. Use the **Auto Fill** demo button on the login screen or register a new user!

---

## 📡 REST API Documentation

### Auth Endpoints
* `POST /api/auth/register` - Create new user account.
* `POST /api/auth/login` - Authenticate user & return JWT token.
* `GET /api/auth/me` - Retrieve current user profile (*Protected*).

### Transaction Endpoints (*All Protected*)
* `GET /api/transactions` - Fetch user transactions with filters (`type`, `category`, `startDate`, `endDate`, `search`, `sortBy`, `order`).
* `POST /api/transactions` - Create transaction (`title`, `amount`, `type`, `category`, `date`, `notes`).
* `GET /api/transactions/:id` - Fetch transaction details.
* `PUT /api/transactions/:id` - Update transaction.
* `DELETE /api/transactions/:id` - Delete transaction.
* `GET /api/transactions/summary` - Aggregate totals, category distribution, and monthly trend data.
* `GET /api/transactions/export` - Export all transactions as CSV.

---

## 🌐 Deployment Instructions

### Option 1: 1-Click Full-Stack Deployment on Vercel (Recommended)
This repository is pre-configured with a root `vercel.json` and `api/index.js` serverless function handler. Both the React frontend and Express backend can run directly on Vercel!

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/new), click **"Add New Project"** and import your `Personal-Finance-Tracker` GitHub repository.
3. Keep the **Root Directory** as `./` (default).
4. Under **Environment Variables**, add:
   * `MONGO_URI`: `mongodb+srv://...` (your MongoDB Atlas connection string)
   * `JWT_SECRET`: your secure JWT secret string
   * `NODE_ENV`: `production`
5. Click **Deploy**. Vercel will:
   * Build the React frontend into `client/dist`.
   * Deploy the Express API as a serverless function at `/api/*`.

---

### Option 2: Frontend on Vercel + Backend on Render/Railway
If you prefer running your Node.js backend on a dedicated server (e.g. Render or Railway):

#### Frontend (Vercel)
1. In Vercel, set the **Root Directory** to `client`.
2. Add environment variable:
   * `VITE_API_URL`: `https://<your-deployed-backend-url>/api`
3. Click **Deploy**.

#### Backend (Render / Railway)
1. In Render, select **New Web Service** and set the Root Directory to `backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `PORT=5000`.

