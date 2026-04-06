# 💼 Job Application Tracker

A full-stack web application for tracking job applications, built with React and Django.

🔗 **Live Demo:** [job-tracker-snowy-two.vercel.app](https://job-tracker-snowy-two.vercel.app)

---

## Features

- **Authentication** — Register and log in with email and password using JWT tokens
- **Job Tracking** — Add, edit, and delete job applications
- **Status Management** — Track applications by status: Applied, Interview, Offer, Rejected
- **Analytics** — Pie chart breakdown of application statuses
- **Per-user Data** — Each user only sees their own jobs
- **Mobile Responsive** — Works on desktop and mobile devices

---

## Tech Stack

**Frontend**
- React (Vite)
- Axios
- Recharts

**Backend**
- Django 6
- Django REST Framework
- djangorestframework-simplejwt
- SQLite

**Deployment**
- Frontend → Vercel
- Backend → Railway

---

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the `frontend/` folder:

```
VITE_API_URL=http://127.0.0.1:8000
```

For production, set `VITE_API_URL` to your Railway backend URL.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Log in and get JWT tokens |
| GET | `/api/applications/` | Get all jobs for logged-in user |
| POST | `/api/applications/` | Create a new job |
| PUT | `/api/applications/:id/` | Update a job |
| DELETE | `/api/applications/:id/` | Delete a job |

---

## Author

**Ryan Popock**
- GitHub: [@ryanthegam3r23](https://github.com/ryanthegam3r23)
- Email: rypop04@gmail.com
