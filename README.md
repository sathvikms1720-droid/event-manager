# Event Manager — Full Stack Event Planning & Management Application

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=flat&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=flat&logo=sqlalchemy&logoColor=white)

> A modern full-stack Event Management application designed to simplify event planning, client management, scheduling, payment tracking, and reminders through a clean and mobile-friendly interface.

---

# What Is This?

Event Manager is a full-stack web application developed to help event organizers manage their events and business activities efficiently.

The application provides a centralized platform to organize client information, schedule events, track budgets and payments, and monitor upcoming activities.

It aims to reduce manual work and make event management more organized and accessible.

---

# Features

| Feature | Description |
|---|---|
| Dashboard | Overview of clients, events, and event statistics |
| Event Management | Create, view, and manage events |
| Calendar | Organize and track events by date |
| Client Management | Store and manage client information |
| Payment Tracking | Track event budgets, advance payments, and remaining balances |
| Event Status | Monitor upcoming and completed events |
| Recent Events | View recently added events |
| Today's Events | Track events scheduled for the current day |
| Reminders | Keep track of upcoming events and schedules |
| Mobile-Friendly UI | Optimized mobile-focused interface |
| Interactive Navigation | Smooth navigation and animations |

---

# Architecture

```text
Frontend (React + Tailwind CSS)
          │
          ▼
    React Router
          │
          ▼
      API Requests
          │
          ▼
    FastAPI Backend
          │
          ▼
     SQLAlchemy ORM
          │
          ▼
  PostgreSQL Database
      (Neon Cloud)
```

---

# Tech Stack

## Frontend

| Technology | Usage |
|---|---|
| React.js | Frontend Framework |
| Vite | Development & Build Tool |
| Tailwind CSS | UI Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Router DOM | Navigation |

## Backend

| Technology | Usage |
|---|---|
| Python | Backend Programming |
| FastAPI | REST API Development |
| SQLAlchemy | Database ORM |
| Uvicorn | ASGI Server |

## Database

| Technology | Usage |
|---|---|
| PostgreSQL | Relational Database |
| Neon | Cloud Database Hosting |

## Development Tools

| Tool | Usage |
|---|---|
| Visual Studio Code | Code Editor |
| Git | Version Control |
| GitHub | Source Code Management |
| Postman | API Testing |

---

# Folder Structure

```text
event-manager/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
│
└── README.md
```

---

# Installation

## Prerequisites

- Node.js and npm
- Python 3.11+
- PostgreSQL or Neon Database
- Git

---

# Backend Setup

Clone the repository:

```bash
git clone https://github.com/sathvikms1720-droid/event-manager.git
```

Navigate to the backend:

```bash
cd event-manager/backend
```

Create a virtual environment:

```bash
python -m venv venv
```

## Activate Virtual Environment

### Windows

```powershell
.\venv\Scripts\Activate.ps1
```

### Mac/Linux

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Environment Variables

Configure your database connection in the backend `.env` file.

```env
DATABASE_URL=your_neon_database_url
```

## Run Backend

```bash
python -m uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd event-manager/frontend
```

Install dependencies:

```bash
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Database

The application uses PostgreSQL as its relational database.

Neon is used for cloud-hosted PostgreSQL database management, while SQLAlchemy handles database operations through ORM models.

The database manages:

- Client information
- Event details
- Event schedules
- Budget and payment information
- Event status
- Reminder information

---

# How to Use

1. Open the Event Manager application.
2. Navigate to the dashboard to view event statistics.
3. Add clients and maintain their information.
4. Create events with dates, times, venues, and event types.
5. Track event budgets and advance payments.
6. Monitor upcoming events through the calendar.
7. Check reminders and manage scheduled activities.

---

# Key Learning Outcomes

- Full-stack web application development.
- Building REST APIs using FastAPI.
- React frontend and backend integration.
- PostgreSQL database design and management.
- SQLAlchemy ORM implementation.
- CRUD operations and data management.
- Responsive mobile-first UI development.
- Git and GitHub version control.

---

# Known Limitations

- Advanced push notifications are not yet implemented.
- PDF invoice generation is not yet available.
- Advanced financial analytics can be improved.
- Native mobile application support is planned.

---

# Future Improvements

- [ ] Android APK application.
- [ ] Push notifications for upcoming events.
- [ ] Automated event reminders.
- [ ] PDF invoice generation.
- [ ] Advanced event analytics and reports.
- [ ] Expense and profit tracking.
- [ ] Client communication integration.
- [ ] Enhanced calendar management.

---

# Author

## Sathvik M S

GitHub: [@sathvikms1720-droid](https://github.com/sathvikms1720-droid)

---

**Developed with React, FastAPI, and PostgreSQL.**
