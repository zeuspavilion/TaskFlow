# ⚡ TaskFlow - Smart Task & Priority Management

A modern, full-stack, dark-themed To-Do application built with **React Native CLI (TypeScript)**, **Node.js/Express**, and **MongoDB**. Designed with a focus on visual excellence, performance, and rich productivity features including JWT authentication, intelligent urgency ranking, multi-criteria filtering, and analytics.

---

## ✨ Features Overview

### 🔐 1. Secure Authentication & Session Management
- **User Registration & Login**: Validated email and password credentials with instant feedback.
- **Secure Password Hashing**: Hashed using `bcryptjs` (10 salt rounds).
- **Stateless JWT Authorization**: JWT-based session security with Bearer token authentication.
- **Persistent Sessions**: Auto-restores user login states across app restarts using `@react-native-async-storage`.
- **Demo Quick-Fill**: 1-tap demo credentials loader (`demo@taskflow.io` / `password123`) for rapid testing.

### 📝 2. Advanced Task Management (CRUD)
- **Create**: Add tasks with **Title, Description, Scheduled Date-Time, Deadline Date-Time, Priority Level, and Category Tag**.
- **Read & View**: Live task feed with priority color ribbons, countdown tags, and completion checkboxes.
- **Update**: Edit any task details or toggle completion status with instant visual confirmation.
- **Delete**: Remove tasks with confirmation alerts to prevent accidental loss.

### 🧠 3. Smart Mix Urgency Algorithm (Bonus)
In addition to standard sorting options (Deadline, Priority, Scheduled Time, and Date Created), TaskFlow includes an **Intelligent Urgency Ranking Engine**:

$$\text{Urgency Score} = \text{Priority Weight} + \text{Deadline Proximity} + \text{Scheduled Alignment} - \text{Completion Penalty}$$

- **Priority Weights**: High (`+350 pts`), Medium (`+200 pts`), Low (`+100 pts`).
- **Deadline Proximity**: Overdue tasks trigger a critical alert score boost (`+500` to `+700 pts`). Tasks due within 12h–24h scale up exponentially.
- **Scheduled Today**: Tasks scheduled for the current day receive an active focus boost (`+50 pts`).
- **Completed Tasks**: Deprioritized to the bottom (`-10,000 pts`).

### 🔍 4. Multi-Criteria Filtering & Real-Time Search
- **Instant Search**: Real-time filtering across titles and descriptions.
- **Status Filter**: `All`, `Pending`, `Completed`.
- **Priority Filter**: `All`, `High`, `Medium`, `Low`.
- **Category Tags**: Tag-based chip filtering (`#Work`, `#Personal`, `#Study`, `#Health`, `#Finance`, `#Urgent`, `#General`).

### 📊 5. Analytics & Dashboard Insights
- Productivity progress meter with live completion percentage ($0-100\%$).
- Task counters for Pending, Completed, Overdue, and High Priority tasks.
- Category breakdown and priority distribution charts.

### 🛡️ 6. Zero-Downtime Backend Database Fallback
- Dual database support: Connects to local/remote MongoDB instances seamlessly.
- **Automatic In-Memory Failover**: Automatically provisions an embedded MongoDB engine with pre-seeded demo tasks if external MongoDB services are offline.

---

## 🏗️ Architecture & Project Structure

```
TaskFlow/
├── backend/
│   ├── src/
│   │   ├── controllers/       # authController.ts, taskController.ts
│   │   ├── middleware/        # auth.ts (JWT verification)
│   │   ├── models/            # User.ts, Task.ts (Mongoose schemas)
│   │   ├── routes/            # authRoutes.ts, taskRoutes.ts
│   │   ├── utils/             # sorting.ts (Urgency scoring logic)
│   │   └── server.ts          # Express app entry & database connection
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── tsconfig.json
│
└── mobile/
    ├── src/
    │   ├── api/               # client.ts (Axios + auto JWT interceptor + failover)
    │   ├── components/        # CustomButton, CustomInput, TaskCard, PriorityBadge, etc.
    │   ├── context/           # AuthContext.tsx, TaskContext.tsx
    │   ├── navigation/        # RootNavigator.tsx, AuthNavigator.tsx, TabNavigator.tsx
    │   ├── screens/           # HomeScreen, AddEditTaskScreen, TaskDetailsScreen, ProfileScreen, AnalyticsScreen
    │   ├── theme/             # Modern obsidian dark color palette & styling tokens
    │   ├── types/             # TypeScript data models & navigation types
    │   └── utils/             # dateUtils.ts, sorting.ts
    ├── App.tsx                # App entry with Context Providers
    ├── index.js               # React Native CLI registry
    ├── package.json
    └── tsconfig.json
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Mobile App** | React Native CLI (`0.76.6`), TypeScript |
| **Navigation** | React Navigation 7 (Native Stack + Bottom Tabs) |
| **Local Storage** | `@react-native-async-storage/async-storage` |
| **Backend API** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB, Mongoose, `mongodb-memory-server` (failover) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Network Client** | Axios (with auto JWT interceptor & USB/Wi-Fi auto-fallback) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Java JDK** (JDK 17 recommended)
- **Android Studio & SDK** (Android SDK Platform 34+, Android SDK Build-Tools)

---

### 2. Backend Setup & Run

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file (or use default configuration):
   ```bash
   cp .env.example .env
   ```
4. Build and start the server:
   ```bash
   npm run build
   npm start
   ```
5. The server will run on `http://0.0.0.0:5000`. You can test health at:
   ```
   GET http://localhost:5000/api/health
   ```

---

### 3. Mobile App Setup & Run (Android)

1. Navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Connect your Android device via USB (with USB Debugging enabled) or start an Android Emulator.
4. Set up port forwarding (for physical devices over USB):
   ```bash
   adb reverse tcp:5000 tcp:5000
   adb reverse tcp:8081 tcp:8081
   ```
5. Build and run the app on Android:
   ```bash
   npm run android
   ```

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user profile | **Yes (Bearer Token)** |

### 📋 Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Get filtered & sorted tasks list | **Yes (Bearer Token)** |
| `POST` | `/api/tasks` | Create a new task | **Yes (Bearer Token)** |
| `GET` | `/api/tasks/stats` | Retrieve productivity dashboard statistics | **Yes (Bearer Token)** |
| `GET` | `/api/tasks/:id` | Get details of a single task | **Yes (Bearer Token)** |
| `PUT` | `/api/tasks/:id` | Update task fields or toggle completion | **Yes (Bearer Token)** |
| `DELETE` | `/api/tasks/:id` | Delete a task | **Yes (Bearer Token)** |

---

## 👤 Default Demo Credentials

For quick evaluation without manual registration, you can use:
- **Email:** `demo@taskflow.io`
- **Password:** `password123`
