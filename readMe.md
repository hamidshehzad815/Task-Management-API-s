# Task Management API

A **Task Management API** built with **Node.js** and **Express.js**, providing users with the ability to create, assign, update, and manage tasks. This API includes features such as user authentication, role-based access, task assignment, notifications, and more.

## Features

- **User Authentication and Authorization** (using JWT)
  - Signup, Login, Logout
  - Role-based access control (Admin, User)
- **Task Management**

  - Create, Update, Delete tasks
  - Assign tasks to users
  - Set priority and due date
  - Track task status (Pending, Completed)

- **Comments on Tasks**

  - Users can comment on tasks

- **Filtering and Sorting**

  - Filter tasks by status, priority, and due date
  - Sort tasks by creation date or due date

- **Notifications**

  - Email notifications when a task is assigned (using Nodemailer)

- **Validation and Security**
  - Input validation with express-validator
  - Password hashing using bcryptjs
  - Protected routes with JWT

## Tech Stack

- **Node.js**
- **Express.js**
- **MYSQL**
- **JWT** for authentication
- **Nodemailer** for sending emails
- **mysql2**
- **express-validator** for input validation
- **bcrypt** for password hashing

## Installation

### Prerequisites

- [Node.js]
- [MYSQL]
- An email account or service (for sending notifications)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/hamidshehzad815/Task-Management-API-s.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```
MYSQL_DATABASE = 'your database name'
MYSQL_HOST = 'your host'
MYSQL_USER = 'user'
MYSQL_PASSWORD = 'your password'
MYSQL_PORT = your port
PORT = 3000
SECRET_KEY = "your secret key"
EMAIL_USER = "your email"
EMAIL_PASSWORD = "email app password"

```

4. Start the server:

```bash
npm start
```

The server will run at `http://localhost:3000`.

## Usage

### Authentication Endpoints:

- **Register a new user:**

  ```http
  POST /signup
  ```

- **Login a user:**
  ```http
  POST /login
  ```

### Task Endpoints:

- **Create a new task:**

  ```http
  POST /createTask
  ```

- **Get all tasks (Admin):**

  ```http
  GET /allTasks
  ```

- **Get tasks for the current user:**

  ```http
  GET /tasks
  ```

- **Update a task:**

  ```http
  PUT /updateTask
  ```

- **Delete a task:**
  ```http
  DELETE /delete-task/:taskId
  ```

### Comments:

- **Add a comment to a task:**
  ```http
  POST /getComments


### Notifications:

- Notifications are sent when tasks are assigned or on signup (using **Nodemailer**).


## Future Improvements

- Add real-time updates using **Socket.IO**.
- Add support for file attachments on tasks.
