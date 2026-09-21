# ⚡ TaskFlow - React Native (TypeScript) & Node.js/MongoDB Full-Stack To-Do App

A full-stack, dark-mode To-Do application for Android built with **React Native CLI (TypeScript)**, **Node.js/Express**, and **MongoDB**. Features secure JWT authentication, multi-criteria filtering, task deadline countdowns, priority classification, and a **Smart Mix Urgency Algorithm**.

---

## 📌 Repository Analysis (Requested Evaluation)

| Repository | Can We Use It in React Native? | Technical Rationale & Strategy |
| :--- | :---: | :--- |
| **[`unovue/inspira-ui`](https://github.com/unovue/inspira-ui)** | ❌ **No (Directly)** | Inspira UI is built for **Vue 3 / Nuxt** using browser HTML tags (`div`, `span`, CSS). React Native renders native components (`View`, `Text`). **Strategy Used**: We recreated its aesthetics natively: deep obsidian theme (`#0B0F19`), neon glowing borders, status badges, and glassmorphism-inspired cards. |
| **[`imskyleen/animate-ui`](https://github.com/imskyleen/animate-ui)** | ❌ **No (Directly)** | Uses Web React DOM and Framer Motion. **Strategy Used**: We implemented native touch feedbacks, micro-animations, completion strikes, and smooth modal transitions. |
| **[`darkroomengineering/lenis`](https://github.com/darkroomengineering/lenis)** | ❌ **No** | Lenis is a web browser smooth-scroller (`window.scrollTo`). React Native natively provides 60/120 FPS hardware-accelerated momentum scrolling via `FlatList` and `ScrollView`. |

---

## 🚀 Key Features

### 🔐 1. User Authentication & Security
- User registration and login with email and password.
- Password hashing with **`bcryptjs`** (salt rounds: 10).
- Stateless **JWT (JSON Web Tokens)** session authentication.
- Auto-login on app launch with token persistence in **`AsyncStorage`**.
- Automatic token expiration handling and logout cleanup.

### 📝 2. Advanced Task Management (CRUD)
- **Create**: Tasks with Title, Description, Scheduled Date-Time, Deadline Date-Time, Priority, and Category tag.
- **Read**: Live task list with status pills, priority badges, and countdown indicators.
- **Update**: Edit any task property or toggle completion status in 1 tap.
- **Delete**: Soft or permanent task deletion with confirmation alert.

### 🧠 3. Smart Mix Sorting Algorithm (Bonus)
In addition to standard sorting by Deadline, Priority, and Date Created, the app features an **Intelligent Urgency Ranking Engine**:
$$\text{Urgency Score} = \text{Priority Weight} + \text{Deadline Proximity Bonus} + \text{Scheduled Alignment} - \text{Completion Penalty}$$
- **Priority Weights**: High (+350 pts), Medium (+200 pts), Low (+100 pts).
- **Deadline Proximity**: Overdue tasks trigger a critical alert score boost (+500 to +700 pts). Tasks due within 12h–24h scale up exponentially.
- **Scheduled Today**: Tasks scheduled for the current day receive an active focus boost (+50 pts).
- **Completed Tasks**: Sunk to the bottom (-10,000 pts).

### 🔍 4. Multi-Criteria Filtering & Search
- **Instant Search**: Matches titles and descriptions in real time.
- **Status Filter**: All, Pending, Completed.
- **Priority Filter**: All, High, Medium, Low.
- **Category Filter**: Horizontal chips (#Work, #Personal, #Study, #Health, #Urgent, + Custom Tags).
- **Sort Selector**: Smart Mix, Nearest Deadline, Priority, Scheduled Time, Newest.

### 📊 5. Analytics & Dashboard Insights
- Productivity progress bar with completion rate percentage ($0-100\%$).
- Pending, Completed, Overdue, and High Priority counters.
- Breakdown of active tasks by category and priority.

---

## 🛠️ Project Structure

```
Assignment_modulus_seventeen/
├── backend/
│   ├── src/
│   │   ├── controllers/       # authController.ts, taskController.ts
│   │   ├── middleware/        # auth.ts (JWT verification)
│   │   ├── models/            # User.ts, Task.ts (Mongoose schemas)
│   │   ├── routes/            # authRoutes.ts, taskRoutes.ts
│   │   ├── utils/             # sorting.ts (Smart Mix Algorithm)
│   │   └── server.ts          # Express app entry & MongoDB connection
│   ├── .env                   # Environment config
│   ├── package.json
│   └── tsconfig.json
│
└── mobile/
    ├── src/
    │   ├── api/               # client.ts (Axios + auto JWT interceptor)
    │   ├── components/        # TaskCard, FilterBar, StatsCard, PrioritySelector, CustomDateTimePicker, etc.
    │   ├── context/           # AuthContext.tsx, TaskContext.tsx
    │   ├── navigation/        # RootNavigator.tsx, AuthNavigator.tsx, TabNavigator.tsx
    │   ├── screens/           # HomeScreen, AddEditTaskScreen, TaskDetailsScreen, ProfileScreen, AnalyticsScreen
    │   ├── theme/             # colors.ts, typography, shadows
    │   ├── types/             # TypeScript models & navigation types
    │   └── utils/             # dateUtils.ts, sorting.ts
    ├── App.tsx                # App entry with Providers
    ├── index.js               # React Native CLI registry
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Setup & Execution Instructions

### Step 1: Run the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start MongoDB locally (or ensure your MongoDB Atlas URI is set in `backend/.env`).
3. Start the TypeScript development server:
   ```bash
   npm run dev
   ```
4. The server runs at `http://localhost:5000`. You can verify health at:
   ```
   GET http://localhost:5000/api/health
   ```

---

### Step 2: Run the Mobile Application (Android)
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Metro Bundler:
   ```bash
   npm start
   ```
4. Run on Android Emulator or connected USB device:
   ```bash
   npm run android
   ```

> **Network Note for Android:**
> - Android Emulator connects to localhost via `http://10.0.2.2:5000/api` (already configured as default).
> - For a physical Android phone on the same Wi-Fi, open the **Account / Settings** tab in the app to configure your computer's local IP (e.g., `http://192.168.1.5:5000/api`).

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user profile | **Yes (Bearer)** |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Get filtered & sorted tasks | **Yes (Bearer)** |
| `POST` | `/api/tasks` | Create new task | **Yes (Bearer)** |
| `GET` | `/api/tasks/stats` | Get productivity dashboard metrics | **Yes (Bearer)** |
| `GET` | `/api/tasks/:id` | Get single task details | **Yes (Bearer)** |
| `PUT` | `/api/tasks/:id` | Update task or toggle completion | **Yes (Bearer)** |
| `DELETE` | `/api/tasks/:id` | Delete a task | **Yes (Bearer)** |
