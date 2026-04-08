# Portfolio Management System - Backend

This is a production-ready Flask REST API that serves as the backend for the Portfolio Management System. It handles user authentication, portfolio data management, and standardized API communications.

## Features

- **Robust Authentication**: Secure login and route protection using `Flask-JWT-Extended`.
- **Database System**: Powered by `SQLAlchemy` ORM. Configured to use SQLite for local development and PostgreSQL for production.
- **RESTful Architecture**: Clean modular blueprints for `auth` and `portfolio` routes.
- **Standardized Responses**: Predictable JSON response structures and centralized error handlers (400, 404, 405, 500).
- **CORS Enabled**: Ready to connect with any frontend application.
- **Production Ready**: Fully configured for 1-click deployment to Render or Railway using Gunicorn and dynamic environment variables.

## Getting Started (Local Development)

### Prerequisites
- Python 3.8+
- pip (Python package installer)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Project1
   ```

2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Set up a Virtual Environment:**
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

4. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Environment Variables:**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   SECRET_KEY=your_super_secret_key
   JWT_SECRET_KEY=your_jwt_secret_key
   # DATABASE_URL=postgresql://user:password@localhost/dbname (Optional for local, uses SQLite by default)
   ```

6. **Run the Server:**
   ```bash
   python run.py
   ```
   The API will be available at `http://127.0.0.1:5000/`. The database tables will be automatically initialized on the first run.

## Deployment

This application is ready to be deployed to cloud platforms like **Render** or **Railway**.

- **Web Server**: Uses `gunicorn` via the `Procfile`.
- **Database**: When deploying, provide a PostgreSQL connection string in the `DATABASE_URL` environment variable. The config will automatically parse the URI correctly.
- **Root Directory**: Be sure to configure `backend` as your root directory in your deployment platform settings.

## Project Structure

```
backend/
├── app/
│   ├── routes/          # Blueprint routes (auth, portfolio)
│   ├── utils/           # Utility functions (standardized responses)
│   ├── __init__.py      # App factory and error handlers
│   └── extensions.py    # Database and JWT instances
├── instance/            # Local SQLite database drops here
├── .env.example         # Example environment variables
├── config.py            # App configuration and environment loader
├── Procfile             # Production startup command
├── requirements.txt     # Python dependencies
└── run.py               # Main application entry point
```
