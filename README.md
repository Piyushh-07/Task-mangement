# 📋 Task Management System

A responsive, full-stack Task Management web application built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Bootstrap 5**. Designed for assigning, tracking, and managing team tasks with real-time status updates and data export capabilities.

---

## 🚀 Features

* **Authentication & Access Control**: Simple, reliable sign-in and sign-up with client-side session protection (`localStorage`). Unauthorized visitors are automatically redirected to the login page.
* **Interactive Dashboard**:
  * Real-time metrics showing total tasks assigned this month, completed tasks, and pending tasks.
  * Task assignment form with live word counter, deadline date picker, and searchable employee dropdown (via Select2).
  * Recent tasks overview table.
* **Full Task Management (DataTables)**:
  * Comprehensive task list with live search, sorting, and customizable pagination.
  * **Export to Multiple Formats**: One-click export to **CSV**, **Excel**, and **PDF**, plus direct **Print** support.
  * **Inline Status Toggle**: Switch between `Pending` and `Completed` in real time; changes are immediately saved to MongoDB.
* **Mobile Responsive**: Custom CSS media queries adapt the UI across desktops, tablets, and phones, featuring a slide-out hamburger navigation menu.
* **Auto-Database Seeding**: Automatically seeds default team members on the initial database connection if the user collection is clean.

---

## 🛠️ Tech Stack

### Frontend
* **HTML5 & CSS3**: Custom styles (`style.css`) with responsive media queries.
* **JavaScript (ES6+)**: Vanilla JS utilizing the `fetch` API for asynchronous client-server communication.
* **Bootstrap 5**: UI components, responsive layout grid, badges, and switches.
* **Bootstrap Icons**: Visual iconography across headers, sidebars, and buttons.
* **jQuery**: Supporting utility library for DataTables and Select2.
* **Select2**: Searchable dropdown selection for team members.
* **DataTables**: Advanced interactive table with `JSZip` (Excel) and `pdfmake` (PDF) plugins.

### Backend
* **Node.js**: Asynchronous event-driven JavaScript runtime.
* **Express.js**: Lightweight REST API framework and static asset server.
* **dotenv**: Environment variable management.

### Database
* **MongoDB Atlas**: Cloud-hosted NoSQL document database.
* **Mongoose ODM**: Data modeling, schema definitions, validation, and queries.

---

## 📂 Project Structure

```text
Task management/
├── .env                       # Environment variables (Port, MongoDB URI)
├── package.json               # Dependencies and start scripts
├── README.md                  # Project documentation
├── client/                    # Frontend assets and views
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css      # Core & responsive styles
│   │   ├── js/
│   │   │   ├── dashboard.js   # Dashboard logic & stats loading
│   │   │   ├── login.js       # Authentication script
│   │   │   ├── register.js    # Registration script
│   │   │   └── task.js        # DataTables and status toggle logic
│   │   └── uploads/           # Image assets & profile avatars
│   └── views/
│       ├── dashboard.html     # Main dashboard & task creation
│       ├── login.html         # Sign-in page
│       ├── register.html      # Sign-up page
│       └── tasks.html         # Full task table page
└── server/                    # Backend server
    ├── app.js                 # Express app configuration & REST API routes
    ├── server.js              # Server initialization, MongoDB connection & seeder
    └── models/
        ├── Task.js            # Mongoose Task schema
        └── User.js            # Mongoose User schema
```

---

## ⚙️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [npm](https://www.npmjs.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB instance)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "c:\piyush\Task management"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Open or create the `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/task_management?retryWrites=true&w=majority
   ```
   *(Replace with your actual MongoDB connection string).*

4. **Start the application**:
   ```bash
   npm start
   ```
   *(Or for auto-reloading during development: `npm run dev`)*

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔑 Default Test Accounts

Upon initial connection, the database is automatically seeded with default team members. You can log in using:

* **Email**: `john@example.com`
* **Password**: `Password123!`

*(You can also click **"Create now"** on the login page to register a new account).*

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Register a new user account |
| `POST` | `/api/login` | Authenticate an existing user |
| `GET` | `/api/employees` | Retrieve all registered employees for assignments |
| `GET` | `/api/tasks` | Fetch all tasks with populated assignee information |
| `POST` | `/api/tasks` | Create and assign a new task |
| `PATCH` | `/api/tasks/:id/status` | Update task status (`Pending` / `Completed`) |
| `GET` | `/api/tasks/stats` | Retrieve monthly total, completed, and pending counts |

---

## 📄 License
This project was developed for educational and internship purposes.
